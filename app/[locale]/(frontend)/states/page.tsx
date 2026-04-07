"use client"

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ExternalLink, Map, List, Globe, Sparkles, Users, BookOpen, Info } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/constants"
import { NECYPAA_STATES } from "@/lib/data/states"
import { YPAA_MEETINGS, YPAA_MEETING_COUNT, getYPAAMeetingCountsByState, getYPAAStatesWithMeetings } from "@/lib/data/ypaa-meetings"
import StateCard from "@/components/state-card"
import MeetingDirectory from "@/components/meeting-directory"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import { staggerContainer, staggerChild, SPRING_GENTLE } from "@/components/ui/motion-primitives"

const NecypaaRegionMap = lazy(() => import("@/components/necypaa-region-map"))

type RegionFilter = "all" | "new-england" | "expansion"
type ContentTab = "resources" | "meetings"

export default function StatesPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all")
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [activeTab, setActiveTab] = useState<ContentTab>("resources")
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (window.innerWidth < 768) setViewMode("list")
  }, [])

  const totalIntergroups = NECYPAA_STATES.reduce(
    (sum, s) => sum + s.intergroups.length,
    0,
  )
  const ypaaCount = NECYPAA_STATES.filter((s) => s.ypaaCommittee).length
  const meetingCounts = useMemo(() => getYPAAMeetingCountsByState(), [])
  const ypaaStates = useMemo(() => getYPAAStatesWithMeetings(), [])

  const filteredStates = useMemo(() => {
    if (regionFilter === "all") return NECYPAA_STATES
    return NECYPAA_STATES.filter((s) => s.region === regionFilter)
  }, [regionFilter])

  const handleViewMeetings = useCallback((stateAbbreviation: string) => {
    setSelectedState(stateAbbreviation)
    setActiveTab("meetings")
    // Scroll to top of content area so the directory is visible
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleStateSelect = (abbreviation: string) => {
    const isDeselecting = selectedState === abbreviation
    setSelectedState(isDeselecting ? null : abbreviation)

    // Auto-switch region filter so the selected state's card is visible
    if (!isDeselecting) {
      const state = NECYPAA_STATES.find((s) => s.abbreviation === abbreviation)
      if (state && regionFilter !== "all" && regionFilter !== state.region) {
        setRegionFilter(state.region)
      }
    }
  }

  const stats = [
    {
      value: "13",
      label: "States + D.C.",
      color: "var(--nec-cyan)",
      bgRgb: "var(--nec-cyan-rgb)",
    },
    {
      value: String(YPAA_MEETING_COUNT),
      label: "YPAA Meetings",
      color: "var(--nec-pink)",
      bgRgb: "var(--nec-pink-rgb)",
    },
    {
      value: String(ypaaCount),
      label: "YPAA Committees",
      color: "var(--nec-purple)",
      bgRgb: "var(--nec-purple-rgb)",
    },
    {
      value: String(totalIntergroups),
      label: "Intergroups",
      color: "var(--nec-gold)",
      bgRgb: "var(--nec-gold-rgb)",
    },
  ]

  const filterTabs: { key: RegionFilter; label: string; count: number }[] = [
    { key: "all", label: "All Regions", count: NECYPAA_STATES.length },
    {
      key: "new-england",
      label: "New England",
      count: NECYPAA_STATES.filter((s) => s.region === "new-england").length,
    },
    {
      key: "expansion",
      label: "2025 Expansion",
      count: NECYPAA_STATES.filter((s) => s.region === "expansion").length,
    },
  ]

  return (
    <div
      className="min-h-screen min-h-screen-safe flex flex-col relative"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      {/* Refined ambient background — thin gradient lines, not blobs */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            background:
              "linear-gradient(180deg, rgba(var(--nec-purple-rgb),0.20) 0%, transparent 30%, transparent 70%, rgba(var(--nec-cyan-rgb),0.12) 100%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 10%, rgba(var(--nec-purple-rgb),0.10) 50%, transparent 90%)",
          }}
        />
      </div>

      <div
        className="flex-1 pt-24 pb-20 md:pb-12 relative z-10"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* ── Hero Header ──────────────────────── */}
            <motion.header
              className="relative mb-12 overflow-hidden rounded-[2rem] border px-6 py-8 text-center shadow-[0_22px_48px_rgba(44,24,16,0.08)] md:px-8 md:py-10"
              initial={shouldReduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
              style={{
                background: "rgba(var(--nec-card-rgb),0.74)",
                borderColor: "rgba(var(--nec-purple-rgb),0.12)",
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(var(--nec-cyan-rgb),0) 0%, rgba(var(--nec-cyan-rgb),0.45) 30%, rgba(var(--nec-purple-rgb),0.52) 72%, rgba(var(--nec-pink-rgb),0.36) 100%)",
                }}
              />
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="section-badge">
                  <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                  Regional Directory
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--nec-text)] leading-[1.1] mb-4">
                <span className="block">Member</span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--nec-cyan) 0%, var(--nec-purple) 50%, var(--nec-pink) 100%)",
                  }}
                >
                  States
                </span>
              </h1>
              <p
                className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
                style={{ color: "var(--nec-muted)" }}
              >
                Local AA resources, intergroups, and young people&apos;s
                groups across the NECYPAA region — 12 states and Washington,
                D.C.
              </p>
            </motion.header>

            {/* ── Luxury Stats Strip ─────────────────── */}
            <motion.div
              className="mb-12 grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-4"
              role="group"
              aria-label="Region statistics"
              variants={shouldReduce ? undefined : staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={staggerChild}
                  className="states-stat-card relative overflow-hidden rounded-[1.55rem] p-5 text-center md:p-6"
                  style={{
                    background: `linear-gradient(135deg, rgba(${stat.bgRgb},0.08) 0%, rgba(var(--nec-card-rgb),0.8) 100%)`,
                    border: `1px solid rgba(${stat.bgRgb},0.18)`,
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(${stat.bgRgb},0.6), transparent)`,
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="block text-3xl md:text-4xl font-black leading-none"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="block text-xs md:text-sm font-semibold mt-2 uppercase tracking-wider"
                    style={{ color: "var(--nec-muted)" }}
                  >
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Interactive Map Section ─────────────── */}
            <section
              className="states-map-section mb-12 overflow-hidden rounded-[2rem]"
              style={{
                background: "rgba(var(--nec-card-rgb),0.86)",
                border: "1px solid rgba(var(--nec-purple-rgb),0.12)",
                boxShadow: "var(--shadow-card-hover)",
              }}
              aria-label="Interactive region map"
            >
              {/* Map header with view toggle */}
              <div className="flex items-center justify-between p-5 md:p-6 border-b" style={{ borderColor: "var(--nec-border)" }}>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-[var(--nec-text)] flex items-center gap-2">
                    <Sparkles
                      className="w-5 h-5"
                      style={{ color: "var(--nec-purple)" }}
                      aria-hidden="true"
                    />
                    Explore the Region
                  </h2>
                  <p
                    className="text-xs md:text-sm mt-1"
                    style={{ color: "var(--nec-muted)" }}
                  >
                    Click a state to view its AA resources
                  </p>
                </div>

                {/* View mode toggle — Map / List */}
                <div
                  className="flex rounded-xl overflow-hidden"
                  role="radiogroup"
                  aria-label="View mode"
                  style={{
                    border: "1px solid var(--nec-border)",
                    background: "rgba(var(--nec-dark-rgb),0.6)",
                  }}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={viewMode === "map"}
                    onClick={() => setViewMode("map")}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200"
                    style={{
                      background:
                        viewMode === "map"
                          ? "rgba(var(--nec-purple-rgb),0.12)"
                          : "transparent",
                      color:
                        viewMode === "map"
                          ? "var(--nec-purple)"
                          : "var(--nec-muted)",
                    }}
                  >
                    <Map className="w-3.5 h-3.5" aria-hidden="true" />
                    Map
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200"
                    style={{
                      background:
                        viewMode === "list"
                          ? "rgba(var(--nec-purple-rgb),0.12)"
                          : "transparent",
                      color:
                        viewMode === "list"
                          ? "var(--nec-purple)"
                          : "var(--nec-muted)",
                    }}
                  >
                    <List className="w-3.5 h-3.5" aria-hidden="true" />
                    List
                  </button>
                </div>
              </div>

              {/* Map content */}
              {viewMode === "map" ? (
                <div className="p-4 md:p-6 lg:p-8">
                  <Suspense fallback={
                    <div className="flex min-h-[400px] items-center justify-center">
                      <div className="text-center space-y-3">
                        <div className="w-8 h-8 mx-auto border-2 border-[var(--nec-purple)] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                        <p className="text-[var(--nec-text)]">Loading map...</p>
                      </div>
                    </div>
                  }>
                    <NecypaaRegionMap
                      activeState={selectedState}
                      onStateSelect={handleStateSelect}
                      meetingCounts={meetingCounts}
                    />
                  </Suspense>
                </div>
              ) : (
                <div className="p-4 md:p-6">
                  {/* Quick-select grid for list mode */}
                  <div
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
                    role="listbox"
                    aria-label="Select a state"
                  >
                    {NECYPAA_STATES.map((state) => {
                      const isActive = selectedState === state.abbreviation
                      const isNE = state.region === "new-england"
                      const rgb = isNE ? "var(--nec-cyan-rgb)" : "var(--nec-purple-rgb)"

                      return (
                        <button
                          key={state.abbreviation}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onClick={() =>
                            handleStateSelect(state.abbreviation)
                          }
                          className="rounded-xl p-3 text-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-purple)]"
                          style={{
                            background: isActive
                              ? `rgba(${rgb},0.18)`
                              : `rgba(${rgb},0.04)`,
                            border: isActive
                              ? `1.5px solid rgba(${rgb},0.5)`
                              : `1px solid rgba(${rgb},0.1)`,
                            boxShadow: isActive
                              ? `0 0 16px rgba(${rgb},0.1)`
                              : "none",
                          }}
                        >
                          <span
                            className="block text-lg font-black"
                            style={{
                              color: isActive
                                ? isNE
                                  ? "var(--nec-cyan)"
                                  : "var(--nec-purple)"
                                : "var(--nec-muted)",
                            }}
                          >
                            {state.abbreviation}
                          </span>
                          <span
                            className="block text-[11px] mt-0.5 font-medium truncate"
                            style={{ color: "var(--nec-muted)" }}
                          >
                            {state.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* ── Primary Content Tabs ─────────────── */}
            <div className="mb-6">
              <div
                className="flex items-center gap-1 rounded-[1.4rem] p-1.5"
                role="tablist"
                aria-label="Page content"
                style={{
                  background: "rgba(var(--nec-card-rgb),0.84)",
                  border: "1px solid rgba(var(--nec-purple-rgb),0.12)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <button
                  type="button"
                  role="tab"
                  id="tab-resources"
                  aria-selected={activeTab === "resources"}
                  aria-controls="panel-resources"
                  onClick={() => setActiveTab("resources")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--nec-purple)]"
                  style={{
                    background: activeTab === "resources"
                      ? "rgba(var(--nec-purple-rgb),0.10)"
                      : "transparent",
                    color: activeTab === "resources"
                      ? "var(--nec-text)"
                      : "var(--nec-muted)",
                    boxShadow: activeTab === "resources"
                      ? "var(--shadow-glow-purple)"
                      : "none",
                  }}
                >
                  <BookOpen className="w-4 h-4" style={{ color: activeTab === "resources" ? "var(--nec-cyan)" : "var(--nec-muted)" }} aria-hidden="true" />
                  State Resources
                  <span
                    className="text-[11px] px-1.5 py-0.5 rounded-md font-bold"
                    style={{
                      background: activeTab === "resources"
                        ? "rgba(var(--nec-cyan-rgb),0.10)"
                        : "rgba(var(--nec-purple-rgb),0.06)",
                      color: activeTab === "resources"
                        ? "var(--nec-cyan)"
                        : "var(--nec-muted)",
                    }}
                  >
                    {NECYPAA_STATES.length}
                  </span>
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-meetings"
                  aria-selected={activeTab === "meetings"}
                  aria-controls="panel-meetings"
                  onClick={() => setActiveTab("meetings")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--nec-purple)]"
                  style={{
                    background: activeTab === "meetings"
                      ? "rgba(var(--nec-pink-rgb),0.10)"
                      : "transparent",
                    color: activeTab === "meetings"
                      ? "var(--nec-text)"
                      : "var(--nec-muted)",
                    boxShadow: activeTab === "meetings"
                      ? "var(--shadow-glow-pink)"
                      : "none",
                  }}
                >
                  <Users className="w-4 h-4" style={{ color: activeTab === "meetings" ? "var(--nec-pink)" : "var(--nec-muted)" }} aria-hidden="true" />
                  YPAA Meetings
                  <span
                    className="text-[11px] px-1.5 py-0.5 rounded-md font-bold"
                    style={{
                      background: activeTab === "meetings"
                        ? "rgba(var(--nec-pink-rgb),0.10)"
                        : "rgba(var(--nec-purple-rgb),0.06)",
                      color: activeTab === "meetings"
                        ? "var(--nec-pink)"
                        : "var(--nec-muted)",
                    }}
                  >
                    {YPAA_MEETING_COUNT}
                  </span>
                </button>
              </div>
            </div>

            {/* ════════════════════════════════════════ */}
            {/* ── TAB PANEL: State Resources ────────── */}
            {/* ════════════════════════════════════════ */}
            {activeTab === "resources" && (
              <div
                id="panel-resources"
                role="tabpanel"
                aria-labelledby="tab-resources"
              >
                {/* Compact outbound links notice */}
                <div
                  className="flex items-start gap-2.5 rounded-xl p-3.5 mb-6 text-xs leading-relaxed"
                  style={{
                    background: "rgba(251,191,36,0.03)",
                    border: "1px solid rgba(251,191,36,0.10)",
                    color: "var(--nec-muted)",
                  }}
                >
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--nec-gold)" }} aria-hidden="true" />
                  <p>
                    <strong style={{ color: "var(--nec-gold)" }}>Tradition 6:</strong>{" "}
                    All links lead to external sites maintained by local AA service bodies and YPAA committees — resource links, not affiliations.
                  </p>
                </div>

                {/* Region filter */}
                <div className="mb-6">
                  <div
                    className="flex items-center gap-1 p-1 rounded-2xl"
                    role="tablist"
                    aria-label="Filter states by region"
                    style={{
                      background: "rgba(var(--nec-dark-rgb),0.6)",
                      border: "1px solid var(--nec-border)",
                    }}
                  >
                    {filterTabs.map((tab) => {
                      const isActive = regionFilter === tab.key
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          aria-controls="state-cards-panel"
                          onClick={() => setRegionFilter(tab.key)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--nec-purple)]"
                          style={{
                            background: isActive
                              ? "rgba(var(--nec-purple-rgb),0.10)"
                              : "transparent",
                            color: isActive
                              ? "var(--nec-purple)"
                              : "var(--nec-muted)",
                            boxShadow: isActive
                              ? "var(--shadow-glow-purple)"
                              : "none",
                          }}
                        >
                          {tab.label}
                          <span
                            className="text-[11px] px-1.5 py-0.5 rounded-md font-bold"
                            style={{
                              background: isActive
                                ? "rgba(var(--nec-purple-rgb),0.12)"
                                : "rgba(var(--nec-purple-rgb),0.06)",
                              color: isActive
                                ? "var(--nec-purple)"
                                : "var(--nec-muted)",
                            }}
                          >
                            {tab.count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* State cards */}
                <section
                  id="state-cards-panel"
                  role="tabpanel"
                  aria-label="NECYPAA member states"
                >
                  <motion.div
                    className="space-y-3"
                    variants={shouldReduce ? undefined : staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                  >
                    {filteredStates.map((state) => (
                      <motion.div key={state.abbreviation} variants={staggerChild}>
                        <StateCard
                          state={state}
                          isHighlighted={selectedState === state.abbreviation}
                          onViewMeetings={handleViewMeetings}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </section>

                {/* AA Meeting Finder — compact */}
                <section
                  className="rounded-2xl p-5 md:p-6 mt-8 text-center relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(var(--nec-purple-rgb),0.06) 0%, rgba(var(--nec-card-rgb),0.6) 100%)",
                    border: "1px solid rgba(var(--nec-purple-rgb),0.15)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(var(--nec-purple-rgb),0.30), rgba(var(--nec-pink-rgb),0.30), transparent)",
                    }}
                    aria-hidden="true"
                  />
                  <h2 className="text-lg font-black text-[var(--nec-text)] mb-1">
                    Find an AA Meeting
                  </h2>
                  <p
                    className="text-xs mb-4 max-w-sm mx-auto"
                    style={{ color: "var(--nec-muted)" }}
                  >
                    Search for meetings anywhere in the NECYPAA region or around the world.
                  </p>
                  <a
                    href="https://www.aa.org/find-aa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2 text-sm"
                  >
                    AA Meeting Finder{" "}
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                </section>

                {/* Feedback note */}
                <div
                  className="mt-8 rounded-xl p-4 text-xs leading-relaxed text-center"
                  style={{
                    background: "rgba(var(--nec-card-rgb),0.4)",
                    border: "1px solid var(--nec-border)",
                    color: "var(--nec-muted)",
                  }}
                >
                  <p>
                    Know of a resource that should be listed here?{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=States%20Page%20Feedback`}
                      className="underline transition-colors hover:text-[var(--nec-text)]"
                      style={{ color: "var(--nec-cyan)" }}
                    >
                      Let us know
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════ */}
            {/* ── TAB PANEL: YPAA Meetings ──────────── */}
            {/* ════════════════════════════════════════ */}
            {activeTab === "meetings" && (
              <div
                id="panel-meetings"
                role="tabpanel"
                aria-labelledby="tab-meetings"
              >
                <MeetingDirectory
                  meetings={YPAA_MEETINGS}
                  theme="pink"
                  initialStateFilter={selectedState || ""}
                  states={ypaaStates}
                  heading="YPAA Meeting Directory"
                  description="Young people's AA meetings across the NECYPAA region. Select a state on the map above or use the filters to find meetings near you."
                  icon="users"
                  onStateFilterChange={(state) => {
                    if (state && state !== selectedState) {
                      handleStateSelect(state)
                    } else if (!state && selectedState) {
                      setSelectedState(null)
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
