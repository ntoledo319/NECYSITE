"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import AddToCalendar from "@/components/add-to-calendar"
import HeroPortalFrame from "@/components/art/hero-portal-frame"
import { Sparkle, Splatter, Hex } from "@/components/art/graffiti-elements"
import { VortexSwirl } from "@/components/art/steampunk-elements"
import {
  AuroraBackground,
  FloatingElement,
  MagneticButton,
  SPRING_GENTLE,
  SPRING_WOBBLY,
  SPRING_SLOW,
} from "@/components/ui/motion-primitives"

export default function HeroSection() {
  const shouldReduce = useReducedMotion()

  return (
    <section
      aria-label="NECYPAA XXXVI Convention Hero — Escaping the Mad Realm"
      className="relative overflow-hidden pt-2 pb-6 md:pt-4 md:pb-8"
    >
      {/* ── Living aurora glow layer (replaces static radial gradients) ── */}
      <AuroraBackground intensity={1.8} />

      {/* ── Portal frame art — the "looking glass" archway ── */}
      <div className="absolute inset-0 flex items-start justify-center pointer-events-none" aria-hidden="true">
        <HeroPortalFrame className="w-full max-w-[500px] md:max-w-[600px] h-auto mt-[-20px] md:mt-[-30px]" />
      </div>

      {/* ── Floating graffiti accents with spring-physics float ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <FloatingElement className="absolute top-[8%] left-[5%] md:left-[12%]" yOffset={6} duration={5}>
          <Sparkle color="var(--nec-gold)" size={16} opacity={0.25} />
        </FloatingElement>
        <FloatingElement className="absolute top-[15%] right-[8%] md:right-[14%]" yOffset={8} xOffset={3} duration={6} delay={1}>
          <Sparkle color="var(--nec-cyan)" size={12} opacity={0.2} />
        </FloatingElement>
        <FloatingElement className="absolute top-[55%] left-[3%] md:left-[10%]" yOffset={10} duration={7} delay={2}>
          <Splatter color="var(--nec-pink)" size={40} opacity={0.08} />
        </FloatingElement>
        <FloatingElement className="absolute top-[65%] right-[4%] md:right-[10%]" yOffset={5} xOffset={4} duration={5.5} delay={0.5}>
          <Hex color="var(--nec-purple)" size={28} opacity={0.1} />
        </FloatingElement>
        <FloatingElement className="absolute bottom-[10%] left-[15%]" yOffset={7} duration={4.5} delay={1.5}>
          <Sparkle color="var(--nec-pink)" size={10} opacity={0.18} />
        </FloatingElement>
        <FloatingElement className="absolute bottom-[15%] right-[18%]" yOffset={9} xOffset={2} duration={6.5} delay={3}>
          <Sparkle color="var(--nec-gold)" size={14} opacity={0.22} />
        </FloatingElement>
        <div className="absolute top-[40%] left-[2%] hidden md:block">
          <VortexSwirl size={80} color="var(--nec-purple)" opacity={0.04} />
        </div>
        <div className="absolute top-[35%] right-[2%] hidden md:block" style={{ transform: "scaleX(-1)" }}>
          <VortexSwirl size={70} color="var(--nec-pink)" opacity={0.035} />
        </div>
      </div>

      {/* ── Hero content with staggered spring entrance ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">

        {/* Theme logo — "Escaping the Mad Realm" calligraphic art (transparent background) */}
        <motion.div
          className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-[300px] lg:max-w-[340px]"
          initial={shouldReduce ? false : { opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={SPRING_SLOW}
        >
          <div
            className="absolute inset-0 scale-[1.6] opacity-50 hero-glow-breathe"
            aria-hidden="true"
            style={{
              background: "radial-gradient(ellipse 55% 50% at 50% 48%, rgba(124,58,237,0.40) 0%, rgba(192,38,211,0.18) 40%, transparent 70%)",
              filter: "blur(48px)",
            }}
          />
          <Image
            src="/images/mad-realm-logo-no-bg.webp"
            alt="Escaping the Mad Realm — NECYPAA XXXVI theme logo featuring ornate calligraphic lettering in a gradient from teal to magenta to gold"
            width={340}
            height={340}
            className="relative z-10 w-full h-auto drop-shadow-[0_4px_40px_rgba(124,58,237,0.45)] drop-shadow-[0_2px_16px_rgba(192,38,211,0.25)]"
            priority
            sizes="(max-width: 640px) 55vw, (max-width: 1024px) 280px, 340px"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoIAAgAAUAmJQBOgB4/gAAAAA=="
          />
        </motion.div>

        {/* Convention title */}
        <motion.h1
          className="mt-3 md:mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wide gradient-shimmer"
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0.15 }}
          style={{
            fontFamily: "var(--font-display), 'Bangers', cursive",
            background: "linear-gradient(90deg, var(--nec-purple) 0%, var(--nec-pink) 35%, var(--nec-gold) 65%, var(--nec-purple) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            letterSpacing: "0.08em",
          }}
        >
          NECYPAA XXXVI
        </motion.h1>

        {/* Location */}
        <motion.h2
          className="mt-1 md:mt-2 text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase tracking-wide"
          initial={shouldReduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0.25 }}
          style={{
            fontFamily: "var(--font-display), 'Bangers', cursive",
            color: "var(--nec-gold)",
            textShadow: "0 0 24px rgba(212,160,23,0.25), 0 2px 4px rgba(0,0,0,0.4)",
            letterSpacing: "0.08em",
          }}
        >
          Hartford, Connecticut
        </motion.h2>

        {/* Dates + Venue */}
        <motion.div
          className="mt-2 md:mt-2 flex flex-col items-center gap-0.5"
          initial={shouldReduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0.35 }}
        >
          <p
            className="text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase"
            style={{ color: "var(--nec-cyan)" }}
          >
            Dec 31, 2026 &ndash; Jan 3, 2027
          </p>
          <p className="text-xs sm:text-sm text-[var(--nec-muted)] tracking-wide font-medium">
            Hartford Marriott Downtown
          </p>
        </motion.div>

        {/* Price + CTAs combined row */}
        <motion.div
          className="mt-4 md:mt-5 flex flex-col items-center gap-4 w-full max-w-lg"
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_WOBBLY, delay: 0.45 }}
        >
          {/* Price badge — compact, styled with purple/gold */}
          <div
            className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl backdrop-blur-sm hero-price-badge"
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
              <span className="text-sm font-semibold text-[var(--nec-text)] block">Pre-Registration</span>
              <span className="text-[var(--nec-muted)] text-xs">Limited pricing · Lock in your spot</span>
            </div>
          </div>

          {/* CTA buttons with magnetic pull */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
            <MagneticButton className="flex-1" strength={0.15}>
              <Link
                href="/register"
                className="btn-primary text-center justify-center w-full"
              >
                Register — $40
              </Link>
            </MagneticButton>
            <MagneticButton className="flex-1" strength={0.15}>
              <a
                href={HOTEL_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-center justify-center w-full"
              >
                Book Hotel<span className="sr-only"> (opens in new tab)</span>
              </a>
            </MagneticButton>
          </div>

          <AddToCalendar variant="inline" className="mt-1" />
        </motion.div>

        <p className="sr-only">
          NECYPAA XXXVI — Escaping the Mad Realm. The Northeast Convention of Young People in Alcoholics Anonymous.
          Hartford, Connecticut. December 31, 2026 through January 3, 2027.
          Pre-registration is $40. Hotel: Hartford Marriott Downtown.
        </p>
      </div>
    </section>
  )
}
