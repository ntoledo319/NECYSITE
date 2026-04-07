"use client"

import { useState, useCallback, useId, useMemo } from "react"

/**
 * Interactive SVG map of the NECYPAA region.
 * Uses geographically accurate state outlines (Albers USA projection)
 * sourced from public-domain US map data. Each state is a clickable
 * path that emits the abbreviation via onStateSelect.
 *
 * Accessibility:
 * - Each state path has role="button", tabIndex, aria-label
 * - Keyboard Enter/Space triggers selection
 * - Active state announced via aria-live region
 * - Respects reduce-motion via CSS
 */

interface NecypaaRegionMapProps {
  activeState: string | null
  onStateSelect: (abbreviation: string) => void
  /** Optional map of state abbreviation → YPAA meeting count for badge display */
  meetingCounts?: Record<string, number>
}

interface StateShape {
  abbreviation: string
  name: string
  d: string
  labelX: number
  labelY: number
  region: "new-england" | "expansion"
}

// Geographically accurate SVG paths (Albers USA projection)
// ViewBox focused on the NE region: "710 25 230 260"
const STATE_SHAPES: StateShape[] = [
  // ── New England ──
  {
    abbreviation: "ME",
    name: "Maine",
    d: "M865.8,91.9 l1.5,0.4 v-2.6 l0.8,-5.5 2.6,-4.7 1.5,-4 -1.9,-2.4 v-6 l0.8,-1 0.8,-2.7 -0.2,-1.5 -0.2,-4.8 1.8,-4.8 2.9,-8.9 2.1,-4.2 h1.3 l1.3,0.2 v1.1 l1.3,2.3 2.7,0.6 0.8,-0.8 v-1 l4,-2.9 1.8,-1.8 1.5,0.2 6,2.4 1.9,1 9.1,29.9 h6 l0.8,1.9 0.2,4.8 2.9,2.3 h0.8 l0.2,-0.5 -0.5,-1.1 2.8,-0.5 1.9,2.1 2.3,3.7 v1.9 l-2.1,4.7 -1.9,0.6 -3.4,3.1 -4.8,5.5 c0,0 -0.6,0 -1.3,0 -0.6,0 -1,-2.1 -1,-2.1 l-1.8,0.2 -1,1.5 -2.4,1.5 -1,1.5 1.6,1.5 -0.5,0.6 -0.5,2.7 -1.9,-0.2 v-1.6 l-0.3,-1.3 -1.5,0.3 -1.8,-3.2 -2.1,1.3 1.3,1.5 0.3,1.1 -0.8,1.3 0.3,3.1 0.2,1.6 -1.6,2.6 -2.9,0.5 -0.3,2.9 -5.3,3.1 -1.3,0.5 -1.6,-1.5 -3.1,3.6 1,3.2 -1.5,1.3 -0.2,4.4 -1.1,6.3 -2.2,-0.9 -0.5,-3.1 -4,-1.1 -0.2,-2.5 -11.7,-37.43z m36.5,15.6 1.5,-1.5 1.4,1.1 0.6,2.4 -1.7,0.9z m6.7,-5.9 1.8,1.9 c0,0 1.3,0.1 1.3,-0.2 0,-0.3 0.2,-2 0.2,-2 l0.9,-0.8 -0.8,-1.8 -2,0.7z",
    labelX: 886,
    labelY: 78,
    region: "new-england",
  },
  {
    abbreviation: "NH",
    name: "New Hampshire",
    d: "M881.7,141.3 l1.1,-3.2 -2.7,-1.2 -0.5,-3.1 -4.1,-1.1 -0.3,-3 -11.7,-37.48 -0.7,0.08 -0.6,1.6 -0.6,-0.5 -1,-1 -1.5,1.9 -0.2,2.29 0.5,8.41 1.9,2.8 v4.3 l-3.9,4.8 -2.4,0.9 v0.7 l1.1,1.9 v8.6 l-0.8,9.2 -0.2,4.7 1,1.4 -0.2,4.7 -0.5,1.5 1,1.1 5.1,-1.2 13.8,-3.5 1.7,-2.9 4,-1.9z",
    labelX: 870,
    labelY: 118,
    region: "new-england",
  },
  {
    abbreviation: "VT",
    name: "Vermont",
    d: "M832.7,111.3 l2.4,6.5 0.8,5.3 -1,3.9 2.5,4.4 0.9,2.3 -0.7,2.6 3.3,1.5 2.9,10.8 v5.3 l11.5,-2.1 -1,-1.1 0.6,-1.9 0.2,-4.3 -1,-1.4 0.2,-4.7 0.8,-9.3 v-8.5 l-1.1,-1.8 v-1.6 l2.8,-1.1 3.5,-4.4 v-3.6 l-1.9,-2.7 -0.3,-5.79 -26.1,6.79z",
    labelX: 846,
    labelY: 118,
    region: "new-england",
  },
  {
    abbreviation: "MA",
    name: "Massachusetts",
    d: "M887.5,172.5 l-0.5,-2.3 0.8,-1.5 2.9,-1.5 0.8,3.1 -0.5,1.8 -2.4,1.5 v1 l1.9,-1.5 3.9,-4.5 3.9,-1.9 4.2,-1.5 -0.3,-2.4 -1,-2.9 -1.9,-2.4 -1.8,-0.8 -2.1,0.2 -0.5,0.5 1,1.3 1.5,-0.8 2.1,1.6 0.8,2.7 -1.8,1.8 -2.3,1 -3.6,-0.5 -3.9,-6 -2.3,-2.6 h-1.8 l-1.1,0.8 -1.9,-2.6 0.3,-1.5 2.4,-5.2 -2.9,-4.4 -3.7,1.8 -1.8,2.9 -18.3,4.7 -13.8,2.5 -0.6,10.6 0.7,4.9 22,-4.8 11.2,-2.8 2,1.6 3.4,4.3 2.9,4.7z m12.5,1.4 2.2,-0.7 0.5,-1.7 1,0.1 1,2.3 -1.3,0.5 -3.9,0.1z m-9.4,0.8 2.3,-2.6 h1.6 l1.8,1.5 -2.4,1 -2.2,1z",
    labelX: 870,
    labelY: 162,
    region: "new-england",
  },
  {
    abbreviation: "RI",
    name: "Rhode Island",
    d: "M873.6,175.7 l-0.8,-4.4 -1.6,-6 5.7,-1.5 1.5,1.3 3.4,4.3 2.8,4.4 -2.8,1.4 -1.3,-0.2 -1.1,1.8 -2.4,1.9 -2.8,1.1z",
    labelX: 879,
    labelY: 176,
    region: "new-england",
  },
  {
    abbreviation: "CT",
    name: "Connecticut",
    d: "M852,190.9 l3.6,-3.2 1.9,-2.1 0.8,0.6 2.7,-1.5 5.2,-1.1 7,-3.5 -0.6,-4.2 -0.8,-4.4 -1.6,-6 -4.3,1.1 -21.8,4.7 0.6,3.1 1.5,7.3 v8.3 l-0.9,2.1 1.7,2.2z",
    labelX: 856,
    labelY: 183,
    region: "new-england",
  },
  // ── Expansion States ──
  {
    abbreviation: "NY",
    name: "New York",
    d: "M843.4,200 l0.5,-2.7 -0.2,-2.4 -3,-1.5 -6.5,-2 -6,-2.6 -0.6,-0.4 -2.7,-0.3 -2,-1.5 -2.1,-5.9 -3.3,-0.5 -2.4,-2.4 -38.4,8.1 -31.6,6 -0.5,-6.5 1.6,-1.2 1.3,-1.1 1,-1.6 1.8,-1.1 1.9,-1.8 0.5,-1.6 2.1,-2.7 1.1,-1 -0.2,-1 -1.3,-3.1 -1.8,-0.2 -1.9,-6.1 2.9,-1.8 4.4,-1.5 4,-1.3 3.2,-0.5 6.3,-0.2 1.9,1.3 1.6,0.2 2.1,-1.3 2.6,-1.1 5.2,-0.5 2.1,-1.8 1.8,-3.2 1.6,-1.9 h2.1 l1.9,-1.1 0.2,-2.3 -1.5,-2.1 -0.3,-1.5 1.1,-2.1 v-1.5 h-1.8 l-1.8,-0.8 -0.8,-1.1 -0.2,-2.6 5.8,-5.5 0.6,-0.8 1.5,-2.9 2.9,-4.5 2.7,-3.7 2.1,-2.4 2.4,-1.8 3.1,-1.2 5.5,-1.3 3.2,0.2 4.5,-1.5 7.4,-2.2 0.7,4.9 2.4,6.5 0.8,5 -1,4.2 2.6,4.5 0.8,2 -0.9,3.2 3.7,1.7 2.7,10.2 v5.8 l-0.6,10.9 0.8,5.4 0.7,3.6 1.5,7.3 v8.1 l-1.1,2.3 2.1,2.7 0.5,0.9 -1.9,1.8 0.3,1.3 1.3,-0.3 1.5,-1.3 2.3,-2.6 1.1,-0.6 1.6,0.6 2.3,0.2 7.9,-3.9 2.9,-2.7 1.3,-1.5 4.2,1.6 -3.4,3.6 -3.9,2.9 -7.1,5.3 -2.6,1 -5.8,1.9 -4,1.1 -1,-0.4z",
    labelX: 788,
    labelY: 168,
    region: "expansion",
  },
  {
    abbreviation: "NJ",
    name: "New Jersey",
    d: "M823.7,228.3 l0.1,-1.5 2.7,-1.3 1.7,-2.8 1.7,-2.4 3.3,-3.2 v-1.2 l-6.1,-4.1 -1,-2.7 -2.7,-0.3 -0.1,-0.9 -0.7,-2.2 2.2,-1.1 0.2,-2.9 -1.3,-1.3 0.2,-1.2 1.9,-3.1 v-3.1 l2.5,-3.1 5.6,2.5 6.4,1.9 2.5,1.2 0.1,1.8 -0.5,2.7 0.4,4.5 -2.1,1.9 -1.1,1 0.5,0.5 2.7,-0.3 1.1,-0.8 1.6,3.4 0.2,9.4 0.6,1.1 -1.1,5.5 -3.1,6.5 -2.7,4 -0.8,4.8 -2.1,2.4 h-0.8 l-0.3,-2.7 0.8,-1 -0.2,-1.5 -4,-0.6 -4.8,-2.3 -3.2,-2.9 -1,-2z",
    labelX: 835,
    labelY: 225,
    region: "expansion",
  },
  {
    abbreviation: "PA",
    name: "Pennsylvania",
    d: "M736.6,192.2 l1.3,-0.5 5.7,-5.5 0.7,6.9 33.5,-6.5 36.9,-7.8 2.3,2.3 3.1,0.4 2,5.6 2.4,1.9 2.8,0.4 0.1,0.1 -2.6,3.2 v3.1 l-1.9,3.1 -0.2,1.9 1.3,1.3 -0.2,1.9 -2.4,1.1 1,3.4 0.2,1.1 2.8,0.3 0.9,2.5 5.9,3.9 v0.4 l-3.1,3 -1.5,2.2 -1.7,2.8 -2.7,1.2 -1.4,0.3 -2.1,1.3 -1.6,1.4 -22.4,4.3 -38.7,7.8 -11.3,1.4 -3.9,0.7 -5.1,-22.4 -4.3,-25.9z",
    labelX: 780,
    labelY: 212,
    region: "expansion",
  },
  {
    abbreviation: "DE",
    name: "Delaware",
    d: "M834.4,247.2 l-1,0.5 -3.6,-2.4 -1.8,-4.7 -1.9,-3.6 -2.3,-1 -2.1,-3.6 0.5,-2 0.5,-2.3 0.1,-1.1 -0.6,0.1 -1.7,1 -2,1.7 -0.2,0.3 1.4,4.1 2.3,5.6 3.7,16.1 5,-0.3 6,-1.1z",
    labelX: 832,
    labelY: 245,
    region: "expansion",
  },
  {
    abbreviation: "MD",
    name: "Maryland",
    d: "M834.8,264.1 l1.7,-3.8 0.5,-4.8 -6.3,1.1 -5.8,0.3 -3.8,-16.8 -2.3,-5.5 -1.5,-4.6 -22.2,4.3 -37.6,7.6 2,10.4 4.8,-4.9 2.5,-0.7 1.4,-1.5 1.8,-2.7 1.6,0.7 2.6,-0.2 2.6,-2.1 2,-1.5 2.1,-0.6 1.5,1.1 2.7,1.4 1.9,1.8 1.3,1.4 4.8,1.6 -0.6,2.9 5.8,2.1 2.1,-2.6 3.7,2.5 -2.1,3.3 -0.7,3.3 -1.8,2.6 v2.1 l0.3,0.8 2,1.3 3.4,1.1 4.3,-0.1 3.1,1 2.1,0.3 1,-2.1 -1.5,-2.1 v-1.8 l-2.4,-2.1 -2.1,-5.5 1.3,-5.3 -0.2,-2.1 -1.3,-1.3 c0,0 1.5,-1.6 1.5,-2.3 0,-0.6 0.5,-2.1 0.5,-2.1 l1.9,-1.3 1.9,-1.6 0.5,1 -1.5,1.6 -1.3,3.7 0.3,1.1 1.8,0.3 0.5,5.5 -2.1,1 0.3,3.6 0.5,-0.2 1.1,-1.9 1.6,1.8 -1.6,1.3 -0.3,3.4 2.6,3.4 3.9,0.5 1.6,-0.8 3.2,4.2 1,0.4z m-14.5,0.2 1.1,2.5 0.2,1.8 1.1,1.9 c0,0 0.9,-0.9 0.9,-1.2 0,-0.3 -0.7,-3.1 -0.7,-3.1 l-0.7,-2.3z",
    labelX: 790,
    labelY: 252,
    region: "expansion",
  },
  {
    abbreviation: "DC",
    name: "Washington, D.C.",
    d: "M803,260 m-3,0 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0",
    labelX: 798,
    labelY: 268,
    region: "expansion",
  },
]

// Centroid cache: pre-computed label positions for accurate state paths
const LABEL_OVERRIDES: Record<string, { x: number; y: number }> = {
  ME: { x: 886, y: 78 },
  NH: { x: 870, y: 118 },
  VT: { x: 846, y: 118 },
  MA: { x: 868, y: 162 },
  RI: { x: 882, y: 176 },
  CT: { x: 856, y: 183 },
  NY: { x: 788, y: 168 },
  NJ: { x: 836, y: 228 },
  PA: { x: 778, y: 212 },
  DE: { x: 833, y: 247 },
  MD: { x: 808, y: 254 },
  DC: { x: 798, y: 268 },
}

export default function NecypaaRegionMap({
  activeState,
  onStateSelect,
  meetingCounts,
}: NecypaaRegionMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const liveRegionId = useId()
  const rawFilterId = useId()
  const filterId = rawFilterId.replace(/:/g, "")

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, abbreviation: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onStateSelect(abbreviation)
      }
    },
    [onStateSelect],
  )

  const getStateFill = useCallback(
    (abbr: string, region: string) => {
      const isActive = activeState === abbr
      const isHovered = hoveredState === abbr
      const isNE = region === "new-england"

      if (isActive) {
        return isNE
          ? "rgba(var(--nec-cyan-rgb),0.40)"
          : "rgba(var(--nec-purple-rgb),0.40)"
      }
      if (isHovered) {
        return isNE
          ? "rgba(var(--nec-cyan-rgb),0.22)"
          : "rgba(var(--nec-purple-rgb),0.22)"
      }
      return isNE
        ? "rgba(var(--nec-cyan-rgb),0.07)"
        : "rgba(var(--nec-purple-rgb),0.07)"
    },
    [activeState, hoveredState],
  )

  const getStrokeColor = useCallback(
    (abbr: string, region: string) => {
      const isActive = activeState === abbr
      const isHovered = hoveredState === abbr
      const isNE = region === "new-england"

      if (isActive) {
        return isNE
          ? "rgba(var(--nec-cyan-rgb),0.85)"
          : "rgba(var(--nec-purple-rgb),0.85)"
      }
      if (isHovered) {
        return isNE
          ? "rgba(var(--nec-cyan-rgb),0.50)"
          : "rgba(var(--nec-purple-rgb),0.50)"
      }
      return "rgba(var(--nec-purple-rgb),0.25)"
    },
    [activeState, hoveredState],
  )

  const activeStateName = useMemo(
    () => STATE_SHAPES.find((s) => s.abbreviation === activeState)?.name,
    [activeState],
  )

  return (
    <div className="necypaa-map-container relative">
      {/* Live region for screen reader announcements */}
      <div
        id={liveRegionId}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {activeStateName
          ? `${activeStateName} selected. Showing resources below.`
          : ""}
      </div>

      <svg
        viewBox="710 25 230 260"
        xmlns="http://www.w3.org/2000/svg"
        role="group"
        aria-label="Interactive map of the NECYPAA region showing 12 states and Washington, D.C. Select a state to view its resources."
        className="w-full h-auto max-h-[480px]"
        style={{ touchAction: "manipulation" }}
      >
        <defs>
          {/* Refined glow for active state — soft, not blobby */}
          <filter id={`${filterId}-active`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feFlood result="color" style={{ floodColor: "rgba(var(--nec-purple-rgb),0.3)" }} />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Subtle border shimmer for NE active */}
          <filter id={`${filterId}-active-ne`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feFlood result="color" style={{ floodColor: "rgba(var(--nec-cyan-rgb),0.3)" }} />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* State paths */}
        {STATE_SHAPES.map((state) => {
          const isActive = activeState === state.abbreviation
          const isHovered = hoveredState === state.abbreviation
          const label = LABEL_OVERRIDES[state.abbreviation] ?? {
            x: state.labelX,
            y: state.labelY,
          }
          const isSmall =
            state.abbreviation === "DC" ||
            state.abbreviation === "RI" ||
            state.abbreviation === "DE"

          return (
            <g key={state.abbreviation}>
              <path
                d={state.d}
                strokeLinejoin="round"
                className="necypaa-map-state"
                style={{
                  fill: getStateFill(state.abbreviation, state.region),
                  stroke: getStrokeColor(state.abbreviation, state.region),
                  strokeWidth: isActive ? 1.8 : isHovered ? 1.2 : 0.6,
                  cursor: "pointer",
                  transition: "fill 0.2s ease, stroke 0.2s ease, stroke-width 0.15s ease",
                  filter: isActive
                    ? `url(#${filterId}-active${state.region === "new-england" ? "-ne" : ""})`
                    : "none",
                }}
                role="button"
                tabIndex={0}
                aria-label={`${state.name}${isActive ? " (selected)" : ""}. Select to view AA resources.`}
                onClick={() => onStateSelect(state.abbreviation)}
                onKeyDown={(e) => handleKeyDown(e, state.abbreviation)}
                onMouseEnter={() => setHoveredState(state.abbreviation)}
                onMouseLeave={() => setHoveredState(null)}
                onFocus={() => setHoveredState(state.abbreviation)}
                onBlur={() => setHoveredState(null)}
              />
              {/* Enlarged invisible touch target for small states — meets WCAG 44px minimum */}
              {isSmall && (
                <circle
                  cx={label.x}
                  cy={label.y}
                  r={14}
                  fill="transparent"
                  stroke="none"
                  style={{ cursor: "pointer", touchAction: "manipulation" }}
                  aria-hidden="true"
                  onClick={() => onStateSelect(state.abbreviation)}
                  onMouseEnter={() => setHoveredState(state.abbreviation)}
                  onMouseLeave={() => setHoveredState(null)}
                />
              )}
              {/* State label */}
              <text
                x={label.x}
                y={meetingCounts && meetingCounts[state.abbreviation] ? label.y - 2 : label.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none select-none"
                style={{
                  fill:
                    isActive
                      ? "#ffffff"
                      : isHovered
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(200,190,220,0.55)",
                  fontSize: isSmall ? "5px" : "7px",
                  fontWeight: isActive ? 800 : 600,
                  fontFamily: "var(--font-heading), Outfit, sans-serif",
                  letterSpacing: "0.08em",
                  transition: "fill 0.2s ease",
                }}
                aria-hidden="true"
              >
                {state.abbreviation}
              </text>
              {/* YPAA meeting count badge */}
              {meetingCounts && meetingCounts[state.abbreviation] > 0 && !isSmall && (
                <g className="pointer-events-none" aria-hidden="true">
                  <rect
                    x={label.x - 5}
                    y={label.y + 3}
                    width={10}
                    height={6}
                    rx={3}
                    strokeWidth={0.3}
                    style={{
                      fill: "rgba(var(--nec-pink-rgb),0.85)",
                      stroke: "rgba(var(--nec-pink-rgb),0.4)",
                    }}
                  />
                  <text
                    x={label.x}
                    y={label.y + 6.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                      fill: "#fff",
                      fontSize: "3.5px",
                      fontWeight: 800,
                      fontFamily: "var(--font-sans), sans-serif",
                    }}
                  >
                    {meetingCounts[state.abbreviation]}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* Legend */}
        <g aria-hidden="true" transform="translate(718, 270)">
          <rect
            x="0"
            y="0"
            width="5"
            height="5"
            rx="1"
            strokeWidth="0.5"
            style={{
              fill: "rgba(var(--nec-cyan-rgb),0.25)",
              stroke: "rgba(var(--nec-cyan-rgb),0.5)",
            }}
          />
          <text
            x="8"
            y="4.5"
            style={{
              fill: "rgba(200,190,220,0.45)",
              fontSize: "5px",
              fontFamily: "var(--font-sans), sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            New England
          </text>
          <rect
            x="58"
            y="0"
            width="5"
            height="5"
            rx="1"
            strokeWidth="0.5"
            style={{
              fill: "rgba(var(--nec-purple-rgb),0.25)",
              stroke: "rgba(var(--nec-purple-rgb),0.5)",
            }}
          />
          <text
            x="66"
            y="4.5"
            style={{
              fill: "rgba(200,190,220,0.45)",
              fontSize: "5px",
              fontFamily: "var(--font-sans), sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            2025 Expansion
          </text>
        </g>
      </svg>

      {/* Mobile-friendly selected state display — visible feedback for touch users */}
      {activeStateName && (
        <div
          className="mt-3 text-center text-sm font-semibold md:hidden"
          style={{ color: "var(--nec-muted)" }}
          aria-hidden="true"
        >
          Selected:{" "}
          <span className="text-[var(--nec-text)]">{activeStateName}</span>
        </div>
      )}
    </div>
  )
}
