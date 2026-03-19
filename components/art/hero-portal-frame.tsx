/**
 * Decorative portal frame SVG for the hero section.
 * Inspired by the ornate steampunk doorway from the character portal art.
 * Renders a large, subtle archway frame behind the hero content.
 * All decorative — aria-hidden, pointer-events-none.
 */

export default function HeroPortalFrame({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 700"
      fill="none"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer arch */}
      <path
        d="M120 680 L120 260 C120 140 200 60 300 60 C400 60 480 140 480 260 L480 680"
        stroke="url(#portalGrad)" strokeWidth="3" fill="none" opacity="0.12"
      />
      {/* Inner arch */}
      <path
        d="M155 680 L155 275 C155 170 215 100 300 100 C385 100 445 170 445 275 L445 680"
        stroke="url(#portalGrad)" strokeWidth="2" fill="none" opacity="0.08"
      />
      {/* Keystone */}
      <path
        d="M275 62 L300 40 L325 62"
        stroke="var(--nec-gold)" strokeWidth="2.5" fill="none" opacity="0.15"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Left door hinge details */}
      <circle cx="130" cy="300" r="6" stroke="var(--nec-gold)" strokeWidth="1.5" opacity="0.1" fill="none" />
      <circle cx="130" cy="300" r="2" fill="var(--nec-gold)" opacity="0.08" />
      <circle cx="130" cy="440" r="6" stroke="var(--nec-gold)" strokeWidth="1.5" opacity="0.1" fill="none" />
      <circle cx="130" cy="440" r="2" fill="var(--nec-gold)" opacity="0.08" />
      {/* Right door hinge details */}
      <circle cx="470" cy="300" r="6" stroke="var(--nec-gold)" strokeWidth="1.5" opacity="0.1" fill="none" />
      <circle cx="470" cy="300" r="2" fill="var(--nec-gold)" opacity="0.08" />
      <circle cx="470" cy="440" r="6" stroke="var(--nec-gold)" strokeWidth="1.5" opacity="0.1" fill="none" />
      <circle cx="470" cy="440" r="2" fill="var(--nec-gold)" opacity="0.08" />

      {/* Left column gears */}
      <g opacity="0.07">
        <circle cx="100" cy="580" r="20" stroke="var(--nec-gold)" strokeWidth="2" />
        <circle cx="100" cy="580" r="10" stroke="var(--nec-gold)" strokeWidth="1.5" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <rect
            key={`lg${a}`}
            x="97" y="555" width="6" height="10" rx="1.5"
            fill="var(--nec-gold)"
            transform={`rotate(${a} 100 580)`}
          />
        ))}
      </g>
      {/* Right column gears */}
      <g opacity="0.06">
        <circle cx="500" cy="560" r="16" stroke="var(--nec-purple)" strokeWidth="2" />
        <circle cx="500" cy="560" r="7" stroke="var(--nec-purple)" strokeWidth="1.5" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <rect
            key={`rg${a}`}
            x="497" y="539" width="6" height="9" rx="1.5"
            fill="var(--nec-purple)"
            transform={`rotate(${a} 500 560)`}
          />
        ))}
      </g>

      {/* Swirl vortex lines in the arch opening — the "looking glass" effect */}
      <g opacity="0.05">
        <ellipse cx="300" cy="350" rx="100" ry="120" stroke="var(--nec-purple)" strokeWidth="1.5" fill="none" />
        <ellipse cx="300" cy="350" rx="70" ry="85" stroke="var(--nec-pink)" strokeWidth="1" fill="none" />
        <ellipse cx="300" cy="350" rx="40" ry="50" stroke="var(--nec-purple)" strokeWidth="1" fill="none" />
      </g>

      {/* Left side decorative key */}
      <g opacity="0.08" transform="translate(70, 500) rotate(-15)">
        <circle cx="12" cy="12" r="8" stroke="var(--nec-gold)" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="3" stroke="var(--nec-gold)" strokeWidth="1" fill="none" />
        <line x1="20" y1="12" x2="45" y2="12" stroke="var(--nec-gold)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="35" y1="12" x2="35" y2="20" stroke="var(--nec-gold)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="42" y1="12" x2="42" y2="18" stroke="var(--nec-gold)" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Right side decorative clock */}
      <g opacity="0.07" transform="translate(480, 490)">
        <circle cx="15" cy="15" r="14" stroke="var(--nec-gold)" strokeWidth="1.5" fill="none" />
        <circle cx="15" cy="15" r="2" fill="var(--nec-gold)" />
        <line x1="15" y1="15" x2="15" y2="5" stroke="var(--nec-gold)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15" y1="15" x2="23" y2="15" stroke="var(--nec-gold)" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Bottom flourish — horizontal ornamental bar */}
      <line x1="140" y1="670" x2="460" y2="670" stroke="url(#portalGrad)" strokeWidth="1" opacity="0.1" />
      <line x1="180" y1="676" x2="420" y2="676" stroke="url(#portalGrad)" strokeWidth="0.5" opacity="0.06" />

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--nec-purple)" />
          <stop offset="50%" stopColor="var(--nec-pink)" />
          <stop offset="100%" stopColor="var(--nec-gold)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
