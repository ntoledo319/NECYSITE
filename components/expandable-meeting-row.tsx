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
      <tr
        className="border-b transition-colors duration-150"
        style={{ borderColor: "var(--nec-border)" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.04)" }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
      >
        <td className="p-3 text-gray-300">{meeting.day}</td>
        <td className="p-3 text-gray-300">{meeting.time}</td>
        <td className="p-3 text-gray-300">
          {meeting.url ? (
            <a href={meeting.url} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--nec-cyan)" }}>
              {meeting.name}<span className="sr-only"> (opens in new tab)</span>
            </a>
          ) : (
            meeting.name
          )}
        </td>
        <td className="p-3 text-gray-300">{meeting.location}</td>
        <td className="p-3 text-gray-300">{meeting.city}</td>
        <td className="p-3 text-gray-300">{meeting.attendance}</td>
        <td className="p-3 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-cyan)] rounded"
            style={{ color: "var(--nec-cyan)" }}
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            aria-label={isExpanded ? `Collapse details for ${meeting.name}` : `Expand details for ${meeting.name}`}
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr id={detailsId} style={{ background: "rgba(124,58,237,0.04)", borderBottom: "1px solid var(--nec-border)" }}>
          <td colSpan={7} className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-1">Address:</h4>
                <p className="text-gray-300">{meeting.address || "No address provided"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-1">Meeting Types:</h4>
                <p className="text-gray-300">{meeting.types || "No types specified"}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
