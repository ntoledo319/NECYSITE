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
}

/**
 * After a gift purchase is confirmed paid by Stripe, mint one gift-code row
 * per recipient listed in session metadata, then dispatch the claim email.
 *
 * Idempotency: if rows already exist for this stripeSessionId, we skip
 * minting (a webhook replay or the success-page self-heal would otherwise
 * double-mint).
 */
export async function mintGiftCodesForPaidSession(args: {
  payload: Payload
  session: Stripe.Checkout.Session
  correlationId: CorrelationId
}): Promise<void> {
  const { payload, session, correlationId } = args

  const recipients = parseRecipients(session.metadata?.gift_recipients_json)
  if (recipients.length === 0) return

  // Idempotency: have we already minted for this session?
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
    // Fall through — minting anyway is safer than skipping.
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

function parseRecipients(raw: unknown): RecipientFromMetadata[] {
  if (typeof raw !== "string") return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((r) => {
        if (!r || typeof r !== "object") return null
        const obj = r as { name?: unknown; email?: unknown }
        const name = typeof obj.name === "string" ? obj.name.trim() : ""
        const email = typeof obj.email === "string" ? obj.email.trim() : null
        if (!name) return null
        return { name, email: email && email.length > 0 ? email : null }
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
