"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startRegistrationCheckout } from "@/actions/registration"
import { Button } from "@/components/ui/button"
import {
  BREAKFAST_PRODUCTS,
  REGISTRATION_PRODUCTS,
  calculateProcessingFee,
  formatUsdFromCents,
  parseUsdInputToCents,
} from "@/lib/registration-products"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"
import AccessCodeCheckout from "@/components/checkout/access-code-checkout"
import BreakfastAddOns from "@/components/checkout/breakfast-add-ons"
import ScholarshipAttribution from "@/components/checkout/scholarship-attribution"
import ScholarshipConfigurator from "@/components/checkout/scholarship-configurator"

interface RegistrationCheckoutProps {
  registrationData: RegistrationData
  policyAgreements: PolicyAgreements | null
  onBack: () => void
}

export default function RegistrationCheckout({
  registrationData,
  policyAgreements,
  onBack,
}: RegistrationCheckoutProps) {
  const hasAccessCode = (registrationData.accessCode ?? "").trim().length > 0

  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isScholarshipMode, setIsScholarshipMode] = useState(registrationData.isScholarship)
  const [scholarshipQuantity, setScholarshipQuantity] = useState(1)
  const [useCustomScholarshipAmount, setUseCustomScholarshipAmount] = useState(false)
  const [scholarshipAmountInput, setScholarshipAmountInput] = useState("40.00")
  const [aaEntity, setAaEntity] = useState("")
  const [reservedForPeople, setReservedForPeople] = useState<string[]>([""])
  const [breakfastSelections, setBreakfastSelections] = useState<Record<string, boolean>>({})
  const [checkoutReady, setCheckoutReady] = useState(false)
  const [checkoutKey, setCheckoutKey] = useState(0)

  const product = REGISTRATION_PRODUCTS.find((p) => p.id === "necypaa-xxxvi-registration")
  const unitRegistrationFeeCents = product?.priceInCents || 0
  const unitRegistrationFee = unitRegistrationFeeCents / 100

  useEffect(() => {
    setScholarshipAmountInput(formatUsdFromCents(unitRegistrationFeeCents))
  }, [unitRegistrationFeeCents])

  const selfRegistrationQuantity = registrationData.isScholarship ? 0 : 1
  const effectiveScholarshipQuantity = isScholarshipMode ? scholarshipQuantity : 0
  const defaultScholarshipUnitAmountCents = unitRegistrationFeeCents
  const enteredScholarshipUnitAmountCents = useCustomScholarshipAmount
    ? parseUsdInputToCents(scholarshipAmountInput)
    : defaultScholarshipUnitAmountCents
  const scholarshipAmountError =
    isScholarshipMode && useCustomScholarshipAmount && enteredScholarshipUnitAmountCents == null
      ? "Enter a valid dollar amount, such as 40 or 40.00."
      : null
  const scholarshipUnitAmountCents = isScholarshipMode ? enteredScholarshipUnitAmountCents : null
  const scholarshipUnitAmountForCheckout = isScholarshipMode && useCustomScholarshipAmount
    ? scholarshipUnitAmountCents
    : null

  const canAddBreakfast = selfRegistrationQuantity > 0
  const selectedBreakfasts = useMemo(
    () => (canAddBreakfast ? BREAKFAST_PRODUCTS.filter((bp) => breakfastSelections[bp.id]) : []),
    [breakfastSelections, canAddBreakfast],
  )
  const breakfastTotalCents = selectedBreakfasts.reduce((sum, bp) => sum + bp.priceInCents, 0)

  const canCalculateTotals = !isScholarshipMode || scholarshipUnitAmountCents != null
  const scholarshipSubtotalCents =
    isScholarshipMode && scholarshipUnitAmountCents != null
      ? scholarshipUnitAmountCents * effectiveScholarshipQuantity
      : 0
  const registrationSubtotalCents = canCalculateTotals
    ? unitRegistrationFeeCents * selfRegistrationQuantity + scholarshipSubtotalCents
    : null
  const subtotalCents = registrationSubtotalCents != null ? registrationSubtotalCents + breakfastTotalCents : null
  const processingFeeCents = subtotalCents != null ? calculateProcessingFee(subtotalCents) : null
  const processingFee = processingFeeCents != null ? processingFeeCents / 100 : null
  const totalAmount = subtotalCents != null && processingFeeCents != null
    ? (subtotalCents + processingFeeCents) / 100
    : null

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
    setReservedForPeople((prev) =>
      prev.length <= effectiveScholarshipQuantity ? prev : prev.slice(0, effectiveScholarshipQuantity),
    )
  }, [effectiveScholarshipQuantity, isScholarshipMode])

  const fetchClientSecret = useCallback(async () => {
    try {
      const reservedNames = reservedForPeople.map((name) => name.trim()).filter(Boolean)
      const selectedBreakfastIds = canAddBreakfast ? selectedBreakfasts.map((bp) => bp.id) : []

      return await startRegistrationCheckout(
        "necypaa-xxxvi-registration",
        registrationData,
        policyAgreements,
        effectiveScholarshipQuantity,
        selectedBreakfastIds,
        {
          aaEntity: aaEntity.trim() || undefined,
          reservedForPerson: reservedNames.length > 0 ? reservedNames.join(", ") : undefined,
        },
        scholarshipUnitAmountForCheckout ?? undefined,
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something didn't go as planned. Please try again — and if it keeps happening, reach out to us at info@necypaa.org.",
      )
      throw err
    }
  }, [
    aaEntity,
    canAddBreakfast,
    effectiveScholarshipQuantity,
    policyAgreements,
    registrationData,
    reservedForPeople,
    scholarshipUnitAmountForCheckout,
    selectedBreakfasts,
  ])

  const resetCheckout = () => setCheckoutReady(false)

  const toggleBreakfast = (productId: string, checked: boolean) => {
    setBreakfastSelections((prev) => ({ ...prev, [productId]: checked }))
    setValidationError(null)
    resetCheckout()
  }

  const updateReservedPerson = (index: number, value: string) => {
    setReservedForPeople((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
    setValidationError(null)
    resetCheckout()
  }

  const addReservedPersonField = () => {
    setReservedForPeople((prev) =>
      prev.length >= effectiveScholarshipQuantity ? prev : [...prev, ""],
    )
    setValidationError(null)
    resetCheckout()
  }

  const removeReservedPersonField = () => {
    setReservedForPeople((prev) => (prev.length <= 1 ? prev : prev.slice(0, -1)))
    setValidationError(null)
    resetCheckout()
  }

  const handleAaEntityChange = (value: string) => {
    setAaEntity(value)
    setValidationError(null)
    resetCheckout()
  }

  const enableScholarship = () => {
    setIsScholarshipMode(true)
    setValidationError(null)
    resetCheckout()
  }

  const disableScholarship = () => {
    setIsScholarshipMode(false)
    setValidationError(null)
    resetCheckout()
  }

  const decreaseScholarship = () => {
    setScholarshipQuantity((q) => Math.max(1, q - 1))
    setValidationError(null)
    resetCheckout()
  }

  const increaseScholarship = () => {
    setScholarshipQuantity((q) => Math.min(20, q + 1))
    setValidationError(null)
    resetCheckout()
  }

  const toggleCustomScholarshipAmount = () => {
    setUseCustomScholarshipAmount((prev) => {
      const next = !prev
      if (next && parseUsdInputToCents(scholarshipAmountInput) == null) {
        setScholarshipAmountInput(formatUsdFromCents(defaultScholarshipUnitAmountCents))
      }
      return next
    })
    setValidationError(null)
    resetCheckout()
  }

  const handleScholarshipAmountChange = (value: string) => {
    setScholarshipAmountInput(value)
    setValidationError(null)
    resetCheckout()
  }

  const normalizeScholarshipAmountInput = () => {
    const parsed = parseUsdInputToCents(scholarshipAmountInput)
    if (parsed != null) {
      setScholarshipAmountInput(formatUsdFromCents(parsed))
    }
  }

  const proceedToPayment = () => {
    if (isScholarshipMode && scholarshipUnitAmountCents == null) {
      setValidationError("Enter a valid scholarship amount before continuing.")
      return
    }

    setValidationError(null)
    setCheckoutKey((prev) => prev + 1)
    setCheckoutReady(true)
  }

  if (hasAccessCode) {
    return (
      <AccessCodeCheckout
        registrationData={registrationData}
        policyAgreements={policyAgreements}
        onBack={onBack}
      />
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button type="button" onClick={onBack} variant="outline" className="text-[var(--nec-text)]">
          Back
        </Button>
        <div
          className="rounded-2xl p-4 min-h-[400px] flex items-center justify-center bg-[var(--nec-card)] border border-[var(--nec-border)]"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center space-y-2">
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
          className="rounded-2xl p-4 min-h-[400px] flex items-center justify-center bg-[var(--nec-card)] border border-[var(--nec-border)]"
          role="status"
          aria-live="polite"
        >
          <div className="text-center space-y-3">
            <div
              className="w-8 h-8 mx-auto border-2 border-[var(--nec-purple)] border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
            <p className="text-[var(--nec-muted)]">Loading payment form&hellip;</p>
          </div>
        </div>
      </div>
    )
  }

  const scholarshipUnitAmountLabel =
    scholarshipUnitAmountCents != null ? `$${formatUsdFromCents(scholarshipUnitAmountCents)}` : "Add amount"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button type="button" onClick={onBack} variant="outline" className="text-[var(--nec-text)]">
          Back
        </Button>
        {!isScholarshipMode && selfRegistrationQuantity > 0 && (
          <Button
            type="button"
            onClick={enableScholarship}
            className="border border-[rgba(var(--nec-orange-rgb),0.26)] bg-[var(--nec-orange)] text-white"
          >
            Add Scholarship
          </Button>
        )}
      </div>

      <div className="nec-reg-subcard p-6 space-y-4">
        <div className="space-y-2">
          <p className="form-section-label">Order Summary</p>
          <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--nec-text)]">
            Registration Summary
          </h3>
        </div>
        <div className="space-y-2 text-[var(--nec-muted)]">
          {selfRegistrationQuantity > 0 && (
            <div className="flex justify-between">
              <span>Registration Fee</span>
              <span className="font-medium text-[var(--nec-text)]">${unitRegistrationFee.toFixed(2)}</span>
            </div>
          )}

          {isScholarshipMode && (
            <div className="flex justify-between items-center">
              <span>
                Scholarship Fee ({effectiveScholarshipQuantity} x {scholarshipUnitAmountLabel})
              </span>
              <span className="font-medium text-[var(--nec-text)]">
                {scholarshipUnitAmountCents != null
                  ? `$${formatUsdFromCents(scholarshipSubtotalCents)}`
                  : "Add amount"}
              </span>
            </div>
          )}

          {selectedBreakfasts.map((bp) => (
            <div key={bp.id} className="flex justify-between">
              <span>
                Breakfast -{" "}
                {bp.id === "breakfast-friday" ? "Friday" : bp.id === "breakfast-saturday" ? "Saturday" : "Sunday"}
              </span>
              <span className="font-medium text-[var(--nec-text)]">${(bp.priceInCents / 100).toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between text-sm">
            <span>Processing Fee (2.9% + $0.30)</span>
            <span className="font-medium text-[var(--nec-text)]">
              {processingFee != null ? `$${processingFee.toFixed(2)}` : "Add amount"}
            </span>
          </div>
          <div className="border-t border-[var(--nec-border)] pt-2 mt-2 flex justify-between text-lg font-bold">
            <span className="text-[var(--nec-text)]">Total</span>
            <span className="text-[var(--nec-gold)]">
              {totalAmount != null ? `$${totalAmount.toFixed(2)}` : "Add amount"}
            </span>
          </div>
        </div>
      </div>

      {isScholarshipMode && (
        <ScholarshipConfigurator
          quantity={effectiveScholarshipQuantity}
          defaultUnitAmountCents={defaultScholarshipUnitAmountCents}
          useCustomAmount={useCustomScholarshipAmount}
          amountInput={scholarshipAmountInput}
          amountError={scholarshipAmountError}
          currentUnitAmountCents={scholarshipUnitAmountCents}
          currentTotalCents={scholarshipSubtotalCents}
          onDecreaseQuantity={decreaseScholarship}
          onIncreaseQuantity={increaseScholarship}
          onToggleCustomAmount={toggleCustomScholarshipAmount}
          onAmountInputChange={handleScholarshipAmountChange}
          onAmountInputBlur={normalizeScholarshipAmountInput}
          removeAction={
            selfRegistrationQuantity > 0
              ? { label: "Remove scholarship registrations", onClick: disableScholarship }
              : undefined
          }
          title="Scholarship Pricing"
          description="Use the live pre-registration price by default, or set a custom amount per scholarship if you need something different."
        />
      )}

      {validationError && (
        <div
          className="rounded-xl border border-[rgba(var(--nec-pink-rgb),0.24)] bg-[rgba(var(--nec-pink-rgb),0.08)] px-4 py-3 text-sm text-[var(--nec-text)]"
          role="alert"
          aria-live="assertive"
        >
          {validationError}
        </div>
      )}

      {canAddBreakfast && (
        <BreakfastAddOns breakfastSelections={breakfastSelections} onToggle={toggleBreakfast} />
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

      {!checkoutReady ? (
        <Button onClick={proceedToPayment} disabled={totalAmount == null} className="w-full py-6 text-lg">
          {totalAmount != null
            ? `Proceed to Payment - $${totalAmount.toFixed(2)}`
            : "Add Scholarship Amount To Continue"}
        </Button>
      ) : (
        <div key={checkoutKey} id="checkout" className="nec-stripe-embed p-4 min-h-[400px]">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </div>
  )
}
