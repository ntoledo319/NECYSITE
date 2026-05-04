import type { EventData } from "@/lib/data/events"
import { SITE_URL } from "@/lib/constants"

function parseToISO(dateStr: string, timeStr?: string): string | null {
  const cleaned = dateStr
    .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i, "")
    .replace(/(\d+)(st|nd|rd|th)/i, "$1")
    .trim()

  const base = new Date(`${cleaned}${timeStr ? ` ${timeStr}` : ""}`)
  return isNaN(base.getTime()) ? null : base.toISOString()
}

export function generateEventJsonLd(event: EventData): Record<string, unknown> | null {
  const startTime = event.schedule.length > 0 ? event.schedule[0].time : undefined
  const startDate = parseToISO(event.date, startTime)
  if (!startDate) return null

  const endDate = new Date(new Date(startDate).getTime() + 3 * 60 * 60 * 1000).toISOString()

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate,
    endDate,
    description: event.description || undefined,
    image: event.flyerSrc ? `${SITE_URL}${event.flyerSrc}` : undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  }

  if (event.location) {
    jsonLd.location = {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.location,
      },
    }
  }

  const costDetail = event.details.find(
    (d) =>
      d.label.toLowerCase().includes("contribution") ||
      d.label.toLowerCase().includes("donation") ||
      d.label.toLowerCase().includes("cost"),
  )
  if (costDetail) {
    const match = costDetail.value.match(/\$(\d+)/)
    if (match) {
      jsonLd.offers = {
        "@type": "Offer",
        price: match[1],
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/events`,
      }
    }
  }

  return JSON.parse(JSON.stringify(jsonLd))
}
