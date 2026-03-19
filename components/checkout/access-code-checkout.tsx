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
      router.push("/register/success")
    } catch {
      setAccessCodeError("Something went wrong. Please try again — and if it keeps happening, reach out to us at info@necypaa.org.")
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
        className="text-white bg-transparent border-[var(--nec-border)]"
      >
        Back
      </Button>

      <div className="nec-card rounded-2xl p-6 border border-[var(--nec-border)] space-y-4 bg-[rgba(26,16,48,0.6)]">
        <h3 className="text-lg font-semibold text-white">Registration Summary</h3>
        <div className="space-y-2 text-gray-300">
          <div className="flex justify-between">
            <span>Registration (Access Code)</span>
            <span className="font-medium text-white">$0.00</span>
          </div>
          <div className="border-t border-[var(--nec-border)] pt-2 mt-2 flex justify-between text-lg font-bold">
            <span className="text-white">Total</span>
            <span className="text-[var(--nec-gold)]">$0.00</span>
          </div>
        </div>
        <p className="text-xs text-gray-300">
          Your registration will be completed using your access code. No payment is required.
        </p>
      </div>

      <div aria-live="polite">
        {accessCodeError && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-lg p-3 text-center" role="alert">
            {accessCodeError}
          </div>
        )}
      </div>

      {accessCodeSuccess ? (
        <div className="text-center py-4" role="status" aria-live="polite">
          <p className="text-white font-semibold">Registration complete! Redirecting&hellip;</p>
        </div>
      ) : (
        <Button
          onClick={handleAccessCodeSubmit}
          disabled={isSubmittingCode}
          className="w-full text-white py-6 text-lg font-bold bg-[var(--nec-pink)] shadow-[0_2px_16px_rgba(192,38,211,0.3)]"
        >
          {isSubmittingCode ? "Completing Registration\u2026" : "Complete Registration"}
        </Button>
      )}
    </div>
  )
}
