"use client"

import { useState } from "react"
import RegistrationForm from "@/components/registration-form"
import PolicyAgreement from "@/components/policy-agreement"
import RegistrationConfirmation from "@/components/registration-confirmation"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"

type Step = "info" | "policy" | "confirm"

export default function FreeRegPage() {
  const [currentStep, setCurrentStep] = useState<Step>("info")
  const [registrationData, setRegistrationData] =
    useState<RegistrationData | null>(null)
  const [policyAgreements, setPolicyAgreements] =
    useState<PolicyAgreements | null>(null)

  const handleInfoComplete = (data: RegistrationData) => {
    setRegistrationData(data)
    setCurrentStep("policy")
  }

  const handlePolicyComplete = (agreements: PolicyAgreements) => {
    setPolicyAgreements(agreements)
    setCurrentStep("confirm")
  }

  const steps = [
    { key: "info" as const, label: "Information", number: 1 },
    { key: "policy" as const, label: "Policy", number: 2 },
    { key: "confirm" as const, label: "Confirm", number: 3 },
  ]

  return (
    <div className="min-h-screen min-h-screen-safe bg-[var(--nec-navy)] relative">
      <PageArtAccents character="cheshire-cat" accentColor="var(--nec-pink)" variant="subtle" dividerVariant="potion" />
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-[var(--nec-text)] mb-2 nec-heading-shadow">
              NECYPAA XXXVI Registration
            </h1>
            <p className="text-lg font-bold text-[var(--nec-gold)]">
              The Archway of Freedom
            </p>
          </div>

          {/* Progress Indicator */}
          <nav aria-label="Registration steps" className="flex justify-center mb-8">
            <ol className="flex items-center gap-3 list-none p-0 m-0">
              {steps.map((step, index) => (
                <li key={step.key} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === step.key ? "nec-step-active" : "nec-step-inactive"}`}
                      aria-hidden="true"
                    >
                      {step.number}
                    </div>
                    <span
                      className={`text-sm font-medium ${currentStep === step.key ? "text-[var(--nec-text)]" : "text-[var(--nec-muted)]"}`}
                      {...(currentStep === step.key ? { "aria-current": "step" as const } : {})}
                    >
                      {step.label}
                      <span className="sr-only"> (step {step.number} of {steps.length})</span>
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-0.5 rounded-full bg-[var(--nec-border)]" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Content */}
          <div className="nec-reg-card p-6 md:p-8">
            {currentStep === "info" && (
              <RegistrationForm onComplete={handleInfoComplete} />
            )}

            {currentStep === "policy" && (
              <PolicyAgreement
                onComplete={handlePolicyComplete}
                onBack={() => setCurrentStep("info")}
              />
            )}

            {currentStep === "confirm" &&
              registrationData &&
              policyAgreements && (
                <RegistrationConfirmation
                  registrationData={registrationData}
                  policyAgreements={policyAgreements}
                  onBack={() => setCurrentStep("policy")}
                />
              )}
          </div>

          {/* Hotel Booking CTA */}
          <div className="mt-8 nec-reg-accent-purple p-6 text-center">
            <h2 className="text-xl font-bold text-[var(--nec-text)] mb-2 nec-heading-shadow-sm">
              Need a Place to Stay?
            </h2>
            <p className="text-sm text-[var(--nec-muted)] mb-4">
              Book your room at our host hotel with the special NECYPAA rate!
            </p>
            <a
              href={HOTEL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex"
            >
              Book Hotel<span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
