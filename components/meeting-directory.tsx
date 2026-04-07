"use client"

import { useState, useMemo, useId, useEffect } from "react"
import { Search, Filter, X, Users, Heart } from "lucide-react"
import MeetingDirectoryCard from "@/components/meeting-directory-card"
import type { MeetingDirectoryItem } from "@/components/meeting-directory-card"
import type { MeetingFormat } from "@/lib/data/ypaa-meetings"

type ColorTheme = "pink" | "blue"

interface MeetingDirectoryProps {
  meetings: MeetingDirectoryItem[]
  theme?: ColorTheme
  /** Pre-filter to a specific state (e.g., from map selection) */
  initialStateFilter?: string
  /** All unique states available */
  states: string[]
  /** Section heading */
  heading: string
  /** Section description */
  description: string
  /** Icon to use in heading */
  icon?: "users" | "heart"
  /** Optional callback when state filter changes (for map sync) */
  onStateFilterChange?: (state: string) => void
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const FORMAT_LABELS: Record<MeetingFormat, string> = {
  "in-person": "In-Person",
  online: "Online",
  hybrid: "Hybrid",
}

const THEME = {
  pink: {
    accentRgb: "var(--nec-pink-rgb)",
    accent: "var(--nec-pink)",
    badgeBg: "rgba(var(--nec-pink-rgb),0.08)",
    badgeBorder: "rgba(var(--nec-pink-rgb),0.20)",
    filterActiveBg: "rgba(var(--nec-pink-rgb),0.10)",
    filterActiveBorder: "rgba(var(--nec-pink-rgb),0.30)",
  },
  blue: {
    accentRgb: "var(--alanon-blue-rgb)",
    accent: "var(--alanon-blue)",
    badgeBg: "rgba(var(--alanon-blue-rgb),0.08)",
    badgeBorder: "rgba(var(--alanon-blue-rgb),0.20)",
    filterActiveBg: "rgba(var(--alanon-blue-rgb),0.10)",
    filterActiveBorder: "rgba(var(--alanon-blue-rgb),0.30)",
  },
} as const

const STATE_NAMES: Record<string, string> = {
  CT: "Connecticut",
  DC: "Washington, D.C.",
  DE: "Delaware",
  MA: "Massachusetts",
  MD: "Maryland",
  ME: "Maine",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NY: "New York",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  VT: "Vermont",
  CA: "California",
}

export default function MeetingDirectory({
  meetings,
  theme = "pink",
  initialStateFilter = "",
  states,
  heading,
  description,
  icon = "users",
  onStateFilterChange,
}: MeetingDirectoryProps) {
  const t = THEME[theme]
  const uid = useId()
  const searchId = `${uid}-search`
  const stateId = `${uid}-state`
  const dayId = `${uid}-day`
  const formatId = `${uid}-format`
  const resultsId = `${uid}-results`

  const [stateFilter, setStateFilter] = useState(initialStateFilter)
  const [dayFilter, setDayFilter] = useState("")
  const [formatFilter, setFormatFilter] = useState<MeetingFormat | "">("")
  const [searchQuery, setSearchQuery] = useState("")

  const filterLabelClassName = "form-section-label mb-2 block text-[0.72rem]"
  const filterControlClassName =
    "h-12 w-full rounded-xl border border-[rgba(var(--nec-purple-rgb),0.14)] px-4 text-sm font-medium text-[var(--nec-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-[border-color,box-shadow,background,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

  useEffect(() => {
    setStateFilter(initialStateFilter)
  }, [initialStateFilter])

  const handleStateChange = (value: string) => {
    setStateFilter(value)
    onStateFilterChange?.(value)
  }

  const filtered = useMemo(() => {
    let result = meetings

    if (stateFilter) {
      result = result.filter((meeting) => meeting.state === stateFilter)
    }
    if (dayFilter) {
      result = result.filter((meeting) => meeting.day === dayFilter)
    }
    if (formatFilter) {
      result = result.filter((meeting) => meeting.format === formatFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (meeting) =>
          meeting.name.toLowerCase().includes(q) ||
          meeting.city.toLowerCase().includes(q) ||
          (meeting.location && meeting.location.toLowerCase().includes(q))
      )
    }

    return result
  }, [meetings, stateFilter, dayFilter, formatFilter, searchQuery])

  const hasActiveFilters = Boolean(stateFilter || dayFilter || formatFilter || searchQuery)
  const activeFilters = [
    stateFilter ? STATE_NAMES[stateFilter] || stateFilter : null,
    dayFilter || null,
    formatFilter ? FORMAT_LABELS[formatFilter] : null,
    searchQuery.trim() ? `Search: ${searchQuery.trim()}` : null,
  ].filter(Boolean) as string[]

  const clearAll = () => {
    setStateFilter("")
    setDayFilter("")
    setFormatFilter("")
    setSearchQuery("")
    onStateFilterChange?.("")
  }

  const IconComponent = icon === "heart" ? Heart : Users

  return (
    <section
      className="nec-meeting-directory overflow-hidden rounded-[2rem]"
      style={{
        background: `linear-gradient(180deg, rgba(var(--nec-card-rgb),0.98) 0%, rgba(${t.accentRgb},0.04) 100%)`,
        border: `1px solid rgba(${t.accentRgb},0.14)`,
        boxShadow: "0 26px 60px rgba(44,24,16,0.10), 0 2px 6px rgba(0,0,0,0.03)",
      }}
      aria-labelledby={`${uid}-heading`}
    >
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(${t.accentRgb},0.36) 24%, rgba(${t.accentRgb},0.68) 50%, rgba(${t.accentRgb},0.36) 76%, transparent 100%)`,
        }}
        aria-hidden="true"
      />

      <div className="space-y-6 p-6 md:space-y-7 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{ background: t.badgeBg, border: `1px solid ${t.badgeBorder}` }}
            >
              <IconComponent className="h-4 w-4" style={{ color: t.accent }} aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: t.accent }}>
                Regional Directory
              </span>
            </div>
            <h2
              id={`${uid}-heading`}
              className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)] md:text-3xl"
            >
              {heading}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--nec-muted)]">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
            <div className="rounded-2xl border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.84)] px-4 py-3 shadow-[0_16px_32px_rgba(44,24,16,0.06)]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Visible</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--nec-text)]">{filtered.length}</p>
            </div>
            <div className="rounded-2xl border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.84)] px-4 py-3 shadow-[0_16px_32px_rgba(44,24,16,0.06)]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">States</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--nec-text)]">{states.length}</p>
            </div>
          </div>
        </div>

        <div
          className="grid gap-3 rounded-[1.5rem] p-4 md:grid-cols-2 md:p-5 xl:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto]"
          style={{
            background: `rgba(${t.accentRgb},0.025)`,
            border: `1px solid rgba(${t.accentRgb},0.10)`,
          }}
          role="search"
          aria-label={`Filter ${heading}`}
        >
          <div className="md:col-span-2 xl:col-span-1">
            <label htmlFor={searchId} className={filterLabelClassName}>
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--nec-muted)]" aria-hidden="true" />
              <input
                id={searchId}
                type="search"
                placeholder="Meeting name, city, or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${filterControlClassName} pl-11 pr-4`}
                style={{ background: "rgba(var(--nec-card-rgb),0.92)" }}
              />
            </div>
          </div>

          <div>
            <label htmlFor={stateId} className={filterLabelClassName}>
              State
            </label>
            <select
              id={stateId}
              value={stateFilter}
              onChange={(e) => handleStateChange(e.target.value)}
              className={`${filterControlClassName} appearance-none cursor-pointer pr-10`}
              style={{
                background: stateFilter ? t.filterActiveBg : "rgba(var(--nec-card-rgb),0.92)",
                borderColor: stateFilter ? t.filterActiveBorder : "rgba(var(--nec-purple-rgb),0.14)",
                color: stateFilter ? t.accent : "var(--nec-text)",
              }}
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {STATE_NAMES[state] || state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={dayId} className={filterLabelClassName}>
              Day
            </label>
            <select
              id={dayId}
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              className={`${filterControlClassName} appearance-none cursor-pointer pr-10`}
              style={{
                background: dayFilter ? t.filterActiveBg : "rgba(var(--nec-card-rgb),0.92)",
                borderColor: dayFilter ? t.filterActiveBorder : "rgba(var(--nec-purple-rgb),0.14)",
                color: dayFilter ? t.accent : "var(--nec-text)",
              }}
            >
              <option value="">All Days</option>
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={formatId} className={filterLabelClassName}>
              Format
            </label>
            <select
              id={formatId}
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value as MeetingFormat | "")}
              className={`${filterControlClassName} appearance-none cursor-pointer pr-10`}
              style={{
                background: formatFilter ? t.filterActiveBg : "rgba(var(--nec-card-rgb),0.92)",
                borderColor: formatFilter ? t.filterActiveBorder : "rgba(var(--nec-purple-rgb),0.14)",
                color: formatFilter ? t.accent : "var(--nec-text)",
              }}
            >
              <option value="">All Formats</option>
              <option value="in-person">In-Person</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.88)] px-4 text-sm font-semibold transition-[border-color,background,color] duration-200 hover:border-[rgba(var(--nec-purple-rgb),0.22)] hover:bg-[rgba(var(--nec-purple-rgb),0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)] xl:self-end"
              style={{ color: t.accent }}
              aria-label="Clear all filters"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div
            id={resultsId}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.86)] px-3.5 py-2"
            aria-live="polite"
            aria-atomic="true"
          >
            <Filter className="h-3.5 w-3.5 text-[var(--nec-muted)]" aria-hidden="true" />
            <span className="text-sm font-medium text-[var(--nec-muted)]">
              {filtered.length} meeting{filtered.length !== 1 ? "s" : ""} found
              {stateFilter ? ` in ${STATE_NAMES[stateFilter] || stateFilter}` : ""}
            </span>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((label) => (
                <span
                  key={label}
                  className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
                  style={{
                    background: t.badgeBg,
                    border: `1px solid ${t.badgeBorder}`,
                    color: t.accent,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((meeting, index) => (
              <MeetingDirectoryCard
                key={`${meeting.name}-${meeting.state}-${meeting.day}-${index}`}
                meeting={meeting}
                theme={theme}
              />
            ))}
          </div>
        ) : (
          <div
            className="rounded-[1.5rem] px-6 py-12 text-center"
            style={{
              background: `rgba(${t.accentRgb},0.03)`,
              border: `1px dashed rgba(${t.accentRgb},0.16)`,
            }}
          >
            <p className="text-lg font-semibold text-[var(--nec-text)]">No meetings matched that view.</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--nec-muted)]">
              {hasActiveFilters
                ? "Try broadening your search or clearing one of the filters."
                : "Check back soon. We keep adding meetings across the region."}
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.92)] px-4 py-2.5 text-sm font-semibold text-[var(--nec-text)] transition-[border-color,background] duration-200 hover:border-[rgba(var(--nec-purple-rgb),0.22)] hover:bg-[rgba(var(--nec-purple-rgb),0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Reset filters
                </button>
              )}
              {stateFilter && (
                <a
                  href="mailto:info@necypaa.org"
                  className="inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold"
                  style={{ color: t.accent }}
                >
                  Know a meeting in {STATE_NAMES[stateFilter] || stateFilter}? Let us know.
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
