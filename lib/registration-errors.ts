import type { CorrelationId } from "./correlation"

/**
 * Single shape for every failure mode the registration UI cares about.
 * Server actions return `{ success: false, error: RegistrationError }`; the
 * UI maps `error.code` to a specific recovery path (retry, contact, switch
 * to access code, etc) rather than guessing from message strings.
 */
export type RegistrationErrorCode =
  | "STRIPE_DOWN"
  | "STRIPE_TIMEOUT"
  | "STRIPE_INVALID_REQUEST"
  | "DB_DOWN"
  | "DB_TIMEOUT"
  | "ISSUER_DOWN"
  | "ISSUER_TIMEOUT"
  | "ISSUER_INVALID_CODE"
  | "ISSUER_EXPIRED"
  | "ISSUER_ALREADY_USED"
  | "REDIS_DOWN"
  | "RATE_LIMITED"
  | "VALIDATION"
  | "CONFIG_MISSING"
  | "REGISTRATION_PAUSED"
  | "UNKNOWN"

export interface RegistrationError {
  code: RegistrationErrorCode
  /** Message shown to the user. Always present, always recovery-oriented. */
  userMessage: string
  /** Whether the UI should expose a retry button. */
  retryable: boolean
  /** Whether the UI should prompt the user to email support. */
  contactSupport: boolean
  /** Correlation ID for tracing. Echo into UI so support emails are useful. */
  correlationId: CorrelationId
  /** Seconds until the user can retry, when known (rate limits). */
  retryAfterSeconds?: number
  /** Field path for validation errors. */
  fieldPath?: string
}

const CONTACT_LINE = "If this keeps happening, email info@necypaa.org and we'll register you manually."

const MESSAGES: Record<RegistrationErrorCode, { message: string; retryable: boolean; contactSupport: boolean }> = {
  STRIPE_DOWN: {
    message: `Our payment processor isn't responding right now. Wait a minute and try again. ${CONTACT_LINE}`,
    retryable: true,
    contactSupport: true,
  },
  STRIPE_TIMEOUT: {
    message: `The payment system took too long to respond. Try again in a moment. ${CONTACT_LINE}`,
    retryable: true,
    contactSupport: true,
  },
  STRIPE_INVALID_REQUEST: {
    message: `We sent something the payment processor didn't accept. ${CONTACT_LINE}`,
    retryable: false,
    contactSupport: true,
  },
  DB_DOWN: {
    message: `We can't reach our database right now. Try again in a minute. ${CONTACT_LINE}`,
    retryable: true,
    contactSupport: true,
  },
  DB_TIMEOUT: {
    message: `Our database is slow to respond. Try again. ${CONTACT_LINE}`,
    retryable: true,
    contactSupport: true,
  },
  ISSUER_DOWN: {
    message: `The access-code service is unreachable. Try again, or pay with a card to register now. ${CONTACT_LINE}`,
    retryable: true,
    contactSupport: true,
  },
  ISSUER_TIMEOUT: {
    message: `The access-code service is slow to respond. Try again.`,
    retryable: true,
    contactSupport: true,
  },
  ISSUER_INVALID_CODE: {
    message: `That code isn't recognized. Double-check the letters and try again.`,
    retryable: true,
    contactSupport: true,
  },
  ISSUER_EXPIRED: {
    message: `That code has expired. ${CONTACT_LINE}`,
    retryable: false,
    contactSupport: true,
  },
  ISSUER_ALREADY_USED: {
    message: `That code has already been redeemed. ${CONTACT_LINE}`,
    retryable: false,
    contactSupport: true,
  },
  REDIS_DOWN: {
    message: `A safety system is offline. Try again in a moment. ${CONTACT_LINE}`,
    retryable: true,
    contactSupport: true,
  },
  RATE_LIMITED: {
    message: `You've tried this too many times in a short window. Wait a minute and try again.`,
    retryable: true,
    contactSupport: false,
  },
  VALIDATION: {
    message: `Something in the form wasn't accepted. Review the highlighted field and try again.`,
    retryable: true,
    contactSupport: false,
  },
  CONFIG_MISSING: {
    message: `Registration is temporarily misconfigured on our end. ${CONTACT_LINE}`,
    retryable: false,
    contactSupport: true,
  },
  REGISTRATION_PAUSED: {
    message: `Registration is paused while we fix a problem. Email info@necypaa.org and we'll register you manually as soon as we can.`,
    retryable: false,
    contactSupport: true,
  },
  UNKNOWN: {
    message: `Something went wrong on our side. Try again, and if it keeps happening, email info@necypaa.org.`,
    retryable: true,
    contactSupport: true,
  },
}

interface BuildOptions {
  correlationId: CorrelationId
  userMessage?: string
  retryAfterSeconds?: number
  fieldPath?: string
}

export function buildError(code: RegistrationErrorCode, opts: BuildOptions): RegistrationError {
  const defaults = MESSAGES[code]
  return {
    code,
    userMessage: opts.userMessage ?? defaults.message,
    retryable: defaults.retryable,
    contactSupport: defaults.contactSupport,
    correlationId: opts.correlationId,
    retryAfterSeconds: opts.retryAfterSeconds,
    fieldPath: opts.fieldPath,
  }
}

/**
 * Map an unknown thrown value to a RegistrationError. Use as the catch-all
 * in server actions so the UI never sees a bare Error.
 *
 * Where a Stripe-side message is available, we surface it in `userMessage`
 * appended to the friendly template. This gives the user (and especially
 * the support inbox) the actual diagnostic instead of a generic "something
 * went wrong" — far easier to triage.
 */
export function fromUnknown(err: unknown, correlationId: CorrelationId): RegistrationError {
  if (typeof err === "object" && err !== null && "code" in err && typeof (err as { code: unknown }).code === "string") {
    const maybe = err as { code: string }
    if (maybe.code in MESSAGES) {
      return buildError(maybe.code as RegistrationErrorCode, { correlationId })
    }
  }
  // Stripe errors carry `type` like 'StripeConnectionError' / 'StripeAPIError' / 'StripeInvalidRequestError'
  if (typeof err === "object" && err !== null && "type" in err) {
    const e = err as { type?: unknown; message?: unknown; code?: unknown; param?: unknown; decline_code?: unknown }
    const stripeMessage = typeof e.message === "string" ? e.message : ""
    const stripeCode = typeof e.code === "string" ? e.code : ""
    const stripeParam = typeof e.param === "string" ? e.param : ""
    const detail = [stripeCode, stripeParam, stripeMessage].filter(Boolean).join(" — ").slice(0, 280)
    const ref = ` [ref ${correlationId}${detail ? ` / ${detail}` : ""}]`

    if (e.type === "StripeConnectionError" || e.type === "StripeAPIError") {
      return buildError("STRIPE_DOWN", {
        correlationId,
        userMessage: `${MESSAGES.STRIPE_DOWN.message}${ref}`,
      })
    }
    if (e.type === "StripeInvalidRequestError") {
      return buildError("STRIPE_INVALID_REQUEST", {
        correlationId,
        userMessage: `${MESSAGES.STRIPE_INVALID_REQUEST.message}${ref}`,
      })
    }
    if (e.type === "StripeAuthenticationError") {
      return buildError("CONFIG_MISSING", {
        correlationId,
        userMessage: `${MESSAGES.CONFIG_MISSING.message}${ref}`,
      })
    }
    if (e.type === "StripeRateLimitError") {
      return buildError("RATE_LIMITED", {
        correlationId,
        userMessage: `Stripe rate-limited the request. Wait a moment and try again.${ref}`,
      })
    }
  }
  if (err instanceof Error && err.name === "TimeoutError") {
    return buildError("STRIPE_TIMEOUT", { correlationId, userMessage: err.message })
  }
  return buildError("UNKNOWN", {
    correlationId,
    userMessage: err instanceof Error && err.message
      ? `${MESSAGES.UNKNOWN.message} [ref ${correlationId} / ${err.message.slice(0, 200)}]`
      : undefined,
  })
}
