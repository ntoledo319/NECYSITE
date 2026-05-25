import "server-only"
import type { Payload } from "payload"
import type Stripe from "stripe"
import { withTimeout, safeAsync } from "./resilience"
import { log, summarizeError } from "./logger"
import { generateGiftToken } from "./gift-tokens"
import { dlqRegistrationFailure } from "./dlq"
import { sendGiftClaimEmail } from "./gift-email"
import type { CorrelationId } from "./correlation"

const PAYLOAD_TIMEOUT_MS = 6_000

interface RecipientFromMetadata {
  name: string
  email: string | null
  message: string | null
}

/**
 * After a gift purchase is confirmed paid by Stripe, mint one gift-code row
 * per recipient, then dispatch the claim email.
 *
 * Recipients are read from the parent `registrations` row's metadata
 * (`metadata.gift_recipients`), where they are stored at action-time with
 * no truncation. Stripe metadata is NOT used as the recipient source
 * because Stripe enforces a 500-char-per-value cap that any non-trivial
 * recipient list would blow past. The session is still used to learn
 * sponsor name/email and other display-only fields.
 *
 * Concurrency: a `processed-webhook-events` row keyed on
 * `mint-<stripeSessionId>` acts as a single-shot lock. Two concurrent
 * webhooks (or webhook + self-heal) racing on the same session means one
 * wins the lock and mints, the other no-ops cleanly.
 */
export async function mintGiftCodesForPaidSession(args: {
  payload: Payload
  session: Stripe.Checkout.Session
  correlationId: CorrelationId
}): Promise<void> {
  const { payload, session, correlationId } = args

  // Claim the mint lock first. If another worker already inserted this
  // marker, we lose the race and return silently.
  const lockEventId = `mint-${session.id}`
  try {
    await withTimeout(
      payload.create({
        collection: "processed-webhook-events",
        data: {
          eventId: lockEventId,
          eventType: "internal.gift_mint",
          correlationId,
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "gift.mint_lock",
    )
  } catch (err) {
    // Almost certainly a unique-constraint violation — another worker beat
    // us. That's the desired behavior; bail out cleanly.
    log.info({
      event: "gift.mint_lock_lost",
      correlationId,
      sessionId: session.id,
      reason: err instanceof Error ? err.message : String(err),
    })
    return
  }

  // Resolve recipients from the parent registration row (full, untruncated).
  const recipients = await resolveRecipients(payload, session, correlationId)
  if (recipients.length === 0) {
    log.info({ event: "gift.mint_no_recipients", correlationId, sessionId: session.id })
    return
  }

  // Belt-and-suspenders: even with the lock, do an existence check before
  // creating rows. Covers the unlikely case where a previous attempt
  // partial-minted and a different worker is retrying via reconciliation.
  try {
    const existing = await withTimeout(
      payload.find({
        collection: "gift-codes",
        where: { stripeSessionId: { equals: session.id } },
        limit: 1,
      }),
      PAYLOAD_TIMEOUT_MS,
      "gift.find_existing",
    )
    if (existing.docs.length > 0) {
      log.info({
        event: "gift.mint_skipped_already_present",
        correlationId,
        sessionId: session.id,
        existingCount: existing.docs.length,
      })
      return
    }
  } catch (err) {
    log.warn({ event: "gift.mint_idempotency_check_failed", correlationId, ...summarizeError(err) })
    // Fall through — minting is safer than skipping.
  }

  const sponsorName = stringFromMeta(session.metadata, "attendee_name") || "A friend"
  const sponsorEmail = (session.customer_email ?? stringFromMeta(session.metadata, "attendee_email") ?? "").trim()
  const sponsorState = stringFromMeta(session.metadata, "attendee_state")
  const unitAmountCents = Number(stringFromMeta(session.metadata, "gift_unit_amount_cents") || "0") || 0
  const paidAt = new Date().toISOString()

  for (const recipient of recipients) {
    const token = generateGiftToken()
    let createdId: string | number | null = null
    try {
      const created = await withTimeout(
        payload.create({
          collection: "gift-codes",
          data: {
            token,
            correlationId,
            status: "unclaimed",
            recipientName: recipient.name,
            recipientEmail: recipient.email || undefined,
            sponsorMessage: recipient.message || undefined,
            sponsorName,
            sponsorEmail: sponsorEmail || "unknown@necypaa.org",
            sponsorState: sponsorState || undefined,
            emailDeliveredTo: "pending",
            paidAt,
            stripeSessionId: session.id,
            stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
            amountPaidCents: unitAmountCents || undefined,
          },
        }),
        PAYLOAD_TIMEOUT_MS,
        "gift.create",
      )
      createdId = (created as { id: string | number }).id
      log.info({
        event: "gift.minted",
        correlationId,
        giftId: createdId,
        sessionId: session.id,
        hasRecipientEmail: Boolean(recipient.email),
      })
    } catch (err) {
      log.error({ event: "gift.mint_failed", correlationId, sessionId: session.id, ...summarizeError(err) })
      await dlqRegistrationFailure({
        correlationId,
        stage: "payload.create",
        severity: "critical",
        error: err,
        email: sponsorEmail,
        stripeSessionId: session.id,
        requestPayload: { recipient: { name: recipient.name, hasEmail: Boolean(recipient.email) } },
      })
      continue
    }

    if (!createdId) continue

    await safeAsync(
      () =>
        sendGiftClaimEmail({
          giftId: createdId,
          token,
          recipientName: recipient.name,
          recipientEmail: recipient.email || null,
          sponsorName,
          sponsorEmail,
          sponsorMessage: recipient.message || null,
          correlationId,
          payload,
        }),
      undefined,
      {
        correlationId,
        label: "gift.send_claim_email",
        severity: "warn",
      },
    )
  }
}

/**
 * Look up the parent registration row by stripeSessionId and return its
 * recipient list. Falls back to parsing the legacy `gift_recipients_json`
 * Stripe metadata key if the Payload row isn't found — this covers
 * in-flight sessions that pre-date the safer metadata strategy.
 */
async function resolveRecipients(
  payload: Payload,
  session: Stripe.Checkout.Session,
  correlationId: CorrelationId,
): Promise<RecipientFromMetadata[]> {
  // Preferred path: read from the parent registration row's metadata.
  try {
    const found = await withTimeout(
      payload.find({
        collection: "registrations",
        where: { stripeSessionId: { equals: session.id } },
        limit: 1,
      }),
      PAYLOAD_TIMEOUT_MS,
      "gift.resolve_recipients.find_registration",
    )
    if (found.docs.length > 0) {
      const md = (found.docs[0] as { metadata?: Record<string, unknown> | null }).metadata
      if (md && Array.isArray(md.gift_recipients)) {
        const parsed = (md.gift_recipients as unknown[])
          .map((r) => {
            if (!r || typeof r !== "object") return null
            const obj = r as { name?: unknown; email?: unknown; message?: unknown }
            const name = typeof obj.name === "string" ? obj.name.trim() : ""
            const email = typeof obj.email === "string" ? obj.email.trim() : null
            const message = typeof obj.message === "string" ? obj.message.trim() : null
            if (!name) return null
            return {
              name,
              email: email && email.length > 0 ? email : null,
              message: message && message.length > 0 ? message : null,
            }
          })
          .filter((v): v is RecipientFromMetadata => v !== null)
          .slice(0, 20)
        if (parsed.length > 0) return parsed
      }
    }
  } catch (err) {
    log.warn({
      event: "gift.resolve_recipients_payload_failed",
      correlationId,
      sessionId: session.id,
      ...summarizeError(err),
    })
  }

  // Back-compat fallback: legacy in-flight sessions stored recipients in
  // Stripe metadata. The JSON may be truncated; we accept what we can parse.
  const legacy = parseLegacyJson(stringFromMeta(session.metadata, "gift_recipients_json"))
  if (legacy.length > 0) {
    log.info({
      event: "gift.resolve_recipients_legacy_path",
      correlationId,
      sessionId: session.id,
      recipientCount: legacy.length,
    })
  }
  return legacy
}

function parseLegacyJson(raw: string): RecipientFromMetadata[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((r) => {
        if (!r || typeof r !== "object") return null
        const obj = r as { name?: unknown; email?: unknown; message?: unknown }
        const name = typeof obj.name === "string" ? obj.name.trim() : ""
        const email = typeof obj.email === "string" ? obj.email.trim() : null
        const message = typeof obj.message === "string" ? obj.message.trim() : null
        if (!name) return null
        return {
          name,
          email: email && email.length > 0 ? email : null,
          message: message && message.length > 0 ? message.slice(0, 500) : null,
        }
      })
      .filter((v): v is RecipientFromMetadata => v !== null)
      .slice(0, 20)
  } catch {
    return []
  }
}

function stringFromMeta(md: Stripe.Metadata | null | undefined, key: string): string {
  if (!md) return ""
  const v = (md as Record<string, unknown>)[key]
  return typeof v === "string" ? v : ""
}
