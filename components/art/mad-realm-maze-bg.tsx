/**
 * Subtle SVG maze pattern overlay for the Mad Realm background.
 * Renders a fixed, low-opacity geometric maze inspired by the
 * isometric maze floors in the portal art (IMG_7428).
 * Pure decorative — aria-hidden, pointer-events-none.
 */
export default function MadRealmMazeBg() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ contain: "strict", contentVisibility: "auto" }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="mad-realm-maze"
            x="0" y="0"
            width="120" height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Outer maze ring */}
            <rect x="4" y="4" width="112" height="112" rx="2"
              stroke="rgb(124,58,237)" strokeWidth="0.6" fill="none" opacity="0.04" />
            {/* Inner rings */}
            <rect x="18" y="18" width="84" height="84" rx="2"
              stroke="rgb(192,38,211)" strokeWidth="0.5" fill="none" opacity="0.03" />
            <rect x="32" y="32" width="56" height="56" rx="2"
              stroke="rgb(124,58,237)" strokeWidth="0.5" fill="none" opacity="0.025" />
            <rect x="46" y="46" width="28" height="28" rx="1"
              stroke="rgb(212,160,23)" strokeWidth="0.4" fill="none" opacity="0.03" />
            {/* Maze openings — horizontal */}
            <line x1="4" y1="60" x2="18" y2="60"
              stroke="rgb(124,58,237)" strokeWidth="0.5" opacity="0.035" />
            <line x1="102" y1="60" x2="116" y2="60"
              stroke="rgb(124,58,237)" strokeWidth="0.5" opacity="0.035" />
            {/* Maze openings — vertical */}
            <line x1="60" y1="4" x2="60" y2="18"
              stroke="rgb(192,38,211)" strokeWidth="0.5" opacity="0.03" />
            <line x1="60" y1="102" x2="60" y2="116"
              stroke="rgb(192,38,211)" strokeWidth="0.5" opacity="0.03" />
            {/* Corner accents — tiny gear-like dots */}
            <circle cx="4" cy="4" r="1.5" fill="rgb(212,160,23)" opacity="0.04" />
            <circle cx="116" cy="4" r="1.5" fill="rgb(212,160,23)" opacity="0.04" />
            <circle cx="4" cy="116" r="1.5" fill="rgb(212,160,23)" opacity="0.04" />
            <circle cx="116" cy="116" r="1.5" fill="rgb(212,160,23)" opacity="0.04" />
            {/* Center triangle (AA-inspired, subtle) */}
            <polygon
              points="60,42 72,66 48,66"
              stroke="rgb(212,160,23)" strokeWidth="0.4" fill="none" opacity="0.025"
            />
            {/* Diagonal path hints */}
            <line x1="18" y1="32" x2="32" y2="18"
              stroke="rgb(124,58,237)" strokeWidth="0.3" opacity="0.02" />
            <line x1="88" y1="102" x2="102" y2="88"
              stroke="rgb(124,58,237)" strokeWidth="0.3" opacity="0.02" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mad-realm-maze)" />
      </svg>
    </div>
  )
}
