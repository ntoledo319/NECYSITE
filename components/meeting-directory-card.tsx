"use client"

import { Clock, ExternalLink, Globe, Info, MapPin } from "lucide-react"
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
    accentRgb: "var(--nec-pink-rgb)",
    badge: {
      "in-person": {
        bg: "rgba(var(--nec-cyan-rgb),0.08)",
        border: "rgba(var(--nec-cyan-rgb),0.18)",
        color: "var(--nec-cyan)",
        label: "In-Person",
      },
      online: {
        bg: "rgba(var(--nec-purple-rgb),0.08)",
        border: "rgba(var(--nec-purple-rgb),0.18)",
        color: "var(--nec-purple)",
        label: "Online",
      },
      hybrid: {
        bg: "rgba(var(--nec-pink-rgb),0.08)",
        border: "rgba(var(--nec-pink-rgb),0.18)",
        color: "var(--nec-pink)",
        label: "Hybrid",
      },
    },
  },
  blue: {
    accent: "var(--alanon-blue)",
    accentRgb: "var(--alanon-blue-rgb)",
    badge: {
      "in-person": {
        bg: "rgba(var(--alanon-blue-rgb),0.08)",
        border: "rgba(var(--alanon-blue-rgb),0.18)",
        color: "var(--alanon-blue)",
        label: "In-Person",
      },
      online: {
        bg: "rgba(var(--nec-purple-rgb),0.08)",
        border: "rgba(var(--nec-purple-rgb),0.18)",
        color: "var(--nec-purple)",
        label: "Online",
      },
      hybrid: {
        bg: "rgba(var(--alanon-blue-rgb),0.08)",
        border: "rgba(var(--alanon-blue-rgb),0.15)",
        color: "var(--alanon-blue)",
        label: "Hybrid",
      },
    },
  },
} as const

export default function MeetingDirectoryCard({ meeting, theme = "pink" }: MeetingDirectoryCardProps) {
  const t = THEME_COLORS[theme]
  const formatBadge = t.badge[meeting.format]
  const hasLocation = meeting.location && meeting.location !== "Unknown"
  const hasOnlineUrl = Boolean(meeting.onlineUrl)

  return (
    <article className="nec-card h-full p-5">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <h3 className="text-base font-semibold leading-tight text-[var(--nec-text)]">{meeting.name}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{
                  background: formatBadge.bg,
                  border: `1px solid ${formatBadge.border}`,
                  color: formatBadge.color,
                }}
              >
                {meeting.format === "in-person" ? (
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <Globe className="h-3 w-3" aria-hidden="true" />
                )}
                {formatBadge.label}
              </span>
              {meeting.type && (
                <span className="rounded-full border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] px-2.5 py-1 text-[11px] font-medium text-[var(--nec-muted)]">
                  {meeting.type}
                </span>
              )}
              {meeting.ageRange && (
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-medium"
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
          </div>

          <span
            className="flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{
              background: `rgba(${t.accentRgb},0.08)`,
              color: t.accent,
              border: `1px solid rgba(${t.accentRgb},0.16)`,
            }}
          >
            {meeting.state}
          </span>
        </div>

        <div className="grid gap-3 border-y border-[rgba(var(--nec-purple-rgb),0.08)] py-4">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: t.accent }} aria-hidden="true" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">When</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-[var(--nec-text)]">
                {meeting.day && meeting.time
                  ? `${meeting.day} • ${meeting.time}`
                  : meeting.day || meeting.time || "Contact for schedule"}
              </p>
            </div>
          </div>

          {(meeting.city || hasLocation) && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: t.accent }} aria-hidden="true" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Where</p>
                <p className="mt-1 text-sm leading-6 text-[var(--nec-text)]">
                  {meeting.city && hasLocation
                    ? `${meeting.city} — ${meeting.location}`
                    : meeting.city || meeting.location}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 text-sm">
          {hasOnlineUrl && (
            <a
              href={meeting.onlineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
              style={{ color: t.accent }}
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              Join Online
              {meeting.meetingId && <span className="text-[var(--nec-muted)]">({meeting.meetingId})</span>}
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          )}

          {meeting.notes && (
            <p className="flex items-start gap-2 text-sm leading-6 text-[var(--nec-muted)]">
              <Info className="mt-1 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>{meeting.notes}</span>
            </p>
          )}
        </div>

        {meeting.contactUrl && meeting.contactUrl.startsWith("http") && (
          <div className="mt-auto pt-3">
            <a
              href={meeting.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
            >
              Source / More Info
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        )}
      </div>
    </article>
  )
}
