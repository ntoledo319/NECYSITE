"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

interface MeetingProps {
  day: string
  name: string
  time: string
  location: string
  address: string
  city: string
  types: string
  url?: string
  attendance?: string
}

export function ExpandableMeetingRow({ meeting }: { meeting: MeetingProps }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsId = `meeting-details-${meeting.name.replace(/\s+/g, "-").toLowerCase()}-${meeting.day.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <>
      <tr className="border-b border-[rgba(var(--nec-purple-rgb),0.08)] align-top text-sm transition-colors duration-150 hover:bg-[rgba(var(--nec-purple-rgb),0.03)]">
        <td className="px-4 py-3 text-[var(--nec-muted)]">{meeting.day}</td>
        <td className="px-4 py-3 text-[var(--nec-muted)]">{meeting.time}</td>
        <td className="px-4 py-3 text-[var(--nec-text)]">
          {meeting.url ? (
            <a href={meeting.url} target="_blank" rel="noopener noreferrer" className="font-semibold transition-colors hover:text-[var(--nec-purple)] hover:underline">
              {meeting.name}<span className="sr-only"> (opens in new tab)</span>
            </a>
          ) : (
            meeting.name
          )}
        </td>
        <td className="px-4 py-3 text-[var(--nec-muted)]">{meeting.location}</td>
        <td className="px-4 py-3 text-[var(--nec-muted)]">{meeting.city}</td>
        <td className="px-4 py-3 text-[var(--nec-muted)]">{meeting.attendance}</td>
        <td className="px-4 py-3 text-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.88)] text-[var(--nec-purple)] transition-[border-color,background,color] duration-200 hover:border-[rgba(var(--nec-purple-rgb),0.22)] hover:bg-[rgba(var(--nec-purple-rgb),0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)]"
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            aria-label={isExpanded ? `Collapse details for ${meeting.name}` : `Expand details for ${meeting.name}`}
          >
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr id={detailsId} className="border-b border-[rgba(var(--nec-purple-rgb),0.08)] bg-[rgba(var(--nec-purple-rgb),0.035)]">
          <td colSpan={7} className="px-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(var(--nec-purple-rgb),0.08)] bg-[rgba(var(--nec-card-rgb),0.72)] px-4 py-3">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">Address</h4>
                <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">{meeting.address || "No address provided"}</p>
              </div>
              <div className="rounded-2xl border border-[rgba(var(--nec-purple-rgb),0.08)] bg-[rgba(var(--nec-card-rgb),0.72)] px-4 py-3">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">Meeting Types</h4>
                <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">{meeting.types || "No types specified"}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
