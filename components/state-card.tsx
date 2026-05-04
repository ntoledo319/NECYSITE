"use client"

import { useState, useRef, useEffect } from "react"
import {
  ChevronDown,
  Clock,
  ExternalLink,
  Globe as GlobeIcon,
  MapPin,
  Users,
  Heart,
  Search,
  Sparkles,
} from "lucide-react"
import type { StateResource } from "@/lib/data/states"
import { getYPAAMeetingsByState } from "@/lib/data/ypaa-meetings"

interface StateCardProps {
  state: StateResource
  isHighlighted?: boolean
  onViewMeetings?: (stateAbbreviation: string) => void
}

export default function StateCard({ state, isHighlighted, onViewMeetings }: StateCardProps) {
  const [expanded, setExpanded] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const cardId = `state-${state.abbreviation}`
  const panelId = `${cardId}-panel`

  const isNewEngland = state.region === "new-england"
  const accentColor = isNewEngland ? "var(--nec-cyan)" : "var(--nec-purple)"
  const accentRgb = isNewEngland ? "var(--nec-cyan-rgb)" : "var(--nec-purple-rgb)"

  const stateMeetings = getYPAAMeetingsByState(state.abbreviation)
  const meetingCount = stateMeetings.length
  const previewMeetings = stateMeetings.slice(0, 3)

  // Auto-expand + scroll when highlighted from map
  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      setExpanded(true)
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isHighlighted])

  return (
    <article
      ref={cardRef}
      className="group/card overflow-hidden rounded-[1.7rem] transition-[border-color,box-shadow,transform] duration-200"
      style={{
        background: expanded
          ? `linear-gradient(135deg, rgba(${accentRgb},0.05) 0%, rgba(var(--nec-card-rgb),0.92) 42%, rgba(var(--nec-card-rgb),0.84) 100%)`
          : "rgba(var(--nec-card-rgb),0.82)",
        border: isHighlighted
          ? `1.5px solid rgba(${accentRgb},0.5)`
          : expanded
            ? `1px solid rgba(${accentRgb},0.25)`
            : "1px solid rgba(var(--nec-purple-rgb),0.10)",
        boxShadow: isHighlighted
          ? `0 18px 42px rgba(44,24,16,0.10), 0 0 0 1px rgba(${accentRgb},0.08)`
          : expanded
            ? `0 16px 34px rgba(44,24,16,0.08)`
            : "0 10px 22px rgba(44,24,16,0.05)",
      }}
    >
      {/* Top accent gradient line */}
      {(expanded || isHighlighted) && (
        <div
          className="h-[2px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(${accentRgb},0.5) 30%, rgba(${accentRgb},0.8) 50%, rgba(${accentRgb},0.5) 70%, transparent 100%)`,
          }}
          aria-hidden="true"
        />
      )}

      <button
        id={cardId}
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-4 rounded-[1.7rem] p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--nec-purple)] md:p-6"
      >
        {/* State abbreviation badge — luxury version */}
        <span
          className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] text-xl font-black md:h-16 md:w-16 md:text-2xl"
          style={{
            background: expanded
              ? `linear-gradient(135deg, rgba(${accentRgb},0.20) 0%, rgba(${accentRgb},0.08) 100%)`
              : `rgba(${accentRgb},0.06)`,
            color: accentColor,
            border: `1px solid rgba(${accentRgb},${expanded ? "0.35" : "0.15"})`,
            boxShadow: expanded ? `0 12px 22px rgba(44,24,16,0.08)` : "none",
          }}
        >
          {state.abbreviation}
          {/* Shimmer effect on hover */}
          <span
            className="absolute inset-0 opacity-0 group-hover/card:opacity-100"
            style={{
              background: `linear-gradient(135deg, transparent 40%, rgba(${accentRgb},0.1) 50%, transparent 60%)`,
              transition: "opacity 0.4s ease",
            }}
            aria-hidden="true"
          />
        </span>

        {/* State name and summary */}
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold leading-tight text-[var(--nec-text)] md:text-lg">
            {state.name}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-medium" style={{ color: "var(--nec-muted)" }}>
              {state.intergroups.length} intergroup
              {state.intergroups.length !== 1 ? "s" : ""}
            </span>
            {state.ypaaCommittee && (
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
                style={{
                  background: "rgba(var(--nec-pink-rgb),0.08)",
                  color: "var(--nec-pink)",
                  border: "1px solid rgba(var(--nec-pink-rgb),0.15)",
                }}
              >
                YPAA
              </span>
            )}
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{
                background: `rgba(${accentRgb},0.08)`,
                color: accentColor,
                border: `1px solid rgba(${accentRgb},0.15)`,
              }}
            >
              {isNewEngland ? "New England" : "Expansion"}
            </span>
          </span>
          {state.notes && (
            <span className="mt-1.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3 flex-shrink-0" style={{ color: "var(--nec-gold)" }} aria-hidden="true" />
              <span className="text-xs font-semibold" style={{ color: "var(--nec-gold)" }}>
                {state.notes}
              </span>
            </span>
          )}
        </span>

        {/* Expand chevron */}
        <ChevronDown
          className="h-5 w-5 flex-shrink-0"
          style={{
            color: expanded ? accentColor : "var(--nec-muted)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease",
          }}
          aria-hidden="true"
        />
      </button>

      {/* Expandable panel */}
      {expanded && (
        <div id={panelId} role="region" aria-labelledby={cardId} className="state-card-panel px-5 pb-6 pt-0 md:px-6">
          <div className="border-t pt-5" style={{ borderColor: `rgba(${accentRgb},0.12)` }}>
            <div className="grid gap-5 sm:grid-cols-2">
              {/* AA Intergroups */}
              <section className="state-card-section">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-lg"
                    style={{
                      background: "rgba(var(--nec-cyan-rgb),0.08)",
                      border: "1px solid rgba(var(--nec-cyan-rgb),0.15)",
                    }}
                  >
                    <MapPin className="h-3.5 w-3.5" style={{ color: "var(--nec-cyan)" }} aria-hidden="true" />
                  </span>
                  <span style={{ color: "var(--nec-cyan)" }}>AA Intergroups</span>
                </h3>
                <ul className="space-y-1" aria-label={`AA intergroups in ${state.name}`}>
                  {state.intergroups.map((ig) => (
                    <li key={ig.url}>
                      <a
                        href={ig.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link -mx-1 flex items-start gap-2 rounded-[1rem] p-2.5 transition-[background-color,border-color] duration-200 hover:bg-[rgba(var(--nec-cyan-rgb),0.04)]"
                      >
                        <span className="min-w-0 flex-1">
                          <span
                            className="block text-sm font-semibold transition-colors group-hover/link:text-[var(--nec-text)]"
                            style={{ color: "var(--nec-text)" }}
                          >
                            {ig.name}
                          </span>
                          {ig.area && (
                            <span className="mt-0.5 block text-xs" style={{ color: "var(--nec-muted)" }}>
                              {ig.area}
                            </span>
                          )}
                        </span>
                        <ExternalLink
                          className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 opacity-40 transition-opacity group-hover/link:opacity-100"
                          style={{ color: "var(--nec-cyan)" }}
                          aria-hidden="true"
                        />
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              {/* YPAA Committee */}
              {(state.ypaaCommittee || meetingCount > 0) && (
                <section className="state-card-section">
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-lg"
                      style={{
                        background: "rgba(var(--nec-pink-rgb),0.08)",
                        border: "1px solid rgba(var(--nec-pink-rgb),0.15)",
                      }}
                    >
                      <Users className="h-3.5 w-3.5" style={{ color: "var(--nec-pink)" }} aria-hidden="true" />
                    </span>
                    <span style={{ color: "var(--nec-pink)" }}>Young People in AA</span>
                    {meetingCount > 0 && (
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                        style={{
                          background: "rgba(var(--nec-pink-rgb),0.08)",
                          color: "var(--nec-pink)",
                          border: "1px solid rgba(var(--nec-pink-rgb),0.18)",
                        }}
                      >
                        {meetingCount} meeting{meetingCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </h3>
                  {state.ypaaCommittee && (
                    <a
                      href={state.ypaaCommittee.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link -mx-1 flex items-center gap-2 rounded-[1rem] p-2.5 transition-[background-color,border-color] duration-200 hover:bg-[rgba(var(--nec-pink-rgb),0.04)]"
                    >
                      <span
                        className="text-sm font-semibold transition-colors group-hover/link:text-[var(--nec-text)]"
                        style={{ color: "var(--nec-text)" }}
                      >
                        {state.ypaaCommittee.name}
                      </span>
                      <ExternalLink
                        className="h-3.5 w-3.5 flex-shrink-0 opacity-40 transition-opacity group-hover/link:opacity-100"
                        style={{ color: "var(--nec-pink)" }}
                        aria-hidden="true"
                      />
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  )}
                  {/* Inline meeting preview */}
                  {previewMeetings.length > 0 && (
                    <ul className="mt-2 space-y-1.5" aria-label={`YPAA meetings in ${state.name}`}>
                      {previewMeetings.map((m, i) => (
                        <li
                          key={`${m.name}-${m.day}-${i}`}
                          className="rounded-[1rem] p-2.5"
                          style={{
                            background: "rgba(var(--nec-pink-rgb),0.03)",
                            border: "1px solid rgba(var(--nec-pink-rgb),0.06)",
                          }}
                        >
                          <span className="block text-xs font-bold leading-tight text-[var(--nec-text)]">{m.name}</span>
                          <span className="mt-0.5 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" style={{ color: "var(--nec-pink)" }} aria-hidden="true" />
                            <span className="text-[11px]" style={{ color: "var(--nec-muted)" }}>
                              {m.day && m.time
                                ? `${m.day} \u2022 ${m.time}`
                                : m.day || m.time || "Contact for schedule"}
                            </span>
                            <span
                              className="ml-1 rounded px-1 py-px text-[9px] font-bold uppercase"
                              style={{
                                background:
                                  m.format === "online"
                                    ? "rgba(var(--nec-purple-rgb),0.08)"
                                    : m.format === "hybrid"
                                      ? "rgba(var(--nec-pink-rgb),0.08)"
                                      : "rgba(var(--nec-cyan-rgb),0.08)",
                                color:
                                  m.format === "online"
                                    ? "var(--nec-purple)"
                                    : m.format === "hybrid"
                                      ? "var(--nec-pink)"
                                      : "var(--nec-cyan)",
                              }}
                            >
                              {m.format === "in-person" ? (
                                <>
                                  <MapPin className="-mt-px mr-0.5 inline h-2 w-2" aria-hidden="true" />
                                  In-Person
                                </>
                              ) : m.format === "online" ? (
                                <>
                                  <GlobeIcon className="-mt-px mr-0.5 inline h-2 w-2" aria-hidden="true" />
                                  Online
                                </>
                              ) : (
                                <>
                                  <GlobeIcon className="-mt-px mr-0.5 inline h-2 w-2" aria-hidden="true" />
                                  Hybrid
                                </>
                              )}
                            </span>
                          </span>
                        </li>
                      ))}
                      {meetingCount > 3 && onViewMeetings && (
                        <li>
                          <button
                            type="button"
                            onClick={() => onViewMeetings(state.abbreviation)}
                            className="mt-1 inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-xs font-semibold transition-colors hover:underline"
                            style={{ color: "var(--nec-pink)" }}
                          >
                            View all {meetingCount} meetings →
                          </button>
                        </li>
                      )}
                    </ul>
                  )}
                </section>
              )}

              {/* Family Resources (Al-Anon / Alateen) */}
              <section className="state-card-section">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-lg"
                    style={{
                      background: "rgba(var(--nec-gold-rgb),0.08)",
                      border: "1px solid rgba(var(--nec-gold-rgb),0.15)",
                    }}
                  >
                    <Heart className="h-3.5 w-3.5" style={{ color: "var(--nec-gold)" }} aria-hidden="true" />
                  </span>
                  <span style={{ color: "var(--nec-gold)" }}>Family Resources</span>
                </h3>
                <ul className="space-y-1" aria-label={`Family resources in ${state.name}`}>
                  <li>
                    <a
                      href={state.alanon.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link -mx-1 flex items-center gap-2 rounded-[1rem] p-2.5 transition-[background-color,border-color] duration-200 hover:bg-[rgba(var(--nec-gold-rgb),0.04)]"
                    >
                      <span
                        className="text-sm font-semibold transition-colors group-hover/link:text-[var(--nec-text)]"
                        style={{ color: "var(--nec-text)" }}
                      >
                        Al-Anon
                      </span>
                      <ExternalLink
                        className="h-3.5 w-3.5 flex-shrink-0 opacity-40 transition-opacity group-hover/link:opacity-100"
                        style={{ color: "var(--nec-gold)" }}
                        aria-hidden="true"
                      />
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  </li>
                  {state.alanon.alateenUrl && (
                    <li>
                      <a
                        href={state.alanon.alateenUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link -mx-1 flex items-center gap-2 rounded-[1rem] p-2.5 transition-[background-color,border-color] duration-200 hover:bg-[rgba(var(--nec-gold-rgb),0.04)]"
                      >
                        <span
                          className="text-sm font-semibold transition-colors group-hover/link:text-[var(--nec-text)]"
                          style={{ color: "var(--nec-text)" }}
                        >
                          Alateen
                        </span>
                        <ExternalLink
                          className="h-3.5 w-3.5 flex-shrink-0 opacity-40 transition-opacity group-hover/link:opacity-100"
                          style={{ color: "var(--nec-gold)" }}
                          aria-hidden="true"
                        />
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    </li>
                  )}
                </ul>
              </section>

              {/* Meeting Finder */}
              <section className="state-card-section">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-lg"
                    style={{
                      background: "rgba(234,88,12,0.12)",
                      border: "1px solid rgba(234,88,12,0.2)",
                    }}
                  >
                    <Search className="h-3.5 w-3.5" style={{ color: "var(--nec-orange)" }} aria-hidden="true" />
                  </span>
                  <span style={{ color: "var(--nec-orange)" }}>Find a Meeting</span>
                </h3>
                <a
                  href={state.meetingFinderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[1rem] px-4 py-2.5 text-sm font-bold transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "rgba(234,88,12,0.08)",
                    border: "1px solid rgba(234,88,12,0.2)",
                    color: "var(--nec-orange)",
                  }}
                >
                  AA meetings in {state.name}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </section>
            </div>

            {/* Area Service — footer link */}
            {state.areaServiceUrl && state.areaServiceUrl !== state.intergroups[0]?.url && (
              <div className="mt-5 border-t pt-4" style={{ borderColor: `rgba(${accentRgb},0.08)` }}>
                <a
                  href={state.areaServiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-[var(--nec-text)]"
                  style={{ color: "var(--nec-muted)" }}
                >
                  Area Service Committee
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  )
}
