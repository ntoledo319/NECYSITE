import "server-only"
import { createHash } from "node:crypto"
import type { CorrelationId } from "./correlation"

/**
 * Single JSON-line logger for the registration system. Never logs raw PII;
 * use `hashedEmail` / `maskedCode` / `partialId` helpers for anything that
 * could identify a person or a secret.
 *
 * Output goes to stdout — Vercel captures it. Sentry reporting is layered
 * on top in `lib/sentry.ts`; this file stays dependency-free so it can be
 * imported anywhere without breaking the cold-start budget.
 */

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LogFields {
  correlationId?: CorrelationId
  /** Logical event name — e.g. "registration.stripe.session.created" */
  event: string
  /** Free-form structured fields. Avoid putting PII here. */
  [key: string]: unknown
}

type EmittableFields = Omit<LogFields, "event"> & {
  ts: string
  level: LogLevel
  event: string
}

const SENSITIVE_KEYS = new Set([
  "email",
  "attendeeEmail",
  "recipientEmail",
  "scholarshipRecipientEmail",
  "name",
  "attendeeName",
  "phone",
  "accessCode",
  "password",
  "secret",
  "token",
  "authorization",
  "apiKey",
])

function scrub(value: unknown): unknown {
  if (value == null) return value
  if (typeof value !== "object") return value
  if (Array.isArray(value)) return value.map(scrub)
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(k)) {
      if (typeof v === "string" && v.length > 0) {
        out[`${k}_hashed`] = hashIdentifier(v)
      } else {
        out[`${k}_present`] = Boolean(v)
      }
      continue
    }
    out[k] = scrub(v)
  }
  return out
}

export function hashIdentifier(value: string): string {
  return createHash("sha256").update(value.toLowerCase().trim()).digest("hex").slice(0, 12)
}

export function partialId(value: string | null | undefined, keep = 6): string {
  if (!value) return "none"
  if (value.length <= keep) return "***"
  return `${value.slice(0, keep)}…`
}

function emit(level: LogLevel, fields: LogFields): void {
  const { event, correlationId, ...rest } = fields
  const payload: EmittableFields = {
    ts: new Date().toISOString(),
    level,
    event,
    ...(correlationId ? { correlationId } : {}),
    ...(scrub(rest) as Record<string, unknown>),
  }
  const line = safeStringify(payload)
  if (level === "error") {
    console.error(line)
  } else if (level === "warn") {
    console.warn(line)
  } else if (level === "debug") {
    if (process.env.NODE_ENV !== "production") console.debug(line)
  } else {
    console.log(line)
  }
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch {
    return JSON.stringify({ ts: new Date().toISOString(), level: "error", event: "logger.stringify_failed" })
  }
}

export const log = {
  debug: (fields: LogFields) => emit("debug", fields),
  info: (fields: LogFields) => emit("info", fields),
  warn: (fields: LogFields) => emit("warn", fields),
  error: (fields: LogFields) => emit("error", fields),
}

export function summarizeError(err: unknown): { name: string; message: string; stack?: string } {
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack }
  }
  return { name: "NonError", message: String(err) }
}
