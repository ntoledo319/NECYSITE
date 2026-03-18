/**
 * Steampunk gear SVG elements derived from the Mad Realm portal art.
 * Visual language: interlocking cog wheels, brass/purple/pink tones.
 * Used as subtle decorative accents across pages.
 */

interface GearProps {
  size?: number
  teeth?: number
  className?: string
  color?: string
  opacity?: number
}

export function Gear({
  size = 60,
  teeth = 8,
  className = "",
  color = "currentColor",
  opacity = 0.06,
}: GearProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="35" stroke={color} strokeWidth="6" opacity={opacity} />
      <circle cx="50" cy="50" r="18" stroke={color} strokeWidth="4" opacity={opacity} />
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (360 / teeth) * i
        return (
          <rect
            key={angle}
            x="46"
            y="8"
            width="8"
            height="16"
            rx="2"
            fill={color}
            opacity={opacity}
            transform={`rotate(${angle} 50 50)`}
          />
        )
      })}
    </svg>
  )
}

export function GearCluster({
  className = "",
}: {
  className?: string
}) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <div className="relative w-[140px] h-[100px]">
        <div className="absolute top-0 left-0">
          <Gear size={60} teeth={8} color="rgb(168,85,247)" opacity={0.07} />
        </div>
        <div className="absolute top-[25px] left-[45px]">
          <Gear size={45} teeth={6} color="rgb(236,72,153)" opacity={0.05} />
        </div>
        <div className="absolute top-[5px] left-[80px]">
          <Gear size={35} teeth={6} color="rgb(234,179,8)" opacity={0.04} />
        </div>
      </div>
    </div>
  )
}

export function MazePattern({
  className = "",
  opacity = 0.03,
}: {
  className?: string
  opacity?: number
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="10" y="10" width="180" height="180" stroke="rgb(168,85,247)" strokeWidth="2" opacity={opacity} />
      <rect x="30" y="30" width="140" height="140" stroke="rgb(192,38,211)" strokeWidth="1.5" opacity={opacity} />
      <rect x="50" y="50" width="100" height="100" stroke="rgb(168,85,247)" strokeWidth="1.5" opacity={opacity} />
      <rect x="70" y="70" width="60" height="60" stroke="rgb(234,179,8)" strokeWidth="1" opacity={opacity} />
      <line x1="10" y1="100" x2="50" y2="100" stroke="rgb(168,85,247)" strokeWidth="1.5" opacity={opacity} />
      <line x1="150" y1="100" x2="190" y2="100" stroke="rgb(168,85,247)" strokeWidth="1.5" opacity={opacity} />
      <line x1="100" y1="10" x2="100" y2="50" stroke="rgb(192,38,211)" strokeWidth="1.5" opacity={opacity} />
      <line x1="100" y1="150" x2="100" y2="190" stroke="rgb(192,38,211)" strokeWidth="1.5" opacity={opacity} />
      <line x1="30" y1="60" x2="50" y2="60" stroke="rgb(234,179,8)" strokeWidth="1" opacity={opacity * 0.8} />
      <line x1="150" y1="140" x2="170" y2="140" stroke="rgb(234,179,8)" strokeWidth="1" opacity={opacity * 0.8} />
    </svg>
  )
}
