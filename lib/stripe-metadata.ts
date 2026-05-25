import "server-only"
import { log } from "./logger"

/**
 * Sanitize a metadata object so it always satisfies Stripe's hard limits:
 *
 *   - 50 keys max per object
 *   - key   ≤ 40 chars, [a-zA-Z0-9_-]
 *   - value ≤ 500 chars (stringified)
 *   - values must be strings
 *
 * Anything that violates these is truncated or dropped with a logged
 * warning. Stripe rejects the whole session create if any field is over —
 * we'd rather succeed with truncated metadata than fail entirely. The
 * Payload row keeps the full, untruncated data alongside in its own
 * metadata field, so audit trail is preserved.
 *
 * Use this helper at every site that passes metadata to Stripe (session,
 * payment_intent, customer). No raw metadata blocks should reach Stripe
 * without going through this function.
 */

const MAX_KEYS = 50
const MAX_KEY_LENGTH = 40
const MAX_VALUE_LENGTH = 480 // 20-char safety margin under Stripe's 500
const KEY_PATTERN = /^[a-zA-Z0-9_-]+$/

export function safeStripeMetadata(
  raw: Record<string, unknown>,
  ctx: { correlationId?: string; label?: string } = {},
): Record<string, string> {
  const out: Record<string, string> = {}
  const truncated: string[] = []
  const dropped: string[] = []

  let kept = 0
  for (const [key, value] of Object.entries(raw)) {
    if (kept >= MAX_KEYS) {
      dropped.push(key)
      continue
    }
    if (key.length > MAX_KEY_LENGTH || !KEY_PATTERN.test(key)) {
      dropped.push(key)
      continue
    }
    if (value === undefined || value === null) {
      continue
    }
    const str = String(value)
    if (str.length === 0) {
      continue
    }
    if (str.length > MAX_VALUE_LENGTH) {
      out[key] = str.slice(0, MAX_VALUE_LENGTH - 1) + "…"
      truncated.push(`${key}(${str.length}→${MAX_VALUE_LENGTH})`)
    } else {
      out[key] = str
    }
    kept += 1
  }

  if (truncated.length > 0 || dropped.length > 0) {
    log.warn({
      event: "stripe_metadata.sanitized",
      correlationId: ctx.correlationId,
      label: ctx.label,
      truncated,
      dropped,
    })
  }

  return out
}
