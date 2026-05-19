import "server-only"
import type { Payload } from "payload"
import { withTimeout, safeAsync } from "./resilience"
import { log, summarizeError } from "./logger"
import { alertCritical } from "./alerts"
import type { CorrelationId } from "./correlation"

const PAYLOAD_TIMEOUT_MS = 6_000

/**
 * Voids all unclaimed gift codes spawned from a refunded or disputed parent
 * Stripe session. Already-claimed codes are NOT modified — the recipient is
 * a real attendee at that point and unwinding their registration is a human
 * decision. Claimed-code IDs are included in the alert so admins can act.
 *
 * Idempotent: re-running on already-voided rows is a no-op.
 */
export async function voidUnclaimedGiftsForSession(args: {
  payload: Payload
  stripeSessionId: string
  reason: string
  correlationId: CorrelationId
  alert?: boolean
}): Promise<{ voided: number; claimed: number; failed: number }> {
  const { payload, stripeSessionId, reason, correlationId } = args
  if (!stripeSessionId) {
    return { voided: 0, claimed: 0, failed: 0 }
  }

  let docs: Array<{ id: string | number; status?: string | null; recipientName?: string | null; claimedRegistrationId?: string | null }> = []
  try {
    const found = await withTimeout(
      payload.find({
        collection: "gift-codes",
        where: { stripeSessionId: { equals: stripeSessionId } },
        limit: 50,
      }),
      PAYLOAD_TIMEOUT_MS,
      "gift_void.find",
    )
    docs = found.docs as typeof docs
  } catch (err) {
    log.error({ event: "gift_void.find_failed", correlationId, stripeSessionId, ...summarizeError(err) })
    return { voided: 0, claimed: 0, failed: 0 }
  }

  if (docs.length === 0) {
    return { voided: 0, claimed: 0, failed: 0 }
  }

  let voided = 0
  let claimed = 0
  let failed = 0
  const claimedDetails: Array<{ id: string | number; name: string }> = []

  for (const row of docs) {
    if (row.status === "claimed") {
      claimed += 1
      claimedDetails.push({ id: row.id, name: row.recipientName ?? "unknown" })
      continue
    }
    if (row.status === "void") {
      // Already voided — count as voided for the summary.
      voided += 1
      continue
    }
    await safeAsync(
      async () => {
        await withTimeout(
          payload.update({
            collection: "gift-codes",
            id: row.id,
            data: { status: "void", voidReason: reason.slice(0, 1000) },
          }),
          PAYLOAD_TIMEOUT_MS,
          "gift_void.update",
        )
        voided += 1
      },
      undefined,
      {
        correlationId,
        label: "gift_void.update",
        severity: "warn",
        onError: () => {
          failed += 1
        },
      },
    )
  }

  log.info({
    event: "gift_void.completed",
    correlationId,
    stripeSessionId,
    voided,
    claimed,
    failed,
    reason,
  })

  if ((args.alert ?? true) && (claimed > 0 || failed > 0)) {
    await alertCritical({
      event: "gift_void.requires_review",
      correlationId,
      summary:
        claimed > 0
          ? `${claimed} gift code(s) were already claimed before the parent purchase was refunded/disputed`
          : `${failed} gift code(s) failed to void`,
      fields: {
        stripeSessionId,
        reason,
        voided,
        claimed,
        failed,
        claimedDetails: claimedDetails.length > 0 ? JSON.stringify(claimedDetails).slice(0, 500) : undefined,
      },
    })
  }

  return { voided, claimed, failed }
}
