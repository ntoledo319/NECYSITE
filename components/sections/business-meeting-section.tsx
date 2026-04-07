"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Calendar, Clock, Video } from "lucide-react"
import { ZOOM_MEETING_URL } from "@/lib/constants"

function getEasterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month, day)
}

function isSameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getNextBusinessMeetingDate(): Date {
  const now = new Date()

  function getNthSunday(year: number, month: number, n: number): Date {
    const first = new Date(year, month, 1)
    const dayOfWeek = first.getDay()
    const daysUntilSunday = (7 - dayOfWeek) % 7
    const firstSunday = 1 + daysUntilSunday
    return new Date(year, month, firstSunday + (n - 1) * 7)
  }

  for (let offset = 0; offset < 6; offset++) {
    const ref = new Date(now.getFullYear(), now.getMonth() + offset, 1)
    const year = ref.getFullYear()
    const month = ref.getMonth()
    const easter = getEasterSunday(year)

    for (const nth of [1, 3]) {
      const meetingDate = getNthSunday(year, month, nth)
      if (isSameDate(meetingDate, easter)) continue
      const meetingTime = new Date(meetingDate)
      meetingTime.setHours(14, 0, 0, 0)
      if (meetingTime > now) return meetingDate
    }
  }

  return new Date()
}

function formatMeetingDate(date: Date): string {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const day = date.getDate()
  const suffix =
    day === 1 || day === 21 || day === 31 ? "st"
    : day === 2 || day === 22 ? "nd"
    : day === 3 || day === 23 ? "rd"
    : "th"
  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${day}${suffix}`
}

const meetingDetails = [
  { label: "Schedule", value: "First and third Sunday of each month", icon: Calendar, accent: "var(--nec-purple)", accentRgb: "var(--nec-purple-rgb)" },
  { label: "Time", value: "2:00 PM Eastern", icon: Clock, accent: "var(--nec-gold)", accentRgb: "var(--nec-gold-rgb)" },
  { label: "Location", value: "Zoom", icon: Video, accent: "var(--nec-cyan)", accentRgb: "var(--nec-cyan-rgb)" },
]

export default function BusinessMeetingSection() {
  const [dateStr, setDateStr] = useState("")

  useEffect(() => {
    setDateStr(formatMeetingDate(getNextBusinessMeetingDate()))
  }, [])

  return (
    <section id="business-meeting" aria-label="Next business meeting" className="h-full">
      <article className="nec-card flex h-full flex-col p-7 md:p-8">
        <span className="section-badge">Committee Work</span>
        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
          Join the next business meeting.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
          Meet the host committee, hear what is moving, and see how the convention is actually built.
          If someone wants to help, this page should make the door feel open.
        </p>

        <div className="mt-6 rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Next meeting</p>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[var(--nec-text)]">
            {dateStr || "Loading…"}
          </p>
        </div>

        <dl className="mt-6 grid gap-4">
          {meetingDetails.map((detail) => {
            const Icon = detail.icon
            return (
              <div
                key={detail.label}
                className="grid gap-3 rounded-2xl border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.74)] p-4 sm:grid-cols-[auto_1fr]"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border"
                  style={{
                    background: `rgba(${detail.accentRgb},0.06)`,
                    borderColor: `rgba(${detail.accentRgb},0.14)`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: detail.accent }} aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">{detail.label}</dt>
                  <dd className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">{detail.value}</dd>
                </div>
              </div>
            )
          })}
        </dl>

        <div className="mt-auto pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={ZOOM_MEETING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Join on Zoom
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <Link href="/service" className="btn-ghost">
              Explore Service
            </Link>
          </div>
        </div>
      </article>
    </section>
  )
}
