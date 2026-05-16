import "server-only"
import type { CorrelationId } from "./correlation"
import { log, summarizeError } from "./logger"

/**
 * Resilience primitives. Every external call in the registration flow goes
 * through one or more of these. The goal is that a single transient failure
 * never blocks a user, and a permanent failure leaves a paper trail.
 */

export class TimeoutError extends Error {
  constructor(public readonly label: string, public readonly ms: number) {
    super(`Operation '${label}' timed out after ${ms}ms`)
    this.name = "TimeoutError"
  }
}

export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
  options: { onTimeout?: () => void } = {},
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await new Promise<T>((resolve, reject) => {
      timer = setTimeout(() => {
        options.onTimeout?.()
        reject(new TimeoutError(label, ms))
      }, ms)
      promise.then(
        (value) => {
          if (timer) clearTimeout(timer)
          resolve(value)
        },
        (err) => {
          if (timer) clearTimeout(timer)
          reject(err)
        },
      )
    })
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export interface RetryOptions {
  maxAttempts: number
  baseDelayMs: number
  /** Multiplier for exponential backoff. Default 2. */
  backoffFactor?: number
  /** Cap on individual delay between attempts. Default 8000ms. */
  maxDelayMs?: number
  /** Decide whether a given error is worth retrying. Default: always. */
  retryableErrors?: (err: unknown, attempt: number) => boolean
  correlationId?: CorrelationId
  label: string
}

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions): Promise<T> {
  const { maxAttempts, baseDelayMs, backoffFactor = 2, maxDelayMs = 8000, retryableErrors, correlationId, label } = opts

  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn()
      if (attempt > 1) {
        log.info({
          event: "resilience.retry.succeeded",
          correlationId,
          label,
          attempt,
          maxAttempts,
        })
      }
      return result
    } catch (err) {
      lastError = err
      const isLast = attempt === maxAttempts
      const retryable = retryableErrors ? retryableErrors(err, attempt) : true
      log.warn({
        event: "resilience.retry.attempt_failed",
        correlationId,
        label,
        attempt,
        maxAttempts,
        retryable,
        isLast,
        ...summarizeError(err),
      })
      if (isLast || !retryable) break
      const delay = Math.min(maxDelayMs, baseDelayMs * Math.pow(backoffFactor, attempt - 1))
      await sleep(delay)
    }
  }
  throw lastError
}

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms))
}

export interface SafeAsyncOptions {
  correlationId?: CorrelationId
  label: string
  /** What to log/alert on. `info` does not write a DLQ entry. */
  severity?: "info" | "warn" | "error" | "critical"
  /** Optional hook to record the failure (DLQ writer, alert, etc). */
  onError?: (err: unknown) => Promise<void> | void
}

/**
 * Run an async function, log + report any throw, and return a fallback.
 * Use anywhere a failure must not propagate (best-effort side effects,
 * non-critical reconciliation, telemetry writes, etc).
 */
export async function safeAsync<T>(fn: () => Promise<T>, fallback: T, opts: SafeAsyncOptions): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    log.error({
      event: "resilience.safe_async.failed",
      correlationId: opts.correlationId,
      label: opts.label,
      severity: opts.severity ?? "error",
      ...summarizeError(err),
    })
    if (opts.onError) {
      try {
        await opts.onError(err)
      } catch (hookErr) {
        log.error({
          event: "resilience.safe_async.on_error_hook_failed",
          correlationId: opts.correlationId,
          label: opts.label,
          ...summarizeError(hookErr),
        })
      }
    }
    return fallback
  }
}

/** Convenience: retry an external call with a timeout per attempt. */
export async function withTimeoutAndRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions & { perAttemptTimeoutMs: number },
): Promise<T> {
  return withRetry(() => withTimeout(fn(), opts.perAttemptTimeoutMs, opts.label), opts)
}
