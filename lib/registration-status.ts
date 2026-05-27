import "server-only"

/**
 * Single source of truth for "is registration accepting writes right now".
 * Today this is a Vercel env var (`REGISTRATION_PAUSED=1`) — flip it in the
 * dashboard and the next request rejects with a polite "email us" card.
 * Promotion to a Payload `SiteSettings` global is straightforward later.
 *
 * Note: server-only. The page also reads a public mirror exposed via
 * `NEXT_PUBLIC_REGISTRATION_PAUSED` so the client can render the paused state
 * without a round-trip. Both must agree in practice; the server is authoritative.
 */

const TRUTHY = new Set(["1", "true", "yes", "on", "paused"])

export function isRegistrationPaused(): boolean {
  const raw = process.env.REGISTRATION_PAUSED ?? ""
  return TRUTHY.has(raw.toLowerCase().trim())
}

export function registrationPausedReason(): string | null {
  const raw = process.env.REGISTRATION_PAUSED_REASON
  if (!raw) return null
  return raw.trim().slice(0, 280) || null
}
