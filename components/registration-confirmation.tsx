"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { submitFreeRegistration } from "@/actions/free-registration"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"

interface RegistrationConfirmationProps {
  registrationData: RegistrationData
  policyAgreements: PolicyAgreements
  onBack: () => void
}

export default function RegistrationConfirmation({
  registrationData,
  policyAgreements,
  onBack,
}: RegistrationConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      await submitFreeRegistration(registrationData, policyAgreements)
      setIsComplete(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isComplete) {
    return (
      <div className="text-center space-y-6 py-8" role="status" aria-live="polite">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-[rgba(124,58,237,0.12)]">
          <svg
            className="w-8 h-8 text-[var(--nec-cyan)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[var(--nec-text)] mb-2">
            {"You're"} Registered!
          </h3>
          <p className="text-[var(--nec-text)]">
            Thank you, {registrationData.name}. Your registration for NECYPAA XXXVI has been confirmed.
          </p>
        </div>

        <div className="nec-reg-subcard rounded-2xl p-5 text-left max-w-sm mx-auto">
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-3 text-[var(--nec-muted)]">
            Registration Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--nec-muted)]">Name</span>
              <span className="text-[var(--nec-text)]">{registrationData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--nec-muted)]">Email</span>
              <span className="text-[var(--nec-text)]">{registrationData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--nec-muted)]">State</span>
              <span className="text-[var(--nec-text)]">{registrationData.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--nec-muted)]">Homegroup</span>
              <span className="text-[var(--nec-text)]">{registrationData.homegroup}</span>
            </div>
          </div>
        </div>

        {/* Hotel Booking CTA */}
        <div className="pt-4">
          <p className="text-sm mb-3 text-[var(--nec-muted)]">
            {"Don't"} forget to book your hotel room!
          </p>
          <a
            href={HOTEL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Book Hotel<span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-[var(--nec-text)] mb-1">
          Confirm Your Registration
        </h3>
        <p className="text-sm text-[var(--nec-muted)]">
          Please review your information before submitting.
        </p>
      </div>

      <div className="nec-reg-subcard rounded-2xl p-5">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--nec-muted)]">Name</span>
            <span className="text-[var(--nec-text)]">{registrationData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--nec-muted)]">Email</span>
            <span className="text-[var(--nec-text)]">{registrationData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--nec-muted)]">State</span>
            <span className="text-[var(--nec-text)]">{registrationData.state}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--nec-muted)]">Homegroup / Committee</span>
            <span className="text-[var(--nec-text)]">{registrationData.homegroup}</span>
          </div>
          {registrationData.accommodations && (
            <div className="flex justify-between">
              <span className="text-[var(--nec-muted)]">Accommodations</span>
              <span className="text-[var(--nec-text)]">{registrationData.accommodations}</span>
            </div>
          )}
          {registrationData.interpretationNeeded && (
            <div className="flex justify-between">
              <span className="text-[var(--nec-muted)]">Interpretation</span>
              <span className="text-[var(--nec-text)]">Needed</span>
            </div>
          )}
          {registrationData.mobilityAccessibility && (
            <div className="flex justify-between">
              <span className="text-[var(--nec-muted)]">Accessibility</span>
              <span className="text-[var(--nec-text)]">Needed</span>
            </div>
          )}
          {registrationData.willingToServe && (
            <div className="flex justify-between">
              <span className="text-[var(--nec-muted)]">Willing to Serve</span>
              <span className="text-[var(--nec-text)]">Yes</span>
            </div>
          )}
        </div>
      </div>

      <div aria-live="assertive">
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-lg p-3 text-center" role="alert">
            {error}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 text-[var(--nec-text)] bg-transparent border-[var(--nec-border)]"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 text-[var(--nec-text)] font-bold bg-[var(--nec-pink)] shadow-[0_2px_12px_rgba(192,38,211,0.25)]"
        >
          {isSubmitting ? "Submitting..." : "Complete Registration"}
        </Button>
      </div>
    </div>
  )
}
