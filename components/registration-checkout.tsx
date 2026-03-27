"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startRegistrationCheckout } from "@/actions/registration"
import { Button } from "@/components/ui/button"
import { BREAKFAST_PRODUCTS, REGISTRATION_PRODUCTS, calculateProcessingFee } from "@/lib/registration-products"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"
import AccessCodeCheckout from "@/components/checkout/access-code-checkout"
import BreakfastAddOns from "@/components/checkout/breakfast-add-ons"
import ScholarshipAttribution from "@/components/checkout/scholarship-attribution"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegistrationCheckoutProps {
  registrationData: RegistrationData
  policyAgreements: PolicyAgreements | null
  onBack: () => void
}

export default function RegistrationCheckout({ registrationData, policyAgreements, onBack }: RegistrationCheckoutProps) {
  const hasAccessCode = (registrationData.accessCode ?? "").trim().length > 0

  // ── Standard paid checkout state ──────────────────────────────
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isScholarshipMode, setIsScholarshipMode] = useState(registrationData.isScholarship)
  const [scholarshipQuantity, setScholarshipQuantity] = useState(1)
  const [aaEntity, setAaEntity] = useState("")
  const [reservedForPeople, setReservedForPeople] = useState<string[]>([""])
  const [breakfastSelections, setBreakfastSelections] = useState<Record<string, boolean>>({})
  const [checkoutReady, setCheckoutReady] = useState(false)
  const [checkoutKey, setCheckoutKey] = useState(0)
  
  // For scholarship-only purchases, we need to collect purchaser info
  const isScholarshipOnlyPurchase = registrationData.isScholarship && !registrationData.name && !registrationData.email
  const [purchaserName, setPurchaserName] = useState(registrationData.purchaserName || "")
  const [purchaserEmail, setPurchaserEmail] = useState(registrationData.purchaserEmail || "")

  const product = REGISTRATION_PRODUCTS.find((p) => p.id === "necypaa-xxxvi-registration")
  const unitRegistrationFeeCents = product?.priceInCents || 0
  const unitRegistrationFee = unitRegistrationFeeCents / 100

  const selfRegistrationQuantity = registrationData.isScholarship ? 0 : 1
  const effectiveScholarshipQuantity = isScholarshipMode ? scholarshipQuantity : 0

  const canAddBreakfast = selfRegistrationQuantity > 0
  const selectedBreakfasts = useMemo(
    () => (canAddBreakfast ? BREAKFAST_PRODUCTS.filter((bp) => breakfastSelections[bp.id]) : []),
    [canAddBreakfast, breakfastSelections],
  )
  const breakfastTotalCents = selectedBreakfasts.reduce((sum, bp) => sum + bp.priceInCents, 0)

  const registrationSubtotalCents = unitRegistrationFeeCents * (selfRegistrationQuantity + effectiveScholarshipQuantity)
  const subtotalCents = registrationSubtotalCents + breakfastTotalCents
  const processingFee = calculateProcessingFee(subtotalCents) / 100
  const totalAmount = subtotalCents / 100 + processingFee

  useEffect(() => {
    if (hasAccessCode) return
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (key) {
      setStripePromise(loadStripe(key))
    } else {
      setError("We're having trouble loading the payment form. Please refresh the page or try again in a moment.")
    }
  }, [hasAccessCode])

  useEffect(() => {
    if (!isScholarshipMode) return
    setReservedForPeople((prev) => (prev.length <= effectiveScholarshipQuantity ? prev : prev.slice(0, effectiveScholarshipQuantity)))
  }, [isScholarshipMode, effectiveScholarshipQuantity])

  const fetchClientSecret = useCallback(async () => {
    try {
      const reservedNames = reservedForPeople.map((name) => name.trim()).filter(Boolean)
      const selectedBreakfastIds = canAddBreakfast ? selectedBreakfasts.map((bp) => bp.id) : []

      // For scholarship-only purchases, add purchaser info to the registration data
      const registrationDataWithPurchaser = isScholarshipOnlyPurchase
        ? { ...registrationData, purchaserName: purchaserName.trim(), purchaserEmail: purchaserEmail.trim() }
        : registrationData

      return await startRegistrationCheckout(
        "necypaa-xxxvi-registration",
        registrationDataWithPurchaser,
        policyAgreements,
        effectiveScholarshipQuantity,
        selectedBreakfastIds,
        {
          aaEntity: aaEntity.trim() || undefined,
          reservedForPerson: reservedNames.length > 0 ? reservedNames.join(", ") : undefined,
        },
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something didn't go as planned. Please try again — and if it keeps happening, reach out to us at info@necypaa.org.")
      throw err
    }
  }, [
    aaEntity,
    canAddBreakfast,
    effectiveScholarshipQuantity,
    isScholarshipOnlyPurchase,
    policyAgreements,
    purchaserEmail,
    purchaserName,
    registrationData,
    reservedForPeople,
    selectedBreakfasts,
  ])

  // ── Paid checkout handlers ────────────────────────────────────

  const resetCheckout = () => setCheckoutReady(false)

  const toggleBreakfast = (productId: string, checked: boolean) => {
    setBreakfastSelections((prev) => ({ ...prev, [productId]: checked }))
    resetCheckout()
  }

  const updateReservedPerson = (index: number, value: string) => {
    setReservedForPeople((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
    resetCheckout()
  }

  const addReservedPersonField = () => {
    setReservedForPeople((prev) => (prev.length >= effectiveScholarshipQuantity ? prev : [...prev, ""]))
    resetCheckout()
  }

  const removeReservedPersonField = () => {
    setReservedForPeople((prev) => (prev.length <= 1 ? prev : prev.slice(0, -1)))
    resetCheckout()
  }

  const handleAaEntityChange = (value: string) => {
    setAaEntity(value)
    resetCheckout()
  }

  const enableScholarship = () => { setIsScholarshipMode(true); resetCheckout() }
  const disableScholarship = () => { setIsScholarshipMode(false); resetCheckout() }
  const decreaseScholarship = () => { setScholarshipQuantity((q) => Math.max(1, q - 1)); resetCheckout() }
  const increaseScholarship = () => { setScholarshipQuantity((q) => Math.min(20, q + 1)); resetCheckout() }

  const handlePurchaserNameChange = (value: string) => { setPurchaserName(value); resetCheckout() }
  const handlePurchaserEmailChange = (value: string) => { setPurchaserEmail(value); resetCheckout() }
  
  // For scholarship-only, require valid purchaser email before proceeding
  const canProceedToPayment = !isScholarshipOnlyPurchase || (purchaserEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(purchaserEmail.trim()))

  const proceedToPayment = () => {
    setCheckoutKey((prev) => prev + 1)
    setCheckoutReady(true)
  }

  // ── Access code checkout path ─────────────────────────────────

  if (hasAccessCode) {
    return (
      <AccessCodeCheckout
        registrationData={registrationData}
        policyAgreements={policyAgreements}
        onBack={onBack}
      />
    )
  }

  // ── Standard paid checkout path ───────────────────────────────

  if (error) {
    return (
      <div className="space-y-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="text-white bg-transparent border-[var(--nec-border)]"
        >
          Back
        </Button>
        <div className="rounded-2xl p-4 min-h-[400px] flex items-center justify-center bg-[rgba(26,16,48,0.9)] border border-[var(--nec-border)]" role="alert" aria-live="assertive">
          <div className="text-center space-y-2">
            <p className="text-red-400 font-semibold">Hmm, something went wrong</p>
            <p className="text-[var(--nec-muted)]">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="space-y-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="text-white bg-transparent border-[var(--nec-border)]"
        >
          Back
        </Button>
        <div className="rounded-2xl p-4 min-h-[400px] flex items-center justify-center bg-[rgba(26,16,48,0.9)] border border-[var(--nec-border)]" role="status" aria-live="polite">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 mx-auto border-2 border-[var(--nec-purple)] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <p className="text-[var(--nec-muted)]">Loading payment form&hellip;</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="text-white bg-transparent border-[var(--nec-border)]"
        >
          Back
        </Button>
        {!isScholarshipMode && selfRegistrationQuantity > 0 && (
          <Button type="button" onClick={enableScholarship} className="text-white bg-[var(--nec-orange)]">
            Add Scholarship
          </Button>
        )}
      </div>

      <div className="rounded-2xl p-6 border border-[var(--nec-border)] space-y-4 bg-[rgba(26,16,48,0.6)]">
        <h3 className="text-lg font-semibold text-white">Registration Summary</h3>
        <div className="space-y-2 text-[var(--nec-muted)]">
          {selfRegistrationQuantity > 0 && (
            <div className="flex justify-between">
              <span>Registration Fee</span>
              <span className="font-medium text-white">${unitRegistrationFee.toFixed(2)}</span>
            </div>
          )}

          {isScholarshipMode && (
            <div className="space-y-2 rounded-xl border border-[var(--nec-border)] p-3">
              <div className="flex justify-between items-center">
                <span>Scholarship Fee ({effectiveScholarshipQuantity} x ${unitRegistrationFee.toFixed(2)})</span>
                <span className="font-medium text-white">
                  ${(effectiveScholarshipQuantity * unitRegistrationFee).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={decreaseScholarship}
                  className="px-3 py-1 text-white rounded disabled:opacity-50 bg-[rgba(45,31,78,0.8)]"
                  disabled={scholarshipQuantity <= 1}
                  aria-label="Decrease scholarship quantity"
                >
                  -
                </button>
                <span className="px-2 py-1 text-white font-semibold" aria-live="polite" aria-atomic="true">{scholarshipQuantity}</span>
                <button
                  type="button"
                  onClick={increaseScholarship}
                  className="px-3 py-1 text-white rounded disabled:opacity-50 bg-[rgba(45,31,78,0.8)]"
                  disabled={scholarshipQuantity >= 20}
                  aria-label="Increase scholarship quantity"
                >
                  +
                </button>
                {selfRegistrationQuantity > 0 && (
                  <button
                    type="button"
                    onClick={disableScholarship}
                    className="ml-2 px-3 py-1 text-white bg-red-700 hover:bg-red-600 rounded"
                    aria-label="Remove scholarship registrations"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )}

          {selectedBreakfasts.map((bp) => (
            <div key={bp.id} className="flex justify-between">
              <span>
                Breakfast -{" "}
                {bp.id === "breakfast-friday" ? "Friday" : bp.id === "breakfast-saturday" ? "Saturday" : "Sunday"}
              </span>
              <span className="font-medium text-white">${(bp.priceInCents / 100).toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between text-sm">
            <span>Processing Fee (2.9% + $0.30)</span>
            <span className="font-medium text-white">${processingFee.toFixed(2)}</span>
          </div>
          <div className="border-t border-[var(--nec-border)] pt-2 mt-2 flex justify-between text-lg font-bold">
            <span className="text-white">Total</span>
            <span className="text-[var(--nec-gold)]">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {canAddBreakfast && (
        <BreakfastAddOns
          breakfastSelections={breakfastSelections}
          onToggle={toggleBreakfast}
        />
      )}

      {isScholarshipMode && (
        <ScholarshipAttribution
          aaEntity={aaEntity}
          onAaEntityChange={handleAaEntityChange}
          reservedForPeople={reservedForPeople}
          onUpdateReservedPerson={updateReservedPerson}
          onAddReservedPerson={addReservedPersonField}
          onRemoveReservedPerson={removeReservedPersonField}
          effectiveScholarshipQuantity={effectiveScholarshipQuantity}
        />
      )}

      {/* Purchaser Info for Scholarship-Only Purchases */}
      {isScholarshipOnlyPurchase && (
        <div className="space-y-4 rounded-xl border p-4" style={{ background: "rgba(26,16,48,0.6)", borderColor: "var(--nec-border)" }}>
          <h3 className="text-lg font-semibold text-white">Your Contact Information</h3>
          <p className="text-sm text-[var(--nec-muted)]">
            We need your email to send the payment receipt and scholarship confirmation.
          </p>
          <div className="space-y-3">
            <div>
              <Label htmlFor="purchaser-name" className="text-white text-sm mb-1.5 block">
                Your Name (optional)
              </Label>
              <Input
                id="purchaser-name"
                type="text"
                placeholder="Your name"
                value={purchaserName}
                onChange={(e) => handlePurchaserNameChange(e.target.value)}
                className="bg-[var(--nec-input)] border-[var(--nec-border)] text-white placeholder:text-[var(--nec-muted)]"
              />
            </div>
            <div>
              <Label htmlFor="purchaser-email" className="text-white text-sm mb-1.5 block">
                Your Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="purchaser-email"
                type="email"
                placeholder="your.email@example.com"
                value={purchaserEmail}
                onChange={(e) => handlePurchaserEmailChange(e.target.value)}
                className="bg-[var(--nec-input)] border-[var(--nec-border)] text-white placeholder:text-[var(--nec-muted)]"
              />
              {purchaserEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(purchaserEmail.trim()) && (
                <p className="text-red-400 text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!checkoutReady ? (
        <Button
          onClick={proceedToPayment}
          disabled={!canProceedToPayment}
          className="w-full text-white py-6 text-lg font-bold bg-[var(--nec-pink)] shadow-[0_2px_16px_rgba(192,38,211,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScholarshipOnlyPurchase && !canProceedToPayment
            ? "Enter your email to continue"
            : `Proceed to Payment - $${totalAmount.toFixed(2)}`}
        </Button>
      ) : (
        <div key={checkoutKey} id="checkout" className="bg-white rounded-lg p-4 min-h-[400px]">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </div>
  )
}
