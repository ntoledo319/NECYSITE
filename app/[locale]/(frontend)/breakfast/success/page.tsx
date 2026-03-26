"use client"

import Link from "next/link"
import { CheckCircle, Hotel, Home, Mail, ArrowRight } from "lucide-react"
import { HOTEL_BOOKING_URL, CONTACT_EMAIL, CONVENTION_DATES, CONVENTION_VENUE } from "@/lib/constants"
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
    <div className="min-h-screen min-h-screen-safe flex flex-col items-center justify-center px-4 py-16 bg-[var(--nec-navy)]">
      {/* Top accent bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 nec-accent-bar"
        aria-hidden="true"
        style={{ background: "linear-gradient(90deg, transparent 0%, var(--nec-orange) 20%, var(--nec-gold) 50%, var(--nec-cyan) 80%, transparent 100%)" }}
      />

      <motion.div
        className="w-full max-w-lg space-y-6"
        variants={shouldReduce ? undefined : staggerContainer}
        initial={shouldReduce ? undefined : "hidden"}
        animate="show"
      >
        {/* Success card */}
        <motion.div
          className="nec-success-card-orange p-8 md:p-10 text-center space-y-5"
          variants={shouldReduce ? undefined : fadeUp}
          transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
        >
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center nec-success-icon-orange">
              <CheckCircle className="w-10 h-10 text-[var(--nec-gold)]" aria-hidden="true" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white nec-heading-shadow">
              Breakfast Tickets Confirmed!
            </h1>
            <p className="text-base font-semibold text-[var(--nec-gold)]">
              NECYPAA XXXVI · Hartford, CT
            </p>
            <p className="text-sm text-[var(--nec-muted)]">
              {CONVENTION_DATES} · {CONVENTION_VENUE}
            </p>
          </div>

          {/* Confirmation message */}
          <p className="text-sm leading-relaxed text-[var(--nec-text)]">
            Your breakfast tickets are confirmed. A receipt was sent to the email you provided.
            Breakfast will be served at the Hartford Marriott Downtown — no need to print anything,
            just check in with your name at the door.
          </p>

          <hr className="border-[var(--nec-border)]" />

          {/* Next steps */}
          <div className="text-left space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">Next Steps</p>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 nec-step-badge-orange">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Register for the convention</p>
                <p className="text-xs mt-0.5 text-[var(--nec-muted)]">
                  If you haven&apos;t already, secure your spot at NECYPAA XXXVI for just $40.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 nec-step-badge-orange">
                2
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
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 nec-step-badge-orange">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Save the dates</p>
                <p className="text-xs mt-0.5 text-[var(--nec-muted)]">
                  {CONVENTION_DATES}. Plan for travel on both ends — it&apos;s New Year&apos;s Eve!
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          variants={shouldReduce ? undefined : fadeUp}
          transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
        >
          <Link
            href="/register"
            className="btn-primary flex-1 !justify-center"
          >
            Register for Convention
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <a
            href={HOTEL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 !justify-center"
          >
            <Hotel className="w-4 h-4" aria-hidden="true" />
            Book Hotel<span className="sr-only"> (opens in new tab)</span>
          </a>
        </motion.div>

        {/* Extra actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
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

        {/* Help */}
        <motion.div
          className="nec-reg-help-card rounded-xl p-4 text-center space-y-1"
          variants={shouldReduce ? undefined : fadeUp}
          transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
        >
          <p className="text-xs text-[var(--nec-muted)]">Questions about your breakfast tickets?</p>
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
            href="/breakfast"
            className="text-xs transition-colors inline-flex items-center gap-1 hover:opacity-80 text-[var(--nec-muted)]"
          >
            Buy more breakfast tickets
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
