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
      <div className="nec-reg-subcard rounded-2xl p-4 min-h-[300px] flex items-center justify-center" role="alert" aria-live="assertive">
        <div className="text-center space-y-2">
          <p className="font-semibold text-[hsl(var(--destructive))]">Hmm, something went wrong</p>
          <p className="text-[var(--nec-muted)]">{error}</p>
        </div>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="nec-reg-subcard rounded-2xl p-4 min-h-[300px] flex items-center justify-center" role="status" aria-live="polite">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-2 border-[var(--nec-purple)] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <p className="text-[var(--nec-muted)]">Loading payment form&hellip;</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!checkoutReady ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-6">
            <div className="nec-reg-subcard rounded-[1.8rem] p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[var(--nec-text)]">Your Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName" className="text-[var(--nec-text)]">
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
                    className="text-[var(--nec-text)]"
                  />
                  {errors.firstName && <p id="firstName-error" role="alert" aria-live="assertive" className="text-xs mt-1 text-[var(--nec-pink)]">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-[var(--nec-text)]">
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
                    className="text-[var(--nec-text)]"
                  />
                  {errors.lastName && <p id="lastName-error" role="alert" aria-live="assertive" className="text-xs mt-1 text-[var(--nec-pink)]">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-[var(--nec-text)]">
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
                  className="text-[var(--nec-text)]"
                />
                {errors.email && <p id="email-error" role="alert" aria-live="assertive" className="text-xs mt-1 text-[var(--nec-pink)]">{errors.email}</p>}
              </div>
            </div>

            <div className="nec-reg-subcard rounded-[1.8rem] p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[var(--nec-text)]">New Years Day Breakfast!</h3>
              <p className="text-sm text-[var(--nec-muted)]">
                Friday is especially recommended. Most local restaurants are closed on New Year&apos;s Day.
              </p>

              {fridayProduct && (
                <button
                  type="button"
                  onClick={() => toggleBreakfast(fridayProduct.id, !breakfastSelections[fridayProduct.id])}
                  aria-pressed={breakfastSelections[fridayProduct.id] || false}
                  className="w-full rounded-[1.45rem] border px-4 py-4 text-left transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5"
                  style={{
                    background: breakfastSelections[fridayProduct.id] ? "rgba(var(--nec-gold-rgb),0.12)" : "rgba(var(--nec-gold-rgb),0.04)",
                    borderColor: breakfastSelections[fridayProduct.id] ? "rgba(var(--nec-gold-rgb),0.5)" : "rgba(var(--nec-gold-rgb),0.15)",
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
                      <div className="flex items-center justify-between gap-4">
                        <Label htmlFor={fridayProduct.id} className="cursor-pointer text-sm font-semibold text-[var(--nec-text)]">Friday - New Year&apos;s Day</Label>
                        <span className="rounded-full border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-gold-rgb),0.08)] px-3 py-1 text-sm font-semibold text-[var(--nec-text)]">$25</span>
                      </div>
                      <p className="mt-2 text-xs text-[var(--nec-gold)]">
                        Start your day on-site with fellowship and no restaurant scramble.
                      </p>
                    </div>
                  </div>
                </button>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {weekendProducts.map((bp) => (
                  <button
                    key={bp.id}
                    type="button"
                    onClick={() => toggleBreakfast(bp.id, !breakfastSelections[bp.id])}
                    aria-pressed={breakfastSelections[bp.id] || false}
                    className="nec-breakfast-option w-full rounded-[1.35rem] border px-4 py-4 text-left transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5"
                    style={{
                      background: breakfastSelections[bp.id] ? "rgba(var(--nec-purple-rgb),0.08)" : "rgba(var(--nec-card-rgb),0.9)",
                      borderColor: breakfastSelections[bp.id] ? "rgba(var(--nec-gold-rgb),0.5)" : "var(--nec-border)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={bp.id}
                        checked={breakfastSelections[bp.id] || false}
                        onCheckedChange={(checked) => toggleBreakfast(bp.id, checked as boolean)}
                        className="border-[var(--nec-border)] data-[state=checked]:bg-[var(--nec-gold)] data-[state=checked]:border-[var(--nec-gold)]"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex flex-1 items-center justify-between gap-4">
                        <Label htmlFor={bp.id} className="cursor-pointer text-sm text-[var(--nec-text)]">
                          {bp.id === "breakfast-saturday" ? "Saturday Breakfast" : "Sunday Breakfast"}
                        </Label>
                        <span className="text-sm font-medium text-[var(--nec-text)]">$25</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="nec-reg-subcard rounded-[1.8rem] p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--nec-text)]">Order Summary</h3>
              <div className="space-y-2 text-[var(--nec-muted)]">
                {selectedBreakfasts.length === 0 && <p className="text-[var(--nec-muted)] text-sm">Select at least one breakfast.</p>}
                {selectedBreakfasts.map((bp) => (
                  <div key={bp.id} className="flex justify-between gap-4 text-sm">
                    <span>{bp.name}</span>
                    <span className="font-medium text-[var(--nec-text)]">${(bp.priceInCents / 100).toFixed(2)}</span>
                  </div>
                ))}
                {selectedBreakfasts.length > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Processing Fee (2.9% + $0.30)</span>
                      <span className="font-medium text-[var(--nec-text)]">${processingFee.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-[var(--nec-border)] pt-3 text-lg font-bold">
                      <span className="text-[var(--nec-text)]">Total</span>
                      <span className="text-[var(--nec-gold)]">${totalAmount.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <Button
                onClick={proceedToPayment}
                disabled={!isFormValid}
                className="mt-6 w-full bg-[var(--nec-pink)] py-6 text-lg font-bold text-[var(--nec-text)] shadow-[0_2px_16px_rgba(var(--nec-pink-rgb),0.18)]"
              >
                Proceed to Payment{isFormValid ? ` - $${totalAmount.toFixed(2)}` : ""}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div key={checkoutKey} className="nec-stripe-embed min-h-[400px] rounded-[1.8rem] p-4">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </div>
  )
}
