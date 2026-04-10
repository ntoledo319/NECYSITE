"use client"

import Image from "next/image"
import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import AddToCalendar from "@/components/add-to-calendar"

export default function HeroSection() {
  return (
    <section
      aria-label="NECYPAA XXXVI Convention Hero — Escaping the Mad Realm"
      className="relative -mt-16 flex min-h-screen flex-col overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Poster background ── */}
      <Image
        src="/images/mad-realm-poster-full.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-poster-alive object-cover object-[center_28%] sm:object-center"
        aria-hidden="true"
      />

      {/* Mobile overlay */}
      <div
        className="pointer-events-none absolute inset-0 sm:hidden"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.54) 30%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.58) 68%, rgba(0,0,0,0.80) 88%, rgba(0,0,0,0.94) 100%)",
        }}
      />
      {/* Desktop overlay */}
      <div
        className="pointer-events-none absolute inset-0 hidden sm:block"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.34) 30%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.38) 65%, rgba(0,0,0,0.70) 88%, rgba(0,0,0,0.88) 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]"
        aria-hidden="true"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, var(--nec-navy) 100%)",
        }}
      />

      {/* ── Layout: logo pinned to the circle, text anchored to bottom ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center px-6 text-center">

        {/*
          Logo — positioned at ~30% from viewport top on mobile to align
          with the AA triangle in the poster's vortex circle.
          On desktop, justify-center handles alignment naturally.
        */}
        <div
          className="hero-logo-glow hero-enter-1 relative sm:mt-auto"
          style={{ marginTop: "max(5rem, 26vh)" }}
        >
          <Image
            src="/images/mad-realm-logo-no-bg.webp"
            alt="Escaping the Mad Realm — NECYPAA XXXVI theme logo"
            width={340}
            height={340}
            priority
            sizes="(max-width: 640px) 62vw, (max-width: 1024px) 260px, 340px"
            className="relative z-10 h-auto w-full"
            style={{
              width: "clamp(220px, 60vw, 340px)",
              filter:
                "drop-shadow(0 6px 36px rgba(124,58,237,0.55)) drop-shadow(0 2px 16px rgba(192,38,211,0.35))",
            }}
          />
        </div>

        {/* Text block — pushed to the lower portion */}
        <div className="mt-auto mb-14 flex flex-col items-center sm:mb-16 md:mb-24">

          {/* Title */}
          <h1
            className="hero-enter-2 hero-title text-2xl font-black uppercase leading-none tracking-wide sm:text-3xl md:text-4xl lg:text-5xl"
            style={{
              fontFamily: "var(--font-display), 'Bangers', cursive",
              letterSpacing: "0.08em",
            }}
          >
            NECYPAA XXXVI
          </h1>

          {/* Location */}
          <h2
            className="hero-enter-3 hero-subtitle mt-1 text-lg font-black uppercase tracking-wide sm:text-xl md:mt-2 md:text-2xl lg:text-3xl"
            style={{
              fontFamily: "var(--font-display), 'Bangers', cursive",
              letterSpacing: "0.08em",
            }}
          >
            Hartford, Connecticut
          </h2>

          {/* Decorative rule */}
          <div
            className="hero-enter-3 mx-auto mt-3 h-px w-28 sm:mt-4 sm:w-40 md:mt-5 md:w-48"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(242,218,130,0.50) 30%, rgba(212,168,210,0.45) 70%, transparent 100%)",
            }}
          />

          {/* Dates + Venue */}
          <div
            className="hero-enter-4 mt-3 flex flex-col items-center gap-1.5 rounded-2xl px-5 py-2.5 backdrop-blur-sm sm:mt-4 sm:px-6 sm:py-3 md:mt-5 md:px-8 md:py-4"
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(232,223,208,0.08)",
            }}
          >
            <p
              className="text-sm font-bold uppercase tracking-[0.12em] sm:text-base sm:tracking-widest md:text-lg lg:text-xl"
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

          {/* CTAs */}
          <div className="hero-enter-5 mt-5 flex w-full flex-col items-center gap-3 sm:mt-7 md:mt-9">
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
            <AddToCalendar variant="inline" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
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
