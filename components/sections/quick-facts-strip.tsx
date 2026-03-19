"use client"

import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"

const facts = [
  {
    icon: "📅",
    label: "Dates",
    value: "Dec 31 – Jan 3",
    sub: "New Year's Eve 2026",
    color: "var(--nec-gold)",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Hartford, CT",
    sub: "Hartford Marriott Downtown",
    color: "var(--nec-cyan)",
  },
  {
    icon: "🎟️",
    label: "Pre-Registration",
    value: "$40",
    sub: "Lock in your spot",
    color: "var(--nec-pink)",
    href: "/register",
    external: false,
  },
  {
    icon: "🏨",
    label: "Hotel Block",
    value: "Book Now",
    sub: "Special NECYPAA rate",
    color: "var(--nec-cyan)",
    href: HOTEL_BOOKING_URL,
    external: true,
  },
  {
    icon: "🎉",
    label: "Convention",
    value: "4-Day YPAA",
    sub: "Young & young at heart",
    color: "var(--nec-orange)",
  },
  {
    icon: "🤝",
    label: "Get Involved",
    value: "Join a Committee",
    sub: "Service opportunities",
    color: "var(--nec-purple)",
    href: "/service",
    external: false,
  },
]

export default function QuickFactsStrip() {
  return (
    <section aria-label="Quick facts" className="px-4 md:px-0">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {facts.map((fact) => {
          const inner = (
            <div
              key={fact.label}
              className="fact-pill group fact-pill-interactive transition-all duration-200"
              style={{
                cursor: fact.href ? "pointer" : undefined,
              }}
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
              <span className="text-xs text-gray-400 leading-tight">{fact.sub}</span>
            </div>
          )

          if (fact.href) {
            if (fact.external) {
              return (
                <a
                  key={fact.label}
                  href={fact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  {inner}
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              )
            }
            return (
              <Link key={fact.label} href={fact.href} className="no-underline">
                {inner}
              </Link>
            )
          }

          return <div key={fact.label}>{inner}</div>
        })}
      </div>
    </section>
  )
}
