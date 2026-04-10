"use client"

import { useState, useMemo, useCallback } from "react"
import {
  MapPin,
  ChevronDown,
  CalendarPlus,
  Smartphone,
  Monitor,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { GOOGLE_CALENDAR_ID } from "@/lib/constants"
import type { CalendarEvent, EventCategory } from "@/lib/calendar/types"
import EventDetailModal from "./event-detail-modal"

// ─── Calendar subscription URLs ───────────────────────────────────

const ICS_FEED = `https://calendar.google.com/calendar/ical/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/public/basic.ics`
const SUBSCRIBE_GOOGLE = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(`webcal://calendar.google.com/calendar/ical/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/public/basic.ics`)}`
const SUBSCRIBE_WEBCAL = `webcal://calendar.google.com/calendar/ical/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/public/basic.ics`
const SUBSCRIBE_ICAL = ICS_FEED

// ─── Category styling ─────────────────────────────────────────────

const CATEGORY_META: Record<
  EventCategory,
  { colorVar: string; rgbVar: string; labelKey: string }
> = {
  "host-business": {
    colorVar: "--nec-purple",
    rgbVar: "--nec-purple-rgb",
    labelKey: "hostBusiness",
  },
  "host-event": {
    colorVar: "--nec-pink",
    rgbVar: "--nec-pink-rgb",
    labelKey: "hostEvent",
  },
  external: {
    colorVar: "--nec-cyan",
    rgbVar: "--nec-cyan-rgb",
    labelKey: "external",
  },
}

const ALL_CATEGORIES: EventCategory[] = ["host-business", "host-event", "external"]

// ─── Date helpers ─────────────────────────────────────────────────

function safeDate(iso: string): Date {
  if (!iso.includes("T")) return new Date(`${iso}T12:00:00`)
  return new Date(iso)
}

function isAllDay(start: string): boolean {
  return !start.includes("T")
}

function formatCardDate(iso: string): string {
  return safeDate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  })
}

function formatCardTime(iso: string): string {
  return safeDate(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  })
}

function getMonthKey(iso: string): string {
  return safeDate(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/New_York",
  })
}

function formatBrowseDate(iso: string): { month: string; day: string } {
  const d = safeDate(iso)
  return {
    month: d.toLocaleDateString("en-US", { month: "short", timeZone: "America/New_York" }),
    day: d.toLocaleDateString("en-US", { day: "numeric", timeZone: "America/New_York" }),
  }
}

// ─── Component ────────────────────────────────────────────────────

export default function CalendarClient({ events }: { events: CalendarEvent[] }) {
  const t = useTranslations("calendar")

  const [activeCategories, setActiveCategories] = useState<Set<EventCategory>>(
    new Set(["host-business", "host-event"])
  )
  const [timeframe, setTimeframe] = useState<"upcoming" | "past">("upcoming")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [expanded, setExpanded] = useState(false)

  const now = useMemo(() => new Date(), [])

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (!activeCategories.has(e.category)) return false
      const eventDate = safeDate(e.start)
      return timeframe === "upcoming" ? eventDate >= now : eventDate < now
    })
  }, [events, activeCategories, timeframe, now])

  // Show first 6 events inline, rest behind expander
  const INLINE_COUNT = 6
  const visibleEvents = useMemo(() => {
    if (timeframe === "past") return [...filteredEvents].reverse().slice(0, INLINE_COUNT)
    return filteredEvents.slice(0, INLINE_COUNT)
  }, [filteredEvents, timeframe])
  const remainingCount = Math.max(0, filteredEvents.length - INLINE_COUNT)

  const browseByMonth = useMemo(() => {
    const eventsToGroup = timeframe === "past" ? [...filteredEvents].reverse() : filteredEvents
    const groups: { month: string; events: CalendarEvent[] }[] = []
    for (const event of eventsToGroup) {
      const key = getMonthKey(event.start)
      const last = groups[groups.length - 1]
      if (last && last.month === key) {
        last.events.push(event)
      } else {
        groups.push({ month: key, events: [event] })
      }
    }
    return groups
  }, [filteredEvents, timeframe])

  const toggleCategory = useCallback((cat: EventCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }, [])

  const resetFilters = useCallback(() => {
    setActiveCategories(new Set(["host-business", "host-event"]))
    setTimeframe("upcoming")
  }, [])

  const hasEvents = events.length > 0
  const hasFilteredEvents = filteredEvents.length > 0

  return (
    <div className="space-y-3">
      {/* ── Compact controls row ─────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Time toggle — compact */}
        <div
          className="inline-flex rounded-lg p-0.5 flex-shrink-0"
          style={{
            backgroundColor: "rgba(var(--nec-purple-rgb), 0.06)",
            border: "1px solid rgba(var(--nec-purple-rgb), 0.12)",
          }}
          role="radiogroup"
          aria-label="Time range"
        >
          {(["upcoming", "past"] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              role="radio"
              aria-checked={timeframe === tf}
              onClick={() => setTimeframe(tf)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
              style={
                timeframe === tf
                  ? { backgroundColor: "var(--nec-purple)", color: "white" }
                  : { color: "var(--nec-muted)" }
              }
            >
              {t(tf)}
            </button>
          ))}
        </div>

        {/* Category pills — compact */}
        {ALL_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat]
          const active = activeCategories.has(cat)
          return (
            <button
              key={cat}
              type="button"
              role="switch"
              aria-checked={active}
              onClick={() => toggleCategory(cat)}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 min-h-[2.75rem]"
              style={
                active
                  ? {
                      backgroundColor: `rgba(var(${meta.rgbVar}), 0.14)`,
                      color: `var(${meta.colorVar})`,
                      border: `1.5px solid rgba(var(${meta.rgbVar}), 0.30)`,
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "var(--nec-muted)",
                      border: "1.5px solid rgba(var(--nec-purple-rgb), 0.10)",
                      opacity: 0.5,
                    }
              }
            >
              {t(meta.labelKey)}
            </button>
          )
        })}

      </div>

      {/* ── SR live region ────────────────────────────────── */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {hasFilteredEvents
          ? `${filteredEvents.length} events shown`
          : "No events match current filters"}
      </div>

      {/* ── Event list (up to 6 inline) ────────────────── */}
      {visibleEvents.length > 0 && (
        <div className="-mx-1">
          {visibleEvents.map((event) => {
            const meta = CATEGORY_META[event.category]
            const { day } = formatBrowseDate(event.start)
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedEvent(event)}
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nec-purple)] min-h-[2.75rem]"
                aria-label={`${t("viewDetails")}: ${event.title}`}
              >
                <span className="w-6 text-right text-xs font-bold tabular-nums flex-shrink-0 text-[var(--nec-muted)]">
                  {day}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `var(${meta.colorVar})` }}
                  aria-hidden="true"
                />
                <span className="text-sm text-[var(--nec-text)] truncate flex-1">
                  {event.title}
                </span>
                <span className="text-[11px] text-[var(--nec-muted)] flex-shrink-0 tabular-nums">
                  {isAllDay(event.start) ? formatCardDate(event.start).split(", ")[0] : formatCardTime(event.start)}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Expand / collapse full calendar ──────────────── */}
      {hasFilteredEvents && filteredEvents.length > INLINE_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.04)] rounded-xl min-h-[2.75rem]"
          style={{ color: "var(--nec-purple)" }}
          aria-expanded={expanded}
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
          {expanded ? "Collapse" : `${remainingCount} more — view full calendar`}
        </button>
      )}

      {/* ── Full browse list (collapsed by default) ──────── */}
      {expanded && browseByMonth.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-[rgba(var(--nec-purple-rgb),0.08)]">
          {browseByMonth.map((group) => (
            <div key={group.month}>
              <h4
                className="text-[10px] font-bold uppercase tracking-widest mb-2 pb-1.5 border-b"
                style={{
                  color: "var(--nec-muted)",
                  borderColor: "rgba(var(--nec-purple-rgb), 0.08)",
                }}
              >
                {group.month}
              </h4>
              <div className="space-y-0.5">
                {group.events.map((event) => {
                  const meta = CATEGORY_META[event.category]
                  const { day } = formatBrowseDate(event.start)
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nec-purple)] min-h-[2.75rem]"
                      aria-label={`${t("viewDetails")}: ${event.title}`}
                    >
                      <span className="w-6 text-right text-xs font-bold tabular-nums flex-shrink-0 text-[var(--nec-muted)]">
                        {day}
                      </span>
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `var(${meta.colorVar})` }}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-[var(--nec-text)] truncate flex-1">
                        {event.title}
                      </span>
                      {event.location && (
                        <span className="hidden md:flex items-center gap-1 text-[11px] text-[var(--nec-muted)] truncate max-w-[10rem]">
                          <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                          <span className="truncate">{event.location}</span>
                        </span>
                      )}
                      <span className="text-[11px] text-[var(--nec-muted)] flex-shrink-0 tabular-nums">
                        {isAllDay(event.start) ? t("allDay") : formatCardTime(event.start)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Subscribe to calendar ─────────────────────────── */}
      {hasEvents && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-[rgba(var(--nec-purple-rgb),0.08)]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--nec-muted)]">
            Sync to your phone
          </span>
          <a
            href={SUBSCRIBE_GOOGLE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold transition-opacity hover:opacity-75 py-1 min-h-[2.75rem]"
            style={{ color: "var(--nec-purple)" }}
          >
            <Monitor className="w-3 h-3" aria-hidden="true" />
            Google
          </a>
          <a
            href={SUBSCRIBE_WEBCAL}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold transition-opacity hover:opacity-75 py-1 min-h-[2.75rem]"
            style={{ color: "var(--nec-pink)" }}
          >
            <Smartphone className="w-3 h-3" aria-hidden="true" />
            Apple
          </a>
          <a
            href={SUBSCRIBE_ICAL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold transition-opacity hover:opacity-75 py-1 min-h-[2.75rem]"
            style={{ color: "var(--nec-cyan)" }}
          >
            <CalendarPlus className="w-3 h-3" aria-hidden="true" />
            Outlook / iCal
          </a>
        </div>
      )}

      {/* ── Empty states ──────────────────────────────────── */}
      {hasEvents && !hasFilteredEvents && (
        <div className="text-center py-4 space-y-2">
          <p className="text-sm italic text-[var(--nec-muted)]">
            Curiouser and curiouser&hellip; nothing matches those filters.
          </p>
          <button type="button" onClick={resetFilters} className="btn-ghost !text-xs">
            {t("resetFilters")}
          </button>
        </div>
      )}

      {!hasEvents && (
        <div className="text-center py-4">
          <p className="text-sm italic text-[var(--nec-muted)]">
            The calendar is quiet for now. Check back soon.
          </p>
        </div>
      )}

      {/* ── Modal ──────────────────────────────────────────── */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}
