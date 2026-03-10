"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Hotel, Home, Mail, ArrowRight } from "lucide-react"
import { HOTEL_BOOKING_URL, CONTACT_EMAIL } from "@/lib/constants"

export default function RegistrationSuccessPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "var(--nec-navy)" }}
    >
      {/* CT state art watermark */}
      <div className="absolute right-0 top-1/3 w-[300px] h-[360px] pointer-events-none select-none opacity-[0.03]">
        <Image
          src="/images/ct-state-art.webp"
          alt=""
          fill
          className="object-contain object-right"
          aria-hidden="true"
        />
      </div>

      {/* Top accent bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50"
        style={{
          background: "linear-gradient(90deg, var(--nec-pink), var(--nec-cyan), var(--nec-orange))",
        }}
      />

      <div className="w-full max-w-lg space-y-6">
        {/* Success card */}
        <div
          className="rounded-2xl p-8 md:p-10 text-center space-y-5"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,232,0.08) 0%, rgba(232,0,110,0.06) 100%)",
            border: "1px solid rgba(0,212,232,0.25)",
          }}
        >
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0,212,232,0.12)",
                border: "2px solid rgba(0,212,232,0.40)",
              }}
            >
              <CheckCircle
                className="w-10 h-10"
                style={{ color: "var(--nec-cyan)" }}
              />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1
              className="text-3xl font-black text-white"
            >
              You&apos;re Registered!
            </h1>
            <p
              className="text-base font-semibold"
              style={{ color: "var(--nec-cyan)" }}
            >
              NECYPAA XXXVI · Hartford, CT
            </p>
            <p className="text-sm text-gray-400">
              Dec 31, 2026 – Jan 3, 2027 · Hartford Marriott Downtown
            </p>
          </div>

          {/* Confirmation message */}
          <p className="text-sm text-gray-300 leading-relaxed">
            Your registration is confirmed. A receipt was sent to the email you provided. Keep it
            for your records — you&apos;ll need your registration confirmation at check-in.
          </p>

          <hr style={{ borderColor: "var(--nec-border)" }} />

          {/* Next steps */}
          <div className="text-left space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Next Steps</p>

            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: "rgba(0,212,232,0.15)", color: "var(--nec-cyan)" }}
              >
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Book your hotel room</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Secure your room at the Hartford Marriott Downtown at our special group rate
                  before the block fills up.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: "rgba(0,212,232,0.15)", color: "var(--nec-cyan)" }}
              >
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Save the dates</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Dec 31, 2026 – Jan 3, 2027. Plan for travel on both ends — it&apos;s New Year&apos;s Eve!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: "rgba(0,212,232,0.15)", color: "var(--nec-cyan)" }}
              >
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Stay in the loop</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Check back at this site for schedule, speakers, and event updates as we get
                  closer to convention.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={HOTEL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 !justify-center"
          >
            <Hotel className="w-4 h-4" />
            Book Hotel Now
          </a>
          <Link
            href="/"
            className="btn-ghost flex-1 !justify-center"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Help */}
        <div
          className="rounded-xl p-4 text-center space-y-1"
          style={{ background: "var(--nec-card)", border: "1px solid var(--nec-border)" }}
        >
          <p className="text-xs text-gray-400">Questions or need help with your registration?</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-75"
            style={{ color: "var(--nec-cyan)" }}
          >
            <Mail className="w-3.5 h-3.5" />
            {CONTACT_EMAIL}
          </a>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/register"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-1"
          >
            Register another person
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
