"use client"

import Image from "next/image"
import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import AddToCalendar from "@/components/add-to-calendar"

export default function HeroSection() {
  return (
    <section
      aria-label="NECYPAA XXXVI Convention Hero — Escaping the Mad Realm"
      className="relative -mt-16 flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Poster as atmosphere — the vortex breathes ── */}
      <Image
        src="/images/mad-realm-poster-full.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-poster-alive object-cover object-center"
        aria-hidden="true"
      />

      {/*
        Two-layer overlay system:
        1. Theme-safe darkening (always black — works in light AND dark mode)
        2. Bottom fade to page background color (var(--nec-navy) for seamless transition)
      */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.34) 30%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.38) 65%, rgba(0,0,0,0.70) 88%, rgba(0,0,0,0.88) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, var(--nec-navy) 100%)",
        }}
      />

      {/* ── Content — materializes from the art ── */}
      <div className="relative z-10 flex w-full flex-col items-center px-5 pb-24 pt-24 text-center sm:px-6">

        {/* Theme logo with breathing glow — stagger 1 */}
        <div className="hero-logo-glow hero-enter-1 relative">
          <Image
            src="/images/mad-realm-logo-no-bg.webp"
            alt="Escaping the Mad Realm — NECYPAA XXXVI theme logo"
            width={340}
            height={340}
            priority
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 280px, 340px"
            className="relative z-10 h-auto w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[340px]"
            style={{
              filter:
                "drop-shadow(0 4px 32px rgba(124,58,237,0.45)) drop-shadow(0 2px 12px rgba(192,38,211,0.25))",
            }}
          />
        </div>

        {/* Convention title — stagger 2 */}
        <h1
          className="hero-enter-2 mt-5 text-2xl font-black uppercase tracking-wide sm:text-3xl md:mt-6 md:text-4xl lg:text-5xl"
          style={{
            fontFamily: "var(--font-display), 'Bangers', cursive",
            background:
              "linear-gradient(90deg, #C08ABF 0%, #D4748E 35%, #D4A84B 65%, #C08ABF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.08em",
          }}
        >
          NECYPAA XXXVI
        </h1>

        {/* Location — stagger 3 */}
        <h2
          className="hero-enter-3 mt-1 text-lg font-black uppercase tracking-wide sm:text-xl md:mt-2 md:text-2xl lg:text-3xl"
          style={{
            fontFamily: "var(--font-display), 'Bangers', cursive",
            color: "#D4A84B",
            textShadow:
              "0 0 28px rgba(212,168,75,0.40), 0 2px 6px rgba(0,0,0,0.7)",
            letterSpacing: "0.08em",
          }}
        >
          Hartford, Connecticut
        </h2>

        {/* Decorative rule — echoes the poster's golden border details */}
        <div
          className="hero-enter-3 mx-auto mt-4 h-px w-32 sm:w-40 md:mt-5 md:w-48"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,168,75,0.50) 30%, rgba(192,138,191,0.45) 70%, transparent 100%)",
          }}
        />

        {/* Dates + Venue — stagger 4 */}
        <div className="hero-enter-4 mt-4 flex flex-col items-center gap-1 md:mt-5">
          <p
            className="text-sm font-bold uppercase tracking-widest sm:text-base md:text-lg"
            style={{
              color: "#5DBAA8",
              textShadow:
                "0 0 18px rgba(93,186,168,0.35), 0 1px 4px rgba(0,0,0,0.6)",
            }}
          >
            Dec 31, 2026 &ndash; Jan 3, 2027
          </p>
          <p
            className="text-xs font-medium tracking-wide sm:text-sm"
            style={{
              color: "rgba(232,223,208,0.75)",
              textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            }}
          >
            Hartford Marriott Downtown
          </p>
        </div>

        {/* CTAs — stagger 5 */}
        <div className="hero-enter-5 mt-7 flex flex-col items-center gap-4 md:mt-9">
          <div className="flex w-full max-w-sm flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="btn-primary justify-center text-center"
            >
              Register Now
            </Link>
            <a
              href={HOTEL_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary justify-center text-center"
            >
              Book Hotel
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>

          <AddToCalendar variant="inline" className="mt-1" />
        </div>
      </div>

      {/* ── Scroll indicator — minimal line + chevron ── */}
      <div
        className="hero-scroll-hint absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1"
        aria-hidden="true"
      >
        <div
          className="h-8 w-px"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(232,223,208,0.4))" }}
        />
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="rgba(232,223,208,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="sr-only">
        NECYPAA XXXVI — Escaping the Mad Realm. The Northeast Convention of
        Young People in Alcoholics Anonymous. Hartford, Connecticut. December
        31, 2026 through January 3, 2027. Hartford Marriott Downtown.
      </p>
    </section>
  )
}
