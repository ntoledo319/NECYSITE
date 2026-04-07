"use client"

import Link from "next/link"
import { CheckCircle, Hotel, Home, Mail, ArrowRight, UtensilsCrossed } from "lucide-react"
import { HOTEL_BOOKING_URL, CONTACT_EMAIL, CONVENTION_DATES, CONVENTION_VENUE } from "@/lib/constants"
import AddToCalendar from "@/components/add-to-calendar"
import ShareMenu from "@/components/share-menu"
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

export default function RegistrationSuccessPage() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="min-h-screen min-h-screen-safe flex flex-col relative overflow-hidden bg-[var(--nec-navy)]">
      <PageArtAccents character="cheshire-cat" accentColor="var(--nec-cyan)" variant="subtle" dividerVariant="compass" />

      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 nec-accent-bar"
        aria-hidden="true"
        style={{ background: "linear-gradient(90deg, transparent 0%, var(--nec-pink) 20%, var(--nec-cyan) 50%, var(--nec-orange) 80%, transparent 100%)" }}
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
              <div className="nec-success-card-purple overflow-hidden p-8 md:p-10">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                  <div className="text-center lg:text-left space-y-5">
                    <div className="flex justify-center lg:justify-start">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center nec-success-icon-purple">
                        <CheckCircle className="w-10 h-10 text-[var(--nec-cyan)]" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-3xl font-black text-[var(--nec-text)] nec-heading-shadow">
                        You&apos;re Registered!
                      </h1>
                      <p className="text-base font-semibold text-[var(--nec-cyan)]">
                        NECYPAA XXXVI · Hartford, CT
                      </p>
                      <p className="text-sm text-[var(--nec-muted)]">
                        {CONVENTION_DATES} · {CONVENTION_VENUE}
                      </p>
                    </div>

                    <p className="text-sm leading-relaxed text-[var(--nec-text)]">
                      Your registration is confirmed. A receipt was sent to the email you provided. Keep it
                      for your records — you&apos;ll need your registration confirmation at check-in.
                    </p>
                  </div>

                  <div className="rounded-[1.6rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.70)] p-6 text-left">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">Next Steps</p>

                    <div className="mt-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 nec-step-badge-purple">
                          1
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--nec-text)]">Book your hotel room</p>
                          <p className="text-xs mt-0.5 text-[var(--nec-muted)]">
                            Secure your room at the Hartford Marriott Downtown at our special group rate
                            before the block fills up.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 nec-step-badge-purple">
                          2
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--nec-text)]">Save the dates</p>
                          <p className="text-xs mt-0.5 text-[var(--nec-muted)]">
                            {CONVENTION_DATES}. Plan for travel on both ends — it&apos;s New Year&apos;s Eve!
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 nec-step-badge-purple">
                          3
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--nec-text)]">Stay in the loop</p>
                          <p className="text-xs mt-0.5 text-[var(--nec-muted)]">
                            Check back at this site for schedule, speakers, and event updates as we get
                            closer to convention.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.94fr_1.06fr]">
                <motion.div
                  className="nec-reg-accent-orange p-5 space-y-3"
                  variants={shouldReduce ? undefined : fadeUp}
                  transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center nec-step-badge-orange">
                      <UtensilsCrossed className="w-5 h-5 text-[var(--nec-orange)]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--nec-text)]">Don&apos;t forget breakfast!</p>
                      <p className="text-xs mt-0.5 text-[var(--nec-muted)]">
                        Start your New Year right with the NECYPAA XXXVI breakfast event.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/breakfast"
                    className="btn-ghost w-full !justify-center !text-sm border-[rgba(234,88,12,0.35)] text-[var(--nec-orange)]"
                  >
                    Get Breakfast Tickets
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </motion.div>

                <motion.div
                  className="nec-reg-help-card rounded-[1.6rem] p-5 space-y-4"
                  variants={shouldReduce ? undefined : fadeUp}
                  transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={HOTEL_BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex-1 !justify-center"
                    >
                      <Hotel className="w-4 h-4" aria-hidden="true" />
                      Book Hotel Now<span className="sr-only"> (opens in new tab)</span>
                    </a>
                    <AddToCalendar variant="ghost" className="flex-1 !justify-center" />
                  </div>

                  <div className="flex">
                    <Link
                      href="/"
                      className="btn-ghost flex-1 !justify-center"
                    >
                      <Home className="w-4 h-4" aria-hidden="true" />
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.aside
              className="space-y-4 lg:sticky lg:top-28"
              variants={shouldReduce ? undefined : fadeUp}
              transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
            >
              <div className="text-center">
                <ShareMenu
                  text="I just registered for NECYPAA XXXVI — Escaping the Mad Realm! Hartford, CT · New Year's Eve 2026"
                  url="https://www.necypaact.com/register"
                  triggerClassName="btn-ghost w-full !justify-center !text-sm"
                  triggerLabel="Tell Your Friends"
                />
              </div>

              <div className="nec-reg-help-card rounded-[1.6rem] p-5 text-center space-y-2">
                <p className="text-xs text-[var(--nec-muted)]">Questions or need help with your registration?</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-75 text-[var(--nec-cyan)]"
                >
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div className="text-center">
                <Link
                  href="/register"
                  className="text-xs transition-colors inline-flex items-center gap-1 hover:opacity-80 text-[var(--nec-muted)]"
                >
                  Register another person
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
