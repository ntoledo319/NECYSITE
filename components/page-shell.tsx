import Image from "next/image"
import Link from "next/link"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"

interface PageShellProps {
  badge: string
  title: string
  subtitle?: string
  children?: React.ReactNode
  character?: "mad-hatter" | "cheshire-cat" | "caterpillar"
}

const CHARACTER_DATA = {
  "mad-hatter": {
    portal: "/images/mad-hatter-portal.jpg",
    standalone: "/images/mad-hatter-character.jpg",
    alt: "The Mad Hatter character escaping through ornate portal doors from the Mad Realm, with psychedelic swirl background and steampunk gears",
    standaloneAlt: "The Mad Hatter character in purple coat and orange vest with top hat",
    accent: "var(--nec-purple)",
    accentRgb: "124,58,237",
  },
  "cheshire-cat": {
    portal: "/images/cheshire-cat-portal.jpg",
    standalone: "/images/cheshire-cat-character.jpg",
    alt: "The Cheshire Cat character escaping through ornate portal doors from the Mad Realm, grinning with psychedelic swirl background and steampunk gears",
    standaloneAlt: "The Cheshire Cat character in pink and purple stripes with a wide grin",
    accent: "var(--nec-pink)",
    accentRgb: "192,38,211",
  },
  caterpillar: {
    portal: "/images/caterpillar-portal.jpg",
    standalone: "/images/caterpillar-character.jpg",
    alt: "The Caterpillar character escaping through ornate portal doors from the Mad Realm, wearing a brown coat and fedora with steampunk gears",
    standaloneAlt: "The Caterpillar character in brown coat and fedora hat",
    accent: "var(--nec-gold)",
    accentRgb: "234,179,8",
  },
}

const CHARACTERS = ["mad-hatter", "cheshire-cat", "caterpillar"] as const

function getCharacterForPage(badge: string): "mad-hatter" | "cheshire-cat" | "caterpillar" {
  const hash = badge.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return CHARACTERS[hash % CHARACTERS.length]
}

export default function PageShell({ badge, title, subtitle, children, character }: PageShellProps) {
  const charKey = character || getCharacterForPage(badge)
  const char = CHARACTER_DATA[charKey]

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: "var(--nec-navy)" }}>
      <main className="flex-1 pt-24 pb-20 md:pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page header */}
            <div className="text-center mb-10">
              <span className="section-badge mb-4 inline-block">{badge}</span>
              <h1 className="section-heading mb-3">{title}</h1>
              {subtitle && (
                <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--nec-muted)" }}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Page content */}
            {children || (
              <div className="relative">
                {/* Ambient glow behind the portal */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
                  aria-hidden="true"
                  style={{
                    background: `radial-gradient(ellipse 70% 60% at 50% 45%, rgba(${char.accentRgb},0.20) 0%, rgba(124,58,237,0.08) 40%, transparent 70%)`,
                    filter: "blur(60px)",
                  }}
                />

                <div
                  className="relative nec-card overflow-hidden"
                  style={{
                    boxShadow: `0 8px 48px rgba(0,0,0,0.4), 0 0 80px rgba(${char.accentRgb},0.08)`,
                  }}
                >
                  {/* Top accent bar */}
                  <div
                    className="h-1 w-full"
                    aria-hidden="true"
                    style={{
                      background: "linear-gradient(90deg, rgba(124,58,237,0.6) 0%, rgba(192,38,211,0.5) 50%, rgba(234,179,8,0.5) 100%)",
                    }}
                  />

                  <div className="p-8 md:p-12 text-center">
                    {/* Portal art */}
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto mb-6">
                      <div
                        className="absolute inset-0 scale-[1.3] rounded-full"
                        aria-hidden="true"
                        style={{
                          background: `radial-gradient(circle, rgba(${char.accentRgb},0.25) 0%, transparent 65%)`,
                          filter: "blur(30px)",
                        }}
                      />
                      <Image
                        src={char.portal}
                        alt={char.alt}
                        width={300}
                        height={450}
                        className="relative z-10 w-full h-full object-contain drop-shadow-[0_4px_30px_rgba(124,58,237,0.35)]"
                      />
                    </div>

                    {/* Steampunk gear SVGs */}
                    <div className="absolute top-6 left-6 opacity-[0.06] pointer-events-none" aria-hidden="true">
                      <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="6" className="text-purple-400" />
                        <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="4" className="text-purple-400" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                          <rect
                            key={angle}
                            x="46"
                            y="8"
                            width="8"
                            height="16"
                            rx="2"
                            fill="currentColor"
                            className="text-purple-400"
                            transform={`rotate(${angle} 50 50)`}
                          />
                        ))}
                      </svg>
                    </div>
                    <div className="absolute bottom-8 right-8 opacity-[0.05] pointer-events-none" aria-hidden="true">
                      <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="6" className="text-pink-400" />
                        <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="4" className="text-pink-400" />
                        {[0, 60, 120, 180, 240, 300].map((angle) => (
                          <rect
                            key={angle}
                            x="46"
                            y="8"
                            width="8"
                            height="16"
                            rx="2"
                            fill="currentColor"
                            className="text-pink-400"
                            transform={`rotate(${angle} 50 50)`}
                          />
                        ))}
                      </svg>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-3">
                      Still Escaping the Mad Realm&hellip;
                    </h2>
                    <p className="text-sm max-w-md mx-auto mb-6" style={{ color: "var(--nec-muted)" }}>
                      This page is under construction. We&apos;re building something
                      special for NECYPAA XXXVI — check back soon.
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 font-bold text-sm rounded-xl px-5 py-2.5 transition-all duration-200 uppercase tracking-wide"
                      style={{
                        background: `rgba(${char.accentRgb},0.12)`,
                        border: `1px solid rgba(${char.accentRgb},0.30)`,
                        color: char.accent,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
                      }}
                    >
                      Back to the Portal
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
