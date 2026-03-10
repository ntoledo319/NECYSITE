"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Video } from "lucide-react"
import { ZOOM_MEETING_URL } from "@/lib/constants"

function getNextBusinessMeetingDate(): Date {
  const now = new Date()

  function getNthSunday(year: number, month: number, n: number): Date {
    const first = new Date(year, month, 1)
    const dayOfWeek = first.getDay()
    const daysUntilSunday = (7 - dayOfWeek) % 7
    const firstSunday = 1 + daysUntilSunday
    return new Date(year, month, firstSunday + (n - 1) * 7)
  }

  for (let offset = 0; offset < 3; offset++) {
    const ref = new Date(now.getFullYear(), now.getMonth() + offset, 1)
    const year = ref.getFullYear()
    const month = ref.getMonth()

    for (const nth of [1, 3]) {
      const meetingDate = getNthSunday(year, month, nth)
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

export default function BusinessMeetingSection() {
  const [dateStr, setDateStr] = useState("")

  useEffect(() => {
    setDateStr(formatMeetingDate(getNextBusinessMeetingDate()))
  }, [])

  return (
    <section id="business-meeting" aria-label="Next business meeting" className="px-4 md:px-0">
      <div className="mb-6">
        <span className="section-badge">Planning</span>
        <h2 className="section-heading mt-3" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Next Business Meeting</h2>
        <p className="mt-2 text-sm text-gray-400">
          Held on the 1st and 3rd Sundays of each month at 2:00 PM ET via Zoom.
        </p>
      </div>

      <div
        className="nec-card p-6 md:p-8 transition-all duration-200 backdrop-blur-sm"
        style={{ maxWidth: "640px", boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}
      >
        <h3 className="text-lg font-bold text-white mb-5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>NECYPAA XXXVI Business Meeting</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Date */}
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,212,232,0.10)", border: "1px solid rgba(0,212,232,0.20)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
            >
              <Calendar className="w-4 h-4" style={{ color: "var(--nec-cyan)" }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Next Date</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {dateStr || "Loading…"}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,212,232,0.10)", border: "1px solid rgba(0,212,232,0.20)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
            >
              <Clock className="w-4 h-4" style={{ color: "var(--nec-cyan)" }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Time</p>
              <p className="text-sm font-bold text-white mt-0.5">2:00 PM Eastern</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-5 leading-relaxed">
          All are welcome to attend our business meetings on Zoom. Come see how the convention is
          built — committees, updates, votes, and fellowship.
        </p>

        <a
          href={ZOOM_MEETING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bold text-sm rounded-xl px-5 py-2.5 transition-all duration-200 uppercase tracking-wide"
          style={{
            background: "rgba(0,212,232,0.10)",
            border: "1px solid rgba(0,212,232,0.30)",
            color: "var(--nec-cyan)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = "rgba(0,212,232,0.20)"
            el.style.boxShadow = "0 2px 16px rgba(0,212,232,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = "rgba(0,212,232,0.10)"
            el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)"
          }}
        >
          <Video className="w-4 h-4" />
          Join on Zoom
        </a>
      </div>
    </section>
  )
}
