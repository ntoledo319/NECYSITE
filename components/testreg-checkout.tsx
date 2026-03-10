"use client"

import { useCallback, useEffect, useState } from "react"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startTestregCheckout } from "@/app/actions/testreg"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  REGISTRATION_PRODUCTS,
  BREAKFAST_PRODUCTS,
  calculateProcessingFee,
} from "@/lib/registration-products"

interface RegistrationData {
  name: string
  state: string
  email: string
  accommodations: string
  interpretationNeeded: boolean
  handicapAccessibility: boolean
  willingToServe: boolean
  homegroup: string
}

interface PolicyAgreements {
  readPolicy: boolean
  understandQuestions: boolean
  acknowledgeBehavior: boolean
  understandAdmission: boolean
  understandReporting: boolean
  understandInvestigation: boolean
  signatureAgreement: boolean
}

interface TestregCheckoutProps {
  registrationData: RegistrationData
  policyAgreements: PolicyAgreements
  onBack: () => void
}

export default function TestregCheckout({
  registrationData,
  policyAgreements,
  onBack,
}: TestregCheckoutProps) {
  const [stripePromise, setStripePromise] = useState<ReturnType<
    typeof loadStripe
  > | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [breakfastSelections, setBreakfastSelections] = useState<
    Record<string, boolean>
  >({})
  const [checkoutReady, setCheckoutReady] = useState(false)
  const [checkoutKey, setCheckoutKey] = useState(0)

  const product = REGISTRATION_PRODUCTS.find(
    (p) => p.id === "necypaa-xxxvi-registration"
  )
  const registrationFee = product ? product.priceInCents / 100 : 0

  const selectedBreakfasts = BREAKFAST_PRODUCTS.filter(
    (bp) => breakfastSelections[bp.id]
  )
  const breakfastTotalCents = selectedBreakfasts.reduce(
    (sum, bp) => sum + bp.priceInCents,
    0
  )
  const subtotalCents = (product?.priceInCents || 0) + breakfastTotalCents
  const processingFeeCents = calculateProcessingFee(subtotalCents)
  const processingFee = processingFeeCents / 100
  const totalAmount = subtotalCents / 100 + processingFee

  const handleToggleBreakfast = (productId: string, checked: boolean) => {
    setBreakfastSelections((prev) => ({ ...prev, [productId]: checked }))
    // Reset the Stripe checkout so it re-creates with the new total
    setCheckoutReady(false)
  }

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (key) {
      setStripePromise(loadStripe(key))
    } else {
      setError("Stripe publishable key not found")
    }
  }, [])

  const handleProceedToPayment = () => {
    setCheckoutKey((prev) => prev + 1)
    setCheckoutReady(true)
  }

  const fetchClientSecret = useCallback(async () => {
    try {
      const selectedBreakfastIds = Object.entries(breakfastSelections)
        .filter(([, selected]) => selected)
        .map(([id]) => id)

      const clientSecret = await startTestregCheckout(
        "necypaa-xxxvi-registration",
        registrationData,
        policyAgreements,
        selectedBreakfastIds
      )
      return clientSecret
    } catch (err) {
      console.error("Error fetching client secret:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create checkout session"
      )
      throw err
    }
  }, [registrationData, policyAgreements, breakfastSelections])

  const fridayProduct = BREAKFAST_PRODUCTS.find(
    (p) => p.id === "breakfast-friday"
  )

  if (error) {
    return (
      <div className="space-y-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="text-white bg-transparent" style={{ borderColor: "var(--nec-border)" }}
        >
          Back
        </Button>
        <div className="rounded-2xl p-4 min-h-[400px] flex items-center justify-center" style={{ background: "rgba(26,34,54,0.9)", border: "1px solid var(--nec-border)" }}>
          <div className="text-center space-y-2">
            <p className="text-red-400 font-semibold">Payment Error</p>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button
        type="button"
        onClick={onBack}
        variant="outline"
        className="text-white bg-transparent" style={{ borderColor: "var(--nec-border)" }}
      >
        Back
      </Button>

      {/* Registration Fee + Breakfast Add-ons */}
      <div className="rounded-2xl p-5 border" style={{ background: "rgba(26,34,54,0.6)", borderColor: "var(--nec-border)" }}>
        {/* Registration price shown prominently */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Registration Fee</h3>
            <p className="text-gray-400 text-xs">NECYPAA XXXVI - The Archway of Freedom</p>
          </div>
          <span className="text-xl font-bold" style={{ color: "var(--nec-gold)" }}>${registrationFee.toFixed(2)}</span>
        </div>

        <div className="border-t pt-3" style={{ borderColor: "var(--nec-border)" }}>
          <p className="text-sm text-gray-300 mb-2">
            Add breakfast tickets <span className="text-gray-500">($20 each)</span>
          </p>

          <div className="space-y-2">
            {/* Friday - New Year's Day */}
            {fridayProduct && (
              <button
                type="button"
                onClick={() =>
                  handleToggleBreakfast(
                    fridayProduct.id,
                    !breakfastSelections[fridayProduct.id]
                  )
                }
                className="w-full text-left rounded-xl px-3 py-2.5 transition-colors border"
                style={{
                  background: breakfastSelections[fridayProduct.id] ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.04)",
                  borderColor: breakfastSelections[fridayProduct.id] ? "rgba(249,115,22,0.5)" : "rgba(249,115,22,0.15)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id={fridayProduct.id}
                    checked={breakfastSelections[fridayProduct.id] || false}
                    onCheckedChange={(checked) =>
                      handleToggleBreakfast(fridayProduct.id, checked as boolean)
                    }
                    className="border-orange-600 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-white font-medium cursor-pointer">
                        Friday - New Year{"'"}s Day
                      </Label>
                      <span className="text-sm text-white font-medium">$20</span>
                    </div>
                    <p className="text-orange-400 text-xs mt-0.5">
                      Most restaurants closed -- start your new year with fellowship!
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Saturday and Sunday */}
            {BREAKFAST_PRODUCTS.filter((p) => p.id !== "breakfast-friday").map(
              (bp) => (
                <button
                  key={bp.id}
                  type="button"
                  onClick={() =>
                    handleToggleBreakfast(bp.id, !breakfastSelections[bp.id])
                  }
                  className="w-full text-left rounded-xl px-3 py-2.5 transition-colors border"
                  style={{
                    background: breakfastSelections[bp.id] ? "rgba(42,53,82,0.6)" : "rgba(26,34,54,0.6)",
                    borderColor: breakfastSelections[bp.id] ? "rgba(249,115,22,0.5)" : "var(--nec-border)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id={bp.id}
                      checked={breakfastSelections[bp.id] || false}
                      onCheckedChange={(checked) =>
                        handleToggleBreakfast(bp.id, checked as boolean)
                      }
                      className="border-gray-600 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <Label className="text-sm text-white cursor-pointer">
                        {bp.id === "breakfast-saturday" ? "Saturday" : "Sunday"}
                      </Label>
                      <span className="text-sm text-white font-medium">$20</span>
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        </div>

        {/* Inline order summary */}
        <div className="border-t mt-4 pt-3 space-y-1.5 text-sm" style={{ borderColor: "var(--nec-border)" }}>
          <div className="flex justify-between text-gray-300">
            <span>Registration</span>
            <span className="text-white">${registrationFee.toFixed(2)}</span>
          </div>
          {selectedBreakfasts.map((bp) => (
            <div key={bp.id} className="flex justify-between text-gray-300">
              <span>Breakfast - {bp.id === "breakfast-friday" ? "Friday" : bp.id === "breakfast-saturday" ? "Saturday" : "Sunday"}</span>
              <span className="text-white">${(bp.priceInCents / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-gray-400 text-xs">
            <span>Processing fee (2.9% + $0.30)</span>
            <span>${processingFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-1 flex justify-between font-bold" style={{ borderColor: "var(--nec-border)" }}>
            <span className="text-white">Total</span>
            <span style={{ color: "var(--nec-gold)" }}>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      {!checkoutReady ? (
        <Button
          onClick={handleProceedToPayment}
          className="w-full text-white py-6 text-lg font-bold"
          style={{ background: "var(--nec-pink)", boxShadow: "0 2px 16px rgba(232,0,110,0.3)" }}
          disabled={!stripePromise}
        >
          Proceed to Payment - ${totalAmount.toFixed(2)}
        </Button>
      ) : (
        stripePromise && (
          <div
            key={checkoutKey}
            id="checkout"
            className="bg-white rounded-lg p-4 min-h-[400px]"
          >
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ fetchClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )
      )}
    </div>
  )
}
