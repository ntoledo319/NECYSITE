"use client"

import { useEffect, useCallback } from "react"
import { X, MapPin, CalendarPlus, ExternalLink, Clock } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFocusTrap } from "@/lib/use-focus-trap"
import { generateEventIcs } from "@/lib/calendar/ics"
import type { CalendarEvent, EventCategory } from "@/lib/calendar/types"

const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string; border: string }> = {
  "host-business": {
    bg: "rgba(var(--nec-purple-rgb), 0.12)",
    text: "var(--nec-purple)",
    border: "rgba(var(--nec-purple-rgb), 0.22)",
  },
  "host-event": {
    bg: "rgba(var(--nec-pink-rgb), 0.12)",
    text: "var(--nec-pink)",
    border: "rgba(var(--nec-pink-rgb), 0.22)",
  },
  external: {
    bg: "rgba(var(--nec-cyan-rgb), 0.12)",
    text: "var(--nec-cyan)",
    border: "rgba(var(--nec-cyan-rgb), 0.22)",
  },
}

function safeDate(iso: string): Date {
  if (!iso.includes("T")) return new Date(`${iso}T12:00:00`)
  return new Date(iso)
}

function formatFullDate(iso: string): string {
  return safeDate(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  })
}

function formatTime(iso: string): string {
  return safeDate(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  })
}

function isAllDay(start: string): boolean {
  return !start.includes("T")
}

function extractFirstUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s<>"']+/)
  return match ? match[0] : null
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

export default function EventDetailModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const t = useTranslations("calendar")
  const containerRef = useFocusTrap<HTMLDivElement>(true)
  const colors = CATEGORY_COLORS[event.category]

  const categoryLabel =
    event.category === "host-business"
      ? t("hostBusiness")
      : event.category === "host-event"
        ? t("hostEvent")
        : t("external")

  const allDay = isAllDay(event.start)
  const descriptionUrl = event.description ? extractFirstUrl(event.description) : null
  const mapsUrl = event.location ? `https://maps.google.com/?q=${encodeURIComponent(event.location)}` : null

  const handleDownloadIcs = useCallback(() => {
    const ics = generateEventIcs(event)
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${event.title.toLowerCase().replace(/\s+/g, "-")}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [event])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    // Prevent body scroll
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm motion-safe:animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        ref={containerRef}
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-[1.85rem] border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[var(--nec-card)] shadow-[0_20px_60px_rgba(0,0,0,0.2)] motion-safe:animate-[slideUp_250ms_ease-out] md:rounded-[1.85rem] md:motion-safe:animate-[scaleIn_200ms_ease-out]"
      >
        {/* Top gradient accent */}
        <div
          className="absolute inset-x-0 top-0 h-1 rounded-t-[1.85rem]"
          aria-hidden="true"
          style={{
            background: `linear-gradient(90deg, ${colors.border} 0%, ${colors.text} 50%, ${colors.border} 100%)`,
          }}
        />

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 md:hidden" aria-hidden="true">
          <div className="h-1 w-10 rounded-full bg-[var(--nec-border)]" />
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.08)]"
          aria-label={t("closeModal")}
          style={{ color: "var(--nec-muted)" }}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-5 p-6 pt-4 md:p-8 md:pt-8">
          {/* Category chip */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            {categoryLabel}
          </span>

          {/* Title */}
          <h2 className="pr-8 font-heading text-2xl font-bold leading-tight text-[var(--nec-text)]">{event.title}</h2>

          {/* Date/time */}
          <div className="flex items-start gap-3">
            <div
              className="nec-icon-badge flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
              aria-hidden="true"
            >
              <Clock className="h-5 w-5" style={{ color: colors.text }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--nec-text)]">{formatFullDate(event.start)}</p>
              <p className="text-sm text-[var(--nec-muted)]">
                {allDay ? t("allDay") : `${formatTime(event.start)} — ${formatTime(event.end)}`}
              </p>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3">
              <div
                className="nec-icon-badge flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                aria-hidden="true"
              >
                <MapPin className="h-5 w-5" style={{ color: colors.text }} />
              </div>
              <div>
                <p className="text-sm text-[var(--nec-text)]">{event.location}</p>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-75"
                    style={{ color: colors.text }}
                  >
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {t("openInMaps")}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--nec-muted)]">
              {stripHtml(event.description)}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="btn-primary inline-flex items-center justify-center gap-2 !px-5 !py-2.5 !text-sm"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden="true" />
              {t("addToMyCalendar")}
            </button>

            {descriptionUrl && (
              <a
                href={descriptionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {t("moreInfo")}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
