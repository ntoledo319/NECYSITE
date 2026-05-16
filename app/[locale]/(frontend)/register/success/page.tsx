import type { Metadata } from "next"
import { headers, cookies } from "next/headers"
import { stripe } from "@/lib/stripe"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import RegistrationConfirmed, { type VerifiedRegistration } from "./registration-confirmed"
import { Link } from "@/i18n/navigation"
import { AlertCircle, Clock, Mail } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"
import { withTimeout } from "@/lib/resilience"
import { newCorrelationId } from "@/lib/correlation"
import { log, summarizeError, hashIdentifier } from "@/lib/logger"
import { rateLimitReadOnly, hashIdentifier as ipHash, extractClientIp, formatResetSeconds } from "@/lib/rate-limit"
import { verifySuccessToken, verifyAccessCodePayload, isSuccessTokenConfigured } from "@/lib/success-token"

const SUCCESS_COOKIE = "necypaa_checkout_token"

async function readSuccessCookieToken(sessionId: string): Promise<string | null> {
  try {
    const jar = await cookies()
    const value = jar.get(SUCCESS_COOKIE)?.value
    if (!value) return null
    const [cookieSessionId, token] = value.split(".")
    if (cookieSessionId !== sessionId || !token) return null
    return token
  } catch {
    return null
  }
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Registration Confirmation — NECYPAA XXXVI",
  description: "Your NECYPAA XXXVI registration confirmation.",
}

type VerifyResult =
  | { status: "verified"; data: VerifiedRegistration }
  | { status: "unpaid" }
  | { status: "error"; correlationId: string }
  | { status: "missing" }
  | { status: "forbidden" }
  | { status: "rate_limited"; retryAfter: number }

const STRIPE_TIMEOUT_MS = 6_000
const PAYLOAD_TIMEOUT_MS = 4_000

async function rateLimitSuccessView(req: { ip: string }) {
  return rateLimitReadOnly(`success:${ipHash(req.ip)}`, { limit: 30, windowMs: 60_000 })
}

async function fetchFromStripe(sessionId: string, correlationId: string): Promise<VerifyResult> {
  try {
    const session = await withTimeout(
      stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] }),
      STRIPE_TIMEOUT_MS,
      "stripe.sessions.retrieve",
    )
    if (session.payment_status === "paid" && session.status === "complete") {
      return {
        status: "verified",
        data: {
          customerName: session.metadata?.attendee_name ?? null,
          customerEmail: session.customer_email ?? session.customer_details?.email ?? null,
          amountTotal: session.amount_total,
          currency: session.currency,
          purchaseType: session.metadata?.purchase_type ?? null,
          lineItems:
            session.line_items?.data.map((item) => ({
              description: item.description ?? "",
              quantity: item.quantity,
              amountTotal: item.amount_total,
            })) ?? [],
        },
      }
    }
    return { status: "unpaid" }
  } catch (err) {
    log.error({
      event: "success.stripe_lookup_failed",
      correlationId,
      sessionId,
      ...summarizeError(err),
    })
    return { status: "error", correlationId }
  }
}

interface PayloadRegistrationRow {
  id: string | number
  status?: string | null
  email?: string | null
  name?: string | null
  amountTotalCents?: number | null
  metadata?: Record<string, unknown> | null
}

async function fetchFromPayload(sessionId: string, correlationId: string): Promise<VerifyResult> {
  try {
    const payload = await withTimeout(getPayload({ config: configPromise }), PAYLOAD_TIMEOUT_MS, "payload.bootstrap")
    const found = await withTimeout(
      payload.find({
        collection: "registrations",
        where: { stripeSessionId: { equals: sessionId } },
        limit: 1,
      }),
      PAYLOAD_TIMEOUT_MS,
      "payload.find:success_fallback",
    )
    if (found.docs.length === 0) {
      return { status: "missing" }
    }
    const doc = found.docs[0] as PayloadRegistrationRow
    if (doc.status !== "paid") {
      return { status: "unpaid" }
    }
    return {
      status: "verified",
      data: {
        customerName: typeof doc.name === "string" ? doc.name : null,
        customerEmail: typeof doc.email === "string" ? doc.email : null,
        amountTotal: typeof doc.amountTotalCents === "number" ? doc.amountTotalCents : null,
        currency: "usd",
        purchaseType:
          typeof doc.metadata?.purchase_type === "string" ? (doc.metadata.purchase_type as string) : null,
        lineItems: [],
      },
    }
  } catch (err) {
    log.error({ event: "success.payload_lookup_failed", correlationId, sessionId, ...summarizeError(err) })
    return { status: "error", correlationId }
  }
}

export default async function RegistrationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; flow?: string; t?: string }>
}) {
  const params = await searchParams
  const correlationId = newCorrelationId("success")

  // ── Rate limit ───────────────────────────────────────────────────
  try {
    const ip = extractClientIp(await headers())
    const rl = await rateLimitSuccessView({ ip })
    if (!rl.success) {
      log.warn({ event: "success.rate_limited", correlationId })
      return <UnverifiedPage status="rate_limited" retryAfter={formatResetSeconds(rl.resetMs)} />
    }
  } catch (err) {
    // Rate limit failure is non-fatal here — we don't want a Redis outage to
    // break the confirmation page. Log and continue.
    log.warn({ event: "success.rate_limit_check_failed", correlationId, ...summarizeError(err) })
  }

  // ── Access-code branch ──────────────────────────────────────────
  if (params.flow === "access-code") {
    const payload = verifyAccessCodePayload(params.t ?? null)
    if (payload) {
      log.info({
        event: "success.access_code_rendered",
        correlationId,
        hashedEmail: hashIdentifier(payload.email),
      })
      return (
        <RegistrationConfirmed
          registration={{
            customerName: payload.name,
            customerEmail: payload.email,
            amountTotal: 0,
            currency: "usd",
            purchaseType: "comp",
            lineItems: [],
          }}
        />
      )
    }
    // Token mismatch or missing — still render the generic access-code success
    // page if the secret isn't configured (back-compat with older redirects);
    // otherwise show the missing state.
    if (!isSuccessTokenConfigured() && !params.t) {
      return <RegistrationConfirmed />
    }
    log.warn({ event: "success.access_code_token_invalid", correlationId })
    return <UnverifiedPage status="missing" />
  }

  // ── Stripe-verified paid registration ──────────────────────────
  if (params.session_id) {
    const sessionId = params.session_id
    if (typeof sessionId !== "string" || sessionId.length < 8 || sessionId.length > 200) {
      log.warn({ event: "success.invalid_session_id", correlationId })
      return <UnverifiedPage status="missing" />
    }

    // Verify ownership of the session. We accept either a URL token (older
    // links / shared receipts) or a same-site cookie set at checkout time
    // (the primary path; Stripe doesn't let us compute the URL token).
    const cookieToken = await readSuccessCookieToken(sessionId)
    const tokenOk =
      verifySuccessToken(sessionId, params.t ?? null) || verifySuccessToken(sessionId, cookieToken)

    if (!tokenOk && (params.t || cookieToken)) {
      log.warn({ event: "success.token_invalid", correlationId, sessionId })
      return <UnverifiedPage status="forbidden" />
    }

    // Try Stripe first, fall back to Payload when Stripe is unreachable
    // or when there's no token (so we trust Payload over Stripe metadata).
    const stripeResult = tokenOk
      ? await fetchFromStripe(sessionId, correlationId)
      : ({ status: "error" as const, correlationId } as VerifyResult)
    if (stripeResult.status === "verified") {
      return <RegistrationConfirmed registration={stripeResult.data} />
    }
    if (stripeResult.status === "unpaid") {
      return <UnverifiedPage status="unpaid" />
    }

    // No token, or Stripe errored — try Payload as the authoritative store.
    const payloadResult = await fetchFromPayload(sessionId, correlationId)
    if (payloadResult.status === "verified") {
      log.info({ event: "success.served_from_payload_fallback", correlationId, sessionId, tokenOk })
      return <RegistrationConfirmed registration={payloadResult.data} />
    }
    if (payloadResult.status === "unpaid") {
      return <UnverifiedPage status="unpaid" />
    }

    return <UnverifiedPage status="error" correlationId={correlationId} />
  }

  return <UnverifiedPage status="missing" />
}

// ── Unverified states ────────────────────────────────────────────

function UnverifiedPage({
  status,
  correlationId,
  retryAfter,
}: {
  status: "unpaid" | "error" | "missing" | "forbidden" | "rate_limited"
  correlationId?: string
  retryAfter?: number
}) {
  return (
    <div className="min-h-screen-safe relative flex min-h-screen flex-col overflow-hidden bg-[var(--nec-navy)]">
      <PageArtAccents character="mad-hatter" accentColor="var(--nec-purple)" variant="subtle" dividerVariant="gear" />

      <div className="container relative z-10 mx-auto px-4 py-16 pt-24">
        <div className="mx-auto max-w-2xl">
          <div className="nec-reg-card space-y-5 p-8 text-center md:p-10">
            {status === "unpaid" ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(var(--nec-gold-rgb),0.24)] bg-[rgba(var(--nec-gold-rgb),0.12)]">
                  <Clock className="h-8 w-8 text-[var(--nec-gold)]" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-black text-[var(--nec-text)] md:text-3xl">Payment not yet confirmed</h1>
                <p className="leading-7 text-[var(--nec-muted)]">
                  Your payment is still being processed. This usually resolves within a few moments &mdash; try
                  refreshing this page.
                </p>
                <p className="text-sm text-[var(--nec-muted)]">
                  If it still shows as pending after a minute or two, your payment may not have completed. Check your
                  bank or card statement to confirm.
                </p>
              </>
            ) : status === "error" ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(var(--nec-pink-rgb),0.24)] bg-[rgba(var(--nec-pink-rgb),0.12)]">
                  <AlertCircle className="h-8 w-8 text-[var(--nec-pink)]" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-black text-[var(--nec-text)] md:text-3xl">
                  Verification temporarily unavailable
                </h1>
                <p className="leading-7 text-[var(--nec-muted)]">
                  We couldn&apos;t reach our payment system to confirm your registration right now. If you completed
                  payment, you should have received a receipt by email from Stripe.
                </p>
                <p className="text-sm text-[var(--nec-muted)]">
                  Try refreshing this page, or check your email for a Stripe receipt as confirmation.
                </p>
                {correlationId && (
                  <p className="text-xs text-[var(--nec-muted)]">
                    Reference: <code>{correlationId}</code>
                  </p>
                )}
              </>
            ) : status === "forbidden" ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(var(--nec-pink-rgb),0.24)] bg-[rgba(var(--nec-pink-rgb),0.12)]">
                  <AlertCircle className="h-8 w-8 text-[var(--nec-pink)]" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-black text-[var(--nec-text)] md:text-3xl">
                  This confirmation link is no longer valid
                </h1>
                <p className="leading-7 text-[var(--nec-muted)]">
                  Either the link was shared from someone else, or it&apos;s been altered. If you registered, your
                  Stripe receipt has a working link to this page.
                </p>
              </>
            ) : status === "rate_limited" ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(var(--nec-purple-rgb),0.24)] bg-[rgba(var(--nec-purple-rgb),0.12)]">
                  <Clock className="h-8 w-8 text-[var(--nec-purple)]" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-black text-[var(--nec-text)] md:text-3xl">Too many checks</h1>
                <p className="leading-7 text-[var(--nec-muted)]">
                  This page has been loaded a lot recently. Wait{" "}
                  {retryAfter ? `about ${retryAfter} seconds` : "a moment"} and refresh.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(var(--nec-pink-rgb),0.24)] bg-[rgba(var(--nec-pink-rgb),0.12)]">
                  <AlertCircle className="h-8 w-8 text-[var(--nec-pink)]" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-black text-[var(--nec-text)] md:text-3xl">
                  We couldn&apos;t verify your registration
                </h1>
                <p className="leading-7 text-[var(--nec-muted)]">
                  No payment session was found. If you just completed a payment, check your email for a receipt from
                  Stripe &mdash; it contains a link back to this confirmation page.
                </p>
                <p className="text-sm text-[var(--nec-muted)]">
                  If you registered with an access code, you should have been redirected here automatically. Try
                  registering again or reach out to us.
                </p>
              </>
            )}

            <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
              <Link href="/register" className="btn-primary">
                Back to Registration
              </Link>
              <Link href="/" className="btn-ghost">
                Go Home
              </Link>
            </div>

            <div className="border-t border-[var(--nec-border)] pt-3">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Registration%20Verification%20Issue${correlationId ? `%20%5B${encodeURIComponent(correlationId)}%5D` : ""}`}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                Need help? Reach out &mdash; {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
