"use client"

import Link from "next/link"
import { CheckCircle, Hotel, Home, Mail, ArrowRight, UtensilsCrossed } from "lucide-react"
import { HOTEL_BOOKING_URL, CONTACT_EMAIL, CONVENTION_DATES, CONVENTION_VENUE } from "@/lib/constants"
import AddToCalendar from "@/components/add-to-calendar"
import ShareMenu from "@/components/share-menu"
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
    <div className="min-h-screen min-h-screen-safe flex flex-col items-center justify-center px-4 py-16 bg-[var(--nec-navy)]">
      {/* Top accent bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 nec-accent-bar"
        aria-hidden="true"
        style={{ background: "linear-gradient(90deg, transparent 0%, var(--nec-pink) 20%, var(--nec-cyan) 50%, var(--nec-orange) 80%, transparent 100%)" }}
      />

      <motion.div
        className="w-full max-w-lg space-y-6"
        variants={shouldReduce ? undefined : staggerContainer}
        initial={shouldReduce ? undefined : "hidden"}
        animate="show"
      >
        {/* Success card */}
        <motion.div
          className="nec-success-card-purple p-8 md:p-10 text-center space-y-5"
          variants={shouldReduce ? undefined : fadeUp}
          transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
        >
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center nec-success-icon-purple">
              <CheckCircle className="w-10 h-10 text-[var(--nec-cyan)]" aria-hidden="true" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white nec-heading-shadow">
              You&apos;re Registered!
            </h1>
            <p className="text-base font-semibold text-[var(--nec-cyan)]">
              NECYPAA XXXVI · Hartford, CT
            </p>
            <p className="text-sm text-[var(--nec-muted)]">
              {CONVENTION_DATES} · {CONVENTION_VENUE}
            </p>
          </div>

          {/* Confirmation message */}
          <p className="text-sm leading-relaxed text-[var(--nec-text)]">
            Your registration is confirmed. A receipt was sent to the email you provided. Keep it
            for your records — you&apos;ll need your registration confirmation at check-in.
          </p>

          <hr className="border-[var(--nec-border)]" />

          {/* Next steps */}
          <div className="text-left space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">Next Steps</p>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 nec-step-badge-purple">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Book your hotel room</p>
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
                <p className="text-sm font-semibold text-white">Save the dates</p>
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
                <p className="text-sm font-semibold text-white">Stay in the loop</p>
                <p className="text-xs mt-0.5 text-[var(--nec-muted)]">
                  Check back at this site for schedule, speakers, and event updates as we get
                  closer to convention.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Breakfast cross-sell */}
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
              <p className="text-sm font-semibold text-white">Don&apos;t forget breakfast!</p>
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

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          variants={shouldReduce ? undefined : fadeUp}
          transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
        >
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
        </motion.div>
        <motion.div
          className="flex"
          variants={shouldReduce ? undefined : fadeUp}
          transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
        >
          <Link
            href="/"
            className="btn-ghost flex-1 !justify-center"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Link>
        </motion.div>

        {/* Share */}
        <motion.div
          className="text-center"
          variants={shouldReduce ? undefined : fadeUp}
          transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
        >
          <ShareMenu
            text="I just registered for NECYPAA XXXVI — Escaping the Mad Realm! Hartford, CT · New Year's Eve 2026"
            url="https://www.necypaact.com/register"
            triggerClassName="btn-ghost !text-sm"
            triggerLabel="Tell Your Friends"
          />
        </motion.div>

        {/* Help */}
        <motion.div
          className="nec-reg-help-card rounded-xl p-4 text-center space-y-1"
          variants={shouldReduce ? undefined : fadeUp}
          transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
        >
          <p className="text-xs text-[var(--nec-muted)]">Questions or need help with your registration?</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-75 text-[var(--nec-cyan)]"
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            {CONTACT_EMAIL}
          </a>
        </motion.div>

        {/* Back link */}
        <motion.div
          className="text-center"
          variants={shouldReduce ? undefined : fadeUp}
          transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
        >
          <Link
            href="/register"
            className="text-xs transition-colors inline-flex items-center gap-1 hover:opacity-80 text-[var(--nec-muted)]"
          >
            Register another person
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
