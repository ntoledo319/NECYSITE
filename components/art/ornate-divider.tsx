/**
 * Ornate steampunk section divider — replaces simple gradient lines.
 * Features gears, keys, and decorative flourishes inspired by the
 * Mad Realm border art. Pure SVG, no images needed.
 * All decorative — aria-hidden.
 */

interface OrnateDividerProps {
  variant?: "gear" | "key" | "potion" | "compass"
  className?: string
  color?: string
}

export default function OrnateDivider({
  variant = "gear",
  className = "",
  color,
}: OrnateDividerProps) {
  const accentColor = color ?? "var(--nec-purple)"

  return (
    <div
      className={`relative flex items-center gap-0 w-full py-4 ${className}`}
      aria-hidden="true"
    >
      {/* Left flourish line */}
      <div className="flex-1 flex items-center">
        <div
          className="h-[1px] flex-1 mad-realm-divider-line"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accentColor} 100%)`,
            opacity: 0.35,
          }}
        />
        <LeftFlourish color={accentColor} />
      </div>

      {/* Center motif */}
      <div className="mx-2 flex-shrink-0">
        {variant === "gear" && <GearMotif color={accentColor} />}
        {variant === "key" && <KeyMotif color={accentColor} />}
        {variant === "potion" && <PotionMotif color={accentColor} />}
        {variant === "compass" && <CompassMotif color={accentColor} />}
      </div>

      {/* Right flourish line */}
      <div className="flex-1 flex items-center">
        <RightFlourish color={accentColor} />
        <div
          className="h-[1px] flex-1 mad-realm-divider-line"
          style={{
            background: `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)`,
            opacity: 0.35,
          }}
        />
      </div>
    </div>
  )
}

function LeftFlourish({ color }: { color: string }) {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="flex-shrink-0">
      <path
        d="M60 10 C55 10, 50 6, 44 6 C38 6, 35 10, 30 10 C25 10, 22 6, 16 6 C10 6, 6 10, 0 10"
        stroke={color} strokeWidth="1" opacity="0.3" fill="none"
      />
      <circle cx="0" cy="10" r="2" fill={color} opacity="0.2" />
      <circle cx="30" cy="10" r="1.5" fill={color} opacity="0.15" />
    </svg>
  )
}

function RightFlourish({ color }: { color: string }) {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="flex-shrink-0">
      <path
        d="M0 10 C5 10, 10 6, 16 6 C22 6, 25 10, 30 10 C35 10, 38 6, 44 6 C50 6, 55 10, 60 10"
        stroke={color} strokeWidth="1" opacity="0.3" fill="none"
      />
      <circle cx="60" cy="10" r="2" fill={color} opacity="0.2" />
      <circle cx="30" cy="10" r="1.5" fill={color} opacity="0.15" />
    </svg>
  )
}

function GearMotif({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="22" stroke={color} strokeWidth="2.5" opacity="0.4" />
      <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="2" opacity="0.3" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="47" y="20" width="6" height="10" rx="1.5"
          fill={color} opacity="0.3"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {/* Inner triangle — subtle AA nod */}
      <polygon
        points="50,38 58,56 42,56"
        stroke={color} strokeWidth="1.5" fill="none" opacity="0.2"
      />
    </svg>
  )
}

function KeyMotif({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
      <circle cx="35" cy="50" r="15" stroke={color} strokeWidth="2.5" opacity="0.35" />
      <circle cx="35" cy="50" r="6" stroke={color} strokeWidth="2" opacity="0.25" />
      <line x1="50" y1="50" x2="85" y2="50" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
      <line x1="70" y1="50" x2="70" y2="62" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      <line x1="80" y1="50" x2="80" y2="58" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      {/* Decorative dots */}
      <circle cx="15" cy="50" r="2" fill={color} opacity="0.2" />
      <circle cx="90" cy="50" r="2" fill={color} opacity="0.2" />
    </svg>
  )
}

function PotionMotif({ color }: { color: string }) {
  return (
    <svg width="40" height="48" viewBox="0 0 80 100" fill="none">
      <rect x="30" y="10" width="20" height="10" rx="3" stroke={color} strokeWidth="2" opacity="0.35" />
      <path
        d="M30 20 L22 48 C18 58 20 72 28 80 C36 88 44 88 52 80 C60 72 62 58 58 48 L50 20"
        stroke={color} strokeWidth="2" fill="none" opacity="0.35" strokeLinejoin="round"
      />
      <ellipse cx="40" cy="72" rx="10" ry="5" stroke={color} strokeWidth="1.5" opacity="0.2" />
      {/* Bubbles */}
      <circle cx="36" cy="60" r="2.5" stroke={color} strokeWidth="1" opacity="0.2" fill="none" />
      <circle cx="44" cy="55" r="1.5" stroke={color} strokeWidth="1" opacity="0.15" fill="none" />
    </svg>
  )
}

function CompassMotif({ color }: { color: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="28" stroke={color} strokeWidth="2" opacity="0.35" />
      <circle cx="50" cy="50" r="24" stroke={color} strokeWidth="1" opacity="0.2" />
      <circle cx="50" cy="50" r="3" fill={color} opacity="0.3" />
      {/* Cardinal points */}
      <polygon points="50,22 53,42 50,46 47,42" fill={color} opacity="0.3" />
      <polygon points="50,78 47,58 50,54 53,58" fill={color} opacity="0.15" />
      <polygon points="22,50 42,47 46,50 42,53" fill={color} opacity="0.15" />
      <polygon points="78,50 58,53 54,50 58,47" fill={color} opacity="0.15" />
      {/* Cross lines */}
      <line x1="50" y1="22" x2="50" y2="78" stroke={color} strokeWidth="0.5" opacity="0.15" />
      <line x1="22" y1="50" x2="78" y2="50" stroke={color} strokeWidth="0.5" opacity="0.15" />
    </svg>
  )
}
