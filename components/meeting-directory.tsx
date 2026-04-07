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

const THEME = {
  pink: {
    accentRgb: "192,38,211",
    accent: "var(--nec-pink)",
    badgeBg: "rgba(192,38,211,0.12)",
    badgeBorder: "rgba(192,38,211,0.30)",
    filterActiveBg: "rgba(192,38,211,0.15)",
    filterActiveBorder: "rgba(192,38,211,0.40)",
    headingGradient: "linear-gradient(90deg, var(--nec-pink) 0%, var(--nec-purple) 100%)",
  },
  blue: {
    accentRgb: "0,147,208",
    accent: "var(--alanon-blue)",
    badgeBg: "rgba(0,147,208,0.12)",
    badgeBorder: "rgba(0,147,208,0.30)",
    filterActiveBg: "rgba(0,147,208,0.15)",
    filterActiveBorder: "rgba(0,147,208,0.40)",
    headingGradient: "linear-gradient(90deg, var(--alanon-blue) 0%, var(--alanon-blue-dim) 100%)",
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

  // Sync when parent changes the state filter (e.g., map click)
  useEffect(() => {
    setStateFilter(initialStateFilter)
  }, [initialStateFilter])

  // Sync external state filter
  const handleStateChange = (value: string) => {
    setStateFilter(value)
    onStateFilterChange?.(value)
  }

  const filtered = useMemo(() => {
    let result = meetings

    if (stateFilter) {
      result = result.filter((m) => m.state === stateFilter)
    }
    if (dayFilter) {
      result = result.filter((m) => m.day === dayFilter)
    }
    if (formatFilter) {
      result = result.filter((m) => m.format === formatFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          (m.location && m.location.toLowerCase().includes(q))
      )
    }

    return result
  }, [meetings, stateFilter, dayFilter, formatFilter, searchQuery])

  const hasActiveFilters = stateFilter || dayFilter || formatFilter || searchQuery

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
      className="nec-meeting-directory rounded-3xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(${t.accentRgb},0.04) 0%, rgba(var(--nec-card-rgb),0.85) 40%, rgba(var(--nec-dark-rgb),0.95) 100%)`,
        border: `1px solid rgba(${t.accentRgb},0.15)`,
        boxShadow: `0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}
      aria-labelledby={`${uid}-heading`}
    >
      {/* Top accent line */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(${t.accentRgb},0.5) 30%, rgba(${t.accentRgb},0.8) 50%, rgba(${t.accentRgb},0.5) 70%, transparent 100%)`,
        }}
        aria-hidden="true"
      />

      <div className="p-6 md:p-8">

      {/* Heading */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: `rgba(${t.accentRgb},0.12)`,
              border: `1px solid rgba(${t.accentRgb},0.25)`,
            }}
          >
            <IconComponent className="w-4 h-4" style={{ color: t.accent }} aria-hidden="true" />
          </span>
          <h2
            id={`${uid}-heading`}
            className="text-xl md:text-2xl font-black bg-clip-text text-transparent"
            style={{ backgroundImage: t.headingGradient }}
          >
            {heading}
          </h2>
        </div>
        <p className="text-sm" style={{ color: "var(--nec-muted)" }}>
          {description}
        </p>
      </div>

      {/* Filter bar */}
      <div
        className="flex flex-wrap items-end gap-3 mb-5 p-4 rounded-xl"
        style={{
          background: `rgba(${t.accentRgb},0.03)`,
          border: `1px solid rgba(${t.accentRgb},0.08)`,
        }}
        role="search"
        aria-label={`Filter ${heading}`}
      >
        {/* Search */}
        <div className="flex-1 min-w-[180px]">
          <label htmlFor={searchId} className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--nec-muted)" }}>
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--nec-muted)" }} aria-hidden="true" />
            <input
              id={searchId}
              type="search"
              placeholder="Meeting name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-1"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "var(--nec-text)",
                outlineColor: t.accent,
              }}
            />
          </div>
        </div>

        {/* State filter */}
        <div className="min-w-[130px]">
          <label htmlFor={stateId} className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--nec-muted)" }}>
            State
          </label>
          <select
            id={stateId}
            value={stateFilter}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-1 appearance-none cursor-pointer"
            style={{
              background: stateFilter ? t.filterActiveBg : "rgba(255,255,255,0.04)",
              border: `1px solid ${stateFilter ? t.filterActiveBorder : "rgba(255,255,255,0.10)"}`,
              color: stateFilter ? t.accent : "var(--nec-text)",
              outlineColor: t.accent,
            }}
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {STATE_NAMES[s] || s}
              </option>
            ))}
          </select>
        </div>

        {/* Day filter */}
        <div className="min-w-[120px]">
          <label htmlFor={dayId} className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--nec-muted)" }}>
            Day
          </label>
          <select
            id={dayId}
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-1 appearance-none cursor-pointer"
            style={{
              background: dayFilter ? t.filterActiveBg : "rgba(255,255,255,0.04)",
              border: `1px solid ${dayFilter ? t.filterActiveBorder : "rgba(255,255,255,0.10)"}`,
              color: dayFilter ? t.accent : "var(--nec-text)",
              outlineColor: t.accent,
            }}
          >
            <option value="">All Days</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Format filter */}
        <div className="min-w-[120px]">
          <label htmlFor={formatId} className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--nec-muted)" }}>
            Format
          </label>
          <select
            id={formatId}
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value as MeetingFormat | "")}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-1 appearance-none cursor-pointer"
            style={{
              background: formatFilter ? t.filterActiveBg : "rgba(255,255,255,0.04)",
              border: `1px solid ${formatFilter ? t.filterActiveBorder : "rgba(255,255,255,0.10)"}`,
              color: formatFilter ? t.accent : "var(--nec-text)",
              outlineColor: t.accent,
            }}
          >
            <option value="">All Formats</option>
            <option value="in-person">In-Person</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--nec-text)",
              outlineColor: t.accent,
            }}
            aria-label="Clear all filters"
          >
            <X className="w-3 h-3" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {/* Results count (live region) */}
      <div
        id={resultsId}
        className="flex items-center gap-2 mb-4"
        aria-live="polite"
        aria-atomic="true"
      >
        <Filter className="w-3.5 h-3.5" style={{ color: "var(--nec-muted)" }} aria-hidden="true" />
        <span className="text-xs font-semibold" style={{ color: "var(--nec-muted)" }}>
          {filtered.length} meeting{filtered.length !== 1 ? "s" : ""} found
          {stateFilter ? ` in ${STATE_NAMES[stateFilter] || stateFilter}` : ""}
        </span>
      </div>

      {/* Meeting grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((meeting, i) => (
            <MeetingDirectoryCard
              key={`${meeting.name}-${meeting.state}-${meeting.day}-${i}`}
              meeting={meeting}
              theme={theme}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-12 px-6 rounded-xl"
          style={{
            background: `rgba(${t.accentRgb},0.03)`,
            border: `1px dashed rgba(${t.accentRgb},0.15)`,
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--nec-text)" }}>
            No meetings found
          </p>
          <p className="text-xs" style={{ color: "var(--nec-muted)" }}>
            {hasActiveFilters
              ? "Try adjusting your filters or search terms."
              : "Check back soon — we're always adding new meetings."}
          </p>
          {stateFilter && (
            <p className="text-xs mt-2" style={{ color: "var(--nec-muted)" }}>
              Know of a meeting in {STATE_NAMES[stateFilter] || stateFilter}?{" "}
              <a
                href="mailto:info@necypaa.org"
                className="font-semibold underline"
                style={{ color: t.accent }}
              >
                Let us know
              </a>
            </p>
          )}
        </div>
      )}
      </div>{/* end inner padding wrapper */}
    </section>
  )
}
