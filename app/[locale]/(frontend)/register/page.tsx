"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Image from "next/image"
import RegistrationForm from "@/components/registration-form"
import PolicyAgreement from "@/components/policy-agreement"
import RegistrationCheckout from "@/components/registration-checkout"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"
import { CONTACT_EMAIL, HOTEL_BOOKING_URL } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"

type Step = "info" | "policy" | "payment"

const STEP_COPY: Record<Step, { eyebrow: string; title: string; description: string }> = {
  info: {
    eyebrow: "Step One",
    title: "Tell us who’s coming.",
    description: "Start with the details we need to confirm the registration and support the attendee well.",
  },
  policy: {
    eyebrow: "Step Two",
    title: "Review the policy agreement.",
    description: "We keep this visible and explicit so expectations are clear before anyone arrives in Hartford.",
  },
  payment: {
    eyebrow: "Final Step",
    title: "Complete payment.",
    description: "Review the total, add optional items, and finish checkout without losing context.",
  },
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<Step>("info")
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [policyAgreements, setPolicyAgreements] = useState<PolicyAgreements | null>(null)
  const directionRef = useRef(1)
  const shouldReduce = useReducedMotion()

  const handleInfoComplete = (data: RegistrationData) => {
    setRegistrationData(data)
    directionRef.current = 1

    if (data.isScholarship) {
      setPolicyAgreements(null)
      setCurrentStep("payment")
      return
    }

    setCurrentStep("policy")
  }

  const handlePolicyComplete = (agreements: PolicyAgreements) => {
    setPolicyAgreements(agreements)
    directionRef.current = 1
    setCurrentStep("payment")
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [currentStep])

  const isScholarshipFlow = registrationData?.isScholarship === true

  const steps = useMemo(
    () =>
      isScholarshipFlow
        ? [
            { key: "info" as const, label: "Information", number: 1 },
            { key: "payment" as const, label: "Payment", number: 2 },
          ]
        : [
            { key: "info" as const, label: "Information", number: 1 },
            { key: "policy" as const, label: "Policy", number: 2 },
            { key: "payment" as const, label: "Payment", number: 3 },
          ],
    [isScholarshipFlow],
  )

  const activeStepMeta = STEP_COPY[currentStep]

  return (
    <div className="relative min-h-screen min-h-screen-safe bg-[var(--nec-navy)]">
      <PageArtAccents character="mad-hatter" accentColor="var(--nec-purple)" variant="subtle" dividerVariant="key" />
      <div className="absolute left-1/2 top-20 z-0 hidden h-[32rem] w-[26rem] -translate-x-1/2 opacity-[0.05] lg:block" aria-hidden="true">
        <Image
          src="/images/mad-hatter-portal.webp"
          alt=""
          width={416}
          height={624}
          sizes="416px"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 pb-12 pt-24">
        <div className="mx-auto max-w-6xl">
          <header className="max-w-3xl">
            <span className="section-badge page-enter-1">Registration</span>
            <h1 className="page-enter-2 mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl">
              Register for NECYPAA XXXVI.
            </h1>
            <p className="page-enter-3 mt-4 text-lg leading-8 text-[var(--nec-muted)]">
              Secure your spot at NECYPAA XXXVI in Hartford. A few quick steps and you&apos;re in.
            </p>
            <p className="page-enter-4 mt-5 max-w-xl text-base italic leading-7 text-[var(--nec-muted)]" style={{ opacity: 0.85 }}>
              &ldquo;You end up dancing even though &lsquo;you&rsquo;re not a dancer&rsquo; and the
              two hours goes by as if it was 30 minutes.&rdquo;
            </p>
          </header>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <aside className="space-y-6 lg:sticky lg:top-28">
              <div className="nec-card p-7">
                <p className="form-section-label">How It Works</p>
                <ol className="mt-5 space-y-4" aria-label="Registration steps">
                  {steps.map((step) => {
                    const active = currentStep === step.key
                    const completed = steps.findIndex((item) => item.key === currentStep) > steps.findIndex((item) => item.key === step.key)

                    return (
                      <li key={step.key} className="flex items-start gap-4">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            active ? "nec-step-active" : "nec-step-inactive"
                          }`}
                          aria-hidden="true"
                        >
                          {completed ? "✓" : step.number}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-semibold ${
                              active ? "text-[var(--nec-text)]" : "text-[var(--nec-muted)]"
                            }`}
                            {...(active ? { "aria-current": "step" as const } : {})}
                          >
                            {step.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-[var(--nec-muted)]">
                            {STEP_COPY[step.key].description}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>

              <div className="nec-reg-accent-purple p-6">
                <p className="form-section-label">Stay Nearby</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                  Hartford Marriott Downtown
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
                  Book the host hotel early and keep the whole weekend within walking distance of the
                  convention.
                </p>
                <a href={HOTEL_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-5">
                  Book Hotel
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </div>

              <div className="rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.74)] p-6">
                <p className="form-section-label">Need Help?</p>
                <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
                  Questions about registration, accessibility, or scholarship purchases can go straight
                  to{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[var(--nec-text)] underline underline-offset-4">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>
            </aside>

            <section className="nec-reg-card overflow-hidden" aria-label="Registration form and checkout">
              <div
                className="h-1 w-full"
                role="progressbar"
                aria-valuenow={steps.findIndex((s) => s.key === currentStep) + 1}
                aria-valuemin={1}
                aria-valuemax={steps.length}
                aria-label={`Step ${steps.findIndex((s) => s.key === currentStep) + 1} of ${steps.length}`}
              >
                <div
                  className="h-full transition-[width] duration-500 ease-out"
                  style={{
                    width: `${((steps.findIndex((s) => s.key === currentStep) + 1) / steps.length) * 100}%`,
                    background:
                      "linear-gradient(90deg, rgba(var(--nec-purple-rgb),0.5), rgba(var(--nec-pink-rgb),0.5))",
                  }}
                />
              </div>
              <div className="p-6 md:p-8 lg:p-10">
              <div className="mb-8 border-b border-[rgba(var(--nec-purple-rgb),0.10)] pb-6">
                <p className="form-section-label">{activeStepMeta.eyebrow}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                  {activeStepMeta.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--nec-muted)]">
                  {activeStepMeta.description}
                </p>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep}
                  initial={shouldReduce ? false : { opacity: 0, x: directionRef.current * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: directionRef.current * -40 }}
                  transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
                >
                  {currentStep === "info" && <RegistrationForm onComplete={handleInfoComplete} enableScholarship />}

                  {currentStep === "policy" && (
                    <PolicyAgreement
                      onComplete={handlePolicyComplete}
                      onBack={() => {
                        directionRef.current = -1
                        setCurrentStep("info")
                      }}
                    />
                  )}

                  {currentStep === "payment" && registrationData && (
                    <RegistrationCheckout
                      registrationData={registrationData}
                      policyAgreements={policyAgreements}
                      onBack={() => {
                        directionRef.current = -1
                        setCurrentStep(isScholarshipFlow ? "info" : "policy")
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
