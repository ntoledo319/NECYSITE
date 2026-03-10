import Link from "next/link"
import { HOTEL_BOOKING_URL } from "@/lib/constants"

const facts = [
  {
    icon: "📅",
    label: "Dates",
    value: "Dec 31 – Jan 3",
    sub: "2026 – 2027",
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
    sub: "Limited pre-reg pricing",
    color: "var(--nec-pink)",
  },
  {
    icon: "🏨",
    label: "Hotel Block",
    value: "Book Now",
    sub: "Pay later · Special rate",
    color: "var(--nec-cyan)",
    href: HOTEL_BOOKING_URL,
    external: true,
  },
  {
    icon: "🎉",
    label: "Convention Type",
    value: "4-Day YPAA",
    sub: "All ages welcome",
    color: "var(--nec-orange)",
  },
  {
    icon: "✅",
    label: "Register Today",
    value: "Secure Your Spot",
    sub: "Online pre-reg open",
    color: "var(--nec-pink)",
    href: "/register",
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
              className="fact-pill group transition-all duration-200 hover:border-opacity-60"
              style={
                fact.href
                  ? { cursor: "pointer" }
                  : undefined
              }
            >
              <span className="text-2xl">{fact.icon}</span>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--nec-muted)" }}
              >
                {fact.label}
              </span>
              <span
                className="text-sm font-black leading-tight"
                style={{ color: fact.color }}
              >
                {fact.value}
              </span>
              <span className="text-[10px] text-gray-500 leading-tight">{fact.sub}</span>
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
