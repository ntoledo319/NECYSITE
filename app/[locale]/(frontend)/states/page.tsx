"use client"

import { useState, useMemo } from "react"
import { ExternalLink, Map, List, Globe, Sparkles } from "lucide-react"
import { NECYPAA_STATES } from "@/lib/data/states"
import StateCard from "@/components/state-card"
import NecypaaRegionMap from "@/components/necypaa-region-map"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"

type RegionFilter = "all" | "new-england" | "expansion"

export default function StatesPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all")
  const [viewMode, setViewMode] = useState<"map" | "list">("map")

  const totalIntergroups = NECYPAA_STATES.reduce(
    (sum, s) => sum + s.intergroups.length,
    0,
  )
  const ypaaCount = NECYPAA_STATES.filter((s) => s.ypaaCommittee).length

  const filteredStates = useMemo(() => {
    if (regionFilter === "all") return NECYPAA_STATES
    return NECYPAA_STATES.filter((s) => s.region === regionFilter)
  }, [regionFilter])

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
      bgRgb: "20,184,166",
    },
    {
      value: String(ypaaCount),
      label: "YPAA Committees",
      color: "var(--nec-pink)",
      bgRgb: "192,38,211",
    },
    {
      value: String(totalIntergroups),
      label: "Intergroups",
      color: "var(--nec-gold)",
      bgRgb: "212,160,23",
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
              "linear-gradient(180deg, rgba(124,58,237,0.3) 0%, transparent 30%, transparent 70%, rgba(20,184,166,0.2) 100%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 10%, rgba(124,58,237,0.15) 50%, transparent 90%)",
          }}
        />
      </div>

      <div
        className="flex-1 pt-24 pb-20 md:pb-12 relative z-10"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* ── Hero Header ────────────────────────── */}
            <header className="text-center mb-12 relative">
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="section-badge">
                  <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                  Regional Directory
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4">
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
            </header>

            {/* ── Luxury Stats Strip ─────────────────── */}
            <div
              className="grid grid-cols-3 gap-3 md:gap-4 mb-12"
              role="group"
              aria-label="Region statistics"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="states-stat-card relative rounded-2xl p-5 md:p-6 text-center overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, rgba(${stat.bgRgb},0.08) 0%, rgba(15,10,30,0.8) 100%)`,
                    border: `1px solid rgba(${stat.bgRgb},0.18)`,
                    boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)`,
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
                </div>
              ))}
            </div>

            {/* ── Interactive Map Section ─────────────── */}
            <section
              className="mb-12 rounded-3xl overflow-hidden states-map-section"
              style={{
                background:
                  "linear-gradient(180deg, rgba(26,16,48,0.6) 0%, rgba(15,10,30,0.8) 100%)",
                border: "1px solid var(--nec-border)",
                boxShadow:
                  "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
              aria-label="Interactive region map"
            >
              {/* Map header with view toggle */}
              <div className="flex items-center justify-between p-5 md:p-6 border-b" style={{ borderColor: "var(--nec-border)" }}>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
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
                    background: "rgba(15,10,30,0.6)",
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
                          ? "rgba(124,58,237,0.2)"
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
                          ? "rgba(124,58,237,0.2)"
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
                  <NecypaaRegionMap
                    activeState={selectedState}
                    onStateSelect={handleStateSelect}
                  />
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
                      const rgb = isNE ? "20,184,166" : "124,58,237"

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

            {/* ── Outbound links notice ───────────────── */}
            <div
              className="rounded-2xl p-5 md:p-6 mb-8 text-sm leading-relaxed"
              style={{
                background:
                  "linear-gradient(135deg, rgba(251,191,36,0.04) 0%, rgba(15,10,30,0.6) 100%)",
                border: "1px solid rgba(251,191,36,0.12)",
                color: "var(--nec-muted)",
              }}
            >
              <p>
                <strong style={{ color: "var(--nec-gold)" }}>
                  About these links:
                </strong>{" "}
                All links on this page are outbound resources — they will take
                you to external websites maintained by local AA service bodies,
                YPAA committees, and Al-Anon Family Groups. Per Tradition 6,
                these are resource links, not affiliations or endorsements.
              </p>
            </div>

            {/* ── AA Meeting Finder CTA ──────────────── */}
            <section
              className="rounded-3xl p-6 md:p-8 lg:p-10 mb-12 text-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.10) 0%, rgba(26,16,48,0.7) 50%, rgba(192,38,211,0.06) 100%)",
                border: "1px solid rgba(124,58,237,0.20)",
                boxShadow:
                  "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(124,58,237,0.6), rgba(192,38,211,0.6), transparent)",
                }}
                aria-hidden="true"
              />
              <h2 className="text-xl md:text-2xl font-black text-white mb-2">
                Find an AA Meeting
              </h2>
              <p
                className="text-sm md:text-base mb-6 max-w-md mx-auto"
                style={{ color: "var(--nec-muted)" }}
              >
                Search for AA meetings anywhere in the NECYPAA region or
                around the world.
              </p>
              <a
                href="https://www.aa.org/find-aa"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                AA Meeting Finder{" "}
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </section>

            {/* ── Region Filter Tabs ─────────────────── */}
            <div className="mb-6">
              <div
                className="flex items-center gap-1 p-1 rounded-2xl"
                role="tablist"
                aria-label="Filter states by region"
                style={{
                  background: "rgba(15,10,30,0.6)",
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
                          ? "rgba(124,58,237,0.15)"
                          : "transparent",
                        color: isActive
                          ? "var(--nec-purple)"
                          : "var(--nec-muted)",
                        boxShadow: isActive
                          ? "0 0 12px rgba(124,58,237,0.08)"
                          : "none",
                      }}
                    >
                      {tab.label}
                      <span
                        className="text-[11px] px-1.5 py-0.5 rounded-md font-bold"
                        style={{
                          background: isActive
                            ? "rgba(124,58,237,0.2)"
                            : "rgba(45,31,78,0.4)",
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

            {/* ── State Cards ────────────────────────── */}
            <section
              id="state-cards-panel"
              role="tabpanel"
              aria-label="NECYPAA member states"
            >
              <div className="space-y-3">
                {filteredStates.map((state) => (
                  <StateCard
                    key={state.abbreviation}
                    state={state}
                    isHighlighted={selectedState === state.abbreviation}
                  />
                ))}
              </div>
            </section>

            {/* ── Bottom feedback note ────────────────── */}
            <div
              className="mt-12 rounded-2xl p-5 md:p-6 text-sm leading-relaxed text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26,16,48,0.5) 0%, rgba(15,10,30,0.6) 100%)",
                border: "1px solid var(--nec-border)",
                color: "var(--nec-muted)",
              }}
            >
              <p>
                Know of a resource that should be listed here? Missing or
                outdated link?{" "}
                <a
                  href="mailto:info@necypaa.org?subject=States%20Page%20Feedback"
                  className="underline transition-colors hover:text-white"
                  style={{ color: "var(--nec-cyan)" }}
                >
                  Let us know
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
