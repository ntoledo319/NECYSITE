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
      <path d="M50 20a30 30 0 1 1 0 60 30 30 0 0 1 0-60zm0 10a20 20 0 1 0 0 40 20 20 0 0 0 0-40z" fill={color} />
      {/* Gear teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect key={angle} x="46" y="5" width="8" height="15" rx="2" fill={color} transform={`rotate(${angle} 50 50)`} />
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
