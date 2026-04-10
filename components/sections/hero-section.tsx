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
        className="hero-poster-alive object-cover object-[center_38%] sm:object-center"
        aria-hidden="true"
      />

      {/*
        Two-layer overlay system:
        1. Theme-safe darkening (always black — works in light AND dark mode)
           Mobile gets slightly heavier overlay for text legibility at small sizes
        2. Bottom fade to page background color (var(--nec-navy) for seamless transition)
      */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.40) 28%, rgba(0,0,0,0.32) 45%, rgba(0,0,0,0.42) 65%, rgba(0,0,0,0.72) 86%, rgba(0,0,0,0.90) 100%)",
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
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-6 pb-14 pt-20 text-center sm:pb-16 sm:pt-24 md:max-w-3xl md:pb-24">

        {/* Theme logo — fluid sizing, breathes wider on mobile ── stagger 1 */}
        <div className="hero-logo-glow hero-enter-1 relative mb-3 sm:mb-5 md:mb-7">
          {/* Ambient separation — soft blur on mobile, tighter halo on desktop */}
          <div
            className="pointer-events-none absolute inset-[-12%] rounded-full sm:inset-[-18%]"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 60% 58% at 50% 50%, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.18) 55%, transparent 78%)",
              filter: "blur(8px)",
            }}
          />
          <Image
            src="/images/mad-realm-logo-no-bg.webp"
            alt="Escaping the Mad Realm — NECYPAA XXXVI theme logo"
            width={340}
            height={340}
            priority
            sizes="(max-width: 640px) 58vw, (max-width: 1024px) 260px, 340px"
            className="relative z-10 h-auto w-full sm:max-w-[230px] md:max-w-[280px] lg:max-w-[340px]"
            style={{
              width: "clamp(210px, 56vw, 340px)",
              filter:
                "drop-shadow(0 4px 32px rgba(124,58,237,0.50)) drop-shadow(0 2px 14px rgba(192,38,211,0.30))",
            }}
          />
        </div>

        {/* Convention title — stagger 2 */}
        <h1
          className="hero-enter-2 hero-title-glow text-lg font-black uppercase leading-tight tracking-wide sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
          style={{
            fontFamily: "var(--font-display), 'Bangers', cursive",
            background:
              "linear-gradient(90deg, #d4a8d2 0%, #e8899e 30%, #e8c45a 60%, #d4a8d2 100%)",
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
          className="hero-enter-3 mt-0.5 text-[0.9rem] font-black uppercase tracking-wide sm:mt-1 sm:text-lg md:mt-2 md:text-xl lg:text-2xl xl:text-3xl"
          style={{
            fontFamily: "var(--font-display), 'Bangers', cursive",
            color: "#e8c45a",
            textShadow:
              "0 0 24px rgba(232,196,90,0.50), 0 1px 3px rgba(0,0,0,0.8), 0 0 60px rgba(212,168,75,0.20)",
            letterSpacing: "0.08em",
          }}
        >
          Hartford, Connecticut
        </h2>

        {/* Decorative rule */}
        <div
          className="hero-enter-3 mx-auto mt-4 h-px w-28 sm:w-40 md:mt-5 md:w-48"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(232,196,90,0.50) 30%, rgba(212,168,210,0.45) 70%, transparent 100%)",
          }}
        />

        {/* Dates + Venue — stagger 4, frosted pill for legibility */}
        <div
          className="hero-enter-4 mt-4 flex flex-col items-center gap-1.5 rounded-2xl px-5 py-3 backdrop-blur-sm sm:px-6 sm:py-3 md:mt-5 md:px-8 md:py-4"
          style={{
            background: "rgba(0,0,0,0.40)",
            border: "1px solid rgba(232,223,208,0.10)",
          }}
        >
          <p
            className="text-[0.8rem] font-bold uppercase tracking-[0.14em] sm:text-base sm:tracking-widest md:text-lg lg:text-xl"
            style={{
              color: "#7cd4c0",
              textShadow: "0 0 16px rgba(124,212,192,0.35)",
            }}
          >
            Dec 31, 2026 &ndash; Jan 3, 2027
          </p>
          <p
            className="text-xs font-medium tracking-wide sm:text-sm md:text-base"
            style={{
              color: "rgba(232,223,208,0.92)",
              textShadow: "0 1px 3px rgba(0,0,0,0.6)",
            }}
          >
            Hartford Marriott Downtown
          </p>
        </div>

        {/* CTAs — stagger 5 */}
        <div className="hero-enter-5 mt-6 flex w-full flex-col items-center gap-4 sm:mt-7 md:mt-9">
          <div className="flex w-full max-w-xs flex-col justify-center gap-3 sm:max-w-sm sm:flex-row">
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
        className="hero-scroll-hint absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 sm:bottom-8"
        aria-hidden="true"
      >
        <div
          className="h-6 w-px sm:h-8"
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
