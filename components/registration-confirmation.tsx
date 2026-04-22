"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { submitFreeRegistration } from "@/actions/free-registration"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import {
  REGISTRATION_PRODUCTS,
  formatUsdFromCents,
  parseUsdInputToCents,
} from "@/lib/registration-products"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"
import ScholarshipConfigurator from "@/components/checkout/scholarship-configurator"

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
  const [scholarshipQuantity, setScholarshipQuantity] = useState(1)
  const [useCustomScholarshipAmount, setUseCustomScholarshipAmount] = useState(false)
  const [scholarshipAmountInput, setScholarshipAmountInput] = useState("40.00")

  const isScholarshipFlow = registrationData.isScholarship === true
  const registrationProduct = REGISTRATION_PRODUCTS.find((product) => product.id === "necypaa-xxxvi-registration")
  const defaultScholarshipUnitAmountCents = registrationProduct?.priceInCents ?? 0

  useEffect(() => {
    setScholarshipAmountInput(formatUsdFromCents(defaultScholarshipUnitAmountCents))
  }, [defaultScholarshipUnitAmountCents])

  const scholarshipUnitAmountCents = isScholarshipFlow
    ? useCustomScholarshipAmount
      ? parseUsdInputToCents(scholarshipAmountInput)
      : defaultScholarshipUnitAmountCents
    : null
  const scholarshipUnitAmountForSubmission = isScholarshipFlow && useCustomScholarshipAmount
    ? scholarshipUnitAmountCents
    : null
  const scholarshipAmountError =
    isScholarshipFlow && useCustomScholarshipAmount && scholarshipUnitAmountCents == null
      ? "Enter a valid dollar amount, such as 40 or 40.00."
      : null
  const scholarshipTotalCents =
    isScholarshipFlow && scholarshipUnitAmountCents != null
      ? scholarshipUnitAmountCents * scholarshipQuantity
      : null
  const submitDisabled = isSubmitting || (isScholarshipFlow && scholarshipUnitAmountCents == null)

  const toggleCustomScholarshipAmount = () => {
    setUseCustomScholarshipAmount((value) => {
      const next = !value
      if (next && parseUsdInputToCents(scholarshipAmountInput) == null) {
        setScholarshipAmountInput(formatUsdFromCents(defaultScholarshipUnitAmountCents))
      }
      return next
    })
    setError(null)
  }

  const normalizeScholarshipAmountInput = () => {
    const parsed = parseUsdInputToCents(scholarshipAmountInput)
    if (parsed != null) {
      setScholarshipAmountInput(formatUsdFromCents(parsed))
    }
  }

  const handleSubmit = async () => {
    if (isScholarshipFlow && scholarshipUnitAmountCents == null) {
      setError("Enter a valid scholarship amount before saving this record.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await submitFreeRegistration(
        registrationData,
        policyAgreements,
        isScholarshipFlow ? scholarshipQuantity : 0,
        scholarshipUnitAmountForSubmission ?? undefined,
      )
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
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-[rgba(var(--nec-purple-rgb),0.08)]">
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
            {isScholarshipFlow ? "Cash Scholarship Saved" : "You're Registered!"}
          </h3>
          <p className="text-[var(--nec-text)]">
            {isScholarshipFlow
              ? `Thank you, ${registrationData.name}. Your cash scholarship${registrationData.scholarshipRecipientName ? ` for ${registrationData.scholarshipRecipientName}` : ""} has been recorded for NECYPAA XXXVI.`
              : `Thank you, ${registrationData.name}. Your registration for NECYPAA XXXVI has been confirmed.`}
          </p>
        </div>

        <div className="nec-reg-subcard rounded-2xl p-5 text-left max-w-sm mx-auto">
          <h4 className="text-sm font-semibold uppercase tracking-wide mb-3 text-[var(--nec-muted)]">
            {isScholarshipFlow ? "Scholarship Details" : "Registration Details"}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[var(--nec-muted)]">{isScholarshipFlow ? "Purchaser" : "Name"}</span>
              <span className="text-[var(--nec-text)] text-right">{registrationData.name}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--nec-muted)]">Email</span>
              <span className="text-[var(--nec-text)] text-right">{registrationData.email}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--nec-muted)]">State</span>
              <span className="text-[var(--nec-text)] text-right">{registrationData.state}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--nec-muted)]">Homegroup</span>
              <span className="text-[var(--nec-text)] text-right">{registrationData.homegroup}</span>
            </div>
            {isScholarshipFlow && registrationData.scholarshipRecipientName && (
              <div className="flex justify-between gap-4">
                <span className="text-[var(--nec-muted)]">Recipient</span>
                <span className="text-[var(--nec-text)] text-right">{registrationData.scholarshipRecipientName}</span>
              </div>
            )}
            {isScholarshipFlow && registrationData.scholarshipRecipientEmail && (
              <div className="flex justify-between gap-4">
                <span className="text-[var(--nec-muted)]">Recipient Email</span>
                <span className="text-[var(--nec-text)] text-right">{registrationData.scholarshipRecipientEmail}</span>
              </div>
            )}
            {isScholarshipFlow && scholarshipUnitAmountCents != null && (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--nec-muted)]">Quantity</span>
                  <span className="text-[var(--nec-text)] text-right">{scholarshipQuantity}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--nec-muted)]">Amount Each</span>
                  <span className="text-[var(--nec-text)] text-right">${formatUsdFromCents(scholarshipUnitAmountCents)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--nec-muted)]">Total</span>
                  <span className="text-[var(--nec-text)] text-right">
                    ${scholarshipTotalCents != null ? formatUsdFromCents(scholarshipTotalCents) : "0.00"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm mb-3 text-[var(--nec-muted)]">Don't forget to book your hotel room!</p>
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
          {isScholarshipFlow ? "Confirm Cash Scholarship" : "Confirm Your Registration"}
        </h3>
        <p className="text-sm text-[var(--nec-muted)]">
          {isScholarshipFlow
            ? "Review the details below, then confirm the amount you want recorded for this scholarship."
            : "Please review your information before submitting."}
        </p>
      </div>

      <div className="nec-reg-subcard rounded-2xl p-5">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-[var(--nec-muted)]">{isScholarshipFlow ? "Purchaser" : "Name"}</span>
            <span className="text-[var(--nec-text)] text-right">{registrationData.name}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[var(--nec-muted)]">Email</span>
            <span className="text-[var(--nec-text)] text-right">{registrationData.email}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[var(--nec-muted)]">State</span>
            <span className="text-[var(--nec-text)] text-right">{registrationData.state}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[var(--nec-muted)]">Homegroup / Committee</span>
            <span className="text-[var(--nec-text)] text-right">{registrationData.homegroup}</span>
          </div>
          {isScholarshipFlow && registrationData.scholarshipRecipientName && (
            <div className="flex justify-between gap-4">
              <span className="text-[var(--nec-muted)]">Recipient</span>
              <span className="text-[var(--nec-text)] text-right">{registrationData.scholarshipRecipientName}</span>
            </div>
          )}
          {isScholarshipFlow && registrationData.scholarshipRecipientEmail && (
            <div className="flex justify-between gap-4">
              <span className="text-[var(--nec-muted)]">Recipient Email</span>
              <span className="text-[var(--nec-text)] text-right">{registrationData.scholarshipRecipientEmail}</span>
            </div>
          )}
          {!isScholarshipFlow && registrationData.accommodations && (
            <div className="flex justify-between gap-4">
              <span className="text-[var(--nec-muted)]">Accommodations</span>
              <span className="text-[var(--nec-text)] text-right">{registrationData.accommodations}</span>
            </div>
          )}
          {!isScholarshipFlow && registrationData.interpretationNeeded && (
            <div className="flex justify-between gap-4">
              <span className="text-[var(--nec-muted)]">Interpretation</span>
              <span className="text-[var(--nec-text)] text-right">Needed</span>
            </div>
          )}
          {!isScholarshipFlow && registrationData.mobilityAccessibility && (
            <div className="flex justify-between gap-4">
              <span className="text-[var(--nec-muted)]">Accessibility</span>
              <span className="text-[var(--nec-text)] text-right">Needed</span>
            </div>
          )}
          {!isScholarshipFlow && registrationData.willingToServe && (
            <div className="flex justify-between gap-4">
              <span className="text-[var(--nec-muted)]">Willing to Serve</span>
              <span className="text-[var(--nec-text)] text-right">Yes</span>
            </div>
          )}
        </div>
      </div>

      {isScholarshipFlow && (
        <>
          <ScholarshipConfigurator
            quantity={scholarshipQuantity}
            defaultUnitAmountCents={defaultScholarshipUnitAmountCents}
            useCustomAmount={useCustomScholarshipAmount}
            amountInput={scholarshipAmountInput}
            amountError={scholarshipAmountError}
            currentUnitAmountCents={scholarshipUnitAmountCents}
            currentTotalCents={scholarshipTotalCents}
            onDecreaseQuantity={() => {
              setScholarshipQuantity((value) => Math.max(1, value - 1))
              setError(null)
            }}
            onIncreaseQuantity={() => {
              setScholarshipQuantity((value) => Math.min(20, value + 1))
              setError(null)
            }}
            onToggleCustomAmount={toggleCustomScholarshipAmount}
            onAmountInputChange={(value) => {
              setScholarshipAmountInput(value)
              setError(null)
            }}
            onAmountInputBlur={normalizeScholarshipAmountInput}
            title="Cash Scholarship Amount"
            description="This records the amount you want tied to the scholarship in Stripe, while keeping the default synced to the current pre-registration price."
          />

          <div className="nec-reg-subcard rounded-2xl p-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[var(--nec-muted)]">Amount Each</span>
                <span className="text-[var(--nec-text)] text-right">
                  {scholarshipUnitAmountCents != null
                    ? `$${formatUsdFromCents(scholarshipUnitAmountCents)}`
                    : "Add amount"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[var(--nec-muted)]">Quantity</span>
                <span className="text-[var(--nec-text)] text-right">{scholarshipQuantity}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-[var(--nec-border)] pt-3 text-base font-semibold">
                <span className="text-[var(--nec-text)]">Total Recorded</span>
                <span className="text-[var(--nec-gold)] text-right">
                  {scholarshipTotalCents != null
                    ? `$${formatUsdFromCents(scholarshipTotalCents)}`
                    : "Add amount"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      <div aria-live="assertive">
        {error && (
          <div
            className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-lg p-3 text-center"
            role="alert"
            aria-live="assertive"
          >
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
          disabled={submitDisabled}
          className="flex-1 text-[var(--nec-text)] font-bold bg-[var(--nec-pink)] shadow-[0_2px_12px_rgba(var(--nec-pink-rgb),0.15)]"
        >
          {isSubmitting
            ? "Submitting..."
            : isScholarshipFlow
              ? "Save Cash Scholarship"
              : "Complete Registration"}
        </Button>
      </div>
    </div>
  )
}
