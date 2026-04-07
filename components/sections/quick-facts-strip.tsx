"use client"

import Link from "next/link"
import { CalendarDays, Handshake, Hotel, Ticket } from "lucide-react"
import { HOTEL_BOOKING_URL } from "@/lib/constants"

const facts = [
  {
    label: "When",
    value: "December 31 to January 3",
    copy: "New Year's Eve weekend, 2026 into 2027.",
    icon: CalendarDays,
    accent: "var(--nec-purple)",
    accentRgb: "var(--nec-purple-rgb)",
  },
  {
    label: "Stay",
    value: "Hartford Marriott Downtown",
    copy: "The host hotel and weekend headquarters.",
    icon: Hotel,
    accent: "var(--nec-gold)",
    accentRgb: "var(--nec-gold-rgb)",
    href: HOTEL_BOOKING_URL,
    external: true,
  },
  {
    label: "Register",
    value: "$40 pre-registration",
    copy: "Secure your badge before the holiday rush.",
    icon: Ticket,
    accent: "var(--nec-pink)",
    accentRgb: "var(--nec-pink-rgb)",
    href: "/register",
    external: false,
  },
  {
    label: "Service",
    value: "Join the committee work",
    copy: "Business meetings, outreach, hospitality, and more.",
    icon: Handshake,
    accent: "var(--nec-cyan)",
    accentRgb: "var(--nec-cyan-rgb)",
    href: "/service",
    external: false,
  },
]

export default function QuickFactsStrip() {
  return (
    <section aria-label="Key convention details">
      <div className="rounded-[1.75rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.74)] shadow-[0_18px_44px_rgba(44,24,16,0.07)]">
        <div className="grid md:grid-cols-2 xl:grid-cols-4">
          {facts.map((fact, index) => {
            const Icon = fact.icon
            const itemBorderClass = [
              index < facts.length - 1 ? "border-b" : "",
              index % 2 === 0 ? "md:border-r" : "",
              index < facts.length - 2 ? "md:border-b" : "",
              index < facts.length - 1 ? "xl:border-r" : "",
              "xl:border-b-0",
            ]
              .filter(Boolean)
              .join(" ")

            const content = (
              <div className={`flex h-full flex-col gap-4 p-6 md:p-7 ${itemBorderClass}`} style={{ borderColor: "rgba(var(--nec-purple-rgb),0.08)" }}>
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border"
                  style={{
                    color: fact.accent,
                    background: `rgba(${fact.accentRgb},0.06)`,
                    borderColor: `rgba(${fact.accentRgb},0.14)`,
                  }}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">{fact.label}</p>
                  <p className="text-lg font-semibold leading-tight text-[var(--nec-text)]">{fact.value}</p>
                  <p className="text-sm leading-6 text-[var(--nec-muted)]">{fact.copy}</p>
                </div>
              </div>
            )

            if (!fact.href) return <div key={fact.label}>{content}</div>

            if (fact.external) {
              return (
                <a
                  key={fact.label}
                  href={fact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.02)]"
                >
                  {content}
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              )
            }

            return (
              <Link key={fact.label} href={fact.href} className="transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.02)]">
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
