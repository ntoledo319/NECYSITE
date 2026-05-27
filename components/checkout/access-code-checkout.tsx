"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { submitAccessCodeRegistration } from "@/actions/registration"
import { Button } from "@/components/ui/button"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"
import { CONTACT_EMAIL } from "@/lib/constants"

interface AccessCodeCheckoutProps {
  registrationData: RegistrationData
  policyAgreements: PolicyAgreements | null
  onBack: () => void
}

export default function AccessCodeCheckout({ registrationData, policyAgreements, onBack }: AccessCodeCheckoutProps) {
  const router = useRouter()
  const [accessCodeError, setAccessCodeError] = useState<{ message: string; correlationId?: string } | null>(null)
  const [isSubmittingCode, setIsSubmittingCode] = useState(false)

  const handleAccessCodeSubmit = async () => {
    if (!policyAgreements) {
      setAccessCodeError({
        message: "Policy agreements are required. Please go back and complete the policy step.",
      })
      return
    }

    setIsSubmittingCode(true)
    setAccessCodeError(null)

    try {
      const result = await submitAccessCodeRegistration(registrationData, policyAgreements)

      if (!result.success) {
        setAccessCodeError({
          message: result.error.userMessage,
          correlationId: result.error.correlationId,
        })
        return
      }

      router.push(`/register/success?flow=access-code&t=${encodeURIComponent(result.successToken)}`)
    } catch (err) {
      setAccessCodeError({
        message: `Something went wrong. Please try again — and if it keeps happening, email ${CONTACT_EMAIL}.${
          err instanceof Error && err.message ? ` Detail: ${err.message}` : ""
        }`,
      })
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
        <p className="text-xs text-[var(--nec-muted)]">
          Trouble redeeming?{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Access%20code%20issue`}
            className="font-semibold text-[var(--nec-text)] underline underline-offset-4"
          >
            Email {CONTACT_EMAIL}
          </a>{" "}
          and we&apos;ll handle it manually.
        </p>
      </div>

      <div aria-live="polite">
        {accessCodeError && (
          <div
            className="space-y-2 rounded-lg border border-red-700 bg-red-900/30 p-3 text-sm text-red-200"
            role="alert"
          >
            <p>{accessCodeError.message}</p>
            {accessCodeError.correlationId && (
              <p className="text-xs text-red-300">
                Reference for support: <code>{accessCodeError.correlationId}</code>
              </p>
            )}
          </div>
        )}
      </div>

      <Button
        onClick={handleAccessCodeSubmit}
        disabled={isSubmittingCode}
        className="w-full bg-[var(--nec-pink)] py-6 text-lg font-bold text-[var(--nec-text)] shadow-[0_2px_16px_rgba(var(--nec-pink-rgb),0.18)]"
      >
        {isSubmittingCode ? "Completing Registration…" : "Complete Registration"}
      </Button>
    </div>
  )
}
