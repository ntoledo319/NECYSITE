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

  return (
    <section id="meetings" aria-label="Young people's meetings in Connecticut" className="px-4 md:px-0">
      <div className="mb-6">
        <span className="section-badge">Connecticut AA</span>
        <h2 className="section-heading mt-3" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Young People&apos;s Meetings in Connecticut</h2>
        <p className="mt-2 text-sm text-[var(--nec-muted)]">
          Click any meeting name to view details on the CT-AA website. On desktop, click the arrow
          to expand the full address and meeting types.
        </p>
      </div>

      {/* Desktop table */}
      <div className="nec-meetings-table hidden md:block overflow-x-auto rounded-2xl" style={{ border: "1px solid var(--nec-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="nec-meetings-thead" style={{ background: "linear-gradient(135deg, rgba(26,16,48,0.95) 0%, rgba(15,10,30,1) 100%)", borderBottom: "1px solid var(--nec-border)" }}>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">Day</th>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">Time</th>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">Meeting</th>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">Location</th>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">City</th>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">Attendance</th>
              <th className="p-3 text-center text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">Details</th>
            </tr>
          </thead>
          <tbody>
            {allMeetings.map((meeting, i) => (
              <ExpandableMeetingRow key={i} meeting={meeting} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <motion.div
        className="md:hidden grid grid-cols-1 gap-4"
        variants={shouldReduce ? undefined : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {Object.entries(meetingsByDay).map(([day, meetings]) => (
          <motion.div key={day} variants={staggerChild}>
            <MeetingCard day={day} meetings={meetings} />
          </motion.div>
        ))}
      </motion.div>

      {/* Add your meeting */}
      <motion.div
        className="mt-6 nec-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        initial={shouldReduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)" }}
      >
        <div className="flex-1">
          <h3 className="font-bold text-white mb-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>Add Your Meeting</h3>
          <p className="text-sm text-[var(--nec-muted)]">
            Know of a young people&apos;s meeting that&apos;s not on our list? Send us the details and we&apos;ll
            get it added.
          </p>
        </div>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 font-semibold text-sm rounded-xl px-4 py-2.5 transition-all duration-200 flex-shrink-0"
          style={{
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.25)",
            color: "var(--nec-cyan)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <Mail className="w-4 h-4" aria-hidden="true" />
          {CONTACT_EMAIL}
        </a>
      </motion.div>
    </section>
  )
}
