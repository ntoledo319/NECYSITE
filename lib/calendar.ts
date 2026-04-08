import type { EventData } from "@/lib/data/events"

/**
 * Parse a human-readable event date string like "Saturday, April 25th, 2026"
 * and an optional time like "2:00 PM" into a Date object.
 */
function parseEventDate(dateStr: string, timeStr?: string): Date | null {
  // Remove day name prefix and ordinal suffixes
  const cleaned = dateStr
    .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i, "")
    .replace(/(\d+)(st|nd|rd|th)/i, "$1")
    .trim()

  const base = new Date(`${cleaned}${timeStr ? ` ${timeStr}` : ""}`)
  return isNaN(base.getTime()) ? null : base
}

/**
 * Format a Date to Google Calendar's required YYYYMMDDTHHMMSS format (local time).
 */
function formatGCalDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T` +
    `${pad(date.getHours())}${pad(date.getMinutes())}00`
  )
}

/**
 * Generate a Google Calendar URL from an EventData object.
 * Uses the first schedule item's time as the start time.
 * Defaults to a 3-hour event duration.
 */
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
