import type { CalendarEvent } from "./types"

/**
 * Format a Date to ICS YYYYMMDDTHHMMSS format in UTC.
 */
function formatIcsDateUTC(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T` +
    `${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`
  )
}

/**
 * Escape special characters in ICS text values per RFC 5545.
 */
function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
}

/**
 * Fold a line at 75 octets per RFC 5545.
 */
function foldLine(line: string): string {
  if (line.length <= 75) return line
  const parts: string[] = [line.slice(0, 75)]
  let pos = 75
  while (pos < line.length) {
    parts.push(" " + line.slice(pos, pos + 74))
    pos += 74
  }
  return parts.join("\r\n")
}

/**
 * Format a date-only string (YYYY-MM-DD) to ICS VALUE=DATE format (YYYYMMDD).
 */
function formatIcsDateOnly(dateStr: string): string {
  return dateStr.replace(/-/g, "")
}

/**
 * Generate an ICS (iCalendar) string for a single CalendarEvent.
 * Strips HTML tags from description. Uses VALUE=DATE for all-day events,
 * UTC times for timed events.
 */
export function generateEventIcs(event: CalendarEvent): string {
  const now = new Date()
  const isAllDay = !event.start.includes("T")

  // Strip HTML tags from description for ICS
  const plainDesc = event.description.replace(/<[^>]*>/g, "").trim()

  const dtStart = isAllDay
    ? `DTSTART;VALUE=DATE:${formatIcsDateOnly(event.start)}`
    : `DTSTART:${formatIcsDateUTC(new Date(event.start))}Z`

  const dtEnd = isAllDay
    ? `DTEND;VALUE=DATE:${formatIcsDateOnly(event.end)}`
    : `DTEND:${formatIcsDateUTC(new Date(event.end))}Z`

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NECYPAA XXXVI//necypaact.com//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    dtStart,
    dtEnd,
    foldLine(`SUMMARY:${escapeIcs(event.title)}`),
    ...(plainDesc ? [foldLine(`DESCRIPTION:${escapeIcs(plainDesc)}`)] : []),
    ...(event.location ? [foldLine(`LOCATION:${escapeIcs(event.location)}`)] : []),
    "STATUS:CONFIRMED",
    `UID:${event.id}@necypaact.com`,
    `DTSTAMP:${formatIcsDateUTC(now)}Z`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]

  return lines.join("\r\n")
}
