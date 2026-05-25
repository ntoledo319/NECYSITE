"use server"

import { headers, cookies } from "next/headers"
import { getPayload, type Payload } from "payload"
import configPromise from "@payload-config"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { env } from "@/lib/env"
import { calculateProcessingFee } from "@/lib/registration-products"
import { getLivePricing } from "@/lib/pricing"
import { priceDataForCatalogItem, type CatalogKey } from "@/lib/stripe-catalog"
import { rateLimitCheckout, extractClientIp, formatResetSeconds } from "@/lib/rate-limit"
import { breakfastAttendeeSchema, breakfastIdsSchema } from "@/lib/validation"
import type { BreakfastAttendee } from "@/lib/types"
import { newCorrelationId, type CorrelationId } from "@/lib/correlation"
import { log, hashIdentifier, summarizeError } from "@/lib/logger"
import { withTimeout, withRetry, safeAsync, TimeoutError } from "@/lib/resilience"
import { dlqRegistrationFailure } from "@/lib/dlq"
import { buildError, fromUnknown, type RegistrationError } from "@/lib/registration-errors"
import { isRegistrationPaused, registrationPausedReason } from "@/lib/registration-status"
import { signSuccessToken } from "@/lib/success-token"
import { safeStripeMetadata } from "@/lib/stripe-metadata"

const SUPPORTED_LOCALES = new Set(["en", "es"])
const DEFAULT_LOCALE = "en"
const SUCCESS_COOKIE = "necypaa_checkout_token"
const PAYLOAD_TIMEOUT_MS = 5_000
const STRIPE_TIMEOUT_MS = 10_000

function normalizeLocale(input: unknown): string {
  if (typeof input !== "string") return DEFAULT_LOCALE
  const trimmed = input.trim().toLowerCase()
  return SUPPORTED_LOCALES.has(trimmed) ? trimmed : DEFAULT_LOCALE
}

function isRetryableStripeError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false
  if (err instanceof TimeoutError) return true
  const e = err as { type?: string; statusCode?: number }
  if (e.type === "StripeConnectionError" || e.type === "StripeAPIError") return true
  if (typeof e.statusCode === "number" && e.statusCode >= 500) return true
  return false
}

export type StartBreakfastResult =
  | { ok: true; clientSecret: string; correlationId: CorrelationId }
  | { ok: false; error: RegistrationError }

export async function startBreakfastCheckout(
  attendee: BreakfastAttendee,
  breakfastIds: string[],
  locale?: string,
): Promise<StartBreakfastResult> {
  const correlationId = newCorrelationId("brk")

  if (isRegistrationPaused()) {
    log.warn({ event: "breakfast.paused", correlationId, reason: registrationPausedReason() ?? "no_reason" })
    return { ok: false, error: buildError("REGISTRATION_PAUSED", { correlationId }) }
  }

  const resolvedLocale = normalizeLocale(locale)

  let validatedAttendee: import("@/lib/validation").ValidatedBreakfastAttendee
  let validatedIds: string[]
  try {
    validatedAttendee = breakfastAttendeeSchema.parse(attendee)
    validatedIds = breakfastIdsSchema.parse(breakfastIds)
  } catch (err) {
    const zodErr = err as { issues?: Array<{ path: (string | number)[]; message: string }> }
    const first = zodErr.issues?.[0]
    const fieldPath = first?.path?.join(".")
    log.warn({ event: "breakfast.validation_failed", correlationId, fieldPath, message: first?.message })
    return {
      ok: false,
      error: buildError("VALIDATION", {
        correlationId,
        fieldPath,
        userMessage: first
          ? `We couldn't accept that input — ${fieldPath ? fieldPath + ": " : ""}${first.message}`
          : "Invalid attendee data. Please check your information and try again.",
      }),
    }
  }

  let ip = "unknown"
  try {
    ip = extractClientIp(await headers())
  } catch (err) {
    log.warn({ event: "breakfast.ip_extract_failed", correlationId, ...summarizeError(err) })
  }

  let rl: Awaited<ReturnType<typeof rateLimitCheckout>>
  try {
    rl = await withTimeout(
      rateLimitCheckout({ ip, email: validatedAttendee.email }),
      2_000,
      "ratelimit.breakfast",
    )
  } catch (err) {
    log.error({ event: "breakfast.rate_limit_failed", correlationId, ...summarizeError(err) })
    return { ok: false, error: buildError("REDIS_DOWN", { correlationId }) }
  }
  if (!rl.success) {
    const seconds = formatResetSeconds(rl.resetMs)
    return {
      ok: false,
      error: buildError("RATE_LIMITED", {
        correlationId,
        retryAfterSeconds: seconds,
        userMessage: `Too many checkout attempts. Please wait about ${seconds}s and try again.`,
      }),
    }
  }

  const pricing = await getLivePricing()
  const uniqueBreakfastIds = [...new Set(validatedIds)]
  const selectedBreakfasts = uniqueBreakfastIds
    .map((id) => pricing.breakfasts.find((bp) => bp.id === id))
    .filter((bp): bp is (typeof pricing.breakfasts)[number] => Boolean(bp))

  if (selectedBreakfasts.length === 0) {
    return {
      ok: false,
      error: buildError("VALIDATION", {
        correlationId,
        userMessage: "Please select at least one breakfast ticket.",
        fieldPath: "breakfastIds",
      }),
    }
  }

  const subtotalCents = selectedBreakfasts.reduce((sum, bp) => sum + bp.priceInCents, 0)
  const processingFee = calculateProcessingFee(subtotalCents)

  const rawMetadata: Record<string, unknown> = {
    correlation_id: correlationId,
    purchase_type: "breakfast_only",
    intent: "breakfast_only",
    attendee_first_name: validatedAttendee.firstName,
    attendee_last_name: validatedAttendee.lastName,
    attendee_email: validatedAttendee.email,
    breakfast_tickets: selectedBreakfasts.map((bp) => bp.name).join(", "),
    breakfast_count: selectedBreakfasts.length.toString(),
    breakfast_pricing_source: pricing.source,
  }
  const payloadMetadata = rawMetadata
  const stripeMetadata = safeStripeMetadata(rawMetadata, { correlationId, label: "checkout.breakfast" })

  let payload: Payload
  try {
    payload = await withTimeout(getPayload({ config: configPromise }), PAYLOAD_TIMEOUT_MS, "payload.bootstrap")
  } catch (err) {
    log.error({ event: "breakfast.payload_bootstrap_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "critical",
      error: err,
      email: validatedAttendee.email,
    })
    return { ok: false, error: buildError("DB_DOWN", { correlationId }) }
  }

  let record: { id: string | number }
  try {
    record = await withTimeout(
      payload.create({
        collection: "registrations",
        data: {
          email: validatedAttendee.email,
          name: `${validatedAttendee.firstName} ${validatedAttendee.lastName}`.trim(),
          state: "",
          status: "pending",
          type: "breakfast_only",
          stripeSessionId: "",
          amountTotalCents: subtotalCents + processingFee,
          metadata: payloadMetadata,
          accommodations: "",
          interpretationNeeded: false,
          mobilityAccessibility: false,
          willingToServe: false,
          homegroup: "",
        },
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.create:breakfast_pending",
    )
  } catch (err) {
    log.error({ event: "breakfast.payload_create_failed", correlationId, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.create",
      severity: "error",
      error: err,
      email: validatedAttendee.email,
    })
    return {
      ok: false,
      error: buildError(err instanceof TimeoutError ? "DB_TIMEOUT" : "DB_DOWN", { correlationId }),
    }
  }

  log.info({
    event: "breakfast.pending_created",
    correlationId,
    registrationId: record.id,
    hashedEmail: hashIdentifier(validatedAttendee.email),
    subtotalCents,
    breakfastCount: selectedBreakfasts.length,
    pricingSource: pricing.source,
  })

  const successUrlBase = `${env.NEXT_PUBLIC_BASE_URL}/${resolvedLocale}/breakfast/success`
  const idempotencyKey = `breakfast-${record.id}`

  const breakfastLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = await Promise.all(
    selectedBreakfasts.map(async (bp) => {
      const breakfastKey: CatalogKey =
        bp.id === "breakfast-friday"
          ? "necypaa-xxxvi-breakfast-friday"
          : bp.id === "breakfast-saturday"
            ? "necypaa-xxxvi-breakfast-saturday"
            : "necypaa-xxxvi-breakfast-sunday"
      return {
        ...(await priceDataForCatalogItem({
          key: breakfastKey,
          unitAmountCents: bp.priceInCents,
          fallbackName: bp.name,
          fallbackDescription: bp.description,
        })),
        quantity: 1,
      }
    }),
  )
  breakfastLineItems.push({
    ...(await priceDataForCatalogItem({
      key: "necypaa-xxxvi-processing-fee",
      unitAmountCents: processingFee,
      fallbackName: "Processing Fee",
      fallbackDescription: "Credit card processing fee (2.9% + $0.30)",
    })),
    quantity: 1,
  })

  let session: Stripe.Checkout.Session
  try {
    session = await withRetry(
      () =>
        withTimeout(
          stripe.checkout.sessions.create(
            {
              ui_mode: "embedded",
              return_url: `${successUrlBase}?session_id={CHECKOUT_SESSION_ID}`,
              customer_email: validatedAttendee.email,
              customer_creation: "always",
              line_items: breakfastLineItems,
              mode: "payment",
              metadata: safeStripeMetadata(
                { ...stripeMetadata, registration_id: String(record.id) },
                { correlationId, label: "breakfast.session.metadata" },
              ),
              payment_intent_data: {
                metadata: safeStripeMetadata(
                  { ...stripeMetadata, registration_id: String(record.id), stripeSessionId: "" },
                  { correlationId, label: "breakfast.pi.metadata" },
                ),
                description: `NECYPAA XXXVI · ${selectedBreakfasts.length} breakfast${selectedBreakfasts.length === 1 ? "" : "s"} · ${validatedAttendee.email}`,
                statement_descriptor_suffix: "NECYPAA BFAST",
                receipt_email: validatedAttendee.email,
              },
            },
            { idempotencyKey },
          ),
          STRIPE_TIMEOUT_MS,
          "stripe.sessions.create:breakfast",
        ),
      {
        maxAttempts: 2,
        baseDelayMs: 500,
        label: "stripe.sessions.create:breakfast",
        correlationId,
        retryableErrors: isRetryableStripeError,
      },
    )
  } catch (err) {
    log.error({ event: "breakfast.stripe_session_failed", correlationId, registrationId: record.id, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "stripe.session.create",
      severity: "error",
      error: err,
      email: validatedAttendee.email,
      registrationId: record.id,
    })
    await safeAsync(
      () =>
        withTimeout(
          payload.delete({ collection: "registrations", id: record.id }),
          PAYLOAD_TIMEOUT_MS,
          "payload.delete:breakfast_orphan",
        ),
      undefined,
      { correlationId, label: "payload.delete:breakfast_orphan", severity: "warn" },
    )
    return { ok: false, error: fromUnknown(err, correlationId) }
  }

  if (!session.client_secret) {
    log.error({ event: "breakfast.stripe_no_client_secret", correlationId })
    await dlqRegistrationFailure({
      correlationId,
      stage: "stripe.session.create",
      severity: "error",
      error: new Error("Stripe breakfast session created without client_secret"),
      registrationId: record.id,
      stripeSessionId: session.id,
    })
    return { ok: false, error: buildError("STRIPE_DOWN", { correlationId }) }
  }

  // Same cookie-based HMAC ownership scheme as the main registration flow,
  // so /breakfast/success can verify the request came from this purchase.
  const token = signSuccessToken(session.id)
  if (token) {
    await safeAsync(
      async () => {
        const jar = await cookies()
        jar.set({
          name: SUCCESS_COOKIE,
          value: `${session.id}.${token}`,
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60,
        })
      },
      undefined,
      { correlationId, label: "breakfast.cookie_set", severity: "info" },
    )
  }

  try {
    await withRetry(
      () =>
        withTimeout(
          payload.update({
            collection: "registrations",
            id: record.id,
            data: { stripeSessionId: session.id },
          }),
          PAYLOAD_TIMEOUT_MS,
          "payload.update:breakfast_session_id",
        ),
      { maxAttempts: 3, baseDelayMs: 250, label: "payload.update:breakfast_session_id", correlationId },
    )
  } catch (err) {
    log.error({ event: "breakfast.link_session_failed", correlationId, registrationId: record.id, ...summarizeError(err) })
    await dlqRegistrationFailure({
      correlationId,
      stage: "payload.update",
      severity: "critical",
      error: err,
      registrationId: record.id,
      stripeSessionId: session.id,
    })
    return { ok: false, error: buildError("DB_DOWN", { correlationId }) }
  }

  log.info({
    event: "breakfast.session_created",
    correlationId,
    registrationId: record.id,
    sessionId: session.id,
  })

  return { ok: true, clientSecret: session.client_secret, correlationId }
}
