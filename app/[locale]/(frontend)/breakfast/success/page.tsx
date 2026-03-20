"use client"

import Link from "next/link"
import { CheckCircle, Hotel, Home, Mail, ArrowRight } from "lucide-react"
import { HOTEL_BOOKING_URL, CONTACT_EMAIL, CONVENTION_DATES, CONVENTION_VENUE } from "@/lib/constants"

export default function BreakfastSuccessPage() {
  return (
    <div
      className="min-h-screen min-h-screen-safe flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--nec-navy)" }}
    >
      {/* Top accent bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-50"
        aria-hidden="true"
        style={{
          background: "linear-gradient(90deg, transparent 0%, var(--nec-orange) 20%, var(--nec-gold) 50%, var(--nec-cyan) 80%, transparent 100%)",
          boxShadow: "0 0 12px rgba(249,115,22,0.3), 0 0 24px rgba(234,179,8,0.15)",
        }}
      />

      <div className="w-full max-w-lg space-y-6">
        {/* Success card */}
        <div
          className="rounded-2xl p-8 md:p-10 text-center space-y-5 backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(26,16,48,0.7) 50%, rgba(234,179,8,0.05) 100%)",
            border: "1px solid rgba(249,115,22,0.20)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(249,115,22,0.10)",
                border: "2px solid rgba(249,115,22,0.35)",
                boxShadow: "0 0 24px rgba(249,115,22,0.15), 0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              <CheckCircle
                className="w-10 h-10"
                style={{ color: "var(--nec-gold)" }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1
              className="text-3xl font-black text-white"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            >
              Breakfast Tickets Confirmed!
            </h1>
            <p
              className="text-base font-semibold"
              style={{ color: "var(--nec-gold)" }}
            >
              NECYPAA XXXVI · Hartford, CT
            </p>
            <p className="text-sm" style={{ color: "var(--nec-muted)" }}>
              {CONVENTION_DATES} · {CONVENTION_VENUE}
            </p>
          </div>

          {/* Confirmation message */}
          <p className="text-sm leading-relaxed" style={{ color: "var(--nec-text, #d1d5db)" }}>
            Your breakfast tickets are confirmed. A receipt was sent to the email you provided.
            Breakfast will be served at the Hartford Marriott Downtown — no need to print anything,
            just check in with your name at the door.
          </p>

          <hr style={{ borderColor: "var(--nec-border)" }} />

          {/* Next steps */}
          <div className="text-left space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--nec-muted)" }}>Next Steps</p>

            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: "rgba(249,115,22,0.12)", color: "var(--nec-orange)", border: "1px solid rgba(249,115,22,0.25)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
              >
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Register for the convention</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--nec-muted)" }}>
                  If you haven&apos;t already, secure your spot at NECYPAA XXXVI for just $40.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: "rgba(249,115,22,0.12)", color: "var(--nec-orange)", border: "1px solid rgba(249,115,22,0.25)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
              >
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Book your hotel room</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--nec-muted)" }}>
                  Secure your room at the Hartford Marriott Downtown at our special group rate
                  before the block fills up.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: "rgba(249,115,22,0.12)", color: "var(--nec-orange)", border: "1px solid rgba(249,115,22,0.25)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
              >
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Save the dates</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--nec-muted)" }}>
                  {CONVENTION_DATES}. Plan for travel on both ends — it&apos;s New Year&apos;s Eve!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
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
        </div>

        {/* Extra actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="btn-ghost flex-1 !justify-center"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Link>
        </div>

        {/* Help */}
        <div
          className="rounded-xl p-4 text-center space-y-1"
          style={{ background: "linear-gradient(135deg, rgba(26,16,48,0.9) 0%, rgba(15,10,30,0.95) 100%)", border: "1px solid var(--nec-border)", boxShadow: "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)" }}
        >
          <p className="text-xs" style={{ color: "var(--nec-muted)" }}>Questions about your breakfast tickets?</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-75"
            style={{ color: "var(--nec-cyan)" }}
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            {CONTACT_EMAIL}
          </a>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/breakfast"
            className="text-xs transition-colors inline-flex items-center gap-1 hover:opacity-80"
            style={{ color: "var(--nec-muted)" }}
          >
            Buy more breakfast tickets
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
