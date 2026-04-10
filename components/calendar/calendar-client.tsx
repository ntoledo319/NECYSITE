"use client"

import { useState, useMemo, useCallback } from "react"
import {
  Calendar,
  MapPin,
  ChevronRight,
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

/**
 * Parse an event date string safely.
 * Date-only strings (YYYY-MM-DD) are parsed as local noon to avoid
 * the UTC-midnight-rollover bug (Apr 25 UTC midnight = Apr 24 8pm ET).
 */
function safeDate(iso: string): Date {
  if (!iso.includes("T")) {
    return new Date(`${iso}T12:00:00`)
  }
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

  // State
  const [activeCategories, setActiveCategories] = useState<Set<EventCategory>>(
    new Set(["host-business", "host-event"])
  )
  const [timeframe, setTimeframe] = useState<"upcoming" | "past">("upcoming")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  // Derived data
  const now = useMemo(() => new Date(), [])

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (!activeCategories.has(e.category)) return false
      const eventDate = safeDate(e.start)
      return timeframe === "upcoming" ? eventDate >= now : eventDate < now
    })
  }, [events, activeCategories, timeframe, now])

  const heroEvents = useMemo(
    () => (timeframe === "upcoming" ? filteredEvents.slice(0, 5) : filteredEvents.slice(-5).reverse()),
    [filteredEvents, timeframe]
  )

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

  // Handlers
  const toggleCategory = useCallback((cat: EventCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) {
        next.delete(cat)
      } else {
        next.add(cat)
      }
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
    <div className="space-y-8 md:space-y-10">
      {/* ── Filters row ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Time toggle */}
        <div
          className="inline-flex rounded-xl p-1 flex-shrink-0"
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
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 min-w-[5.5rem]"
              style={
                timeframe === tf
                  ? {
                      backgroundColor: "var(--nec-purple)",
                      color: "white",
                      boxShadow: "var(--shadow-card)",
                    }
                  : { color: "var(--nec-muted)" }
              }
            >
              {t(tf)}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category filters">
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
                className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 min-h-[2.75rem] min-w-[2.75rem]"
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
                        opacity: 0.6,
                      }
                }
              >
                {t(meta.labelKey)}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Live region for screen readers ────────────────── */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {hasFilteredEvents
          ? `${filteredEvents.length} events shown`
          : "No events match current filters"}
      </div>

      {/* ── Hero Agenda ───────────────────────────────────── */}
      {hasEvents && hasFilteredEvents && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {heroEvents.map((event, i) => {
            const meta = CATEGORY_META[event.category]
            const { month, day } = formatBrowseDate(event.start)
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedEvent(event)}
                className={`group relative text-left rounded-[1.85rem] overflow-hidden border p-5 transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nec-purple)] focus-visible:ring-offset-2 ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
                style={{
                  backgroundColor: `rgba(var(${meta.rgbVar}), 0.03)`,
                  borderColor: `rgba(var(${meta.rgbVar}), 0.14)`,
                  backgroundImage: `linear-gradient(145deg, rgba(var(${meta.rgbVar}), 0.06), rgba(var(--nec-card-rgb), 0.92))`,
                }}
                aria-label={`${t("viewDetails")}: ${event.title}`}
              >
                {/* Top gradient accent */}
                <div
                  className="absolute inset-x-0 top-0 h-[3px]"
                  aria-hidden="true"
                  style={{
                    background: `linear-gradient(90deg, rgba(var(${meta.rgbVar}), 0.35) 0%, var(${meta.colorVar}) 50%, rgba(var(${meta.rgbVar}), 0.35) 100%)`,
                  }}
                />

                <div className="flex gap-4">
                  {/* Date pillar */}
                  <div
                    className="flex flex-col items-center justify-center w-12 flex-shrink-0 rounded-xl py-2"
                    style={{
                      backgroundColor: `rgba(var(${meta.rgbVar}), 0.08)`,
                      border: `1px solid rgba(var(${meta.rgbVar}), 0.14)`,
                    }}
                    aria-hidden="true"
                  >
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: `var(${meta.colorVar})` }}
                    >
                      {month}
                    </span>
                    <span
                      className="text-xl font-bold leading-none"
                      style={{ color: `var(${meta.colorVar})` }}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Category chip */}
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `rgba(var(${meta.rgbVar}), 0.10)`,
                        color: `var(${meta.colorVar})`,
                      }}
                    >
                      {t(meta.labelKey)}
                    </span>

                    {/* Title */}
                    <h3 className="text-sm font-bold leading-snug text-[var(--nec-text)] line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
                      {event.title}
                    </h3>

                    {/* Date + time */}
                    <p className="text-xs text-[var(--nec-muted)]">
                      {formatCardDate(event.start)}
                      {!isAllDay(event.start) && ` · ${formatCardTime(event.start)}`}
                    </p>

                    {/* Location */}
                    {event.location && (
                      <p className="text-xs text-[var(--nec-muted)] flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{event.location}</span>
                      </p>
                    )}
                  </div>

                  {/* Chevron */}
                  <ChevronRight
                    className="w-4 h-4 flex-shrink-0 self-center opacity-30 group-hover:opacity-60 transition-opacity"
                    style={{ color: `var(${meta.colorVar})` }}
                    aria-hidden="true"
                  />
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Empty states ──────────────────────────────────── */}
      {hasEvents && !hasFilteredEvents && (
        <div className="text-center py-12 space-y-4">
          <Calendar
            className="w-10 h-10 mx-auto opacity-30"
            style={{ color: "var(--nec-purple)" }}
            aria-hidden="true"
          />
          <p className="text-sm text-[var(--nec-muted)]">
            {t("noEventsFiltered", {
              category: [...activeCategories].map((c) => t(CATEGORY_META[c].labelKey)).join(", ") || "selected",
              timeframe: t(timeframe),
            })}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="btn-ghost !text-xs"
          >
            {t("resetFilters")}
          </button>
        </div>
      )}

      {!hasEvents && (
        <div className="text-center py-12 space-y-4">
          <Calendar
            className="w-10 h-10 mx-auto opacity-30"
            style={{ color: "var(--nec-purple)" }}
            aria-hidden="true"
          />
          <p className="text-sm text-[var(--nec-muted)]">{t("noEvents")}</p>
        </div>
      )}

      {/* ── Browse List (grouped by month) ────────────────── */}
      {hasFilteredEvents && browseByMonth.length > 0 && (
        <section aria-label={t("browseHeading")}>
          <h3 className="text-lg font-bold text-[var(--nec-text)] mb-4 font-heading">
            {t("browseHeading")}
          </h3>

          <div className="space-y-6">
            {browseByMonth.map((group) => (
              <div key={group.month}>
                <h4
                  className="text-xs font-bold uppercase tracking-widest mb-3 pb-2 border-b"
                  style={{
                    color: "var(--nec-muted)",
                    borderColor: "rgba(var(--nec-purple-rgb), 0.10)",
                  }}
                >
                  {group.month}
                </h4>

                <div className="space-y-1">
                  {group.events.map((event) => {
                    const meta = CATEGORY_META[event.category]
                    const { day } = formatBrowseDate(event.start)
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nec-purple)] min-h-[2.75rem]"
                        aria-label={`${t("viewDetails")}: ${event.title}`}
                      >
                        {/* Day number */}
                        <span className="w-7 text-right text-sm font-bold tabular-nums flex-shrink-0 text-[var(--nec-muted)]">
                          {day}
                        </span>

                        {/* Category dot */}
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `var(${meta.colorVar})` }}
                          aria-hidden="true"
                        />

                        {/* Title */}
                        <span className="text-sm text-[var(--nec-text)] truncate flex-1">
                          {event.title}
                        </span>

                        {/* Location (desktop only) */}
                        {event.location && (
                          <span className="hidden md:flex items-center gap-1 text-xs text-[var(--nec-muted)] truncate max-w-[12rem]">
                            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                            <span className="truncate">{event.location}</span>
                          </span>
                        )}

                        {/* Time */}
                        <span className="text-xs text-[var(--nec-muted)] flex-shrink-0 tabular-nums">
                          {isAllDay(event.start) ? t("allDay") : formatCardTime(event.start)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Subscription Bar ──────────────────────────────── */}
      <section
        aria-label={t("subscribeBadge")}
        className="rounded-[1.85rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[linear-gradient(145deg,rgba(var(--nec-purple-rgb),0.04),rgba(var(--nec-card-rgb),0.92))] p-6 md:p-8"
      >
        <div className="text-center space-y-3 mb-6">
          <span className="section-badge inline-block">{t("subscribeBadge")}</span>
          <h3 className="text-lg font-bold text-[var(--nec-text)] font-heading">
            {t("subscribeHeading")}
          </h3>
          <p className="text-sm text-[var(--nec-muted)] max-w-md mx-auto">
            {t("subscribeDescription")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={SUBSCRIBE_GOOGLE}
            target="_blank"
            rel="noopener noreferrer"
            className="nec-cta-accent inline-flex items-center justify-center gap-2 font-bold text-sm rounded-xl px-5 py-2.5 transition-all duration-200 uppercase tracking-wide text-[var(--nec-purple)] w-full sm:w-auto"
          >
            <Monitor className="w-4 h-4" aria-hidden="true" />
            {t("addToGoogle")}
            <span className="sr-only"> (opens in new tab)</span>
          </a>

          <a
            href={SUBSCRIBE_WEBCAL}
            className="nec-cta-accent inline-flex items-center justify-center gap-2 font-bold text-sm rounded-xl px-5 py-2.5 transition-all duration-200 uppercase tracking-wide text-[var(--nec-pink)] w-full sm:w-auto"
          >
            <Smartphone className="w-4 h-4" aria-hidden="true" />
            {t("addToApple")}
          </a>

          <a
            href={SUBSCRIBE_ICAL}
            target="_blank"
            rel="noopener noreferrer"
            className="nec-cta-accent inline-flex items-center justify-center gap-2 font-bold text-sm rounded-xl px-5 py-2.5 transition-all duration-200 uppercase tracking-wide text-[var(--nec-cyan)] w-full sm:w-auto"
          >
            <CalendarPlus className="w-4 h-4" aria-hidden="true" />
            {t("subscribeiCal")}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      </section>

      {/* ── Error fallback ─────────────────────────────────── */}
      {/* Error state is handled by the server component returning [] —
          this shows the noEvents state above. Real errors are logged server-side. */}

      {/* ── Event detail modal ─────────────────────────────── */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}
