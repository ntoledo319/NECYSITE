"use client"

import Link from "next/link"
import { CheckCircle, Hotel, Home, Mail, ArrowRight } from "lucide-react"
import { HOTEL_BOOKING_URL, CONTACT_EMAIL, CONVENTION_DATES, CONVENTION_VENUE } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"
import { motion, useReducedMotion } from "framer-motion"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export default function BreakfastSuccessPage() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="min-h-screen-safe relative flex min-h-screen flex-col overflow-hidden bg-[var(--nec-navy)]">
      <PageArtAccents
        character="caterpillar"
        accentColor="var(--nec-orange)"
        variant="subtle"
        dividerVariant="potion"
      />

      <div
        className="nec-accent-bar fixed left-0 right-0 top-0 z-50 h-[2px]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--nec-orange) 20%, var(--nec-gold) 50%, var(--nec-cyan) 80%, transparent 100%)",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 py-16 pt-24">
        <motion.div
          className="mx-auto max-w-6xl"
          variants={shouldReduce ? undefined : staggerContainer}
          initial={shouldReduce ? undefined : "hidden"}
          animate="show"
        >
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <motion.div
              className="space-y-6"
              variants={shouldReduce ? undefined : fadeUp}
              transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
            >
              <div className="nec-success-card-orange overflow-hidden p-8 md:p-10">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                  <div className="space-y-5 text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start">
                      <div className="nec-success-icon-orange flex h-20 w-20 items-center justify-center rounded-full">
                        <CheckCircle className="h-10 w-10 text-[var(--nec-gold)]" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="nec-heading-shadow text-3xl font-black text-[var(--nec-text)]">
                        You&apos;re at the table.
                      </h1>
                      <p className="text-base font-semibold text-[var(--nec-gold)]">NECYPAA XXXVI · Hartford, CT</p>
                      <p className="text-sm text-[var(--nec-muted)]">
                        {CONVENTION_DATES} · {CONVENTION_VENUE}
                      </p>
                    </div>

                    <p className="text-sm leading-relaxed text-[var(--nec-text)]">
                      A receipt was sent to the email you provided. Breakfast is at the Hartford Marriott Downtown —
                      just check in with your name at the door.
                    </p>
                    <p className="text-sm italic leading-relaxed text-[var(--nec-muted)]">
                      Nothing beats starting the new year with good food and even better fellowship.
                    </p>
                  </div>

                  <div className="rounded-[1.6rem] border border-[rgba(var(--nec-orange-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.70)] p-6 text-left">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">Next Steps</p>

                    <div className="mt-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="nec-step-badge-orange mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                          1
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--nec-text)]">Register for the convention</p>
                          <p className="mt-0.5 text-xs text-[var(--nec-muted)]">
                            If you haven&apos;t already, secure your spot at NECYPAA XXXVI.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="nec-step-badge-orange mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                          2
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--nec-text)]">Book your hotel room</p>
                          <p className="mt-0.5 text-xs text-[var(--nec-muted)]">
                            Secure your room at the Hartford Marriott Downtown at our special group rate before the
                            block fills up.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="nec-step-badge-orange mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                          3
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--nec-text)]">Save the dates</p>
                          <p className="mt-0.5 text-xs text-[var(--nec-muted)]">
                            {CONVENTION_DATES}. Plan for travel on both ends — it&apos;s New Year&apos;s Eve!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.aside
              className="space-y-4 lg:sticky lg:top-28"
              variants={shouldReduce ? undefined : fadeUp}
              transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
            >
              <div className="nec-reg-help-card space-y-4 rounded-[1.6rem] p-5">
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link href="/register" className="btn-primary flex-1 !justify-center">
                    Register for Convention
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a
                    href={HOTEL_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex-1 !justify-center"
                  >
                    <Hotel className="h-4 w-4" aria-hidden="true" />
                    Book Hotel<span className="sr-only"> (opens in new tab)</span>
                  </a>
                </div>

                <div className="flex">
                  <Link href="/" className="btn-ghost flex-1 !justify-center">
                    <Home className="h-4 w-4" aria-hidden="true" />
                    Back to Home
                  </Link>
                </div>
              </div>

              <motion.div
                className="nec-reg-help-card space-y-2 rounded-[1.6rem] p-5 text-center"
                variants={shouldReduce ? undefined : fadeUp}
                transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
              >
                <p className="text-xs text-[var(--nec-muted)]">Questions about your breakfast tickets?</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--nec-cyan)] transition-opacity hover:opacity-75"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  {CONTACT_EMAIL}
                </a>
              </motion.div>

              <motion.div
                className="text-center"
                variants={shouldReduce ? undefined : fadeUp}
                transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
              >
                <Link
                  href="/breakfast"
                  className="inline-flex items-center gap-1 text-xs text-[var(--nec-muted)] transition-colors hover:opacity-80"
                >
                  Buy more breakfast tickets
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </motion.div>
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
