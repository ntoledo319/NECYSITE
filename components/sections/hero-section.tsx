"use client"

import Image from "next/image"
import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import HeroPortalFrame from "@/components/art/hero-portal-frame"
import { Sparkle, Splatter, Hex } from "@/components/art/graffiti-elements"
import { VortexSwirl } from "@/components/art/steampunk-elements"

export default function HeroSection() {
  return (
    <section
      aria-label="NECYPAA XXXVI Convention Hero — Escaping the Mad Realm"
      className="relative overflow-hidden pt-2 pb-6 md:pt-4 md:pb-8"
    >
      {/* ── Ambient vortex glow layer ─────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Central purple vortex glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.18]"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 40%, var(--nec-purple) 0%, rgba(192,38,211,0.3) 35%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Right magenta swirl */}
        <div
          className="absolute top-[10%] -right-16 w-[400px] h-[400px] opacity-[0.10]"
          style={{
            background: "radial-gradient(circle, var(--nec-pink) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        {/* Left gold/brass glow */}
        <div
          className="absolute top-[45%] -left-16 w-[350px] h-[350px] opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, var(--nec-gold) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        {/* Bottom teal glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.07]"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 80%, var(--nec-cyan) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* ── Portal frame art — the "looking glass" archway ── */}
      <div className="absolute inset-0 flex items-start justify-center pointer-events-none" aria-hidden="true">
        <HeroPortalFrame className="w-full max-w-[500px] md:max-w-[600px] h-auto mt-[-20px] md:mt-[-30px]" />
      </div>

      {/* ── Floating graffiti accents ─────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[8%] left-[5%] md:left-[12%]">
          <Sparkle color="var(--nec-gold)" size={16} opacity={0.25} />
        </div>
        <div className="absolute top-[15%] right-[8%] md:right-[14%]">
          <Sparkle color="var(--nec-cyan)" size={12} opacity={0.2} />
        </div>
        <div className="absolute top-[55%] left-[3%] md:left-[10%]">
          <Splatter color="var(--nec-pink)" size={40} opacity={0.08} />
        </div>
        <div className="absolute top-[65%] right-[4%] md:right-[10%]">
          <Hex color="var(--nec-purple)" size={28} opacity={0.1} />
        </div>
        <div className="absolute bottom-[10%] left-[15%]">
          <Sparkle color="var(--nec-pink)" size={10} opacity={0.18} />
        </div>
        <div className="absolute bottom-[15%] right-[18%]">
          <Sparkle color="var(--nec-gold)" size={14} opacity={0.22} />
        </div>
        <div className="absolute top-[40%] left-[2%] hidden md:block">
          <VortexSwirl size={80} color="var(--nec-purple)" opacity={0.04} />
        </div>
        <div className="absolute top-[35%] right-[2%] hidden md:block" style={{ transform: "scaleX(-1)" }}>
          <VortexSwirl size={70} color="var(--nec-pink)" opacity={0.035} />
        </div>
      </div>

      {/* ── Hero content ──────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">

        {/* Theme logo — "Escaping the Mad Realm" calligraphic art (transparent background) */}
        <div className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-[300px] lg:max-w-[340px]">
          <div
            className="absolute inset-0 scale-[1.6] opacity-50"
            aria-hidden="true"
            style={{
              background: "radial-gradient(ellipse 55% 50% at 50% 48%, rgba(124,58,237,0.40) 0%, rgba(192,38,211,0.18) 40%, transparent 70%)",
              filter: "blur(48px)",
            }}
          />
          <Image
            src="/images/mad-realm-logo-no-bg.png"
            alt="Escaping the Mad Realm — NECYPAA XXXVI theme logo featuring ornate calligraphic lettering in a gradient from teal to magenta to gold"
            width={340}
            height={340}
            className="relative z-10 w-full h-auto drop-shadow-[0_4px_40px_rgba(124,58,237,0.45)] drop-shadow-[0_2px_16px_rgba(192,38,211,0.25)]"
            priority
            sizes="(max-width: 640px) 55vw, (max-width: 1024px) 280px, 340px"
          />
        </div>

        {/* Convention title */}
        <h1
          className="mt-3 md:mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wide"
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
        <div className="mt-2 md:mt-2 flex flex-col items-center gap-0.5">
          <p
            className="text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase"
            style={{ color: "var(--nec-cyan)" }}
          >
            Dec 31, 2026 &ndash; Jan 3, 2027
          </p>
          <p className="text-xs sm:text-sm text-gray-400 tracking-wide font-medium">
            Hartford Marriott Downtown
          </p>
        </div>

        {/* Price + CTAs combined row */}
        <div className="mt-4 md:mt-5 flex flex-col items-center gap-4 w-full max-w-lg">
          {/* Price badge — compact, styled with purple/gold */}
          <div
            className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(192,38,211,0.06) 100%)",
              border: "1px solid rgba(124,58,237,0.30)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <span
              className="text-2xl md:text-3xl font-black"
              style={{ color: "var(--nec-gold)", textShadow: "0 0 24px rgba(212,160,23,0.35)" }}
            >
              $40
            </span>
            <div className="text-left leading-tight">
              <span className="text-sm font-semibold text-gray-200 block">Pre-Registration</span>
              <span className="text-gray-400 text-xs">Limited pricing · Lock in your spot</span>
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
