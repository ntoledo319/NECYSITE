"use client"

import { useState } from "react"
import RegistrationForm from "@/components/registration-form"
import PolicyAgreement from "@/components/policy-agreement"
import RegistrationConfirmation from "@/components/registration-confirmation"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"

type Step = "info" | "policy" | "confirm"

const stepCopy: Record<Step, string> = {
  info: "Tell us who you are and what you need for the weekend.",
  policy: "Review the safety, conduct, and accommodation policies before finishing.",
  confirm: "Look everything over once, then lock it in.",
}

export default function FreeRegPage() {
  const [currentStep, setCurrentStep] = useState<Step>("info")
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [policyAgreements, setPolicyAgreements] = useState<PolicyAgreements | null>(null)

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
    <div className="relative min-h-screen min-h-screen-safe bg-[var(--nec-navy)]">
      <PageArtAccents character="cheshire-cat" accentColor="var(--nec-pink)" variant="subtle" dividerVariant="potion" />

      <div className="relative z-10 container mx-auto px-4 pb-12 pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
              <div className="rounded-[1.95rem] border border-[rgba(var(--nec-pink-rgb),0.12)] bg-[linear-gradient(135deg,rgba(var(--nec-card-rgb),0.9),rgba(var(--nec-pink-rgb),0.05))] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
                <span className="section-badge inline-flex">Registration</span>
                <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)]">
                  The Archway of Freedom.
                </h1>
                <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
                  This route is for the free registration flow. It should still feel intentional, invitational,
                  and clear enough that nobody wonders whether they are in the right place.
                </p>
              </div>

              <nav aria-label="Registration steps" className="rounded-[1.75rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.86)] px-5 py-5 shadow-[0_18px_40px_rgba(44,24,16,0.08)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                  Step by step
                </p>
                <ol className="mt-4 space-y-4">
                  {steps.map((step) => (
                    <li key={step.key} className="flex gap-3">
                      <div
                        className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          currentStep === step.key ? "nec-step-active" : "nec-step-inactive"
                        }`}
                        aria-hidden="true"
                      >
                        {step.number}
                      </div>
                      <div>
                        <p
                          className={currentStep === step.key ? "font-semibold text-[var(--nec-text)]" : "font-medium text-[var(--nec-muted)]"}
                          {...(currentStep === step.key ? { "aria-current": "step" as const } : {})}
                        >
                          {step.label}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[var(--nec-muted)]">
                          {stepCopy[step.key]}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="rounded-[1.75rem] border border-[rgba(var(--nec-gold-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.84)] px-5 py-5 shadow-[0_18px_40px_rgba(44,24,16,0.08)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                  One smart next move
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--nec-muted)]">
                  Once your registration is handled, book the hotel while the room block still gives you options.
                </p>
                <a href={HOTEL_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-5 inline-flex">
                  Book Hotel<span className="sr-only"> (opens in new tab)</span>
                </a>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.84)] px-5 py-4 shadow-[0_18px_40px_rgba(44,24,16,0.08)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-pink)]">
                  Current step
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--nec-text)]">
                  {steps.find((step) => step.key === currentStep)?.label}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--nec-muted)]">{stepCopy[currentStep]}</p>
              </div>

              <div className="nec-reg-card p-6 md:p-8">
                {currentStep === "info" && <RegistrationForm onComplete={handleInfoComplete} />}

                {currentStep === "policy" && (
                  <PolicyAgreement onComplete={handlePolicyComplete} onBack={() => setCurrentStep("info")} />
                )}

                {currentStep === "confirm" && registrationData && policyAgreements && (
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
    </div>
  )
}
