import "server-only"
import { randomBytes } from "node:crypto"

/**
 * Generate a URL-safe gift redemption token. Tokens are the sole bearer of
 * authorization for /claim/<token>, so they must be unguessable. 22 chars of
 * base64url ≈ 128 bits of entropy.
 */
export function generateGiftToken(): string {
  return base64url(randomBytes(16))
}

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")
}
