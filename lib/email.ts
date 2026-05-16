import "server-only"
import { log, summarizeError } from "./logger"
import { withTimeout } from "./resilience"
import type { CorrelationId } from "./correlation"

/**
 * Transactional email shim. Targets Resend by convention because it ships
 * with a single fetch call and no SDK. No-ops if RESEND_API_KEY is missing —
 * the rest of the registration flow does not depend on email delivery, only
 * scholarship-recipient notifications use this.
 */

export interface SendEmailInput {
  to: string
  subject: string
  text: string
  html?: string
  correlationId?: CorrelationId
  /** Optional reply-to override; defaults to info@necypaa.org. */
  replyTo?: string
}

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; reason: "not_configured" | "send_failed"; message?: string }

const RESEND_API = "https://api.resend.com/emails"
const RESEND_TIMEOUT_MS = 8_000

export async function sendTransactionalEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || "NECYPAA <hello@necypaa.org>"
  if (!apiKey) {
    log.info({ event: "email.skipped_not_configured", correlationId: input.correlationId, subject: input.subject })
    return { ok: false, reason: "not_configured" }
  }
  try {
    const response = await withTimeout(
      fetch(RESEND_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: input.to,
          subject: input.subject,
          text: input.text,
          html: input.html ?? `<pre style="font-family:inherit">${escapeHtml(input.text)}</pre>`,
          reply_to: input.replyTo ?? "info@necypaa.org",
        }),
      }),
      RESEND_TIMEOUT_MS,
      "email.resend",
    )
    if (!response.ok) {
      const body = await response.text().catch(() => "")
      log.warn({
        event: "email.send_non_ok",
        correlationId: input.correlationId,
        status: response.status,
        body: body.slice(0, 400),
      })
      return { ok: false, reason: "send_failed", message: `Resend responded ${response.status}` }
    }
    const json = (await response.json().catch(() => ({}))) as { id?: string }
    log.info({
      event: "email.sent",
      correlationId: input.correlationId,
      subject: input.subject,
      messageId: json.id,
    })
    return { ok: true, id: json.id ?? "" }
  } catch (err) {
    log.error({ event: "email.send_failed", correlationId: input.correlationId, ...summarizeError(err) })
    return { ok: false, reason: "send_failed", message: err instanceof Error ? err.message : String(err) }
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
