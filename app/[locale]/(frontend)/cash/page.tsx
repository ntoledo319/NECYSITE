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
    <div className="min-h-screen min-h-screen-safe bg-[var(--nec-navy)] relative overflow-hidden">
      <PageArtAccents character="cheshire-cat" accentColor="var(--nec-pink)" variant="subtle" dividerVariant="potion" />
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <aside className="space-y-6 lg:sticky lg:top-28">
              <div className="max-w-3xl">
                <h1 className="page-enter-1 text-3xl md:text-4xl font-black text-[var(--nec-text)] mb-2 nec-heading-shadow">
                  NECYPAA XXXVI Registration
                </h1>
                <p className="page-enter-2 text-lg font-bold text-[var(--nec-gold)]">
                  The Archway of Freedom
                </p>
              </div>

              <div className="rounded-[1.85rem] border border-[rgba(var(--nec-pink-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-pink-rgb),0.08),rgba(var(--nec-card-rgb),0.92))] p-6 shadow-[0_20px_48px_rgba(44,24,16,0.08)]">
                <nav aria-label="Registration steps">
                  <ol className="space-y-4 list-none p-0 m-0">
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
                        {index < steps.length - 1 && <div className="flex-1 h-0.5 rounded-full bg-[var(--nec-border)]" aria-hidden="true" />}
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              <div className="nec-reg-accent-purple p-6 text-center">
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
            </aside>

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
          </div>
        </div>
      </div>
    </div>
  )
}
