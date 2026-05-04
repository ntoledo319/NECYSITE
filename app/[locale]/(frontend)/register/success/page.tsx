import type { Metadata } from "next"
import { stripe } from "@/lib/stripe"
import RegistrationConfirmed, { type VerifiedRegistration } from "./registration-confirmed"
import Link from "next/link"
import { AlertCircle, Clock, Mail } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"

export const metadata: Metadata = {
  title: "Registration Confirmation — NECYPAA XXXVI",
  description: "Your NECYPAA XXXVI registration confirmation.",
}

// ── Stripe session verification ──────────────────────────────────

type VerifyResult = { status: "verified"; data: VerifiedRegistration } | { status: "unpaid" } | { status: "error" }

async function verifyStripeSession(sessionId: string): Promise<VerifyResult> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    })

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
  } catch {
    return { status: "error" }
  }
}

// ── Page ─────────────────────────────────────────────────────────

export default async function RegistrationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; flow?: string }>
}) {
  const params = await searchParams

  // ── Stripe-verified paid registration ─────────────────────────
  if (params.session_id) {
    const result = await verifyStripeSession(params.session_id)

    if (result.status === "verified") {
      return <RegistrationConfirmed registration={result.data} />
    }

    return <UnverifiedPage status={result.status} />
  }

  // ── Access-code registration (verified server-side before redirect)
  if (params.flow === "access-code") {
    return <RegistrationConfirmed />
  }

  // ── Direct navigation — no session, no flow ───────────────────
  return <UnverifiedPage status="missing" />
}

// ── Unverified states ────────────────────────────────────────────

function UnverifiedPage({ status }: { status: "unpaid" | "error" | "missing" }) {
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
                href={`mailto:${CONTACT_EMAIL}?subject=Registration%20Verification%20Issue`}
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
