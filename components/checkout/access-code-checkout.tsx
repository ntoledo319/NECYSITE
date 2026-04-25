"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitAccessCodeRegistration } from "@/actions/registration"
import { Button } from "@/components/ui/button"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"

interface AccessCodeCheckoutProps {
  registrationData: RegistrationData
  policyAgreements: PolicyAgreements | null
  onBack: () => void
}

export default function AccessCodeCheckout({ registrationData, policyAgreements, onBack }: AccessCodeCheckoutProps) {
  const router = useRouter()
  const [accessCodeError, setAccessCodeError] = useState<string | null>(null)
  const [isSubmittingCode, setIsSubmittingCode] = useState(false)
  const [accessCodeSuccess, setAccessCodeSuccess] = useState(false)

  const handleAccessCodeSubmit = async () => {
    if (!policyAgreements) {
      setAccessCodeError("Policy agreements are required. Please go back and complete the policy step.")
      return
    }

    setIsSubmittingCode(true)
    setAccessCodeError(null)

    try {
      const result = await submitAccessCodeRegistration(registrationData, policyAgreements)

      if (!result.success) {
        setAccessCodeError(result.error)
        return
      }

      setAccessCodeSuccess(true)
      router.push("/register/success?flow=access-code")
    } catch {
      setAccessCodeError(
        "Something went wrong. Please try again — and if it keeps happening, reach out to us at info@necypaa.org.",
      )
    } finally {
      setIsSubmittingCode(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button
        type="button"
        onClick={onBack}
        variant="outline"
        className="border-[var(--nec-border)] bg-transparent text-[var(--nec-text)]"
      >
        Back
      </Button>

      <div className="nec-reg-subcard space-y-4 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[var(--nec-text)]">Registration Summary</h3>
        <div className="space-y-2 text-[var(--nec-muted)]">
          <div className="flex justify-between">
            <span>Registration (Access Code)</span>
            <span className="font-medium text-[var(--nec-text)]">$0.00</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-[var(--nec-border)] pt-2 text-lg font-bold">
            <span className="text-[var(--nec-text)]">Total</span>
            <span className="text-[var(--nec-gold)]">$0.00</span>
          </div>
        </div>
        <p className="text-xs text-[var(--nec-muted)]">
          Your registration will be completed using your access code. No payment is required.
        </p>
      </div>

      <div aria-live="polite">
        {accessCodeError && (
          <div
            className="rounded-lg border border-red-700 bg-red-900/30 p-3 text-center text-sm text-red-300"
            role="alert"
            aria-live="assertive"
          >
            {accessCodeError}
          </div>
        )}
      </div>

      {accessCodeSuccess ? (
        <div className="py-4 text-center" role="status" aria-live="polite">
          <p className="font-semibold text-[var(--nec-text)]">Registration complete! Redirecting&hellip;</p>
        </div>
      ) : (
        <Button
          onClick={handleAccessCodeSubmit}
          disabled={isSubmittingCode}
          className="w-full bg-[var(--nec-pink)] py-6 text-lg font-bold text-[var(--nec-text)] shadow-[0_2px_16px_rgba(var(--nec-pink-rgb),0.18)]"
        >
          {isSubmittingCode ? "Completing Registration\u2026" : "Complete Registration"}
        </Button>
      )}
    </div>
  )
}
