interface GearProps {
  size?: number
  teeth?: number
  className?: string
  color?: string
  opacity?: number
}

function Gear({
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

