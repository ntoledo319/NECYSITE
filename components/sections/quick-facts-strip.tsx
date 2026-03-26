"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import { SpotlightCard, staggerContainer, staggerChild } from "@/components/ui/motion-primitives"

const facts = [
  {
    icon: "📅",
    label: "Dates",
    value: "Dec 31 – Jan 3",
    sub: "New Year's Eve 2026",
    color: "var(--nec-gold)",
    spotlightColor: "rgba(212,160,23,0.10)",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Hartford, CT",
    sub: "Hartford Marriott Downtown",
    color: "var(--nec-cyan)",
    spotlightColor: "rgba(20,184,166,0.10)",
  },
  {
    icon: "🎟️",
    label: "Pre-Registration",
    value: "$40",
    sub: "Lock in your spot",
    color: "var(--nec-pink)",
    href: "/register",
    external: false,
    spotlightColor: "rgba(192,38,211,0.10)",
  },
  {
    icon: "🏨",
    label: "Hotel Block",
    value: "Book Now",
    sub: "Special NECYPAA rate",
    color: "var(--nec-cyan)",
    href: HOTEL_BOOKING_URL,
    external: true,
    spotlightColor: "rgba(20,184,166,0.10)",
  },
  {
    icon: "🎉",
    label: "Convention",
    value: "4-Day YPAA",
    sub: "Young & young at heart",
    color: "var(--nec-orange)",
    spotlightColor: "rgba(234,88,12,0.10)",
  },
  {
    icon: "🤝",
    label: "Get Involved",
    value: "Join a Committee",
    sub: "Service opportunities",
    color: "var(--nec-purple)",
    href: "/service",
    external: false,
    spotlightColor: "rgba(124,58,237,0.10)",
  },
]

export default function QuickFactsStrip() {
  const shouldReduce = useReducedMotion()

  return (
    <section aria-label="Quick facts" className="px-4 md:px-0">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
        variants={shouldReduce ? undefined : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {facts.map((fact) => {
          const inner = (
            <SpotlightCard
              className="fact-pill group fact-pill-interactive rounded-xl"
              spotlightColor={fact.spotlightColor}
              spotlightSize={200}
            >
              <div
                className="flex flex-col items-center gap-1 p-4 text-center"
                style={{ cursor: fact.href ? "pointer" : undefined }}
              >
                <span className="text-2xl" aria-hidden="true">{fact.icon}</span>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--nec-muted)" }}
                >
                  {fact.label}
                </span>
                <span
                  className="text-sm font-black leading-tight"
                  style={{ color: fact.color, textShadow: `0 0 12px ${fact.color}30` }}
                >
                  {fact.value}
                </span>
                <span className="text-xs text-[var(--nec-muted)] leading-tight">{fact.sub}</span>
              </div>
            </SpotlightCard>
          )

          if (fact.href) {
            if (fact.external) {
              return (
                <motion.a
                  key={fact.label}
                  href={fact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                  variants={shouldReduce ? undefined : staggerChild}
                >
                  {inner}
                  <span className="sr-only"> (opens in new tab)</span>
                </motion.a>
              )
            }
            return (
              <motion.div key={fact.label} variants={shouldReduce ? undefined : staggerChild}>
                <Link href={fact.href} className="no-underline block">
                  {inner}
                </Link>
              </motion.div>
            )
          }

          return (
            <motion.div key={fact.label} variants={shouldReduce ? undefined : staggerChild}>
              {inner}
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
