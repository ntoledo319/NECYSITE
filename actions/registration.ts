"use server"

import { createHash } from "node:crypto"
import { headers, cookies } from "next/headers"
import { getPayload, type Payload } from "payload"
import configPromise from "@payload-config"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { env } from "@/lib/env"
import { calculateProcessingFee, formatUsdFromCents } from "@/lib/registration-products"
import { getLivePricing } from "@/lib/pricing"
import {
  rateLimitCheckout,
  rateLimitCodeRedemption,
  rateLimitCodeRedemptionByIp,
  extractClientIp,
  formatResetSeconds,
} from "@/lib/rate-limit"
import {
  registrationDataSchema,
  policyAgreementsSchema,
  purchaseAttributionSchema,
  productIdSchema,
  breakfastIdsSchema,
} from "@/lib/validation"
import { redeemRegistrationCode, maskAccessCode } from "@/lib/issuer-client"
import { EVENT_SLUG, CONVENTION_START_DATE } from "@/lib/constants"
import type { RegistrationData, PolicyAgreements, PurchaseAttribution } from "@/lib/types"
import { newCorrelationId, type CorrelationId } from "@/lib/correlation"
import { log, hashIdentifier, summarizeError, partialId } from "@/lib/logger"
import { withTimeout, withRetry, safeAsync, TimeoutError } from "@/lib/resilience"
import { dlqRegistrationFailure } from "@/lib/dlq"
import { buildError, fromUnknown, type RegistrationError } from "@/lib/registration-errors"
import { isRegistrationPaused, registrationPausedReason } from "@/lib/registration-status"
import { signSuccessToken, signAccessCodePayload } from "@/lib/success-token"

const SUPPORTED_LOCALES = new Set(["en", "es"])
const DEFAULT_LOCALE = "en"
const SUCCESS_COOKIE = "necypaa_checkout_token"
const PAYLOAD_TIMEOUT_MS = 5_000
const STRIPE_TIMEOUT_MS = 10_000
const PI_UPDATE_TIMEOUT_MS = 5_000

function normalizeLocale(input: unknown): string {
  if (typeof input !== "string") return DEFAULT_LOCALE
  const trimmed = input.trim().toLowerCase()
  return SUPPORTED_LOCALES.has(trimmed) ? trimmed : DEFAULT_LOCALE
}

function isRetryableStripeError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false
  if (err instanceof TimeoutError) return true
  const e = err as { type?: string; statusCode?: number }
  if (e.type === "StripeConnectionError" || e.type === "StripeAPIError") return true
  if (typeof e.statusCode === "number" && e.statusCode >= 500) return true
  return false
}

export type StartCheckoutResult =
  | { ok: true; clientSecret: string; correlationId: CorrelationId }
  | { ok: false; error: RegistrationError }

export async function startRegistrationCheckout(
  productId: string,
  registrationData: RegistrationData,
  policyAgreements: PolicyAgreements | null,
  breakfastIds: string[] = [],
  attribution?: PurchaseAttribution,
  locale?: string,
): Promise<StartCheckoutResult> {
  const correlationId = newCorrelationId()

  if (isRegistrationPaused()) {
    log.warn({ event: "checkout.paused", correlationId, reason: registrationPausedReason() ?? "no_reason" })
    return { ok: false, error: buildError("REGISTRATION_PAUSED", { correlationId }) }
  }

  const resolvedLocale = normalizeLocale(locale)

  let validatedProductId: string
  let validatedData: import("@/lib/validation").ValidatedRegistrationData
  let validatedBreakfastIds: string[]
  let validatedAttribution: import("zod").infer<typeof import("@/lib/validation").purchaseAttributionSchema>
  let validatedPolicy: import("@/lib/validation").ValidatedPolicyAgreements | null

  try {
    validatedProductId = productIdSchema.parse(productId)
    validatedData = registrationDataSchema.parse(registrationData)
    validatedBreakfastIds = breakfastIdsSchema.parse(breakfastIds)
    validatedAttribution = purchaseAttributionSchema.parse(attribution)
    validatedPolicy = policyAgreements ? policyAgreementsSchema.parse(policyAgreements) : null
  } catch (err) {
    const zodErr = err as { issues?: Array<{ path: (string | number)[]; message: string }> }
    const first = zodErr.issues?.[0]
    const fieldPath = first?.path?.join(".")
    log.warn({ event: "checkout.validation_failed", correlationId, fieldPath, message: first?.message })
    return {
      ok: false,
      error: buildError("VALIDATION", {
        correlationId,
        fieldPath,
        userMessage: first
          ? `We couldn't accept that input — ${fieldPath ? fieldPath + ": " : ""}${first.message}`
          : undefined,
      }),
    }
  }

  // Policy gating — REQUIRED when the buyer is an attendee (self or
  // self_plus_gift). Forbidden otherwise (gift_only / donate buyers don't
  // attend, so collecting their signature would be misleading).
  const buyerIsAttendee = validatedData.intent === "self" || validatedData.intent === "self_plus_gift"
  if (buyerIsAttendee && !validatedPolicy) {
    return {
      ok: false,
      error: buildError("VALIDATION", {
        correlationId,
        userMessage:
          "We need you to review and accept the policy agreement before continuing. You can find it on the previous step.",
      }),
    }
  }

  let ip = "unknown"
  try {
    ip = extractClientIp(await headers())
  } catch (err) {
    log.warn({ event: "checkout.ip_extract_failed", correlationId, ...summarizeError(err) })
  }

  let rl: Awaited<ReturnType<typeof rateLimitCheckout>>
  try {
    rl = await withTimeout(rateLimitCheckout({ ip, email: validatedData.email }), 2_000, "ratelimit.checkout")
  } catch (err) {
    log.error({ event: "checkout.rate_limit_failed", correlationId, ...summarizeError(err) })
    return { ok: false, error: buildError("REDIS_DOWN", { correlationId }) }
  }
  if (!rl.success) {
    const seconds = formatResetSeconds(rl.resetMs)
    log.info({ event: "checkout.rate_limited", correlationId, hashedEmail: hashIdentifier(validatedData.email) })
    return {
      ok: false,
      error: buildError("RATE_LIMITED", {
        correlationId,
        retryAfterSeconds: seconds,
        userMessage: `Too many checkout attempts. Please wait about ${seconds}s and try again.`,
      }),
    }
  }

  // Route by intent.
  if (validatedData.intent === "donate") {
    return runDonationCheckout({
      correlationId,
      resolvedLocale,
      validatedData,
      validatedAttribution,
    })
  }

  if (validatedData.intent === "group") {
    return runGroupCheckout({
      correlationId,
      resolvedLocale,
      validatedData,
    })
  }

  return runAttendingOrGiftCheckout({
    correlationId,
    resolvedLocale,
    validatedProductId,
    validatedData,
    validatedPolicy,
    validatedBreakfastIds,
    validatedAttribution,
    buyerIsAttendee,
  })
}

// ── Attending / gift flow ──────────────────────────────────────────

interface AttendingArgs {
  correlationId: CorrelationId
  resolvedLocale: string
  validatedProductId: string
  validatedData: import("@/lib/validation").ValidatedRegistrationData
  validatedPolicy: import("@/lib/validation").ValidatedPolicyAgreements | null
  validatedBreakfastIds: string[]
  validatedAttribution: import("zod").infer<typeof import("@/lib/validation").purchaseAttributionSchema>
  buyerIsAttendee: boolean
}

async function runAttendingOrGiftCheckout(args: AttendingArgs): Promise<StartCheckoutResult> {
  const {
    correlationId,
    resolvedLocale,
    validatedProductId,
    validatedData,
    validatedPolicy,
    validatedBreakfastIds,
    validatedAttribution,
    buyerIsAttendee,
  } = args

  const pricing = await getLivePricing()
  const product = pricing.registration
  if (!product || product.id !== validatedProductId) {
    log.warn({ event: "checkout.unknown_product", correlationId, productId: validatedProductId })
    return {
      ok: false,
      error: buildError("VALIDATION", {
        correlationId,
        userMessage: "Hmm, we couldn't find that registration option. Please go back and try selecting it again.",
      }),
    }
  }

  const selfQuantity = buyerIsAttendee ? 1 : 0
  const giftQuantity = validatedData.giftRecipients.length

  // Breakfast add-ons only apply to attendees.
  const uniqueBreakfastIds = buyerIsAttendee ? [...new Set(validatedBreakfastIds)] : []
  const selectedBreakfasts = uniqueBreakfastIds
    .map((id) => pricing.breakfasts.find((bp) => bp.id === id))
    .filter((bp): bp is (typeof pricing.breakfasts)[number] => Boolean(bp))
  const breakfastTotalCents = selectedBreakfasts.reduce((sum, bp) => sum + bp.priceInCents, 0)

  const registrationSubtotalCents = product.priceInCents * (selfQuantity + giftQuantity)
  const subtotalCents = registrationSubtotalCents + breakfastTotalCents
  if (subtotalCents <= 0) {
    return {
      ok: false,
      error: buildError("VALIDATION", {
        correlationId,
        userMessage: "Add a registration, a gift recipient, or a breakfast ticket before continuing.",
      }),
    }
  }
  const processingFee = calculateProcessingFee(subtotalCents)

  const recordType =
    validatedData.intent === "self_plus_gift"
      ? "self_plus_scholarship"
      : validatedData.intent === "gift_only"
        ? "scholarship"
        : "self"

  const metadata = {
    correlation_id: correlationId,
    purchase_type: recordType,
    intent: validatedData.intent,
    self_registration_quantity: selfQuantity.toString(),
    gift_quantity: giftQuantity.toString(),
    gift_unit_amount_cents: product.priceInCents.toString(),
    gift_recipients_json: JSON.stringify(
      validatedData.giftRecipients.map((r) => ({
        name: r.name,
        email: r.email || null,
        message: r.message || null,
      })),
    ).slice(0, 4000),
    attendee_name: validatedData.name,
    attendee_state: validatedData.state || "not_attending",
    attendee_email: validatedData.email,
    breakfast_tickets: selectedBreakfasts.map((bp) => bp.name).join(", ").slice(0, 500) || "None",
    breakfast_count: selectedBreakfasts.length.toString(),
    breakfast_price_version: "2026-03-26-$25",
    breakfast_ticket_price_cents: "2500",
    attribution_aa_entity: validatedAttribution?.aaEntity || "None",
    attribution_reserved_for_person: validatedAttribution?.reservedForPerson || "None",
    accommodations: buyerIsAttendee ? validatedData.accommodations?.slice(0, 500) || "None" : "not_attending",
    interpretation_needed: buyerIsAttendee ? validatedData.interpretationNeeded.toString() : "not_attending",
    mobility_accessibility: buyerIsAttendee ? validatedData.mobilityAccessibility.toString() : "not_attending",
    willing_to_serve: buyerIsAttendee ? validatedData.willingToServe.toString() : "not_attending",
    homegroup_committee: buyerIsAttendee ? validatedData.homegroup : "not_attending",
    policy_read_and_understood: validatedPolicy ? validatedPolicy.readPolicy.toString() : "not_applicable",
    policy_questions_understood: validatedPolicy ? validatedPolicy.understandQuestions.toString() : "not_applicable",
    policy_behavior_acknowledged: validatedPolicy ? validatedPolicy.acknowledgeBehavior.toString() : "not_applicable",
    policy_admission_understood: validatedPolicy ? validatedPolicy.understandAdmission.toString() : "not_applicable",
    policy_reporting_understood: validatedPolicy ? validatedPolicy.understandReporting.toString() : "not_applicable",
    policy_investigation_understood: validatedPolicy
      ? validatedPolicy.understandInvestigation.toString()
      : "not_applicable",
    policy_signature_agreement: validatedPolicy ? validatedPolicy.signatureAgreement.toString() : "not_applicable",
  } as const

  let payload: Payload
  try {
    payload = await withTimeout(getPayload({ config: configPromise }), PAYLOAD_TIMEOUT_MS, "payload.bootstrap")
  } catch (err) {
    log.error({ event: "checkout.payload_bootstrap_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "critical",
      error: err,
      email: validatedData.email,
      requestPayload: sanitizeRequest({ intent: validatedData.intent }),
    })
    return { ok: false, error: buildError("DB_DOWN", { correlationId }) }
  }

  let record: { id: string | number }
  try {
    record = await withTimeout(
      payload.create({
        collection: "registrations",
        data: {
          email: validatedData.email,
          name: validatedData.name,
          state: validatedData.state || "",
          status: "pending",
          type: recordType,
          stripeSessionId: "",
          amountTotalCents: subtotalCents + processingFee,
          metadata,
          accommodations: buyerIsAttendee ? validatedData.accommodations || "" : "",
          interpretationNeeded: buyerIsAttendee && validatedData.interpretationNeeded,
          mobilityAccessibility: buyerIsAttendee && validatedData.mobilityAccessibility,
          willingToServe: buyerIsAttendee && validatedData.willingToServe,
          homegroup: buyerIsAttendee ? validatedData.homegroup : "",
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.create:pending",
    )
  } catch (err) {
    log.error({ event: "checkout.payload_create_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "error",
      error: err,
      email: validatedData.email,
      requestPayload: sanitizeRequest({ intent: validatedData.intent }),
    })
    return {
      ok: false,
      error: buildError(err instanceof TimeoutError ? "DB_TIMEOUT" : "DB_DOWN", { correlationId }),
    }
  }

  log.info({
    event: "checkout.pending_created",
    correlationId,
    registrationId: record.id,
    intent: validatedData.intent,
    recordType,
    hashedEmail: hashIdentifier(validatedData.email),
    subtotalCents,
    processingFeeCents: processingFee,
  })

  const successUrlBase = `${env.NEXT_PUBLIC_BASE_URL}/${resolvedLocale}/register/success`
  const idempotencyKey = `reg-session-${record.id}`

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  if (selfQuantity > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: product.name, description: product.description },
        unit_amount: product.priceInCents,
      },
      quantity: selfQuantity,
    })
  }
  if (giftQuantity > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Sponsored Registration",
          description: `Gift registration for ${giftQuantity === 1 ? "1 person" : `${giftQuantity} people`} — each receives a claim link`,
        },
        unit_amount: product.priceInCents,
      },
      quantity: giftQuantity,
    })
  }
  for (const bp of selectedBreakfasts) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: bp.name, description: bp.description },
        unit_amount: bp.priceInCents,
      },
      quantity: 1,
    })
  }
  lineItems.push({
    price_data: {
      currency: "usd",
      product_data: { name: "Processing Fee", description: "Credit card processing fee (2.9% + $0.30)" },
      unit_amount: processingFee,
    },
    quantity: 1,
  })

  const piDescription = buildPaymentIntentDescription({
    intent: validatedData.intent,
    selfQuantity,
    giftQuantity,
    breakfastCount: selectedBreakfasts.length,
    email: validatedData.email,
  })

  let session: Stripe.Checkout.Session
  try {
    session = await withRetry(
      () =>
        withTimeout(
          stripe.checkout.sessions.create(
            {
              ui_mode: "embedded",
              return_url: `${successUrlBase}?session_id={CHECKOUT_SESSION_ID}`,
              customer_email: validatedData.email,
              // Always create a Customer object so attribution survives in the
              // Stripe dashboard even for one-off charges.
              customer_creation: "always",
              line_items: lineItems,
              mode: "payment",
              metadata: { ...metadata, registration_id: String(record.id) },
              payment_intent_data: {
                metadata: { ...metadata, registration_id: String(record.id), stripeSessionId: "" },
                description: piDescription,
                // Shows on the cardholder's statement. Max 22 chars and limited
                // character set; keep it short and brand-recognizable.
                statement_descriptor_suffix: "NECYPAA XXXVI",
                receipt_email: validatedData.email,
              },
            },
            { idempotencyKey },
          ),
          STRIPE_TIMEOUT_MS,
          "stripe.sessions.create",
        ),
      {
        maxAttempts: 2,
        baseDelayMs: 500,
        label: "stripe.sessions.create",
        correlationId,
        retryableErrors: isRetryableStripeError,
      },
    )
  } catch (err) {
    log.error({
      event: "checkout.stripe_session_failed",
      correlationId,
      registrationId: record.id,
      ...summarizeError(err),
    })
    await dlqRegistrationFailure({
      correlationId,
      stage: "stripe.session.create",
      severity: "error",
      error: err,
      email: validatedData.email,
      registrationId: record.id,
    })
    await safeAsync(
      () => withTimeout(payload.delete({ collection: "registrations", id: record.id }), PAYLOAD_TIMEOUT_MS, "payload.delete:orphan"),
      undefined,
      { correlationId, label: "payload.delete:orphan", severity: "warn" },
    )
    return { ok: false, error: fromUnknown(err, correlationId) }
  }

  if (!session.client_secret) {
    log.error({ event: "checkout.stripe_no_client_secret", correlationId, sessionId: partialId(session.id) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "stripe.session.create",
      severity: "error",
      error: new Error("Stripe session created without client_secret"),
      registrationId: record.id,
      stripeSessionId: session.id,
    })
    return { ok: false, error: buildError("STRIPE_DOWN", { correlationId }) }
  }

  await setSuccessCookie(session.id, correlationId)

  try {
    await withRetry(
      () =>
        withTimeout(
          payload.update({
            collection: "registrations",
            id: record.id,
            data: { stripeSessionId: session.id },
          }),
          PAYLOAD_TIMEOUT_MS,
          "payload.update:stripeSessionId",
        ),
      { maxAttempts: 3, baseDelayMs: 250, label: "payload.update:stripeSessionId", correlationId },
    )
  } catch (err) {
    log.error({
      event: "checkout.link_session_failed",
      correlationId,
      registrationId: record.id,
      sessionId: session.id,
      ...summarizeError(err),
    })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.update",
      severity: "critical",
      error: err,
      registrationId: record.id,
      stripeSessionId: session.id,
    })
    return { ok: false, error: buildError("DB_DOWN", { correlationId }) }
  }

  if (typeof session.payment_intent === "string") {
    await safeAsync(
      () =>
        withTimeout(
          stripe.paymentIntents.update(session.payment_intent as string, {
            metadata: { ...metadata, registration_id: String(record.id), stripeSessionId: session.id },
          }),
          PI_UPDATE_TIMEOUT_MS,
          "stripe.payment_intent.update",
        ),
      undefined,
      { correlationId, label: "stripe.payment_intent.update", severity: "info" },
    )
  }

  log.info({
    event: "checkout.session_created",
    correlationId,
    registrationId: record.id,
    sessionId: session.id,
    intent: validatedData.intent,
  })

  return { ok: true, clientSecret: session.client_secret, correlationId }
}

// ── Donation flow ──────────────────────────────────────────────────

interface DonationArgs {
  correlationId: CorrelationId
  resolvedLocale: string
  validatedData: import("@/lib/validation").ValidatedRegistrationData
  validatedAttribution: import("zod").infer<typeof import("@/lib/validation").purchaseAttributionSchema>
}

async function runDonationCheckout(args: DonationArgs): Promise<StartCheckoutResult> {
  const { correlationId, resolvedLocale, validatedData, validatedAttribution } = args

  const amountCents = validatedData.donationAmountCents
  const processingFee = calculateProcessingFee(amountCents)

  const metadata = {
    correlation_id: correlationId,
    purchase_type: "donation",
    intent: "donate",
    donor_name: validatedData.name,
    donor_email: validatedData.email,
    donation_amount_cents: amountCents.toString(),
    donation_amount_display: formatUsdFromCents(amountCents),
    attribution_aa_entity: validatedAttribution?.aaEntity || "None",
    attribution_reserved_for_person: validatedAttribution?.reservedForPerson || "None",
  } as const

  let payload: Payload
  try {
    payload = await withTimeout(getPayload({ config: configPromise }), PAYLOAD_TIMEOUT_MS, "payload.bootstrap")
  } catch (err) {
    log.error({ event: "donation.payload_bootstrap_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "critical",
      error: err,
      email: validatedData.email,
    })
    return { ok: false, error: buildError("DB_DOWN", { correlationId }) }
  }

  let record: { id: string | number }
  try {
    record = await withTimeout(
      payload.create({
        collection: "donations",
        data: {
          donorName: validatedData.name,
          donorEmail: validatedData.email,
          correlationId,
          status: "pending",
          amountCents,
          amountTotalCents: amountCents + processingFee,
          metadata,
          attributionAaEntity: validatedAttribution?.aaEntity || undefined,
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.create:donation_pending",
    )
  } catch (err) {
    log.error({ event: "donation.payload_create_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "error",
      error: err,
      email: validatedData.email,
    })
    return {
      ok: false,
      error: buildError(err instanceof TimeoutError ? "DB_TIMEOUT" : "DB_DOWN", { correlationId }),
    }
  }

  log.info({
    event: "donation.pending_created",
    correlationId,
    donationId: record.id,
    amountCents,
    hashedEmail: hashIdentifier(validatedData.email),
  })

  const successUrlBase = `${env.NEXT_PUBLIC_BASE_URL}/${resolvedLocale}/register/success`
  const idempotencyKey = `donation-${record.id}`

  let session: Stripe.Checkout.Session
  try {
    session = await withRetry(
      () =>
        withTimeout(
          stripe.checkout.sessions.create(
            {
              ui_mode: "embedded",
              return_url: `${successUrlBase}?session_id={CHECKOUT_SESSION_ID}&donation=1`,
              customer_email: validatedData.email,
              customer_creation: "always",
              line_items: [
                {
                  price_data: {
                    currency: "usd",
                    product_data: {
                      name: "NECYPAA XXXVI General Fund Donation",
                      description: "Helps cover scholarships for those who can't afford registration.",
                    },
                    unit_amount: amountCents,
                  },
                  quantity: 1,
                },
                {
                  price_data: {
                    currency: "usd",
                    product_data: {
                      name: "Processing Fee",
                      description: "Credit card processing fee (2.9% + $0.30)",
                    },
                    unit_amount: processingFee,
                  },
                  quantity: 1,
                },
              ],
              mode: "payment",
              metadata: { ...metadata, donation_id: String(record.id) },
              payment_intent_data: {
                metadata: { ...metadata, donation_id: String(record.id) },
                description: `NECYPAA XXXVI · General Fund donation · ${formatUsdFromCents(amountCents)} from ${validatedData.email}`,
                statement_descriptor_suffix: "NECYPAA DONATE",
                receipt_email: validatedData.email,
              },
            },
            { idempotencyKey },
          ),
          STRIPE_TIMEOUT_MS,
          "stripe.sessions.create:donation",
        ),
      {
        maxAttempts: 2,
        baseDelayMs: 500,
        label: "stripe.sessions.create:donation",
        correlationId,
        retryableErrors: isRetryableStripeError,
      },
    )
  } catch (err) {
    log.error({ event: "donation.stripe_session_failed", correlationId, donationId: record.id, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "stripe.session.create",
      severity: "error",
      error: err,
      email: validatedData.email,
      registrationId: record.id,
    })
    await safeAsync(
      () => withTimeout(payload.delete({ collection: "donations", id: record.id }), PAYLOAD_TIMEOUT_MS, "payload.delete:donation_orphan"),
      undefined,
      { correlationId, label: "payload.delete:donation_orphan", severity: "warn" },
    )
    return { ok: false, error: fromUnknown(err, correlationId) }
  }

  if (!session.client_secret) {
    log.error({ event: "donation.stripe_no_client_secret", correlationId })
    await dlqRegistrationFailure({
      correlationId,
      stage: "stripe.session.create",
      severity: "error",
      error: new Error("Stripe donation session created without client_secret"),
      registrationId: record.id,
      stripeSessionId: session.id,
    })
    return { ok: false, error: buildError("STRIPE_DOWN", { correlationId }) }
  }

  await setSuccessCookie(session.id, correlationId)

  try {
    await withRetry(
      () =>
        withTimeout(
          payload.update({
            collection: "donations",
            id: record.id,
            data: { stripeSessionId: session.id },
          }),
          PAYLOAD_TIMEOUT_MS,
          "payload.update:donation_session_id",
        ),
      { maxAttempts: 3, baseDelayMs: 250, label: "payload.update:donation_session_id", correlationId },
    )
  } catch (err) {
    log.error({ event: "donation.link_session_failed", correlationId, donationId: record.id, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.update",
      severity: "critical",
      error: err,
      registrationId: record.id,
      stripeSessionId: session.id,
    })
    return { ok: false, error: buildError("DB_DOWN", { correlationId }) }
  }

  log.info({ event: "donation.session_created", correlationId, donationId: record.id, sessionId: session.id })

  return { ok: true, clientSecret: session.client_secret, correlationId }
}

// ── Group / Institution flow ───────────────────────────────────────

interface GroupArgs {
  correlationId: CorrelationId
  resolvedLocale: string
  validatedData: import("@/lib/validation").ValidatedRegistrationData
}

async function runGroupCheckout(args: GroupArgs): Promise<StartCheckoutResult> {
  const { correlationId, resolvedLocale, validatedData } = args

  const pricing = await getLivePricing()
  const unitPriceCents = pricing.registration.priceInCents
  const quantity = validatedData.groupQuantity
  const subtotalCents = unitPriceCents * quantity
  const processingFee = calculateProcessingFee(subtotalCents)
  const deadline = CONVENTION_START_DATE

  const metadata = {
    correlation_id: correlationId,
    purchase_type: "group",
    intent: "group",
    organization_name: validatedData.groupName,
    quantity: quantity.toString(),
    unit_price_cents: unitPriceCents.toString(),
    contact_name: validatedData.name,
    contact_email: validatedData.email,
    submission_deadline: deadline,
    pricing_source: pricing.source,
  } as const

  let payload: Payload
  try {
    payload = await withTimeout(getPayload({ config: configPromise }), PAYLOAD_TIMEOUT_MS, "payload.bootstrap")
  } catch (err) {
    log.error({ event: "group.payload_bootstrap_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "critical",
      error: err,
      email: validatedData.email,
    })
    return { ok: false, error: buildError("DB_DOWN", { correlationId }) }
  }

  let record: { id: string | number }
  try {
    record = await withTimeout(
      payload.create({
        collection: "group-registrations",
        data: {
          organizationName: validatedData.groupName,
          contactName: validatedData.name,
          contactEmail: validatedData.email,
          correlationId,
          quantity,
          unitPriceCents,
          status: "pending",
          submissionDeadline: deadline,
          amountTotalCents: subtotalCents + processingFee,
          metadata,
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.create:group_pending",
    )
  } catch (err) {
    log.error({ event: "group.payload_create_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "error",
      error: err,
      email: validatedData.email,
    })
    return {
      ok: false,
      error: buildError(err instanceof TimeoutError ? "DB_TIMEOUT" : "DB_DOWN", { correlationId }),
    }
  }

  log.info({
    event: "group.pending_created",
    correlationId,
    groupRegistrationId: record.id,
    quantity,
    hashedEmail: hashIdentifier(validatedData.email),
  })

  const successUrlBase = `${env.NEXT_PUBLIC_BASE_URL}/${resolvedLocale}/register/success`
  const idempotencyKey = `group-${record.id}`

  let session: Stripe.Checkout.Session
  try {
    session = await withRetry(
      () =>
        withTimeout(
          stripe.checkout.sessions.create(
            {
              ui_mode: "embedded",
              return_url: `${successUrlBase}?session_id={CHECKOUT_SESSION_ID}&group=1`,
              customer_email: validatedData.email,
              customer_creation: "always",
              line_items: [
                {
                  price_data: {
                    currency: "usd",
                    product_data: {
                      name: `NECYPAA XXXVI — Group Registration (${validatedData.groupName})`,
                      description: `${quantity} seats for ${validatedData.groupName}. Submit attendee names by the convention start date.`,
                    },
                    unit_amount: unitPriceCents,
                  },
                  quantity,
                },
                {
                  price_data: {
                    currency: "usd",
                    product_data: {
                      name: "Processing Fee",
                      description: "Credit card processing fee (2.9% + $0.30)",
                    },
                    unit_amount: processingFee,
                  },
                  quantity: 1,
                },
              ],
              mode: "payment",
              metadata: { ...metadata, group_registration_id: String(record.id) },
              payment_intent_data: {
                metadata: { ...metadata, group_registration_id: String(record.id) },
                description: `NECYPAA XXXVI · Group ${quantity} seats · ${validatedData.groupName} · ${validatedData.email}`.slice(
                  0,
                  250,
                ),
                statement_descriptor_suffix: "NECYPAA GROUP",
                receipt_email: validatedData.email,
              },
            },
            { idempotencyKey },
          ),
          STRIPE_TIMEOUT_MS,
          "stripe.sessions.create:group",
        ),
      {
        maxAttempts: 2,
        baseDelayMs: 500,
        label: "stripe.sessions.create:group",
        correlationId,
        retryableErrors: isRetryableStripeError,
      },
    )
  } catch (err) {
    log.error({
      event: "group.stripe_session_failed",
      correlationId,
      groupRegistrationId: record.id,
      ...summarizeError(err),
    })
    await dlqRegistrationFailure({
      correlationId,
      stage: "stripe.session.create",
      severity: "error",
      error: err,
      email: validatedData.email,
      registrationId: record.id,
    })
    await safeAsync(
      () =>
        withTimeout(
          payload.delete({ collection: "group-registrations", id: record.id }),
          PAYLOAD_TIMEOUT_MS,
          "payload.delete:group_orphan",
        ),
      undefined,
      { correlationId, label: "payload.delete:group_orphan", severity: "warn" },
    )
    return { ok: false, error: fromUnknown(err, correlationId) }
  }

  if (!session.client_secret) {
    log.error({ event: "group.stripe_no_client_secret", correlationId })
    await dlqRegistrationFailure({
      correlationId,
      stage: "stripe.session.create",
      severity: "error",
      error: new Error("Stripe group session created without client_secret"),
      registrationId: record.id,
      stripeSessionId: session.id,
    })
    return { ok: false, error: buildError("STRIPE_DOWN", { correlationId }) }
  }

  await setSuccessCookie(session.id, correlationId)

  try {
    await withRetry(
      () =>
        withTimeout(
          payload.update({
            collection: "group-registrations",
            id: record.id,
            data: { stripeSessionId: session.id },
          }),
          PAYLOAD_TIMEOUT_MS,
          "payload.update:group_session_id",
        ),
      { maxAttempts: 3, baseDelayMs: 250, label: "payload.update:group_session_id", correlationId },
    )
  } catch (err) {
    log.error({ event: "group.link_session_failed", correlationId, groupRegistrationId: record.id, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.update",
      severity: "critical",
      error: err,
      registrationId: record.id,
      stripeSessionId: session.id,
    })
    return { ok: false, error: buildError("DB_DOWN", { correlationId }) }
  }

  log.info({ event: "group.session_created", correlationId, groupRegistrationId: record.id, sessionId: session.id })
  return { ok: true, clientSecret: session.client_secret, correlationId }
}

async function setSuccessCookie(sessionId: string, correlationId: CorrelationId): Promise<void> {
  const token = signSuccessToken(sessionId)
  if (!token) return
  await safeAsync(
    async () => {
      const jar = await cookies()
      jar.set({
        name: SUCCESS_COOKIE,
        value: `${sessionId}.${token}`,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60,
      })
    },
    undefined,
    { correlationId, label: "cookies.set.success_token", severity: "info" },
  )
}

// ── Access-code flow (staff-issued codes via issuer service) ───────

export type AccessCodeResult =
  | { success: true; correlationId: CorrelationId; successToken: string }
  | { success: false; error: RegistrationError }

export async function submitAccessCodeRegistration(
  registrationData: RegistrationData,
  policyAgreements: PolicyAgreements,
): Promise<AccessCodeResult> {
  const correlationId = newCorrelationId()

  if (isRegistrationPaused()) {
    log.warn({ event: "accesscode.paused", correlationId })
    return { success: false, error: buildError("REGISTRATION_PAUSED", { correlationId }) }
  }

  let validatedData: import("@/lib/validation").ValidatedRegistrationData
  let validatedPolicy: import("@/lib/validation").ValidatedPolicyAgreements

  try {
    validatedData = registrationDataSchema.parse(registrationData)
    validatedPolicy = policyAgreementsSchema.parse(policyAgreements)
  } catch (err) {
    const zodErr = err as { issues?: Array<{ path: (string | number)[]; message: string }> }
    const first = zodErr.issues?.[0]
    const fieldPath = first?.path?.join(".")
    log.warn({ event: "accesscode.validation_failed", correlationId, fieldPath, message: first?.message })
    return {
      success: false,
      error: buildError("VALIDATION", {
        correlationId,
        fieldPath,
        userMessage: first ? `Please review — ${fieldPath ? fieldPath + ": " : ""}${first.message}` : undefined,
      }),
    }
  }

  if (!validatedData.accessCode) {
    return {
      success: false,
      error: buildError("VALIDATION", {
        correlationId,
        userMessage: "A registration access code is required.",
        fieldPath: "accessCode",
      }),
    }
  }
  if (validatedData.intent !== "self") {
    return {
      success: false,
      error: buildError("VALIDATION", {
        correlationId,
        userMessage: "Access codes redeem a single registration for the person filling out the form.",
      }),
    }
  }

  let ip = "unknown"
  try {
    ip = extractClientIp(await headers())
  } catch (err) {
    log.warn({ event: "accesscode.ip_extract_failed", correlationId, ...summarizeError(err) })
  }

  let rl: Awaited<ReturnType<typeof rateLimitCodeRedemption>>
  let rlIp: Awaited<ReturnType<typeof rateLimitCodeRedemptionByIp>>
  try {
    ;[rl, rlIp] = await Promise.all([
      withTimeout(rateLimitCodeRedemption({ ip, email: validatedData.email }), 2_000, "ratelimit.code"),
      withTimeout(rateLimitCodeRedemptionByIp({ ip }), 2_000, "ratelimit.code.ip"),
    ])
  } catch (err) {
    log.error({ event: "accesscode.rate_limit_failed", correlationId, ...summarizeError(err) })
    return { success: false, error: buildError("REDIS_DOWN", { correlationId }) }
  }
  const tripped = !rl.success ? rl : !rlIp.success ? rlIp : null
  if (tripped) {
    const seconds = formatResetSeconds(tripped.resetMs)
    log.info({ event: "accesscode.rate_limited", correlationId, hashedEmail: hashIdentifier(validatedData.email) })
    return {
      success: false,
      error: buildError("RATE_LIMITED", {
        correlationId,
        retryAfterSeconds: seconds,
        userMessage: `Too many attempts. Please wait about ${seconds}s and try again.`,
      }),
    }
  }

  const idempotencyKey = createHash("sha256")
    .update(`${validatedData.email.toLowerCase()}-${validatedData.accessCode}`)
    .digest("hex")
    .slice(0, 36)

  let payload: Payload
  try {
    payload = await withTimeout(getPayload({ config: configPromise }), PAYLOAD_TIMEOUT_MS, "payload.bootstrap")
  } catch (err) {
    log.error({ event: "accesscode.payload_bootstrap_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "critical",
      error: err,
      email: validatedData.email,
    })
    return { success: false, error: buildError("DB_DOWN", { correlationId }) }
  }

  let record: { id: string | number }
  try {
    record = await withTimeout(
      payload.create({
        collection: "registrations",
        data: {
          email: validatedData.email,
          name: validatedData.name,
          state: validatedData.state,
          status: "pending",
          type: "comp",
          stripeSessionId: "",
          amountTotalCents: 0,
          metadata: { correlation_id: correlationId, awaiting_issuer_redemption: true },
          accommodations: validatedData.accommodations || "",
          interpretationNeeded: validatedData.interpretationNeeded,
          mobilityAccessibility: validatedData.mobilityAccessibility,
          willingToServe: validatedData.willingToServe,
          homegroup: validatedData.homegroup,
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.create:comp_pending",
    )
  } catch (err) {
    log.error({ event: "accesscode.payload_create_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "error",
      error: err,
      email: validatedData.email,
    })
    return {
      success: false,
      error: buildError(err instanceof TimeoutError ? "DB_TIMEOUT" : "DB_DOWN", { correlationId }),
    }
  }

  let result: Awaited<ReturnType<typeof redeemRegistrationCode>>
  try {
    result = await redeemRegistrationCode({
      code: validatedData.accessCode,
      eventSlug: EVENT_SLUG,
      email: validatedData.email,
      fullName: validatedData.name,
      source: "necypaa-main-site",
      idempotencyKey,
    })
  } catch (err) {
    log.error({ event: "accesscode.issuer_threw", correlationId, ...summarizeError(err) })
    await safeAsync(
      () =>
        withTimeout(
          payload.update({ collection: "registrations", id: record.id, data: { status: "failed" } }),
          PAYLOAD_TIMEOUT_MS,
          "payload.update:comp_failed",
        ),
      undefined,
      { correlationId, label: "payload.update:comp_failed", severity: "warn" },
    )
    await dlqRegistrationFailure({
      correlationId,
      stage: "issuer.redeem",
      severity: "critical",
      error: err,
      email: validatedData.email,
      registrationId: record.id,
    })
    return { success: false, error: buildError("ISSUER_DOWN", { correlationId }) }
  }

  if (!result.success) {
    log.info({
      event: "accesscode.redeem_failed",
      correlationId,
      code: result.code,
      maskedCode: maskAccessCode(validatedData.accessCode),
    })
    await safeAsync(
      () =>
        withTimeout(
          payload.update({
            collection: "registrations",
            id: record.id,
            data: { status: "failed", metadata: { correlation_id: correlationId, issuer_error: result.code } },
          }),
          PAYLOAD_TIMEOUT_MS,
          "payload.update:comp_invalid",
        ),
      undefined,
      { correlationId, label: "payload.update:comp_invalid", severity: "warn" },
    )
    const errorCode =
      result.code === "INVALID_CODE"
        ? "ISSUER_INVALID_CODE"
        : result.code === "EXPIRED_CODE"
          ? "ISSUER_EXPIRED"
          : result.code === "ALREADY_REDEEMED"
            ? "ISSUER_ALREADY_USED"
            : "ISSUER_DOWN"
    return { success: false, error: buildError(errorCode, { correlationId, userMessage: result.error }) }
  }

  try {
    await withTimeout(
      payload.update({
        collection: "registrations",
        id: record.id,
        data: {
          status: "comped",
          type: "comp",
          metadata: {
            correlation_id: correlationId,
            access_grant_id: result.grantId,
            access_redemption_id: result.redemptionId,
            access_grant_type: result.grantType,
            access_issuer_source: "archway-issuer",
            access_code_masked: maskAccessCode(validatedData.accessCode),
            policy_read_and_understood: validatedPolicy.readPolicy,
            policy_questions_understood: validatedPolicy.understandQuestions,
            policy_behavior_acknowledged: validatedPolicy.acknowledgeBehavior,
            policy_admission_understood: validatedPolicy.understandAdmission,
            policy_reporting_understood: validatedPolicy.understandReporting,
            policy_investigation_understood: validatedPolicy.understandInvestigation,
            policy_signature_agreement: validatedPolicy.signatureAgreement,
          },
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.update:comp_promoted",
    )
  } catch (err) {
    log.error({ event: "accesscode.promote_failed", correlationId, registrationId: record.id, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.update",
      severity: "critical",
      error: err,
      email: validatedData.email,
      registrationId: record.id,
    })
  }

  await safeAsync(
    async () => {
      const existingCustomers = await withTimeout(
        stripe.customers.list({ email: validatedData.email, limit: 1 }),
        STRIPE_TIMEOUT_MS,
        "stripe.customers.list",
      )
      const metadata = {
        correlation_id: correlationId,
        access_grant_id: result.grantId,
        access_grant_type: result.grantType,
        access_code_masked: maskAccessCode(validatedData.accessCode),
      }
      if (existingCustomers.data.length > 0) {
        await withTimeout(
          stripe.customers.update(existingCustomers.data[0].id, { name: validatedData.name, metadata }),
          STRIPE_TIMEOUT_MS,
          "stripe.customers.update",
        )
      } else {
        await withTimeout(
          stripe.customers.create({ name: validatedData.name, email: validatedData.email, metadata }),
          STRIPE_TIMEOUT_MS,
          "stripe.customers.create",
        )
      }
    },
    undefined,
    { correlationId, label: "stripe.customer.upsert", severity: "info" },
  )

  const successToken = signAccessCodePayload({
    name: validatedData.name,
    email: validatedData.email,
    iat: Math.floor(Date.now() / 1000),
  })

  log.info({
    event: "accesscode.redeemed",
    correlationId,
    registrationId: record.id,
    grantType: result.grantType,
  })

  return { success: true, correlationId, successToken }
}

function sanitizeRequest(value: unknown): unknown {
  try {
    return JSON.parse(JSON.stringify(value))
  } catch {
    return null
  }
}

interface PiDescriptionArgs {
  intent: "self" | "self_plus_gift" | "gift_only" | "group" | "donate"
  selfQuantity: number
  giftQuantity: number
  breakfastCount: number
  email: string
}

/**
 * Builds the description that appears on the Stripe PaymentIntent and shows
 * up everywhere in the dashboard ("Recent payments", refund views, etc).
 * Capped at ~250 chars to stay well inside Stripe's 1000-char limit.
 */
function buildPaymentIntentDescription(args: PiDescriptionArgs): string {
  const parts: string[] = ["NECYPAA XXXVI"]
  if (args.intent === "self") parts.push("Registration")
  else if (args.intent === "self_plus_gift") parts.push(`Self + ${args.giftQuantity} gift${args.giftQuantity === 1 ? "" : "s"}`)
  else if (args.intent === "gift_only") parts.push(`${args.giftQuantity} gift${args.giftQuantity === 1 ? "" : "s"}`)
  if (args.breakfastCount > 0) parts.push(`${args.breakfastCount} breakfast${args.breakfastCount === 1 ? "" : "s"}`)
  parts.push(args.email)
  return parts.join(" · ").slice(0, 250)
}
