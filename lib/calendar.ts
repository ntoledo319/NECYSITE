import type { EventData } from "@/lib/data/events"

function parseEventDate(dateStr: string, timeStr?: string): Date | null {
  // Remove day name prefix and ordinal suffixes
  const cleaned = dateStr
    .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i, "")
    .replace(/(\d+)(st|nd|rd|th)/i, "$1")
    .trim()

  const base = new Date(`${cleaned}${timeStr ? ` ${timeStr}` : ""}`)
  return isNaN(base.getTime()) ? null : base
}

function formatGCalDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T` +
    `${pad(date.getHours())}${pad(date.getMinutes())}00`
  )
}

export function getGoogleCalendarUrl(event: EventData): string | null {
  const startTime = event.schedule.length > 0 ? event.schedule[0].time : undefined
  const start = parseEventDate(event.date, startTime)
  if (!start) return null

  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatGCalDate(start)}/${formatGCalDate(end)}`,
    location: event.location,
    details: event.description,
  })

  return `https://www.google.com/calendar/render?${params.toString()}`
}
