"use client"

import { useCallback, useEffect, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startBreakfastCheckout } from "@/actions/breakfast"
import { BREAKFAST_PRODUCTS, calculateProcessingFee } from "@/lib/registration-products"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BreakfastCheckout() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [breakfastSelections, setBreakfastSelections] = useState<Record<string, boolean>>({})
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [checkoutReady, setCheckoutReady] = useState(false)
  const [checkoutKey, setCheckoutKey] = useState(0)

  const selectedBreakfasts = BREAKFAST_PRODUCTS.filter((bp) => breakfastSelections[bp.id])
  const subtotalCents = selectedBreakfasts.reduce((sum, bp) => sum + bp.priceInCents, 0)
  const processingFee = subtotalCents > 0 ? calculateProcessingFee(subtotalCents) / 100 : 0
  const totalAmount = subtotalCents / 100 + processingFee

  const fridayProduct = BREAKFAST_PRODUCTS.find((p) => p.id === "breakfast-friday")
  const weekendProducts = BREAKFAST_PRODUCTS.filter((p) => p.id !== "breakfast-friday")

  const validateField = (field: string, value: string) => {
    let errorMsg = ""
    if (!value.trim()) {
      const labels: Record<string, string> = { firstName: "First name", lastName: "Last name", email: "Email" }
      errorMsg = `${labels[field] || field} is required.`
    } else if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      errorMsg = "Please enter a valid email address."
    }
    setErrors((prev) => {
      const next = { ...prev }
      if (errorMsg) {
        next[field] = errorMsg
      } else {
        delete next[field]
      }
      return next
    })
  }

  const isFormValid =
    firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "" && selectedBreakfasts.length > 0

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (key) {
      setStripePromise(loadStripe(key))
    } else {
      setError("We're having trouble loading the payment form. Please refresh the page or try again in a moment.")
    }
  }, [])

  const toggleBreakfast = (productId: string, checked: boolean) => {
    setBreakfastSelections((prev) => ({ ...prev, [productId]: checked }))
    setCheckoutReady(false)
  }

  const fetchClientSecret = useCallback(async () => {
    try {
      const selectedBreakfastIds = selectedBreakfasts.map((bp) => bp.id)
      return await startBreakfastCheckout(
        { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() },
        selectedBreakfastIds,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something didn't go as planned. Please try again — and if it keeps happening, reach out to us at info@necypaa.org.")
      throw err
    }
  }, [email, firstName, lastName, selectedBreakfasts])

  const proceedToPayment = () => {
    setCheckoutKey((prev) => prev + 1)
    setCheckoutReady(true)
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 min-h-[300px] flex items-center justify-center" role="alert" aria-live="assertive">
        <div className="text-center space-y-2">
          <p className="text-red-600 font-semibold">Hmm, something went wrong</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="bg-white rounded-lg p-4 min-h-[300px] flex items-center justify-center" role="status" aria-live="polite">
        <p className="text-gray-600">Loading payment form...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 border border-[var(--nec-border)] space-y-4 bg-[rgba(26,16,48,0.6)]">
        <h3 className="text-lg font-semibold text-white">Your Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName" className="text-white">
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                setCheckoutReady(false)
                if (errors.firstName) setErrors((prev) => { const next = { ...prev }; delete next.firstName; return next })
              }}
              onBlur={() => validateField("firstName", firstName)}
              required
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              className="text-white"
            />
            {errors.firstName && <p id="firstName-error" role="alert" className="text-xs mt-1" style={{ color: "var(--nec-pink)" }}>{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName" className="text-white">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
                setCheckoutReady(false)
                if (errors.lastName) setErrors((prev) => { const next = { ...prev }; delete next.lastName; return next })
              }}
              onBlur={() => validateField("lastName", lastName)}
              required
              aria-required="true"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              className="text-white"
            />
            {errors.lastName && <p id="lastName-error" role="alert" className="text-xs mt-1" style={{ color: "var(--nec-pink)" }}>{errors.lastName}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setCheckoutReady(false)
              if (errors.email) setErrors((prev) => { const next = { ...prev }; delete next.email; return next })
            }}
            onBlur={() => validateField("email", email)}
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="text-white"
          />
          {errors.email && <p id="email-error" role="alert" className="text-xs mt-1" style={{ color: "var(--nec-pink)" }}>{errors.email}</p>}
        </div>
      </div>

      <div className="rounded-2xl p-6 border border-[var(--nec-border)] space-y-4 bg-[rgba(26,16,48,0.6)]">
        <h3 className="text-lg font-semibold text-white">New Years Day Breakfast!</h3>
        <p className="text-sm text-[var(--nec-muted)]">
          Friday is especially recommended. Most local restaurants are closed on New Year&apos;s Day.
        </p>

        {fridayProduct && (
          <button
            type="button"
            onClick={() => toggleBreakfast(fridayProduct.id, !breakfastSelections[fridayProduct.id])}
            aria-pressed={breakfastSelections[fridayProduct.id] || false}
            className="w-full text-left rounded-xl px-4 py-3 transition-colors border"
            style={{
              background: breakfastSelections[fridayProduct.id] ? "rgba(212,160,23,0.12)" : "rgba(212,160,23,0.04)",
              borderColor: breakfastSelections[fridayProduct.id] ? "rgba(212,160,23,0.5)" : "rgba(212,160,23,0.15)",
            }}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id={fridayProduct.id}
                checked={breakfastSelections[fridayProduct.id] || false}
                onCheckedChange={(checked) => toggleBreakfast(fridayProduct.id, checked as boolean)}
                className="mt-1 border-[var(--nec-gold)] data-[state=checked]:bg-[var(--nec-gold)] data-[state=checked]:border-[var(--nec-gold)]"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor={fridayProduct.id} className="text-sm text-white font-semibold cursor-pointer">Friday - New Year&apos;s Day</Label>
                  <span className="text-sm text-white font-semibold">$25</span>
                </div>
                <p className="text-[var(--nec-gold)] text-xs mt-1">
                  Start your day on-site with fellowship and no restaurant scramble.
                </p>
              </div>
            </div>
          </button>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          {weekendProducts.map((bp) => (
            <button
              key={bp.id}
              type="button"
              onClick={() => toggleBreakfast(bp.id, !breakfastSelections[bp.id])}
              aria-pressed={breakfastSelections[bp.id] || false}
              className="nec-breakfast-option w-full text-left rounded-xl px-3 py-2.5 transition-colors border"
              style={{
                background: breakfastSelections[bp.id] ? "rgba(45,31,78,0.6)" : "rgba(26,16,48,0.6)",
                borderColor: breakfastSelections[bp.id] ? "rgba(212,160,23,0.5)" : "var(--nec-border)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id={bp.id}
                  checked={breakfastSelections[bp.id] || false}
                  onCheckedChange={(checked) => toggleBreakfast(bp.id, checked as boolean)}
                  className="border-[var(--nec-border)] data-[state=checked]:bg-[var(--nec-gold)] data-[state=checked]:border-[var(--nec-gold)]"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 flex items-center justify-between">
                  <Label htmlFor={bp.id} className="text-sm text-white cursor-pointer">
                    {bp.id === "breakfast-saturday" ? "Saturday Breakfast" : "Sunday Breakfast"}
                  </Label>
                  <span className="text-sm text-white font-medium">$25</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-6 border border-[var(--nec-border)] bg-[rgba(26,16,48,0.6)]">
        <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
        <div className="space-y-2 text-[var(--nec-muted)]">
          {selectedBreakfasts.length === 0 && <p className="text-[var(--nec-muted)] text-sm">Select at least one breakfast.</p>}
          {selectedBreakfasts.map((bp) => (
            <div key={bp.id} className="flex justify-between">
              <span>{bp.name}</span>
              <span className="font-medium text-white">${(bp.priceInCents / 100).toFixed(2)}</span>
            </div>
          ))}
          {selectedBreakfasts.length > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span>Processing Fee (2.9% + $0.30)</span>
                <span className="font-medium text-white">${processingFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-[var(--nec-border)] pt-2 mt-2 flex justify-between text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="text-[var(--nec-gold)]">${totalAmount.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {!checkoutReady ? (
        <Button
          onClick={proceedToPayment}
          disabled={!isFormValid}
          className="w-full text-white py-6 text-lg font-bold bg-[var(--nec-pink)] shadow-[0_2px_16px_rgba(192,38,211,0.3)]"
        >
          Proceed to Payment{isFormValid ? ` - $${totalAmount.toFixed(2)}` : ""}
        </Button>
      ) : (
        <div key={checkoutKey} className="bg-white rounded-lg p-4 min-h-[400px]">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </div>
  )
}
