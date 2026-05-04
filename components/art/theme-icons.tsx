"use client"

/**
 * Themed SVG mini-illustrations for the Mad Realm.
 * Stroke-based, inherit currentColor, no fill dependencies.
 */

export function PocketWatchIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <line x1="12" y1="12" x2="12" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M12 3V2M12 22V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 2.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function CompassRoseIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <polygon points="12,4 13.5,10.5 12,12 10.5,10.5" fill="currentColor" opacity="0.8" />
      <polygon points="12,20 10.5,13.5 12,12 13.5,13.5" fill="currentColor" opacity="0.4" />
      <line x1="12" y1="3" x2="12" y2="5" stroke="currentColor" strokeWidth="1" />
      <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" strokeWidth="1" />
      <line x1="3" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1" />
      <line x1="19" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function VintageTicketIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M3 9V7C3 6.4 3.4 6 4 6H20C20.6 6 21 6.4 21 7V9C19.3 9 18 10.3 18 12C18 13.7 19.3 15 21 15V17C21 17.6 20.6 18 20 18H4C3.4 18 3 17.6 3 17V15C4.7 15 6 13.7 6 12C6 10.3 4.7 9 3 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line x1="9" y1="6" x2="9" y2="18" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  )
}

export function AntiqueKeyIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <line x1="11" y1="11" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="17" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function MasqueradeMaskIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M2 12C2 12 5 8 9 9C13 10 15 8 15 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M22 12C22 12 19 8 15 9C11 10 9 8 9 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M2 12C2 16 5 20 9 18C11 17 13 17 15 18C19 20 22 16 22 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="7.5" cy="13.5" r="1" fill="currentColor" />
      <circle cx="16.5" cy="13.5" r="1" fill="currentColor" />
    </svg>
  )
}

export function InterlockingGearsIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <rect
          key={a}
          x="8.25"
          y="4.5"
          width="1.5"
          height="2"
          rx="0.3"
          fill="currentColor"
          transform={`rotate(${a} 9 9)`}
        />
      ))}
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
      {[30, 90, 150, 210, 270, 330].map((a) => (
        <rect
          key={a}
          x="15.25"
          y="11.5"
          width="1.5"
          height="2"
          rx="0.3"
          fill="currentColor"
          transform={`rotate(${a} 16 16)`}
        />
      ))}
    </svg>
  )
}
