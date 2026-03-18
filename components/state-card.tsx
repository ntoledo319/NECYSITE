"use client"

import { useState, useRef, useEffect } from "react"
import {
  ChevronDown,
  ExternalLink,
  MapPin,
  Users,
  Heart,
  Search,
  Sparkles,
} from "lucide-react"
import type { StateResource } from "@/lib/data/states"

interface StateCardProps {
  state: StateResource
  isHighlighted?: boolean
}

export default function StateCard({ state, isHighlighted }: StateCardProps) {
  const [expanded, setExpanded] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const cardId = `state-${state.abbreviation}`
  const panelId = `${cardId}-panel`

  const isNewEngland = state.region === "new-england"
  const accentColor = isNewEngland ? "var(--nec-cyan)" : "var(--nec-purple)"
  const accentRgb = isNewEngland ? "20,184,166" : "124,58,237"

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
      className="state-card-luxury group/card rounded-2xl overflow-hidden"
      style={{
        background: expanded
          ? `linear-gradient(135deg, rgba(${accentRgb},0.06) 0%, rgba(26,16,48,0.85) 40%, rgba(15,10,30,0.95) 100%)`
          : "rgba(26,16,48,0.6)",
        border: isHighlighted
          ? `1.5px solid rgba(${accentRgb},0.5)`
          : expanded
            ? `1px solid rgba(${accentRgb},0.25)`
            : "1px solid var(--nec-border)",
        boxShadow: isHighlighted
          ? `0 0 30px rgba(${accentRgb},0.15), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`
          : expanded
            ? `0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`
            : "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
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
        className="w-full text-left p-5 md:p-6 flex items-center gap-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--nec-purple)] rounded-2xl"
      >
        {/* State abbreviation badge — luxury version */}
        <span
          className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black relative overflow-hidden"
          style={{
            background: expanded
              ? `linear-gradient(135deg, rgba(${accentRgb},0.20) 0%, rgba(${accentRgb},0.08) 100%)`
              : `rgba(${accentRgb},0.06)`,
            color: accentColor,
            border: `1px solid rgba(${accentRgb},${expanded ? "0.35" : "0.15"})`,
            boxShadow: expanded
              ? `0 0 20px rgba(${accentRgb},0.1), inset 0 1px 0 rgba(255,255,255,0.06)`
              : "none",
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
        <span className="flex-1 min-w-0">
          <span className="block text-base md:text-lg font-bold text-white leading-tight">
            {state.name}
          </span>
          <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--nec-muted)" }}
            >
              {state.intergroups.length} intergroup
              {state.intergroups.length !== 1 ? "s" : ""}
            </span>
            {state.ypaaCommittee && (
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                style={{
                  background: "rgba(192,38,211,0.12)",
                  color: "var(--nec-pink)",
                  border: "1px solid rgba(192,38,211,0.2)",
                }}
              >
                YPAA
              </span>
            )}
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
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
            <span className="flex items-center gap-1 mt-1.5">
              <Sparkles
                className="w-3 h-3 flex-shrink-0"
                style={{ color: "var(--nec-gold)" }}
                aria-hidden="true"
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--nec-gold)" }}
              >
                {state.notes}
              </span>
            </span>
          )}
        </span>

        {/* Expand chevron */}
        <ChevronDown
          className="w-5 h-5 flex-shrink-0"
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
        <div
          id={panelId}
          role="region"
          aria-labelledby={cardId}
          className="px-5 md:px-6 pb-6 pt-0 state-card-panel"
        >
          <div
            className="border-t pt-5"
            style={{ borderColor: `rgba(${accentRgb},0.12)` }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {/* AA Intergroups */}
              <section className="state-card-section">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(20,184,166,0.12)",
                      border: "1px solid rgba(20,184,166,0.2)",
                    }}
                  >
                    <MapPin
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--nec-cyan)" }}
                      aria-hidden="true"
                    />
                  </span>
                  <span style={{ color: "var(--nec-cyan)" }}>
                    AA Intergroups
                  </span>
                </h3>
                <ul
                  className="space-y-1"
                  aria-label={`AA intergroups in ${state.name}`}
                >
                  {state.intergroups.map((ig) => (
                    <li key={ig.url}>
                      <a
                        href={ig.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-start gap-2 rounded-xl p-2.5 -mx-1 transition-all duration-200"
                        style={{
                          background: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(20,184,166,0.04)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent"
                        }}
                      >
                        <span className="flex-1 min-w-0">
                          <span
                            className="block text-sm font-semibold transition-colors group-hover/link:text-white"
                            style={{ color: "var(--nec-text)" }}
                          >
                            {ig.name}
                          </span>
                          {ig.area && (
                            <span
                              className="block text-xs mt-0.5"
                              style={{ color: "var(--nec-muted)" }}
                            >
                              {ig.area}
                            </span>
                          )}
                        </span>
                        <ExternalLink
                          className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-40 group-hover/link:opacity-100 transition-opacity"
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
              {state.ypaaCommittee && (
                <section className="state-card-section">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(192,38,211,0.12)",
                        border: "1px solid rgba(192,38,211,0.2)",
                      }}
                    >
                      <Users
                        className="w-3.5 h-3.5"
                        style={{ color: "var(--nec-pink)" }}
                        aria-hidden="true"
                      />
                    </span>
                    <span style={{ color: "var(--nec-pink)" }}>
                      Young People in AA
                    </span>
                  </h3>
                  <a
                    href={state.ypaaCommittee.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center gap-2 rounded-xl p-2.5 -mx-1 transition-all duration-200"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(192,38,211,0.04)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent"
                    }}
                  >
                    <span
                      className="text-sm font-semibold transition-colors group-hover/link:text-white"
                      style={{ color: "var(--nec-text)" }}
                    >
                      {state.ypaaCommittee.name}
                    </span>
                    <ExternalLink
                      className="w-3.5 h-3.5 flex-shrink-0 opacity-40 group-hover/link:opacity-100 transition-opacity"
                      style={{ color: "var(--nec-pink)" }}
                      aria-hidden="true"
                    />
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                </section>
              )}

              {/* Family Resources (Al-Anon / Alateen) */}
              <section className="state-card-section">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(212,160,23,0.12)",
                      border: "1px solid rgba(212,160,23,0.2)",
                    }}
                  >
                    <Heart
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--nec-gold)" }}
                      aria-hidden="true"
                    />
                  </span>
                  <span style={{ color: "var(--nec-gold)" }}>
                    Family Resources
                  </span>
                </h3>
                <ul
                  className="space-y-1"
                  aria-label={`Family resources in ${state.name}`}
                >
                  <li>
                    <a
                      href={state.alanon.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-2 rounded-xl p-2.5 -mx-1 transition-all duration-200"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(212,160,23,0.04)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent"
                      }}
                    >
                      <span
                        className="text-sm font-semibold transition-colors group-hover/link:text-white"
                        style={{ color: "var(--nec-text)" }}
                      >
                        Al-Anon
                      </span>
                      <ExternalLink
                        className="w-3.5 h-3.5 flex-shrink-0 opacity-40 group-hover/link:opacity-100 transition-opacity"
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
                        className="group/link flex items-center gap-2 rounded-xl p-2.5 -mx-1 transition-all duration-200"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(212,160,23,0.04)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent"
                        }}
                      >
                        <span
                          className="text-sm font-semibold transition-colors group-hover/link:text-white"
                          style={{ color: "var(--nec-text)" }}
                        >
                          Alateen
                        </span>
                        <ExternalLink
                          className="w-3.5 h-3.5 flex-shrink-0 opacity-40 group-hover/link:opacity-100 transition-opacity"
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
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(234,88,12,0.12)",
                      border: "1px solid rgba(234,88,12,0.2)",
                    }}
                  >
                    <Search
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--nec-orange)" }}
                      aria-hidden="true"
                    />
                  </span>
                  <span style={{ color: "var(--nec-orange)" }}>
                    Find a Meeting
                  </span>
                </h3>
                <a
                  href={state.meetingFinderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200"
                  style={{
                    background: "rgba(234,88,12,0.08)",
                    border: "1px solid rgba(234,88,12,0.2)",
                    color: "var(--nec-orange)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(234,88,12,0.15)"
                    e.currentTarget.style.borderColor = "rgba(234,88,12,0.4)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(234,88,12,0.08)"
                    e.currentTarget.style.borderColor = "rgba(234,88,12,0.2)"
                  }}
                >
                  AA meetings in {state.name}
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </section>
            </div>

            {/* Area Service — footer link */}
            {state.areaServiceUrl &&
              state.areaServiceUrl !== state.intergroups[0]?.url && (
                <div
                  className="mt-5 pt-4 border-t"
                  style={{ borderColor: `rgba(${accentRgb},0.08)` }}
                >
                  <a
                    href={state.areaServiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs inline-flex items-center gap-1.5 transition-colors hover:text-white"
                    style={{ color: "var(--nec-muted)" }}
                  >
                    Area Service Committee
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
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
