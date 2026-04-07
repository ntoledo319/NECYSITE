"use client"

import { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Calendar, Clock, Video } from "lucide-react"
import { ZOOM_MEETING_URL } from "@/lib/constants"
import { GearCluster } from "@/components/art/steampunk-gears"
import {
  SPRING_GENTLE,
  SpotlightCard,
  MagneticButton,
  staggerContainer,
  staggerChild,
} from "@/components/ui/motion-primitives"

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

export default function BusinessMeetingSection() {
  const [dateStr, setDateStr] = useState("")
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    setDateStr(formatMeetingDate(getNextBusinessMeetingDate()))
  }, [])

  return (
    <section id="business-meeting" aria-label="Next business meeting" className="px-4 md:px-0">
      <motion.div
        className="mb-6"
        initial={shouldReduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={SPRING_GENTLE}
      >
        <span className="section-badge section-badge-shimmer">Planning</span>
        <h2 className="section-heading mt-3" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Next Business Meeting</h2>
        <p className="mt-2 text-sm text-[var(--nec-muted)] leading-relaxed">
          Get to know us at our business meetings on Zoom! Come see how the convention is built — through committee work, updates, votes, and fellowship. There are always opportunities for service for anyone who wants to get involved.
        </p>
      </motion.div>

      <SpotlightCard
        className="nec-card nec-card-lift p-6 md:p-8 backdrop-blur-sm relative overflow-hidden"
        spotlightColor="rgba(124,58,237,0.08)"
        spotlightSize={400}
      >
        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{ maxWidth: "640px", boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}
        />
        {/* Steampunk gear accent */}
        <GearCluster className="absolute -top-3 -right-3 opacity-60" />
        <h3 className="text-lg font-bold text-[var(--nec-text)] mb-5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>NECYPAA XXXVI Business Meeting</h3>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {/* Date */}
          <motion.div variants={staggerChild} className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
            >
              <Calendar className="w-4 h-4" style={{ color: "var(--nec-cyan)" }} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--nec-muted)]">Next Date</p>
              <p className="text-sm font-bold text-[var(--nec-text)] mt-0.5">
                {dateStr || "Loading…"}
              </p>
            </div>
          </motion.div>

          {/* Time */}
          <motion.div variants={staggerChild} className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
            >
              <Clock className="w-4 h-4" style={{ color: "var(--nec-cyan)" }} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--nec-muted)]">Time</p>
              <p className="text-sm font-bold text-[var(--nec-text)] mt-0.5">2:00 PM Eastern</p>
            </div>
          </motion.div>
        </motion.div>

        <p className="text-sm text-[var(--nec-muted)] mb-5 leading-relaxed">
          All are welcome — join us on Zoom. No commitment required.
        </p>

        <MagneticButton strength={0.25}>
          <a
            href={ZOOM_MEETING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="zoom-link inline-flex items-center gap-2 font-bold text-sm rounded-xl px-5 py-2.5 transition-all duration-200 uppercase tracking-wide"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.30)",
              color: "var(--nec-cyan)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <Video className="w-4 h-4" aria-hidden="true" />
            Join on Zoom<span className="sr-only"> (opens in new tab)</span>
          </a>
        </MagneticButton>
      </SpotlightCard>
    </section>
  )
}
