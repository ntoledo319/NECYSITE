import "server-only"
import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * HMAC token attached to the Stripe success URL. Stops anyone who finds a
 * checkout session ID in browser history / Referer headers from rendering
 * attendee PII on the confirmation page. Tokens are short — they're not
 * meant to authorize anything, just to prove the URL was issued by us.
 *
 * Used in two places:
 *   1. `signSuccessToken(sessionId)` produces a short HMAC of the session ID.
 *      The server action sets a cookie carrying this token; the success page
 *      reads it back. Stripe's checkout-session API does not support post-
 *      creation `return_url` updates, so URL embedding isn't viable; the
 *      cookie path is the deliverable.
 *   2. `signAccessCodePayload` round-trips name + email across the access-
 *      code redirect (which we own, so URL embedding is fine).
 */

const ALGO = "sha256"
const LENGTH = 24

function secret(): string {
  return process.env.SUCCESS_URL_HMAC_SECRET || process.env.PAYLOAD_SECRET || ""
}

export function isSuccessTokenConfigured(): boolean {
  return secret().length > 0
}

function toBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value)
}

export function signSuccessToken(sessionId: string): string {
  const key = secret()
  if (!key) return ""
  return createHmac(ALGO, key).update(sessionId).digest("hex").slice(0, LENGTH)
}

export function verifySuccessToken(sessionId: string, token: string | null | undefined): boolean {
  const key = secret()
  if (!key) return true // Fail-open when not configured so we don't break prod on rollout.
  if (!token) return false
  const expected = createHmac(ALGO, key).update(sessionId).digest("hex").slice(0, LENGTH)
  try {
    const a = toBytes(token)
    const b = toBytes(expected)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export interface AccessCodeSuccessPayload {
  name: string
  email: string
  /** Unix seconds — used for soft expiry on the consumer side. */
  iat: number
}

export function signAccessCodePayload(payload: AccessCodeSuccessPayload): string {
  const key = secret()
  const body = base64urlEncode(JSON.stringify(payload))
  if (!key) return body
  const sig = createHmac(ALGO, key).update(body).digest("hex").slice(0, LENGTH)
  return `${body}.${sig}`
}

export function verifyAccessCodePayload(token: string | null | undefined): AccessCodeSuccessPayload | null {
  if (!token) return null
  const key = secret()
  const [body, sig] = token.split(".")
  if (!body) return null
  if (key) {
    if (!sig) return null
    const expected = createHmac(ALGO, key).update(body).digest("hex").slice(0, LENGTH)
    try {
      const a = toBytes(sig)
      const b = toBytes(expected)
      if (a.length !== b.length) return null
      if (!timingSafeEqual(a, b)) return null
    } catch {
      return null
    }
  }
  try {
    const json = base64urlDecode(body)
    const parsed = JSON.parse(json) as AccessCodeSuccessPayload
    if (!parsed || typeof parsed !== "object") return null
    if (typeof parsed.name !== "string" || typeof parsed.email !== "string" || typeof parsed.iat !== "number") {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function base64urlEncode(input: string): string {
  return Buffer.from(input, "utf8").toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function base64urlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4))
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/") + pad
  return Buffer.from(normalized, "base64").toString("utf8")
}
