"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { submitFreeRegistration } from "@/app/actions/free-registration"
import type { PolicyAgreements } from "@/components/policy-agreement"

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
      <div className="text-center space-y-6 py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(0,212,232,0.12)" }}>
          <svg
            className="w-8 h-8" style={{ color: "var(--nec-cyan)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
          <h3 className="text-2xl font-bold text-white mb-2">
            {"You're"} Registered!
          </h3>
          <p className="text-gray-300">
            Thank you, {registrationData.name}. Your registration for NECYPAA XXXVI has been confirmed.
          </p>
        </div>

        <div className="rounded-2xl p-5 border text-left max-w-sm mx-auto" style={{ background: "rgba(26,34,54,0.6)", borderColor: "var(--nec-border)" }}>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Registration Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Name</span>
              <span className="text-white">{registrationData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email</span>
              <span className="text-white">{registrationData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">State</span>
              <span className="text-white">{registrationData.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Homegroup</span>
              <span className="text-white">{registrationData.homegroup}</span>
            </div>
          </div>
        </div>

        {/* Hotel Booking CTA */}
        <div className="pt-4">
          <p className="text-gray-400 text-sm mb-3">
            {"Don't"} forget to book your hotel room!
          </p>
          <a
            href="https://www.marriott.com/event-reservations/reservation-link.mi?id=1770049957031&key=GRP&app=resvlink"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Book Hotel
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-1">
          Confirm Your Registration
        </h3>
        <p className="text-gray-400 text-sm">
          Please review your information before submitting.
        </p>
      </div>

      <div className="rounded-2xl p-5 border" style={{ background: "rgba(26,34,54,0.6)", borderColor: "var(--nec-border)" }}>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Name</span>
            <span className="text-white">{registrationData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Email</span>
            <span className="text-white">{registrationData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">State</span>
            <span className="text-white">{registrationData.state}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Homegroup / Committee</span>
            <span className="text-white">{registrationData.homegroup}</span>
          </div>
          {registrationData.accommodations && (
            <div className="flex justify-between">
              <span className="text-gray-400">Accommodations</span>
              <span className="text-white">{registrationData.accommodations}</span>
            </div>
          )}
          {registrationData.interpretationNeeded && (
            <div className="flex justify-between">
              <span className="text-gray-400">Interpretation</span>
              <span className="text-white">Needed</span>
            </div>
          )}
          {registrationData.handicapAccessibility && (
            <div className="flex justify-between">
              <span className="text-gray-400">Accessibility</span>
              <span className="text-white">Needed</span>
            </div>
          )}
          {registrationData.willingToServe && (
            <div className="flex justify-between">
              <span className="text-gray-400">Willing to Serve</span>
              <span className="text-white">Yes</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-lg p-3 text-center">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 text-white bg-transparent" style={{ borderColor: "var(--nec-border)" }}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 text-white font-bold" style={{ background: "var(--nec-pink)", boxShadow: "0 2px 12px rgba(232,0,110,0.25)" }}
        >
          {isSubmitting ? "Submitting..." : "Complete Registration"}
        </Button>
      </div>
    </div>
  )
}
