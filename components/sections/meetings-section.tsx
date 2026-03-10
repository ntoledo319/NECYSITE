"use client"

import { meetingsByDay, allMeetings } from "@/lib/data/meetings"
import { MeetingCard } from "@/components/meeting-card"
import { ExpandableMeetingRow } from "@/components/expandable-meeting-row"
import { Mail } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/constants"

export default function MeetingsSection() {
  return (
    <section id="meetings" aria-label="Young people's meetings in Connecticut" className="px-4 md:px-0">
      <div className="mb-6">
        <span className="section-badge">Connecticut AA</span>
        <h2 className="section-heading mt-3">Young People&apos;s Meetings in Connecticut</h2>
        <p className="mt-2 text-sm text-gray-400">
          Click any meeting name to view details on the CT-AA website. On desktop, click the arrow
          to expand the full address and meeting types.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl" style={{ border: "1px solid var(--nec-border)" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: "var(--nec-card)", borderBottom: "1px solid var(--nec-border)" }}>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">Day</th>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">Time</th>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">Meeting</th>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">Location</th>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">City</th>
              <th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">Attendance</th>
              <th className="p-3 text-center text-xs font-bold uppercase tracking-widest text-gray-400">Details</th>
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
      <div className="md:hidden grid grid-cols-1 gap-4">
        {Object.entries(meetingsByDay).map(([day, meetings]) => (
          <MeetingCard key={day} day={day} meetings={meetings} />
        ))}
      </div>

      {/* Add your meeting */}
      <div
        className="mt-6 nec-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <div className="flex-1">
          <h3 className="font-bold text-white mb-1">Add Your Meeting</h3>
          <p className="text-sm text-gray-400">
            Know of a young people&apos;s meeting that&apos;s not on our list? Send us the details and we&apos;ll
            get it added.
          </p>
        </div>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 font-semibold text-sm rounded-xl px-4 py-2.5 transition-all duration-200 flex-shrink-0"
          style={{
            background: "rgba(0,212,232,0.10)",
            border: "1px solid rgba(0,212,232,0.30)",
            color: "var(--nec-cyan)",
          }}
        >
          <Mail className="w-4 h-4" />
          {CONTACT_EMAIL}
        </a>
      </div>
    </section>
  )
}
