"use client"

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
import type { CalendarEvent } from "@/lib/calendar/types"

function formatMeetingDate(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`)
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  })
}

function formatMeetingTime(iso: string): string {
  if (!iso.includes("T")) return "See calendar for time"
  const d = new Date(iso)
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  })
}

export default function BusinessMeetingSection({ nextMeeting }: { nextMeeting?: CalendarEvent }) {
  const shouldReduce = useReducedMotion()

  const dateStr = nextMeeting ? formatMeetingDate(nextMeeting.start) : ""
  const timeStr = nextMeeting ? formatMeetingTime(nextMeeting.start) : ""

  return (
    <section id="business-meeting" aria-label="Next host committee business meeting" className="px-4 md:px-0">
      <motion.div
        className="mb-6"
        initial={shouldReduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={SPRING_GENTLE}
      >
        <span className="section-badge section-badge-shimmer">Host Committee</span>
        <h2 className="section-heading mt-3" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
          Next Business Meeting
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--nec-muted)]">
          Get to know us at our host committee business meetings on Zoom! Come see how the convention is built — through
          committee work, updates, votes, and fellowship. There are always opportunities for service for anyone who
          wants to get involved.
        </p>
      </motion.div>

      <SpotlightCard
        className="nec-card nec-card-lift relative overflow-hidden p-6 backdrop-blur-sm md:p-8"
        spotlightColor="rgba(124,58,237,0.08)"
        spotlightSize={400}
      >
        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{ maxWidth: "640px", boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)" }}
        />
        <GearCluster className="absolute -right-3 -top-3 opacity-60" />
        <h3 className="mb-5 text-lg font-bold text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
          NECYPAA XXXVI Host Committee Business Meeting
        </h3>

        <motion.div
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={staggerChild} className="flex items-start gap-3">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.25)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <Calendar className="h-4 w-4" style={{ color: "var(--nec-cyan)" }} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--nec-muted)]">Next Date</p>
              <p className="mt-0.5 text-sm font-bold text-white">
                {nextMeeting ? dateStr : "Check the calendar for upcoming dates"}
              </p>
            </div>
          </motion.div>

          <motion.div variants={staggerChild} className="flex items-start gap-3">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.25)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <Clock className="h-4 w-4" style={{ color: "var(--nec-cyan)" }} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--nec-muted)]">Time</p>
              <p className="mt-0.5 text-sm font-bold text-white">{nextMeeting ? timeStr : "See calendar"}</p>
            </div>
          </motion.div>
        </motion.div>

        <p className="mb-5 text-sm leading-relaxed text-[var(--nec-muted)]">
          All are welcome — join us on Zoom. No commitment required.
        </p>

        <MagneticButton strength={0.25}>
          <a
            href={ZOOM_MEETING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="zoom-link inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-all duration-200"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.30)",
              color: "var(--nec-cyan)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <Video className="h-4 w-4" aria-hidden="true" />
            Join on Zoom<span className="sr-only"> (opens in new tab)</span>
          </a>
        </MagneticButton>
      </SpotlightCard>
    </section>
  )
}
