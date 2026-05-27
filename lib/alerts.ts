import "server-only"
import type { CorrelationId } from "./correlation"
import { log, hashIdentifier } from "./logger"

/**
 * Critical-failure alert channel. Posts a single Slack message per call to
 * `ALERT_SLACK_WEBHOOK_URL` if configured; otherwise no-ops. Email fallback
 * via `ALERT_EMAIL_TO` is left as a future hookup (Resend will be added in
 * PR 6 — when that lands, wire it in here).
 *
 * KEEP THE NOISE LOW. Anything that pages this channel should require human
 * action. Wire only to: webhook DLQ writes with severity=critical, registration
 * DLQ writes with severity=critical, reconciliation discrepancies, kill-switch
 * activations, and repeated health-check failures.
 */

const WEBHOOK_URL = process.env.ALERT_SLACK_WEBHOOK_URL
const ENVIRONMENT_LABEL = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown"

export interface AlertPayload {
  event: string
  correlationId?: CorrelationId
  /** One-sentence summary that goes in the message header. */
  summary: string
  /** Bullet-style fields displayed below. PII-safe only — pre-hash emails. */
  fields?: Record<string, string | number | boolean | null | undefined>
}

export async function alertCritical(payload: AlertPayload): Promise<void> {
  log.error({
    event: "alert.critical",
    correlationId: payload.correlationId,
    summary: payload.summary,
    alertEvent: payload.event,
  })

  if (!WEBHOOK_URL) {
    return
  }

  const blocks = buildSlackBlocks(payload)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5_000)
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: payload.summary, blocks }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!response.ok) {
      log.warn({
        event: "alert.slack.non_ok",
        correlationId: payload.correlationId,
        status: response.status,
      })
    }
  } catch (err) {
    log.error({
      event: "alert.slack.failed",
      correlationId: payload.correlationId,
      errorMessage: err instanceof Error ? err.message : String(err),
    })
  }
}

function buildSlackBlocks(payload: AlertPayload): unknown[] {
  const fields = Object.entries(payload.fields ?? {}).map(([k, v]) => ({
    type: "mrkdwn",
    text: `*${k}:* ${formatValue(v)}`,
  }))
  fields.push({ type: "mrkdwn", text: `*env:* ${ENVIRONMENT_LABEL}` })
  if (payload.correlationId) {
    fields.push({ type: "mrkdwn", text: `*correlationId:* \`${payload.correlationId}\`` })
  }

  return [
    {
      type: "header",
      text: { type: "plain_text", text: `🚨 NECYPAA registration: ${payload.event}` },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: payload.summary },
    },
    fields.length > 0 ? { type: "section", fields: fields.slice(0, 10) } : null,
  ].filter(Boolean) as unknown[]
}

function formatValue(v: unknown): string {
  if (v == null) return "_none_"
  if (typeof v === "string") return v.length > 200 ? `${v.slice(0, 200)}…` : v
  return String(v)
}

/** Convenience: pre-hash an email for inclusion in alert fields. */
export function alertHashEmail(email: string): string {
  return hashIdentifier(email)
}
