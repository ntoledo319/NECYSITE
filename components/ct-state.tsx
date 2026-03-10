export default function CTState({ className }: { className?: string }) {
  const path =
    "M 24,20 L 376,14 L 380,26 L 380,228 L 356,242 L 320,248 L 280,252 L 240,252 L 200,252 L 160,251 L 120,248 L 84,242 L 52,236 L 28,228 L 16,218 L 12,205 L 12,80 L 18,38 L 24,20 Z"

  return (
    <div className={`relative ${className ?? ""}`}>
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,212,232,0.18) 0%, rgba(232,0,110,0.10) 50%, transparent 75%)",
          filter: "blur(12px)",
        }}
      />

      <svg
        viewBox="0 0 400 270"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full relative z-10"
        aria-label="Connecticut state outline — NECYPAA XXXVI, Dec 31 2026 – Jan 3 2027"
      >
        <defs>
          {/* Rainbow border gradient (cyan → magenta → yellow → cyan) */}
          <linearGradient
            id="ct-border"
            x1="0"
            y1="0"
            x2="400"
            y2="270"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#00ffcc" />
            <stop offset="20%"  stopColor="#00d4e8" />
            <stop offset="45%"  stopColor="#ff44ff" />
            <stop offset="65%"  stopColor="#e8006e" />
            <stop offset="80%"  stopColor="#ffd700" />
            <stop offset="100%" stopColor="#00ffcc" />
          </linearGradient>

          {/* Dark fill — very close to the flyer's interior */}
          <linearGradient
            id="ct-fill"
            x1="0"
            y1="0"
            x2="0"
            y2="270"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#050510" />
            <stop offset="100%" stopColor="#0a0a1e" />
          </linearGradient>

          {/* Neon glow filter */}
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Text glow filter */}
          <filter id="text-glow" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow halo behind the CT shape */}
        <path
          d={path}
          fill="none"
          stroke="rgba(0,212,232,0.35)"
          strokeWidth="14"
          style={{ filter: "blur(10px)" }}
        />
        <path
          d={path}
          fill="none"
          stroke="rgba(232,0,110,0.25)"
          strokeWidth="20"
          style={{ filter: "blur(18px)" }}
        />

        {/* Dark background fill */}
        <path d={path} fill="url(#ct-fill)" />

        {/* Rainbow gradient border */}
        <path
          d={path}
          fill="none"
          stroke="url(#ct-border)"
          strokeWidth="5"
          strokeLinejoin="round"
          filter="url(#neon-glow)"
        />

        {/* ── Interior decorations ──────────────── */}

        {/* Sparkle dots — top-left area */}
        <circle cx="55"  cy="65"  r="2.5" fill="#00ffcc" opacity="0.7" />
        <circle cx="70"  cy="50"  r="1.5" fill="#ff44ff" opacity="0.6" />
        <circle cx="45"  cy="50"  r="1.8" fill="#ffd700" opacity="0.5" />

        {/* Sparkle dots — top-right */}
        <circle cx="340" cy="58"  r="2.2" fill="#00ffcc" opacity="0.6" />
        <circle cx="358" cy="45"  r="1.5" fill="#ff44ff" opacity="0.5" />
        <circle cx="325" cy="44"  r="1.8" fill="#ffd700" opacity="0.4" />

        {/* ✦ sparkles */}
        <text x="52"  y="88"  fontSize="12" fill="#00d4e8" opacity="0.55" textAnchor="middle">✦</text>
        <text x="348" y="82"  fontSize="9"  fill="#e8006e" opacity="0.55" textAnchor="middle">✦</text>
        <text x="200" y="240" fontSize="7"  fill="#fbbf24" opacity="0.45" textAnchor="middle">✦</text>
        <text x="140" y="220" fontSize="6"  fill="#00d4e8" opacity="0.4"  textAnchor="middle">✦</text>
        <text x="270" y="225" fontSize="8"  fill="#ff44ff" opacity="0.4"  textAnchor="middle">✦</text>

        {/* Main "NECYPAA XXXVI" heading */}
        <text
          x="200"
          y="108"
          textAnchor="middle"
          fontFamily="Bangers, cursive"
          fontSize="50"
          letterSpacing="2"
          fill="white"
          filter="url(#text-glow)"
          style={{ paintOrder: "stroke fill" }}
          stroke="rgba(0,0,0,0.9)"
          strokeWidth="3"
        >
          NECYPAA XXXVI
        </text>

        {/* Date line */}
        <text
          x="200"
          y="148"
          textAnchor="middle"
          fontFamily="monospace, 'Courier New', sans-serif"
          fontSize="17"
          letterSpacing="1"
          fill="#00d4e8"
          filter="url(#text-glow)"
        >
          12.31.2026 · 01.03.2027
        </text>

        {/* Venue line */}
        <text
          x="200"
          y="172"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontSize="11"
          letterSpacing="0.5"
          fill="#8896ae"
        >
          Hartford Marriott Downtown
        </text>

        {/* Bottom neon glow line accent */}
        <line
          x1="120" y1="185"
          x2="280" y2="185"
          stroke="url(#ct-border)"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* "Hartford, CT" at the bottom */}
        <text
          x="200"
          y="204"
          textAnchor="middle"
          fontFamily="Bangers, cursive"
          fontSize="20"
          letterSpacing="3"
          fill="#e8006e"
          filter="url(#text-glow)"
        >
          HARTFORD, CT
        </text>
      </svg>
    </div>
  )
}
