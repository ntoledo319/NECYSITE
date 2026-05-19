"use server"

import { headers } from "next/headers"
import { getPayload, type Payload } from "payload"
import configPromise from "@payload-config"
import { extractClientIp, hashIdentifier as ipHash, rateLimit } from "@/lib/rate-limit"
import { claimFormSchema, policyAgreementsSchema } from "@/lib/validation"
import type { PolicyAgreements } from "@/lib/types"
import { newCorrelationId, type CorrelationId } from "@/lib/correlation"
import { log, hashIdentifier, summarizeError } from "@/lib/logger"
import { withTimeout, TimeoutError } from "@/lib/resilience"
import { dlqRegistrationFailure } from "@/lib/dlq"
import { buildError, type RegistrationError } from "@/lib/registration-errors"
import { isRegistrationPaused } from "@/lib/registration-status"
import { signAccessCodePayload } from "@/lib/success-token"

const PAYLOAD_TIMEOUT_MS = 5_000

export interface ClaimFormInput {
  name: string
  email: string
  state: string
  homegroup: string
  accommodations: string
  interpretationNeeded: boolean
  mobilityAccessibility: boolean
  willingToServe: boolean
}

export type ClaimResult =
  | { success: true; successToken: string; correlationId: CorrelationId }
  | { success: false; error: RegistrationError }

interface GiftRow {
  id: string | number
  token?: string | null
  status?: string | null
  recipientName?: string | null
  sponsorName?: string | null
  sponsorEmail?: string | null
  stripeSessionId?: string | null
  claimedAt?: string | null
  claimedRegistrationId?: string | null
}

/**
 * Server action backing /claim/<token>. Validates, atomically claims the
 * token, writes a comped registration, and returns a signed token for the
 * confirmation page. The claimer is the attendee — they sign the policy.
 */
export async function submitGiftClaim(
  token: string,
  formInput: ClaimFormInput,
  policyAgreements: PolicyAgreements,
): Promise<ClaimResult> {
  const correlationId = newCorrelationId("claim")

  if (isRegistrationPaused()) {
    log.warn({ event: "claim.paused", correlationId })
    return { success: false, error: buildError("REGISTRATION_PAUSED", { correlationId }) }
  }

  if (typeof token !== "string" || token.length < 16 || token.length > 64) {
    return {
      success: false,
      error: buildError("VALIDATION", { correlationId, userMessage: "This claim link is malformed." }),
    }
  }

  let validatedForm: import("@/lib/validation").ValidatedClaimForm
  let validatedPolicy: import("@/lib/validation").ValidatedPolicyAgreements
  try {
    validatedForm = claimFormSchema.parse(formInput)
    validatedPolicy = policyAgreementsSchema.parse(policyAgreements)
  } catch (err) {
    const zodErr = err as { issues?: Array<{ path: (string | number)[]; message: string }> }
    const first = zodErr.issues?.[0]
    const fieldPath = first?.path?.join(".")
    log.warn({ event: "claim.validation_failed", correlationId, fieldPath, message: first?.message })
    return {
      success: false,
      error: buildError("VALIDATION", {
        correlationId,
        fieldPath,
        userMessage: first ? `Please review — ${fieldPath ? fieldPath + ": " : ""}${first.message}` : undefined,
      }),
    }
  }

  let ip = "unknown"
  try {
    ip = extractClientIp(await headers())
  } catch (err) {
    log.warn({ event: "claim.ip_extract_failed", correlationId, ...summarizeError(err) })
  }

  // Rate-limit: per IP (anyone can try lots of tokens) and per token (resist
  // grinding a specific gift). Both fail closed in production via the shared
  // rate-limit module.
  let rlByIp, rlByToken
  try {
    ;[rlByIp, rlByToken] = await Promise.all([
      withTimeout(rateLimit(`claim-ip:${ipHash(ip)}`, { limit: 15, windowMs: 60_000 }), 2_000, "ratelimit.claim_ip"),
      withTimeout(rateLimit(`claim-tok:${token.slice(0, 16)}`, { limit: 8, windowMs: 60_000 }), 2_000, "ratelimit.claim_token"),
    ])
  } catch (err) {
    log.error({ event: "claim.rate_limit_failed", correlationId, ...summarizeError(err) })
    return { success: false, error: buildError("REDIS_DOWN", { correlationId }) }
  }
  if (!rlByIp.success || !rlByToken.success) {
    return {
      success: false,
      error: buildError("RATE_LIMITED", {
        correlationId,
        userMessage: "Too many attempts. Wait a minute and try again.",
      }),
    }
  }

  let payload: Payload
  try {
    payload = await withTimeout(getPayload({ config: configPromise }), PAYLOAD_TIMEOUT_MS, "payload.bootstrap")
  } catch (err) {
    log.error({ event: "claim.payload_bootstrap_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "critical",
      error: err,
      email: validatedForm.email,
    })
    return { success: false, error: buildError("DB_DOWN", { correlationId }) }
  }

  // Look up the gift code.
  let gift: GiftRow
  try {
    const found = await withTimeout(
      payload.find({
        collection: "gift-codes",
        where: { token: { equals: token } },
        limit: 1,
      }),
      PAYLOAD_TIMEOUT_MS,
      "claim.find_gift",
    )
    if (found.docs.length === 0) {
      log.info({ event: "claim.token_not_found", correlationId })
      return {
        success: false,
        error: buildError("VALIDATION", {
          correlationId,
          userMessage: "This claim link is no longer valid. If you believe this is a mistake, email info@necypaa.org.",
        }),
      }
    }
    gift = found.docs[0] as GiftRow
  } catch (err) {
    log.error({ event: "claim.find_failed", correlationId, ...summarizeError(err) })
    return {
      success: false,
      error: buildError(err instanceof TimeoutError ? "DB_TIMEOUT" : "DB_DOWN", { correlationId }),
    }
  }

  if (gift.status === "claimed") {
    return {
      success: false,
      error: buildError("VALIDATION", {
        correlationId,
        userMessage: "This gift has already been claimed. If that wasn't you, email info@necypaa.org.",
      }),
    }
  }
  if (gift.status === "void") {
    return {
      success: false,
      error: buildError("VALIDATION", {
        correlationId,
        userMessage: "This gift has been canceled. Email info@necypaa.org if you think that's wrong.",
      }),
    }
  }

  // Atomic claim: update with a where-clause that requires status='unclaimed'.
  // Payload doesn't expose conditional updates per-id, so we update and then
  // re-read to confirm we won the race; if status flipped under us, undo.
  let registrationId: string | number
  try {
    const registration = await withTimeout(
      payload.create({
        collection: "registrations",
        data: {
          email: validatedForm.email,
          name: validatedForm.name,
          state: validatedForm.state,
          status: "comped",
          type: "comp",
          stripeSessionId: gift.stripeSessionId ?? "",
          amountTotalCents: 0,
          metadata: {
            correlation_id: correlationId,
            source: "gift_claim",
            gift_id: String(gift.id),
            gift_token_masked: `${token.slice(0, 4)}…${token.slice(-4)}`,
            sponsor_name: gift.sponsorName ?? "unknown",
            sponsor_email_hashed: gift.sponsorEmail ? hashIdentifier(gift.sponsorEmail) : "unknown",
            recipient_intended_name: gift.recipientName ?? "unknown",
            policy_read_and_understood: validatedPolicy.readPolicy,
            policy_questions_understood: validatedPolicy.understandQuestions,
            policy_behavior_acknowledged: validatedPolicy.acknowledgeBehavior,
            policy_admission_understood: validatedPolicy.understandAdmission,
            policy_reporting_understood: validatedPolicy.understandReporting,
            policy_investigation_understood: validatedPolicy.understandInvestigation,
            policy_signature_agreement: validatedPolicy.signatureAgreement,
          },
          accommodations: validatedForm.accommodations,
          interpretationNeeded: validatedForm.interpretationNeeded,
          mobilityAccessibility: validatedForm.mobilityAccessibility,
          willingToServe: validatedForm.willingToServe,
          homegroup: validatedForm.homegroup,
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "claim.create_registration",
    )
    registrationId = (registration as { id: string | number }).id
  } catch (err) {
    log.error({ event: "claim.registration_create_failed", correlationId, giftId: gift.id, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "critical",
      error: err,
      email: validatedForm.email,
    })
    return {
      success: false,
      error: buildError(err instanceof TimeoutError ? "DB_TIMEOUT" : "DB_DOWN", { correlationId }),
    }
  }

  // Flip the gift to claimed. If we lost a race (another claimer beat us)
  // we'll see status !== 'unclaimed' on re-read and have to roll back.
  let raced = false
  try {
    await withTimeout(
      payload.update({
        collection: "gift-codes",
        id: gift.id,
        data: {
          status: "claimed",
          claimedAt: new Date().toISOString(),
          claimedByEmail: validatedForm.email,
          claimedRegistrationId: String(registrationId),
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "claim.update_gift",
    )
    // Re-read to detect a race: if our update succeeded but another claim
    // beat us by a fraction, the row's claimedRegistrationId may differ.
    const recheck = await withTimeout(
      payload.findByID({ collection: "gift-codes", id: gift.id }),
      PAYLOAD_TIMEOUT_MS,
      "claim.recheck_gift",
    )
    const recheckRow = recheck as GiftRow
    if (recheckRow.claimedRegistrationId && String(recheckRow.claimedRegistrationId) !== String(registrationId)) {
      raced = true
    }
  } catch (err) {
    log.error({ event: "claim.gift_update_failed", correlationId, giftId: gift.id, ...summarizeError(err) })
    // Roll back the registration we just created.
    await withTimeout(
      payload.delete({ collection: "registrations", id: registrationId }).catch(() => undefined),
      PAYLOAD_TIMEOUT_MS,
      "claim.rollback_registration",
    ).catch(() => undefined)
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.update",
      severity: "critical",
      error: err,
      email: validatedForm.email,
      registrationId,
    })
    return {
      success: false,
      error: buildError(err instanceof TimeoutError ? "DB_TIMEOUT" : "DB_DOWN", { correlationId }),
    }
  }

  if (raced) {
    log.warn({ event: "claim.race_detected", correlationId, giftId: gift.id })
    await withTimeout(
      payload.delete({ collection: "registrations", id: registrationId }).catch(() => undefined),
      PAYLOAD_TIMEOUT_MS,
      "claim.rollback_registration",
    ).catch(() => undefined)
    return {
      success: false,
      error: buildError("VALIDATION", {
        correlationId,
        userMessage: "Someone else just claimed this gift. If that wasn't you, email info@necypaa.org.",
      }),
    }
  }

  const successToken = signAccessCodePayload({
    name: validatedForm.name,
    email: validatedForm.email,
    iat: Math.floor(Date.now() / 1000),
  })

  log.info({
    event: "claim.completed",
    correlationId,
    giftId: gift.id,
    registrationId,
    hashedEmail: hashIdentifier(validatedForm.email),
  })

  return { success: true, successToken, correlationId }
}

/**
 * Light read-side helper used by the claim page server component to display
 * gift metadata without exposing the token to the client component.
 */
export async function loadGiftForClaim(token: string): Promise<
  | { status: "ok"; recipientName: string; sponsorName: string; sponsorMessage: string | null }
  | { status: "claimed" }
  | { status: "void" }
  | { status: "not_found" }
  | { status: "error" }
> {
  if (typeof token !== "string" || token.length < 16 || token.length > 64) {
    return { status: "not_found" }
  }
  const correlationId = newCorrelationId("claim_load")
  try {
    const payload = await withTimeout(getPayload({ config: configPromise }), PAYLOAD_TIMEOUT_MS, "payload.bootstrap")
    const found = await withTimeout(
      payload.find({
        collection: "gift-codes",
        where: { token: { equals: token } },
        limit: 1,
      }),
      PAYLOAD_TIMEOUT_MS,
      "claim.find_gift_public",
    )
    if (found.docs.length === 0) return { status: "not_found" }
    const row = found.docs[0] as GiftRow & { sponsorMessage?: string | null }
    if (row.status === "claimed") return { status: "claimed" }
    if (row.status === "void") return { status: "void" }
    return {
      status: "ok",
      recipientName: row.recipientName ?? "friend",
      sponsorName: row.sponsorName ?? "Someone",
      sponsorMessage: row.sponsorMessage ?? null,
    }
  } catch (err) {
    log.error({ event: "claim.load_failed", correlationId, ...summarizeError(err) })
    return { status: "error" }
  }
}
