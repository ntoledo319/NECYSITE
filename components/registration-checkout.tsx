"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe, type Stripe } from "@stripe/stripe-js"
import { useLocale } from "next-intl"
import { startRegistrationCheckout } from "@/actions/registration"
import { Button } from "@/components/ui/button"
import {
  BREAKFAST_PRODUCTS,
  REGISTRATION_PRODUCTS,
  calculateProcessingFee,
  formatUsdFromCents,
} from "@/lib/registration-products"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"
import AccessCodeCheckout from "@/components/checkout/access-code-checkout"
import BreakfastAddOns from "@/components/checkout/breakfast-add-ons"
import { CONTACT_EMAIL } from "@/lib/constants"

interface RegistrationCheckoutProps {
  registrationData: RegistrationData
  policyAgreements: PolicyAgreements | null
  onBack: () => void
  correlationId?: string
}

const REGISTRATION_PRICE_CENTS = REGISTRATION_PRODUCTS[0]?.priceInCents ?? 4000

export default function RegistrationCheckout({
  registrationData,
  policyAgreements,
  onBack,
}: RegistrationCheckoutProps) {
  const locale = useLocale()
  const hasAccessCode = (registrationData.accessCode ?? "").trim().length > 0
  const intent = registrationData.intent
  const isAttendee = intent === "self" || intent === "self_plus_gift"
  const giftCount = registrationData.giftRecipients.length
  const isDonation = intent === "donate"
  const isGiftOnly = intent === "gift_only"
  const isGroup = intent === "group"
  const groupQuantity = registrationData.groupQuantity

  const [stripePromise, setStripePromise] = useState<Stripe | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [breakfastSelections, setBreakfastSelections] = useState<Record<string, boolean>>({})
  const [checkoutReady, setCheckoutReady] = useState(false)
  const [checkoutKey, setCheckoutKey] = useState(0)
  const [isProceeding, setIsProceeding] = useState(false)

  const canAddBreakfast = isAttendee
  const selectedBreakfasts = useMemo(
    () => (canAddBreakfast ? BREAKFAST_PRODUCTS.filter((bp) => breakfastSelections[bp.id]) : []),
    [breakfastSelections, canAddBreakfast],
  )
  const breakfastTotalCents = selectedBreakfasts.reduce((sum, bp) => sum + bp.priceInCents, 0)

  // Server-authoritative numbers reproduced here for the order summary only.
  // The server recomputes from its own catalog when creating the Stripe session.
  const selfCents = isAttendee ? REGISTRATION_PRICE_CENTS : 0
  const giftSubtotalCents = (intent === "self_plus_gift" || isGiftOnly) ? giftCount * REGISTRATION_PRICE_CENTS : 0
  const donationCents = isDonation ? registrationData.donationAmountCents : 0
  const groupSubtotalCents = isGroup ? groupQuantity * REGISTRATION_PRICE_CENTS : 0
  const subtotalCents = selfCents + giftSubtotalCents + breakfastTotalCents + donationCents + groupSubtotalCents
  const processingFeeCents = subtotalCents > 0 ? calculateProcessingFee(subtotalCents) : 0
  const totalCents = subtotalCents + processingFeeCents

  useEffect(() => {
    if (hasAccessCode) return
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      setError("We're having trouble loading the payment form. Please refresh the page or try again in a moment.")
      return
    }
    loadStripe(key)
      .then(setStripePromise)
      .catch(() =>
        setError("We're having trouble loading the payment form. Please refresh the page or try again in a moment."),
      )
  }, [hasAccessCode])

  const fetchClientSecret = useCallback(async () => {
    try {
      const selectedBreakfastIds = canAddBreakfast ? selectedBreakfasts.map((bp) => bp.id) : []
      const result = await startRegistrationCheckout(
        "necypaa-xxxvi-registration",
        registrationData,
        policyAgreements,
        selectedBreakfastIds,
        undefined,
        locale,
      )
      if (!result.ok) {
        const message = result.error.contactSupport
          ? `${result.error.userMessage} (ref ${result.error.correlationId})`
          : result.error.userMessage
        setError(message)
        return Promise.reject(new Error(result.error.userMessage))
      }
      return result.clientSecret
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Something didn't go as planned. Please try again — and if it keeps happening, reach out at ${CONTACT_EMAIL}.`,
      )
      return Promise.reject(err)
    }
  }, [canAddBreakfast, locale, policyAgreements, registrationData, selectedBreakfasts])

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret])

  const toggleBreakfast = (productId: string, checked: boolean) => {
    setBreakfastSelections((prev) => ({ ...prev, [productId]: checked }))
    setCheckoutReady(false)
    setIsProceeding(false)
  }

  const proceedToPayment = () => {
    if (subtotalCents <= 0) {
      setError("Add a registration, gift recipient, or donation amount before continuing.")
      return
    }
    setError(null)
    setIsProceeding(true)
    setCheckoutKey((prev) => prev + 1)
    setCheckoutReady(true)
  }

  if (hasAccessCode) {
    return (
      <AccessCodeCheckout registrationData={registrationData} policyAgreements={policyAgreements} onBack={onBack} />
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button type="button" onClick={onBack} variant="outline" className="text-[var(--nec-text)]">
          Back
        </Button>
        <div
          className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[var(--nec-border)] bg-[var(--nec-card)] p-4"
          role="alert"
          aria-live="polite"
        >
          <div className="space-y-2 text-center">
            <p className="font-semibold text-[hsl(var(--destructive))]">Hmm, something went wrong</p>
            <p className="text-[var(--nec-muted)]">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="space-y-6">
        <Button type="button" onClick={onBack} variant="outline" className="text-[var(--nec-text)]">
          Back
        </Button>
        <div
          className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[var(--nec-border)] bg-[var(--nec-card)] p-4"
          role="status"
          aria-live="polite"
        >
          <div className="space-y-3 text-center">
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--nec-purple)] border-t-transparent"
              aria-hidden="true"
            />
            <p className="text-[var(--nec-muted)]">Loading payment form&hellip;</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button type="button" onClick={onBack} variant="outline" className="text-[var(--nec-text)]">
          Back
        </Button>
      </div>

      <div className="nec-reg-subcard space-y-4 p-6">
        <div className="space-y-2">
          <p className="form-section-label">Order Summary</p>
          <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--nec-text)]">
            {isDonation ? "Donation Summary" : isGroup ? "Group Purchase Summary" : "Registration Summary"}
          </h3>
        </div>
        <div className="space-y-2 text-[var(--nec-muted)]">
          {selfCents > 0 && (
            <div className="flex justify-between">
              <span>Registration</span>
              <span className="font-medium text-[var(--nec-text)]">${formatUsdFromCents(selfCents)}</span>
            </div>
          )}
          {giftSubtotalCents > 0 && (
            <div className="flex justify-between">
              <span>
                Sponsored registrations ({giftCount} × ${formatUsdFromCents(REGISTRATION_PRICE_CENTS)})
              </span>
              <span className="font-medium text-[var(--nec-text)]">${formatUsdFromCents(giftSubtotalCents)}</span>
            </div>
          )}
          {donationCents > 0 && (
            <div className="flex justify-between">
              <span>General Fund donation</span>
              <span className="font-medium text-[var(--nec-text)]">${formatUsdFromCents(donationCents)}</span>
            </div>
          )}
          {groupSubtotalCents > 0 && (
            <div className="flex justify-between">
              <span>
                {registrationData.groupName || "Group"} — {groupQuantity} seats × ${formatUsdFromCents(REGISTRATION_PRICE_CENTS)}
              </span>
              <span className="font-medium text-[var(--nec-text)]">${formatUsdFromCents(groupSubtotalCents)}</span>
            </div>
          )}
          {selectedBreakfasts.map((bp) => (
            <div key={bp.id} className="flex justify-between">
              <span>
                Breakfast — {bp.id === "breakfast-friday" ? "Friday" : bp.id === "breakfast-saturday" ? "Saturday" : "Sunday"}
              </span>
              <span className="font-medium text-[var(--nec-text)]">${formatUsdFromCents(bp.priceInCents)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <span>Processing Fee (2.9% + $0.30)</span>
            <span className="font-medium text-[var(--nec-text)]">${formatUsdFromCents(processingFeeCents)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-[var(--nec-border)] pt-2 text-lg font-bold">
            <span className="text-[var(--nec-text)]">Total</span>
            <span className="text-[var(--nec-gold)]">${formatUsdFromCents(totalCents)}</span>
          </div>
        </div>
      </div>

      {canAddBreakfast && <BreakfastAddOns breakfastSelections={breakfastSelections} onToggle={toggleBreakfast} />}

      {(intent === "self_plus_gift" || isGiftOnly) && giftCount > 0 && (
        <div
          className="rounded-[1.4rem] border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.6)] p-5 text-sm leading-6 text-[var(--nec-muted)]"
          role="status"
        >
          After payment, each recipient gets a claim link. Recipients with an email get it directly; the rest come back
          to you to forward. They&apos;ll sign the policy and finish registering on the claim page — every attendee
          signs in their own name.
        </div>
      )}

      {isGroup && (
        <div
          className="rounded-[1.4rem] border border-[rgba(var(--nec-gold-rgb),0.30)] bg-[rgba(var(--nec-gold-rgb),0.08)] p-5 text-sm leading-6 text-[var(--nec-text)]"
          role="status"
        >
          After payment, we&apos;ll send your confirmation to{" "}
          <strong>{registrationData.email}</strong>. Reply to that email with your {groupQuantity} attendee names by the
          convention start date. We&apos;ll email each attendee the policy directly when their name reaches us.
        </div>
      )}

      {!checkoutReady ? (
        <Button onClick={proceedToPayment} disabled={subtotalCents <= 0 || isProceeding} className="w-full py-6 text-lg">
          Proceed to Payment — ${formatUsdFromCents(totalCents)}
        </Button>
      ) : (
        <div key={checkoutKey} id="checkout" className="nec-stripe-embed min-h-[400px] p-4">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </div>
  )
}
