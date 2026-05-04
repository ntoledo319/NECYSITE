/** Single floating hexagon */
export function Hex({
  color = "#00d4e8",
  size = 40,
  className = "",
  opacity = 0.5,
}: {
  color?: string
  size?: number
  className?: string
  opacity?: number
}) {
  const h = size
  const w = size * 0.866
  return (
    <svg width={w} height={h} viewBox="0 0 87 100" fill="none" className={className} aria-hidden="true">
      <polygon points="43.5,0 87,25 87,75 43.5,100 0,75 0,25" fill={color} opacity={opacity} />
      <polygon points="43.5,0 87,25 87,40 43.5,15" fill="white" opacity="0.12" />
    </svg>
  )
}

/** Paint splatter blob */
export function Splatter({
  color = "#00d4e8",
  size = 60,
  className = "",
  opacity = 0.5,
}: {
  color?: string
  size?: number
  className?: string
  opacity?: number
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <path
        d="M50 10 C65 5, 85 15, 88 35 C92 50, 80 60, 85 75 C88 88, 70 95, 55 90 C40 86, 35 92, 20 85 C8 78, 5 60, 12 45 C18 32, 10 20, 25 12 C35 6, 42 14, 50 10Z"
        fill={color}
        opacity={opacity}
      />
      {/* Satellite dots */}
      <circle cx="92" cy="20" r="4" fill={color} opacity={opacity * 0.7} />
      <circle cx="8" cy="80" r="3" fill={color} opacity={opacity * 0.6} />
      <circle cx="75" cy="90" r="2.5" fill={color} opacity={opacity * 0.5} />
    </svg>
  )
}

/** Paint drip – vertical teardrop */
export function Drip({
  color = "#e8006e",
  height = 50,
  className = "",
  opacity = 0.6,
}: {
  color?: string
  height?: number
  className?: string
  opacity?: number
}) {
  const w = height * 0.3
  return (
    <svg width={w} height={height} viewBox="0 0 15 50" fill="none" className={className} aria-hidden="true">
      <path
        d="M7.5 0 C7.5 0, 7.5 5, 7.5 5 L9 5 C11 5, 13 8, 13 14 L13 38 C13 44, 11 50, 7.5 50 C4 50, 2 44, 2 38 L2 14 C2 8, 4 5, 6 5 L7.5 5Z"
        fill={color}
        opacity={opacity}
      />
    </svg>
  )
}

/** Sparkle / shine – 4-point star */
export function Sparkle({
  color = "#fbbf24",
  size = 20,
  className = "",
  opacity = 0.8,
}: {
  color?: string
  size?: number
  className?: string
  opacity?: number
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 0 C12 0, 13.5 9, 13.5 9 C13.5 9, 24 12, 24 12 C24 12, 13.5 15, 13.5 15 C13.5 15, 12 24, 12 24 C12 24, 10.5 15, 10.5 15 C10.5 15, 0 12, 0 12 C0 12, 10.5 9, 10.5 9 C10.5 9, 12 0, 12 0Z"
        fill={color}
        opacity={opacity}
      />
    </svg>
  )
}
