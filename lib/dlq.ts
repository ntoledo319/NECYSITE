import "server-only"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import type { CorrelationId } from "./correlation"
import { log, summarizeError, hashIdentifier } from "./logger"
import { alertCritical } from "./alerts"
import { captureException } from "./sentry"
import { withTimeout } from "./resilience"

const DLQ_PAYLOAD_TIMEOUT_MS = 6_000

type RegFailureStage =
  | "stripe.session.create"
  | "stripe.session.retrieve"
  | "stripe.customer.upsert"
  | "stripe.payment_intent.update"
  | "payload.create"
  | "payload.update"
  | "payload.delete"
  | "issuer.redeem"
  | "email.scholarship_recipient"
  | "reconciliation.sweep"
  | "unknown"

export type DlqSeverity = "info" | "warn" | "error" | "critical"

export interface RegFailureInput {
  correlationId: CorrelationId
  stage: RegFailureStage
  severity?: DlqSeverity
  error: unknown
  email?: string
  stripeSessionId?: string
  stripePaymentIntentId?: string
  registrationId?: string | number | null
  requestPayload?: unknown
  /** Defaults to true. Set false for low-severity drafts you don't want to alert on. */
  alert?: boolean
}

/**
 * Persist a registration-flow failure to the dead-letter collection. Always
 * succeeds (worst case it just logs) — callers must never have to handle a
 * failure of the DLQ writer itself.
 */
export async function dlqRegistrationFailure(input: RegFailureInput): Promise<void> {
  const severity = input.severity ?? "error"
  const summary = summarizeError(input.error)
  const stripped = {
    correlationId: input.correlationId,
    stage: input.stage,
    severity,
    errorMessage: summary.message.slice(0, 500),
    errorName: summary.name,
    errorStack: summary.stack?.slice(0, 4000),
    stripeSessionId: input.stripeSessionId,
    stripePaymentIntentId: input.stripePaymentIntentId,
    registrationId: input.registrationId != null ? String(input.registrationId) : undefined,
    hashedEmail: input.email ? hashIdentifier(input.email) : undefined,
    requestPayload: sanitizePayload(input.requestPayload),
    attempts: 1,
  }

  log.error({
    event: "dlq.registration_failure",
    correlationId: input.correlationId,
    stage: input.stage,
    severity,
    ...summary,
  })

  captureException(input.error, {
    correlationId: input.correlationId,
    tags: { stage: input.stage, severity },
  })

  try {
    const payload = await withTimeout(getPayload({ config: configPromise }), DLQ_PAYLOAD_TIMEOUT_MS, "dlq.bootstrap")
    await withTimeout(
      payload.create({ collection: "registration-failures", data: stripped }),
      DLQ_PAYLOAD_TIMEOUT_MS,
      "dlq.registration_failure.create",
    )
  } catch (writeErr) {
    log.error({
      event: "dlq.registration_failure.write_failed",
      correlationId: input.correlationId,
      stage: input.stage,
      ...summarizeError(writeErr),
    })
  }

  if (severity === "critical" && (input.alert ?? true)) {
    await alertCritical({
      event: `registration.${input.stage}.failed`,
      correlationId: input.correlationId,
      summary: `${input.stage} failed: ${summary.message.slice(0, 140)}`,
      fields: {
        stripeSessionId: input.stripeSessionId ?? undefined,
        stripePaymentIntentId: input.stripePaymentIntentId ?? undefined,
        registrationId: input.registrationId != null ? String(input.registrationId) : undefined,
      },
    })
  }
}

export interface WebhookFailureInput {
  correlationId: CorrelationId
  eventId: string
  eventType: string
  severity?: DlqSeverity
  reason: string
  error?: unknown
  stripeSessionId?: string
  stripePaymentIntentId?: string
  stripeChargeId?: string
  rawEvent?: unknown
  alert?: boolean
}

export async function dlqWebhookFailure(input: WebhookFailureInput): Promise<void> {
  const severity = input.severity ?? "error"
  const summary = input.error ? summarizeError(input.error) : { name: "", message: "" }
  const stripped = {
    correlationId: input.correlationId,
    eventId: input.eventId,
    eventType: input.eventType,
    severity,
    reason: input.reason.slice(0, 280),
    errorMessage: summary.message.slice(0, 500),
    errorStack: summary.stack?.slice(0, 4000),
    stripeSessionId: input.stripeSessionId,
    stripePaymentIntentId: input.stripePaymentIntentId,
    stripeChargeId: input.stripeChargeId,
    rawEvent: sanitizePayload(input.rawEvent),
  }

  log.error({
    event: "dlq.webhook_failure",
    correlationId: input.correlationId,
    eventId: input.eventId,
    eventType: input.eventType,
    severity,
    reason: input.reason,
    ...summary,
  })

  captureException(input.error ?? new Error(input.reason), {
    correlationId: input.correlationId,
    tags: { eventType: input.eventType, severity },
  })

  try {
    const payload = await withTimeout(getPayload({ config: configPromise }), DLQ_PAYLOAD_TIMEOUT_MS, "dlq.bootstrap")
    await withTimeout(
      payload.create({ collection: "webhook-failures", data: stripped }),
      DLQ_PAYLOAD_TIMEOUT_MS,
      "dlq.webhook_failure.create",
    )
  } catch (writeErr) {
    log.error({
      event: "dlq.webhook_failure.write_failed",
      correlationId: input.correlationId,
      eventId: input.eventId,
      ...summarizeError(writeErr),
    })
  }

  if (severity === "critical" && (input.alert ?? true)) {
    await alertCritical({
      event: `webhook.${input.eventType}.failed`,
      correlationId: input.correlationId,
      summary: `Webhook ${input.eventType} failed: ${input.reason.slice(0, 140)}`,
      fields: {
        eventId: input.eventId,
        stripeSessionId: input.stripeSessionId,
        stripePaymentIntentId: input.stripePaymentIntentId,
        stripeChargeId: input.stripeChargeId,
      },
    })
  }
}

function sanitizePayload(value: unknown): unknown {
  if (value == null) return value
  try {
    const json = JSON.stringify(value, (_k, v) => {
      if (typeof v === "string" && v.length > 4_000) return `${v.slice(0, 4_000)}…`
      return v
    })
    return JSON.parse(json)
  } catch {
    return { _unserializable: true }
  }
}
