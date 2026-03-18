"use client"

import { useState, useCallback, useId } from "react"

/**
 * Interactive SVG map of the NECYPAA region.
 * Simplified state outlines — accurate enough for visual navigation,
 * not a GIS-grade projection. Each state is a clickable path that
 * emits the abbreviation via onStateSelect.
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
}

interface StateShape {
  abbreviation: string
  name: string
  d: string
  labelX: number
  labelY: number
  region: "new-england" | "expansion"
}

// Simplified SVG paths for the NECYPAA region states
// ViewBox: 0 0 600 500
const STATE_SHAPES: StateShape[] = [
  // ── New England ──
  {
    abbreviation: "ME",
    name: "Maine",
    d: "M495,10 L520,15 L535,55 L540,95 L530,130 L520,155 L505,160 L500,145 L490,120 L485,90 L480,55 L488,25 Z",
    labelX: 512,
    labelY: 85,
    region: "new-england",
  },
  {
    abbreviation: "NH",
    name: "New Hampshire",
    d: "M480,55 L490,120 L500,145 L505,160 L495,175 L480,180 L472,165 L468,130 L470,95 L475,65 Z",
    labelX: 485,
    labelY: 130,
    region: "new-england",
  },
  {
    abbreviation: "VT",
    name: "Vermont",
    d: "M445,60 L475,65 L470,95 L468,130 L472,165 L460,175 L445,170 L438,140 L435,110 L440,80 Z",
    labelX: 455,
    labelY: 125,
    region: "new-england",
  },
  {
    abbreviation: "MA",
    name: "Massachusetts",
    d: "M445,170 L460,175 L480,180 L495,175 L510,180 L530,178 L540,185 L530,195 L510,200 L495,198 L480,200 L460,198 L445,195 L440,185 Z",
    labelX: 490,
    labelY: 188,
    region: "new-england",
  },
  {
    abbreviation: "RI",
    name: "Rhode Island",
    d: "M510,200 L525,200 L530,215 L525,228 L515,225 L508,215 Z",
    labelX: 519,
    labelY: 214,
    region: "new-england",
  },
  {
    abbreviation: "CT",
    name: "Connecticut",
    d: "M460,198 L495,198 L510,200 L508,215 L505,235 L498,245 L480,248 L462,245 L455,230 L454,215 Z",
    labelX: 480,
    labelY: 225,
    region: "new-england",
  },
  // ── Expansion States ──
  {
    abbreviation: "NY",
    name: "New York",
    d: "M310,80 L380,75 L420,70 L445,60 L440,80 L435,110 L438,140 L445,170 L445,195 L454,215 L455,230 L445,240 L430,235 L410,230 L380,228 L355,230 L335,225 L320,215 L310,195 L305,165 L305,130 L308,100 Z",
    labelX: 375,
    labelY: 155,
    region: "expansion",
  },
  {
    abbreviation: "NJ",
    name: "New Jersey",
    d: "M410,230 L430,235 L440,245 L445,265 L440,290 L432,310 L420,320 L410,315 L405,295 L400,270 L402,250 Z",
    labelX: 422,
    labelY: 278,
    region: "expansion",
  },
  {
    abbreviation: "PA",
    name: "Pennsylvania",
    d: "M265,195 L310,195 L320,215 L335,225 L355,230 L380,228 L410,230 L402,250 L400,270 L395,285 L370,290 L340,288 L310,285 L280,280 L260,270 L255,245 L258,220 Z",
    labelX: 330,
    labelY: 245,
    region: "expansion",
  },
  {
    abbreviation: "DE",
    name: "Delaware",
    d: "M420,320 L432,310 L440,325 L438,345 L430,360 L420,355 L415,340 Z",
    labelX: 430,
    labelY: 340,
    region: "expansion",
  },
  {
    abbreviation: "MD",
    name: "Maryland",
    d: "M280,280 L310,285 L340,288 L370,290 L395,285 L400,270 L405,295 L410,315 L420,320 L415,340 L400,345 L380,350 L350,345 L320,340 L290,335 L270,320 L268,300 Z",
    labelX: 345,
    labelY: 315,
    region: "expansion",
  },
  {
    abbreviation: "DC",
    name: "Washington, D.C.",
    d: "M355,345 L370,342 L375,355 L365,362 L355,358 Z",
    labelX: 365,
    labelY: 352,
    region: "expansion",
  },
]

export default function NecypaaRegionMap({
  activeState,
  onStateSelect,
}: NecypaaRegionMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const liveRegionId = useId()

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, abbreviation: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onStateSelect(abbreviation)
      }
    },
    [onStateSelect],
  )

  const getStateColor = (abbr: string, region: string) => {
    const isActive = activeState === abbr
    const isHovered = hoveredState === abbr

    if (isActive) {
      return region === "new-england"
        ? "rgba(20,184,166,0.55)"
        : "rgba(124,58,237,0.55)"
    }
    if (isHovered) {
      return region === "new-england"
        ? "rgba(20,184,166,0.30)"
        : "rgba(124,58,237,0.30)"
    }
    return region === "new-england"
      ? "rgba(20,184,166,0.10)"
      : "rgba(124,58,237,0.10)"
  }

  const getStrokeColor = (abbr: string, region: string) => {
    const isActive = activeState === abbr
    const isHovered = hoveredState === abbr

    if (isActive) {
      return region === "new-england"
        ? "rgba(20,184,166,0.9)"
        : "rgba(124,58,237,0.9)"
    }
    if (isHovered) {
      return region === "new-england"
        ? "rgba(20,184,166,0.6)"
        : "rgba(124,58,237,0.6)"
    }
    return "rgba(45,31,78,0.6)"
  }

  const activeStateName = STATE_SHAPES.find(
    (s) => s.abbreviation === activeState,
  )?.name

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
        viewBox="220 0 360 400"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Interactive map of the NECYPAA region showing 12 states and Washington, D.C. Select a state to view its resources."
        className="w-full h-auto max-h-[420px]"
        style={{ filter: "drop-shadow(0 0 40px rgba(124,58,237,0.08))" }}
      >
        <defs>
          {/* Glow filter for active state */}
          <filter id="state-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Subtle inner glow for hover */}
          <filter
            id="state-hover-glow"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Radial gradient background */}
          <radialGradient id="map-bg-grad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(124,58,237,0.06)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <rect
          x="220"
          y="0"
          width="360"
          height="400"
          fill="url(#map-bg-grad)"
          aria-hidden="true"
        />

        {/* State paths */}
        {STATE_SHAPES.map((state) => {
          const isActive = activeState === state.abbreviation
          const isHovered = hoveredState === state.abbreviation

          return (
            <g key={state.abbreviation}>
              <path
                d={state.d}
                fill={getStateColor(state.abbreviation, state.region)}
                stroke={getStrokeColor(state.abbreviation, state.region)}
                strokeWidth={isActive ? 2.5 : isHovered ? 2 : 1}
                strokeLinejoin="round"
                className="necypaa-map-state"
                style={{
                  cursor: "pointer",
                  filter: isActive
                    ? "url(#state-glow)"
                    : isHovered
                      ? "url(#state-hover-glow)"
                      : "none",
                }}
                role="button"
                tabIndex={0}
                aria-label={`${state.name}${isActive ? " (selected)" : ""}. Click to view AA resources.`}
                onClick={() => onStateSelect(state.abbreviation)}
                onKeyDown={(e) => handleKeyDown(e, state.abbreviation)}
                onMouseEnter={() => setHoveredState(state.abbreviation)}
                onMouseLeave={() => setHoveredState(null)}
                onFocus={() => setHoveredState(state.abbreviation)}
                onBlur={() => setHoveredState(null)}
              />
              {/* State label */}
              <text
                x={state.labelX}
                y={state.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none select-none"
                style={{
                  fill:
                    isActive || isHovered
                      ? "#ffffff"
                      : "rgba(232,224,240,0.6)",
                  fontSize: state.abbreviation === "DC" || state.abbreviation === "RI" ? "8px" : "11px",
                  fontWeight: isActive ? 900 : 700,
                  fontFamily: "var(--font-heading), Outfit, sans-serif",
                  letterSpacing: "0.05em",
                  textShadow: isActive
                    ? "0 0 12px rgba(124,58,237,0.8)"
                    : "none",
                }}
                aria-hidden="true"
              >
                {state.abbreviation}
              </text>
            </g>
          )
        })}

        {/* Legend */}
        <g aria-hidden="true" transform="translate(235, 365)">
          <rect
            x="0"
            y="0"
            width="8"
            height="8"
            rx="2"
            fill="rgba(20,184,166,0.3)"
            stroke="rgba(20,184,166,0.6)"
            strokeWidth="1"
          />
          <text
            x="14"
            y="8"
            style={{
              fill: "var(--nec-muted)",
              fontSize: "9px",
              fontFamily: "var(--font-sans), sans-serif",
            }}
          >
            New England
          </text>
          <rect
            x="95"
            y="0"
            width="8"
            height="8"
            rx="2"
            fill="rgba(124,58,237,0.3)"
            stroke="rgba(124,58,237,0.6)"
            strokeWidth="1"
          />
          <text
            x="109"
            y="8"
            style={{
              fill: "var(--nec-muted)",
              fontSize: "9px",
              fontFamily: "var(--font-sans), sans-serif",
            }}
          >
            2025 Expansion
          </text>
        </g>
      </svg>
    </div>
  )
}
