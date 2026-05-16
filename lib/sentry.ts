import "server-only"

/**
 * No-op Sentry shim. The project does not have `@sentry/nextjs` installed yet;
 * this file is the contract every error path uses today so that wiring real
 * Sentry later is a single-file change.
 *
 * If/when Sentry is added:
 *   1. pnpm add @sentry/nextjs
 *   2. set SENTRY_DSN
 *   3. replace the bodies below with calls into `@sentry/nextjs`
 *   4. nothing else has to change
 */

import type { CorrelationId } from "./correlation"

export interface CaptureContext {
  correlationId?: CorrelationId
  tags?: Record<string, string>
  extra?: Record<string, unknown>
  /** PII-safe. The logger already scrubs but be careful what you pass. */
}

let warned = false
function dsnPresent(): boolean {
  return Boolean(process.env.SENTRY_DSN)
}

function maybeWarnOnce(): void {
  if (warned) return
  warned = true
  if (process.env.NODE_ENV === "production" && !dsnPresent()) {
    console.warn(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "warn",
        event: "sentry.disabled",
        message: "SENTRY_DSN is not set; errors will only appear in stdout logs.",
      }),
    )
  }
}

export function captureException(err: unknown, ctx: CaptureContext = {}): void {
  maybeWarnOnce()
  if (!dsnPresent()) return
  // Intentionally not implemented — installing @sentry/nextjs is the trigger.
  // Re-export point for when it's added; until then this stays a stub so the
  // call sites are correct in advance.
  void err
  void ctx
}

export function captureMessage(message: string, ctx: CaptureContext = {}): void {
  maybeWarnOnce()
  if (!dsnPresent()) return
  void message
  void ctx
}
