"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Image from "next/image"
import RegistrationForm from "@/components/registration-form"
import PolicyAgreement from "@/components/policy-agreement"
import RegistrationCheckout from "@/components/registration-checkout"
import type { RegistrationData, PolicyAgreements } from "@/lib/types"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"

type Step = "info" | "policy" | "payment"

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
  const steps = isScholarshipFlow
    ? [
        { key: "info" as const, label: "Information", number: 1 },
        { key: "payment" as const, label: "Payment", number: 2 },
      ]
    : [
        { key: "info" as const, label: "Information", number: 1 },
        { key: "policy" as const, label: "Policy", number: 2 },
        { key: "payment" as const, label: "Payment", number: 3 },
      ]

  return (
    <div className="min-h-screen min-h-screen-safe relative bg-[var(--nec-navy)]">
      <PageArtAccents character="mad-hatter" accentColor="var(--nec-purple)" variant="subtle" dividerVariant="key" />
      {/* Mad Hatter portal watermark */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-64 h-96 opacity-[0.04] pointer-events-none z-0" aria-hidden="true">
        <Image src="/images/mad-hatter-portal.jpg" alt="" width={256} height={384} sizes="256px" className="w-full h-full object-contain" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl md:text-4xl font-black text-white mb-2"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            >
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
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      aria-hidden="true"
                      style={{
                        background: currentStep === step.key ? "var(--nec-pink)" : "rgba(45,31,78,0.8)",
                        color: currentStep === step.key ? "white" : "var(--nec-muted)",
                        border: currentStep === step.key ? "1px solid rgba(192,38,211,0.5)" : "1px solid var(--nec-border)",
                        boxShadow: currentStep === step.key ? "0 0 12px rgba(192,38,211,0.2)" : "none",
                      }}
                    >
                      {step.number}
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: currentStep === step.key ? "white" : "var(--nec-muted)" }}
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
          <div
            className="rounded-2xl p-6 md:p-8 backdrop-blur-sm overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(26,16,48,0.9) 0%, rgba(15,10,30,0.95) 100%)",
              border: "1px solid var(--nec-border)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
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
                  <PolicyAgreement onComplete={handlePolicyComplete} onBack={() => { directionRef.current = -1; setCurrentStep("info") }} />
                )}

                {currentStep === "payment" && registrationData && (
                  <RegistrationCheckout
                    registrationData={registrationData}
                    policyAgreements={policyAgreements}
                    onBack={() => { directionRef.current = -1; setCurrentStep(isScholarshipFlow ? "info" : "policy") }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Hotel Booking CTA */}
          <div
            className="mt-8 rounded-2xl p-6 text-center backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(26,16,48,0.7) 100%)",
              border: "1px solid rgba(124,58,237,0.18)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <h2
              className="text-xl font-bold text-white mb-2"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
            >
              Need a Place to Stay?
            </h2>
            <p className="text-sm text-gray-300 mb-4">
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
