"use client"

import { MapPin, Globe, Clock, ExternalLink, Info } from "lucide-react"
import type { MeetingFormat } from "@/lib/data/ypaa-meetings"

export interface MeetingDirectoryItem {
  name: string
  state: string
  city: string
  day: string
  time: string
  format: MeetingFormat
  type?: string
  location?: string
  onlineUrl?: string
  meetingId?: string
  contactUrl?: string
  notes?: string
  ageRange?: string
}

type ColorTheme = "pink" | "blue"

interface MeetingDirectoryCardProps {
  meeting: MeetingDirectoryItem
  theme?: ColorTheme
}

const THEME_COLORS = {
  pink: {
    accent: "var(--nec-pink)",
    accentRgb: "192,38,211",
    nameHover: "rgba(192,38,211,0.08)",
    badge: {
      "in-person": { bg: "rgba(20,184,166,0.10)", border: "rgba(20,184,166,0.25)", color: "var(--nec-cyan)", label: "In-Person" },
      online: { bg: "rgba(124,58,237,0.10)", border: "rgba(124,58,237,0.25)", color: "var(--nec-purple)", label: "Online" },
      hybrid: { bg: "rgba(192,38,211,0.10)", border: "rgba(192,38,211,0.25)", color: "var(--nec-pink)", label: "Hybrid" },
    },
  },
  blue: {
    accent: "var(--alanon-blue)",
    accentRgb: "0,147,208",
    nameHover: "rgba(0,147,208,0.08)",
    badge: {
      "in-person": { bg: "rgba(0,147,208,0.10)", border: "rgba(0,147,208,0.25)", color: "var(--alanon-blue)", label: "In-Person" },
      online: { bg: "rgba(124,58,237,0.10)", border: "rgba(124,58,237,0.25)", color: "var(--nec-purple)", label: "Online" },
      hybrid: { bg: "rgba(0,147,208,0.10)", border: "rgba(0,147,208,0.20)", color: "var(--alanon-blue)", label: "Hybrid" },
    },
  },
} as const

export default function MeetingDirectoryCard({ meeting, theme = "pink" }: MeetingDirectoryCardProps) {
  const t = THEME_COLORS[theme]
  const formatBadge = t.badge[meeting.format]
  const hasLocation = meeting.location && meeting.location !== "Unknown"
  const hasOnlineUrl = Boolean(meeting.onlineUrl)

  return (
    <article
      className="nec-meeting-dir-card group/mcard rounded-xl p-4 transition-all duration-200"
      style={{
        background: `linear-gradient(135deg, rgba(${t.accentRgb},0.03) 0%, rgba(var(--nec-card-rgb),0.8) 100%)`,
        border: `1px solid rgba(${t.accentRgb},0.12)`,
      }}
    >
      {/* Header: Name + State badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          className="text-sm font-bold leading-tight text-[var(--nec-text)]"
        >
          {meeting.name}
        </h3>
        <span
          className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
          style={{
            background: `rgba(${t.accentRgb},0.10)`,
            color: t.accent,
            border: `1px solid rgba(${t.accentRgb},0.20)`,
          }}
        >
          {meeting.state}
        </span>
      </div>

      {/* Day + Time */}
      <div className="flex items-center gap-1.5 mb-2">
        <Clock
          className="w-3.5 h-3.5 flex-shrink-0"
          style={{ color: t.accent }}
          aria-hidden="true"
        />
        <span className="text-xs font-semibold" style={{ color: "var(--nec-text)" }}>
          {meeting.day && meeting.time
            ? `${meeting.day} \u2022 ${meeting.time}`
            : meeting.day || meeting.time || "Contact for schedule"}
        </span>
      </div>

      {/* Format badge */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span
          className="nec-meeting-badge inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
          style={{
            background: formatBadge.bg,
            border: `1px solid ${formatBadge.border}`,
            color: formatBadge.color,
          }}
        >
          {meeting.format === "in-person" ? (
            <MapPin className="w-2.5 h-2.5" aria-hidden="true" />
          ) : (
            <Globe className="w-2.5 h-2.5" aria-hidden="true" />
          )}
          {formatBadge.label}
        </span>
        {meeting.type && (
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-md"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--nec-muted)",
            }}
          >
            {meeting.type}
          </span>
        )}
        {meeting.ageRange && (
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-md"
            style={{
              background: `rgba(${t.accentRgb},0.06)`,
              border: `1px solid rgba(${t.accentRgb},0.15)`,
              color: t.accent,
            }}
          >
            {meeting.ageRange}
          </span>
        )}
      </div>

      {/* City + Location */}
      {(meeting.city || hasLocation) && (
        <p
          className="text-xs leading-relaxed mb-1"
          style={{ color: "var(--nec-muted)" }}
        >
          <MapPin className="w-3 h-3 inline-block mr-1 -mt-0.5" style={{ color: t.accent }} aria-hidden="true" />
          {meeting.city && hasLocation
            ? `${meeting.city} — ${meeting.location}`
            : meeting.city || meeting.location}
        </p>
      )}

      {/* Online link */}
      {hasOnlineUrl && (
        <a
          href={meeting.onlineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:underline mb-1"
          style={{ color: t.accent }}
        >
          <Globe className="w-3 h-3" aria-hidden="true" />
          Join Online
          {meeting.meetingId && (
            <span style={{ color: "var(--nec-muted)" }}> ({meeting.meetingId})</span>
          )}
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      )}

      {/* Notes */}
      {meeting.notes && (
        <p className="flex items-start gap-1 text-[11px] mt-2 leading-relaxed" style={{ color: "var(--nec-muted)" }}>
          <Info className="w-3 h-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
          {meeting.notes}
        </p>
      )}

      {/* Contact/source link */}
      {meeting.contactUrl && meeting.contactUrl.startsWith("http") && (
        <div className="mt-2 pt-2 border-t" style={{ borderColor: `rgba(${t.accentRgb},0.08)` }}>
          <a
            href={meeting.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium transition-colors hover:underline"
            style={{ color: "var(--nec-muted)" }}
          >
            Source / More Info
            <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      )}
    </article>
  )
}
