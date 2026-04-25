"use client"

import { CalendarPlus } from "lucide-react"

const EVENT = {
  title: "NECYPAA XXXVI — Escaping the Mad Realm",
  location: "Hartford Marriott Downtown, 200 Columbus Blvd, Hartford, CT 06103",
  description:
    "Northeast Convention of Young People in Alcoholics Anonymous. 4 days of speakers, workshops, meetings, and fellowship. Details: https://www.necypaact.com",
  start: "20261231T180000",
  end: "20270103T140000",
  tzid: "America/New_York",
} as const

function generateICS(): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NECYPAA XXXVI//necypaact.com//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART;TZID=${EVENT.tzid}:${EVENT.start}`,
    `DTEND;TZID=${EVENT.tzid}:${EVENT.end}`,
    `SUMMARY:${EVENT.title}`,
    `DESCRIPTION:${EVENT.description}`,
    `LOCATION:${EVENT.location}`,
    "STATUS:CONFIRMED",
    `UID:necypaa-xxxvi-2026@necypaact.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return lines.join("\r\n")
}

function downloadICS() {
  const ics = generateICS()
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "necypaa-xxxvi.ics"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function AddToCalendar({
  variant = "ghost",
  className = "",
}: {
  variant?: "ghost" | "inline"
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={downloadICS}
      className={`${variant === "ghost" ? "btn-ghost" : "inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-75"} ${className}`}
      style={variant === "inline" ? { color: "var(--nec-cyan)" } : undefined}
    >
      <CalendarPlus className="h-4 w-4" aria-hidden="true" />
      Add to Calendar
    </button>
  )
}
