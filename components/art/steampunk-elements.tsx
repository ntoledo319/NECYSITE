/**
 * Steampunk decorative SVG elements for the "Escaping the Mad Realm" theme.
 * All elements are purely decorative (aria-hidden) and use CSS custom properties.
 */

interface GearProps {
  className?: string
  size?: number
  color?: string
  opacity?: number
}

export function Gear({ className = "", size = 48, color = "var(--nec-gold)", opacity = 0.15 }: GearProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      <path
        d="M50 20a30 30 0 1 1 0 60 30 30 0 0 1 0-60zm0 10a20 20 0 1 0 0 40 20 20 0 0 0 0-40z"
        fill={color}
      />
      {/* Gear teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="46"
          y="5"
          width="8"
          height="15"
          rx="2"
          fill={color}
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
    </svg>
  )
}

export function KeyIcon({ className = "", size = 40, color = "var(--nec-gold)", opacity = 0.12 }: GearProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      <circle cx="30" cy="30" r="18" stroke={color} strokeWidth="4" fill="none" />
      <circle cx="30" cy="30" r="8" stroke={color} strokeWidth="3" fill="none" />
      <line x1="48" y1="30" x2="90" y2="30" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="75" y1="30" x2="75" y2="45" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="85" y1="30" x2="85" y2="42" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function ClockIcon({ className = "", size = 44, color = "var(--nec-gold)", opacity = 0.10 }: GearProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="36" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Hour marks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1="50"
          y1="14"
          x2="50"
          y2="20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {/* Hands */}
      <line x1="50" y1="50" x2="50" y2="25" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="50" x2="68" y2="50" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3" fill={color} />
    </svg>
  )
}

export function VortexSwirl({ className = "", size = 120, color = "var(--nec-purple)", opacity = 0.08 }: GearProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      <path
        d="M100 20 C140 20 170 50 170 90 C170 130 140 155 110 145 C80 135 70 110 85 90 C100 70 120 75 115 95"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M100 180 C60 180 30 150 30 110 C30 70 60 45 90 55 C120 65 130 90 115 110 C100 130 80 125 85 105"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
