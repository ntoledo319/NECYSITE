"use client"

/**
 * Floating Mad Realm particle system — CSS-only animated SVG motifs.
 * Steampunk-Wonderland icons (gears, keys, potions, clocks, cards, hourglasses)
 * drift lazily across the viewport as a decorative background layer.
 *
 * All particles are aria-hidden, pointer-events-none, and respect
 * .a11y-reduce-motion (animations freeze via globals.css).
 */

function GearParticle({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="3" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="46" y="10" width="8" height="14" rx="2"
          fill="currentColor"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
    </svg>
  )
}

function KeyParticle({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <circle cx="30" cy="35" r="16" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="30" cy="35" r="7" stroke="currentColor" strokeWidth="2.5" />
      <line x1="46" y1="35" x2="88" y2="35" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="72" y1="35" x2="72" y2="50" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="82" y1="35" x2="82" y2="47" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

function PotionParticle({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 100" fill="none" className={className}>
      <rect x="28" y="5" width="24" height="12" rx="3" stroke="currentColor" strokeWidth="3" />
      <path
        d="M28 17 L20 45 C16 55 16 65 22 75 C28 85 52 85 58 75 C64 65 64 55 60 45 L52 17"
        stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round"
      />
      <ellipse cx="40" cy="70" rx="14" ry="8" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  )
}

function ClockParticle({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <circle cx="50" cy="55" r="35" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="55" r="3" fill="currentColor" />
      <line x1="50" y1="55" x2="50" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="55" x2="67" y2="55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M42 20 L50 10 L58 20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function CardParticle({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 70 100" fill="none" className={className}>
      <rect x="5" y="5" width="60" height="90" rx="6" stroke="currentColor" strokeWidth="3" />
      <text x="15" y="30" fontSize="18" fill="currentColor" fontFamily="serif">A</text>
      <text x="35" y="65" fontSize="22" fill="currentColor" fontFamily="serif" opacity="0.6">♠</text>
    </svg>
  )
}

function HourglassParticle({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 60 80" fill="none" className={className}>
      <rect x="10" y="4" width="40" height="5" rx="2" stroke="currentColor" strokeWidth="2.5" />
      <rect x="10" y="71" width="40" height="5" rx="2" stroke="currentColor" strokeWidth="2.5" />
      <path d="M15 9 L15 25 C15 35 30 40 30 40 C30 40 45 35 45 25 L45 9" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M15 71 L15 55 C15 45 30 40 30 40 C30 40 45 45 45 55 L45 71" stroke="currentColor" strokeWidth="2.5" fill="none" />
    </svg>
  )
}

function CompassParticle({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      <polygon points="50,15 54,45 50,50 46,45" fill="currentColor" opacity="0.7" />
      <polygon points="50,85 46,55 50,50 54,55" fill="currentColor" opacity="0.4" />
      <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

/* ── Particle definitions with positions ─────────────────────── */
const PARTICLES = [
  { id: "g1", Component: GearParticle, size: 28, left: "5%",  top: "8%",  color: "var(--nec-gold)",   opacity: 0.045, duration: "38s", delay: "0s",   rotate: 25  },
  { id: "k1", Component: KeyParticle,  size: 22, left: "88%", top: "12%", color: "var(--nec-gold)",   opacity: 0.04,  duration: "42s", delay: "-8s",  rotate: -15 },
  { id: "p1", Component: PotionParticle, size: 20, left: "15%", top: "30%", color: "var(--nec-cyan)",  opacity: 0.035, duration: "45s", delay: "-4s",  rotate: 10  },
  { id: "c1", Component: ClockParticle, size: 26, left: "92%", top: "35%", color: "var(--nec-gold)",  opacity: 0.04,  duration: "40s", delay: "-12s", rotate: -20 },
  { id: "d1", Component: CardParticle,  size: 16, left: "78%", top: "55%", color: "var(--nec-pink)",  opacity: 0.035, duration: "50s", delay: "-6s",  rotate: 30  },
  { id: "h1", Component: HourglassParticle, size: 18, left: "8%", top: "60%", color: "var(--nec-purple)", opacity: 0.04, duration: "44s", delay: "-16s", rotate: -12 },
  { id: "g2", Component: GearParticle,  size: 20, left: "70%", top: "75%", color: "var(--nec-purple)", opacity: 0.035, duration: "46s", delay: "-20s", rotate: 45  },
  { id: "m1", Component: CompassParticle, size: 24, left: "40%", top: "85%", color: "var(--nec-gold)", opacity: 0.04,  duration: "48s", delay: "-10s", rotate: 0   },
  { id: "k2", Component: KeyParticle,  size: 18, left: "55%", top: "15%", color: "var(--nec-purple)", opacity: 0.03,  duration: "52s", delay: "-14s", rotate: 20  },
  { id: "p2", Component: PotionParticle, size: 16, left: "95%", top: "70%", color: "var(--nec-pink)", opacity: 0.03,  duration: "43s", delay: "-22s", rotate: -8  },
  { id: "c2", Component: ClockParticle, size: 18, left: "25%", top: "48%", color: "var(--nec-gold)",  opacity: 0.03,  duration: "47s", delay: "-18s", rotate: 15  },
  { id: "g3", Component: GearParticle,  size: 16, left: "50%", top: "42%", color: "var(--nec-gold)",  opacity: 0.025, duration: "55s", delay: "-25s", rotate: -30 },
  { id: "h2", Component: HourglassParticle, size: 14, left: "82%", top: "88%", color: "var(--nec-cyan)", opacity: 0.03, duration: "41s", delay: "-3s", rotate: 8 },
  { id: "d2", Component: CardParticle,  size: 14, left: "3%",  top: "82%", color: "var(--nec-purple)", opacity: 0.03,  duration: "49s", delay: "-7s",  rotate: -25 },
] as const

export default function MadRealmParticles() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden mad-realm-particles"
      aria-hidden="true"
    >
      {PARTICLES.map(({ id, Component, size, left, top, color, opacity, duration, delay, rotate }, index) => (
        <div
          key={id}
          className={`absolute mad-realm-particle${index >= 8 ? " hidden md:block" : ""}`}
          style={{
            left,
            top,
            color,
            opacity,
            transform: `rotate(${rotate}deg)`,
            animation: `madRealmFloat ${duration} ease-in-out ${delay} infinite`,
            willChange: "transform",
          }}
        >
          <Component size={size} />
        </div>
      ))}
    </div>
  )
}
