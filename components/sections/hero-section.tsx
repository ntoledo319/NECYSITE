"use client"

import Image from "next/image"
import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"

export default function HeroSection() {
  return (
    <section
      aria-label="NECYPAA XXXVI Convention Hero — Escaping the Mad Realm"
      className="relative overflow-hidden pt-2 pb-6 md:pt-4 md:pb-10"
    >
      {/* ── Ambient vortex glow layer ─────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Central purple vortex glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] opacity-[0.15]"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 40%, var(--nec-purple) 0%, rgba(192,38,211,0.3) 35%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Right magenta swirl */}
        <div
          className="absolute top-[15%] -right-16 w-[350px] h-[350px] opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, var(--nec-pink) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        {/* Left gold/brass glow */}
        <div
          className="absolute top-[40%] -left-16 w-[300px] h-[300px] opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, var(--nec-gold) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        {/* Bottom teal glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] opacity-[0.06]"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 80%, var(--nec-cyan) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* ── Hero content ──────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">

        {/* Theme logo — "Escaping the Mad Realm" calligraphic art */}
        <div className="relative w-full max-w-[280px] sm:max-w-[360px] md:max-w-[440px] lg:max-w-[500px]">
          <div
            className="absolute inset-0 scale-[1.4] opacity-50"
            style={{
              background: "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(124,58,237,0.40) 0%, rgba(192,38,211,0.18) 40%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <Image
            src="/images/mad-realm-logo.png"
            alt="Escaping the Mad Realm — NECYPAA XXXVI theme logo featuring ornate calligraphic lettering in a gradient from teal to magenta to gold"
            width={500}
            height={750}
            className="relative z-10 w-full h-auto drop-shadow-[0_4px_30px_rgba(124,58,237,0.4)]"
            priority
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 360px, 500px"
          />
        </div>

        {/* Convention title */}
        <h1
          className="mt-4 md:mt-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wide"
          style={{
            fontFamily: "var(--font-display), 'Bangers', cursive",
            background: "linear-gradient(90deg, var(--nec-purple) 0%, var(--nec-pink) 50%, var(--nec-gold) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            letterSpacing: "0.08em",
          }}
        >
          NECYPAA XXXVI
        </h1>

        {/* Location */}
        <h2
          className="mt-1 md:mt-2 text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase tracking-wide"
          style={{
            fontFamily: "var(--font-display), 'Bangers', cursive",
            color: "var(--nec-gold)",
            textShadow: "0 0 24px rgba(212,160,23,0.25), 0 2px 4px rgba(0,0,0,0.4)",
            letterSpacing: "0.08em",
          }}
        >
          Hartford, Connecticut
        </h2>

        {/* Dates + Venue */}
        <p
          className="mt-1 text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase"
          style={{ color: "var(--nec-cyan)" }}
        >
          Dec 31, 2026 &ndash; Jan 3, 2027
        </p>
        <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500 tracking-wide font-medium">
          Hartford Marriott Downtown
        </p>

        {/* Price + CTAs combined row */}
        <div className="mt-4 md:mt-5 flex flex-col items-center gap-4 w-full max-w-lg">
          {/* Price badge — compact, styled with purple/gold */}
          <div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(192,38,211,0.05) 100%)",
              border: "1px solid rgba(124,58,237,0.30)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <span
              className="text-2xl md:text-3xl font-black"
              style={{ color: "var(--nec-gold)", textShadow: "0 0 20px rgba(212,160,23,0.3)" }}
            >
              $40
            </span>
            <div className="text-left leading-tight">
              <span className="text-xs font-semibold text-gray-200 block">Pre-Registration</span>
              <span className="text-gray-500 text-[11px]">Limited pricing · Lock in your spot</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
            <Link
              href="/register"
              className="btn-primary text-center justify-center flex-1"
            >
              Register — $40
            </Link>
            <a
              href={HOTEL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-center justify-center flex-1"
            >
              Book Hotel<span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        </div>

        <p className="sr-only">
          NECYPAA XXXVI — Escaping the Mad Realm. The Northeast Convention of Young People in Alcoholics Anonymous.
          Hartford, Connecticut. December 31, 2026 through January 3, 2027.
          Pre-registration is $40. Hotel: Hartford Marriott Downtown.
        </p>
      </div>
    </section>
  )
}
