"use client"

import Image from "next/image"
import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"

export default function HeroSection() {
  return (
    <section
      aria-label="NECYPAA XXXVi Convention Hero"
      className="relative overflow-hidden pt-2 pb-6 md:pt-4 md:pb-10"
    >
      {/* ── Ambient glow layer ────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] opacity-[0.12]"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 40%, var(--nec-cyan) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-[15%] -right-16 w-[350px] h-[350px] opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, var(--nec-pink) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-[35%] -left-16 w-[300px] h-[300px] opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, var(--nec-orange) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ── Hero content ──────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">

        {/* Logo – transparent graffiti art */}
        <div className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[560px]">
          <div
            className="absolute inset-0 scale-[1.3] opacity-40"
            style={{
              background: "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(0,212,232,0.35) 0%, rgba(232,0,110,0.15) 40%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <Image
            src="/images/necypaa-logo-transparent.webp"
            alt="NECYPAA XXXVI"
            width={560}
            height={359}
            className="relative z-10 w-full h-auto drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            priority
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 400px, 560px"
          />
        </div>

        {/* Location */}
        <h2
          className="mt-3 md:mt-5 text-lg sm:text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-wide"
          style={{
            fontFamily: "var(--font-display), 'Bangers', cursive",
            color: "var(--nec-gold)",
            textShadow: "0 0 24px rgba(251,191,36,0.25), 0 2px 4px rgba(0,0,0,0.4)",
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
          {/* Price badge — compact */}
          <div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, rgba(232,0,110,0.10) 0%, rgba(232,0,110,0.03) 100%)",
              border: "1px solid rgba(232,0,110,0.25)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <span
              className="text-2xl md:text-3xl font-black"
              style={{ color: "var(--nec-pink)", textShadow: "0 0 20px rgba(232,0,110,0.3)" }}
            >
              $40
            </span>
            <div className="text-left leading-tight">
              <span className="text-xs font-semibold text-gray-200 block">Pre-Registration</span>
              <span className="text-gray-500 text-[10px]">Limited pricing · Lock in your spot</span>
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
              Book Hotel
            </a>
          </div>
        </div>

        <p className="sr-only">
          NECYPAA XXXVi — The Northeast Convention of Young People in Alcoholics Anonymous.
          Hartford, Connecticut. December 31, 2026 through January 3, 2027.
          Pre-registration is $40. Hotel: Hartford Marriott Downtown.
        </p>
      </div>
    </section>
  )
}
