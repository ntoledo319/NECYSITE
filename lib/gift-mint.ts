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
 * Recipients come from the parent `registrations` row's metadata
 * (`metadata.gift_recipients`), with no truncation. Stripe metadata caps
 * values at 500 chars — any non-trivial recipient list would blow that.
 *
 * IDEMPOTENCY MODEL (per-recipient atomic):
 *
 * Each recipient gets a deterministic slot key `<sessionId>:<index>`, with
 * a Payload unique constraint on `sessionRecipientKey`. The mint loop tries
 * to create each row by that key; a unique-constraint violation means
 * another worker (a concurrent webhook, the success-page self-heal, the
 * cron, or a previous attempt that crashed mid-loop) already minted that
 * slot — we skip cleanly and move on. This means:
 *
 *   - Crash recovery: a partial-mint state (some recipients minted, others
 *     not) is automatically completed on the next call. No manual recovery
 *     needed.
 *   - Concurrency: two workers running mint in parallel both succeed at
 *     creating non-overlapping rows; the Payload unique constraint prevents
 *     any overlap.
 *   - Email retry: if a row exists but its email send previously failed
 *     (`emailDeliveredTo` ∈ {'pending', 'failed'}), we re-send.
 */
export async function mintGiftCodesForPaidSession(args: {
  payload: Payload
  session: Stripe.Checkout.Session
  correlationId: CorrelationId
}): Promise<void> {
  const { payload, session, correlationId } = args

  const recipients = await resolveRecipients(payload, session, correlationId)
  if (recipients.length === 0) {
    log.info({ event: "gift.mint_no_recipients", correlationId, sessionId: session.id })
    return
  }

  const sponsorName = stringFromMeta(session.metadata, "attendee_name") || "A friend"
  const sponsorEmail = (session.customer_email ?? stringFromMeta(session.metadata, "attendee_email") ?? "").trim()
  const sponsorState = stringFromMeta(session.metadata, "attendee_state")
  const unitAmountCents = Number(stringFromMeta(session.metadata, "gift_unit_amount_cents") || "0") || 0
  const paidAt = new Date().toISOString()

  let mintedNow = 0
  let alreadyExisted = 0
  let emailsReSent = 0
  let failures = 0

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i]
    const slotKey = `${session.id}:${i}`

    const outcome = await mintOrRetrySlot({
      payload,
      session,
      correlationId,
      recipient,
      slotKey,
      recipientIndex: i,
      sponsorName,
      sponsorEmail,
      sponsorState,
      unitAmountCents,
      paidAt,
    })

    if (outcome === "minted") mintedNow += 1
    else if (outcome === "already_existed_email_resent") {
      alreadyExisted += 1
      emailsReSent += 1
    } else if (outcome === "already_existed_skipped") alreadyExisted += 1
    else failures += 1
  }

  log.info({
    event: "gift.mint_complete",
    correlationId,
    sessionId: session.id,
    totalRecipients: recipients.length,
    mintedNow,
    alreadyExisted,
    emailsReSent,
    failures,
  })
}

type SlotOutcome = "minted" | "already_existed_email_resent" | "already_existed_skipped" | "failed"

async function mintOrRetrySlot(args: {
  payload: Payload
  session: Stripe.Checkout.Session
  correlationId: CorrelationId
  recipient: RecipientFromMetadata
  slotKey: string
  recipientIndex: number
  sponsorName: string
  sponsorEmail: string
  sponsorState: string
  unitAmountCents: number
  paidAt: string
}): Promise<SlotOutcome> {
  const {
    payload,
    session,
    correlationId,
    recipient,
    slotKey,
    recipientIndex,
    sponsorName,
    sponsorEmail,
    sponsorState,
    unitAmountCents,
    paidAt,
  } = args

  // Check first to give a fast path for the common case (slot already minted
  // cleanly). The atomic try/catch below is the actual race-safe primitive.
  let existingId: string | number | null = null
  let existingEmailStatus: string | null = null
  let existingToken: string | null = null
  let existingRecipientEmail: string | null = null
  try {
    const found = await withTimeout(
      payload.find({
        collection: "gift-codes",
        where: { sessionRecipientKey: { equals: slotKey } },
        limit: 1,
      }),
      PAYLOAD_TIMEOUT_MS,
      "gift.find_slot",
    )
    if (found.docs.length > 0) {
      const doc = found.docs[0] as {
        id: string | number
        emailDeliveredTo?: string | null
        token?: string | null
        recipientEmail?: string | null
      }
      existingId = doc.id
      existingEmailStatus = doc.emailDeliveredTo ?? null
      existingToken = doc.token ?? null
      existingRecipientEmail = doc.recipientEmail ?? null
    }
  } catch (err) {
    log.warn({
      event: "gift.find_slot_failed",
      correlationId,
      sessionId: session.id,
      slotKey,
      ...summarizeError(err),
    })
    // Fall through and let the create attempt be the source of truth.
  }

  // If a row exists already, decide whether to re-send the email.
  if (existingId && existingToken) {
    const needsEmailRetry = existingEmailStatus === "pending" || existingEmailStatus === "failed"
    if (!needsEmailRetry) {
      log.info({
        event: "gift.slot_already_minted",
        correlationId,
        sessionId: session.id,
        slotKey,
        giftId: existingId,
        emailDeliveredTo: existingEmailStatus,
      })
      return "already_existed_skipped"
    }
    log.info({
      event: "gift.slot_already_minted_retry_email",
      correlationId,
      sessionId: session.id,
      slotKey,
      giftId: existingId,
      previousEmailStatus: existingEmailStatus,
    })
    await safeAsync(
      () =>
        sendGiftClaimEmail({
          giftId: existingId!,
          token: existingToken!,
          recipientName: recipient.name,
          recipientEmail: existingRecipientEmail ?? recipient.email ?? null,
          sponsorName,
          sponsorEmail,
          sponsorMessage: recipient.message || null,
          correlationId,
          payload,
        }),
      undefined,
      { correlationId, label: "gift.email_retry", severity: "warn" },
    )
    return "already_existed_email_resent"
  }

  // Slot is free (or check failed); try to create. A unique-constraint
  // violation on sessionRecipientKey means we lost a race with another
  // worker — treat as success and move on.
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
          sessionRecipientKey: slotKey,
          recipientIndex,
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
      "gift.create_slot",
    )
    createdId = (created as { id: string | number }).id
  } catch (err) {
    // Detect the unique-constraint race: SQLite reports it via libsql with
    // "UNIQUE constraint failed" in the message. We treat any "duplicate"
    // signal as the race outcome.
    const message = err instanceof Error ? err.message : String(err)
    const isUniqueViolation =
      /UNIQUE constraint failed|SQLITE_CONSTRAINT|duplicate key|already exists/i.test(message)
    if (isUniqueViolation) {
      log.info({
        event: "gift.slot_race_lost",
        correlationId,
        sessionId: session.id,
        slotKey,
      })
      return "already_existed_skipped"
    }
    log.error({
      event: "gift.mint_slot_failed",
      correlationId,
      sessionId: session.id,
      slotKey,
      ...summarizeError(err),
    })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "critical",
      error: err,
      email: sponsorEmail,
      stripeSessionId: session.id,
      requestPayload: { slotKey, recipientIndex, recipientName: recipient.name },
    })
    return "failed"
  }

  if (!createdId) return "failed"

  log.info({
    event: "gift.slot_minted",
    correlationId,
    sessionId: session.id,
    slotKey,
    giftId: createdId,
    hasRecipientEmail: Boolean(recipient.email),
  })

  await safeAsync(
    () =>
      sendGiftClaimEmail({
        giftId: createdId!,
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

  return "minted"
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
