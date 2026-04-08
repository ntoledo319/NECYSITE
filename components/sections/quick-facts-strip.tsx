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
    value: "Pre-registration open",
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
      <div className="overflow-hidden rounded-[1.9rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.74)] shadow-[0_18px_44px_rgba(44,24,16,0.07)]">
        <div
          className="h-[3px]"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, rgba(var(--nec-cyan-rgb),0.36) 0%, rgba(var(--nec-gold-rgb),0.46) 40%, rgba(var(--nec-pink-rgb),0.46) 72%, rgba(var(--nec-purple-rgb),0.36) 100%)",
          }}
        />
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
              <article
                className={`flex h-full flex-col gap-4 p-5 transition-[background-color,transform] duration-200 md:p-6 ${itemBorderClass}`}
                style={{
                  borderColor: "rgba(var(--nec-purple-rgb),0.08)",
                  background: index % 2 === 0 ? "rgba(var(--nec-card-rgb),0.24)" : "rgba(var(--nec-purple-rgb),0.02)",
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] border"
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
                  <p className="max-w-[18rem] text-base font-semibold leading-tight text-[var(--nec-text)] md:text-lg">{fact.value}</p>
                  <p className="text-sm leading-6 text-[var(--nec-muted)]">{fact.copy}</p>
                </div>
              </article>
            )

            if (!fact.href) return <div key={fact.label}>{content}</div>

            if (fact.external) {
              return (
                <a
                  key={fact.label}
                  href={fact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-[background-color,transform] duration-200 hover:bg-[rgba(var(--nec-purple-rgb),0.03)] hover:[&_article]:-translate-y-0.5"
                >
                  {content}
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              )
            }

            return (
              <Link
                key={fact.label}
                href={fact.href}
                className="transition-[background-color,transform] duration-200 hover:bg-[rgba(var(--nec-purple-rgb),0.03)] hover:[&_article]:-translate-y-0.5"
              >
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
