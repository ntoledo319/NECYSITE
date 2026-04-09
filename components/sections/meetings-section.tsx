"use client"

import { motion, useReducedMotion } from "framer-motion"
import { meetingsByDay, allMeetings } from "@/lib/data/meetings"
import { MeetingCard } from "@/components/meeting-card"
import { ExpandableMeetingRow } from "@/components/expandable-meeting-row"
import { Mail } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/constants"
import { staggerContainer, staggerChild, SPRING_GENTLE } from "@/components/ui/motion-primitives"

export default function MeetingsSection() {
  const shouldReduce = useReducedMotion()
  const meetingCount = allMeetings.length
  const dayCount = Object.keys(meetingsByDay).length

  return (
    <section id="meetings" aria-label="Young people's meetings in Connecticut" className="px-4 md:px-0">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="section-badge">Connecticut AA</span>
          <h2 className="section-heading mt-4">Young People&apos;s Meetings in Connecticut</h2>
          <p className="mt-3 text-base leading-7 text-[var(--nec-muted)]">
            Keep the directory readable first. Surface the meeting list clearly, then let deeper details unfold when someone needs them.
          </p>
          <p className="mt-3 text-sm text-[var(--nec-muted)]">
            Click any meeting name to view details on the CT-AA website. On desktop, click the arrow
            to expand the full address and meeting types.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:max-w-[260px]">
          <div className="rounded-2xl border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.86)] px-4 py-3 shadow-[0_16px_32px_rgba(44,24,16,0.06)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Meetings</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--nec-text)]">{meetingCount}</p>
          </div>
          <div className="rounded-2xl border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.86)] px-4 py-3 shadow-[0_16px_32px_rgba(44,24,16,0.06)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Days</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--nec-text)]">{dayCount}</p>
          </div>
        </div>
      </div>

      <div className="nec-meetings-table hidden overflow-x-auto rounded-[1.75rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.86)] shadow-[0_20px_44px_rgba(44,24,16,0.08)] md:block">
        <div className="flex items-center justify-between gap-4 border-b border-[rgba(var(--nec-purple-rgb),0.08)] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
              Weekly Directory
            </p>
            <p className="mt-1 text-sm text-[var(--nec-muted)]">
              Expand a row for address and meeting-type details.
            </p>
          </div>
        </div>
        <table className="w-full border-collapse" aria-label="Young People's AA meetings in Connecticut">
          <thead>
            <tr className="nec-meetings-thead border-b border-[rgba(var(--nec-purple-rgb),0.08)] bg-[rgba(var(--nec-purple-rgb),0.03)]">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">Day</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">Time</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">Meeting</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">Location</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">City</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">Attendance</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">Details</th>
            </tr>
          </thead>
          <tbody>
            {allMeetings.map((meeting, index) => (
              <ExpandableMeetingRow key={index} meeting={meeting} />
            ))}
          </tbody>
        </table>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 md:hidden"
        variants={shouldReduce ? undefined : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        <div className="rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.84)] px-4 py-4 shadow-[0_16px_34px_rgba(44,24,16,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
            Mobile View
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
            Browse by day, then follow the linked meeting name for the latest CT-AA details.
          </p>
        </div>
        {Object.entries(meetingsByDay).map(([day, meetings]) => (
          <motion.div key={day} variants={staggerChild}>
            <MeetingCard day={day} meetings={meetings} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-6 flex flex-col gap-4 rounded-[1.75rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[linear-gradient(135deg,rgba(var(--nec-purple-rgb),0.04),rgba(var(--nec-card-rgb),0.92))] p-6 shadow-[0_22px_48px_rgba(44,24,16,0.08)] sm:flex-row sm:items-center"
        initial={shouldReduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
      >
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
            Missing One?
          </p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--nec-text)]">Add Your Meeting</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
            Know of a young people&apos;s meeting that&apos;s not on our list? Send us the details and we&apos;ll
            get it added.
          </p>
        </div>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.94)] px-4 py-2.5 text-sm font-semibold text-[var(--nec-purple)] shadow-[0_14px_30px_rgba(44,24,16,0.08)] transition-[border-color,background,transform] duration-200 hover:-translate-y-0.5 hover:border-[rgba(var(--nec-purple-rgb),0.24)] hover:bg-[rgba(var(--nec-purple-rgb),0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)]"
        >
          <Mail className="w-4 h-4" aria-hidden="true" />
          {CONTACT_EMAIL}
        </a>
      </motion.div>
    </section>
  )
}
