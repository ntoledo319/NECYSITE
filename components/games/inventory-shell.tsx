"use client"

import { useState } from "react"
import Image from "next/image"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import { GearCluster } from "@/components/art/steampunk-gears"

interface InventoryShellProps {
  badge: string
  title: string
  subtitle?: string
  character: "mad-hatter" | "cheshire-cat" | "caterpillar"
  gameName: string
  gameDescription: string
  children: React.ReactNode
}

const CHARACTER_DATA = {
  "mad-hatter": {
    portal: "/images/mad-hatter-portal.jpg",
    alt: "The Mad Hatter character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-purple)",
    accentRgb: "124,58,237",
  },
  "cheshire-cat": {
    portal: "/images/cheshire-cat-portal.jpg",
    alt: "The Cheshire Cat character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-pink)",
    accentRgb: "192,38,211",
  },
  caterpillar: {
    portal: "/images/caterpillar-portal.jpg",
    alt: "The Caterpillar character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-gold)",
    accentRgb: "234,179,8",
  },
}

export default function InventoryShell({
  badge,
  title,
  subtitle,
  character,
  gameName,
  gameDescription,
  children,
}: InventoryShellProps) {
  const [showGame, setShowGame] = useState(false)
  const char = CHARACTER_DATA[character]

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <main className="flex-1 pt-24 pb-20 md:pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page header */}
            <div className="text-center mb-10">
              <span className="section-badge mb-4 inline-block">{badge}</span>
              <h1 className="section-heading mb-3">{title}</h1>
              {subtitle && (
                <p
                  className="text-lg max-w-2xl mx-auto"
                  style={{ color: "var(--nec-muted)" }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Main card */}
            <div className="relative">
              {/* Ambient glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(ellipse 70% 60% at 50% 45%, rgba(${char.accentRgb},0.18) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)`,
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
                    background:
                      "linear-gradient(90deg, rgba(124,58,237,0.6) 0%, rgba(192,38,211,0.5) 50%, rgba(234,179,8,0.5) 100%)",
                  }}
                />

                <div className="p-6 md:p-10 text-center relative">
                  {/* Gear accents */}
                  <GearCluster className="absolute top-4 left-4 opacity-50" />
                  <GearCluster className="absolute bottom-4 right-4 opacity-40" />

                  {!showGame ? (
                    <>
                      {/* Portal art */}
                      <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto mb-6">
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

                      {/* AA triangle icon */}
                      <div className="mx-auto mb-4 w-12 h-12" aria-hidden="true">
                        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke={char.accent}
                            strokeWidth="2"
                            opacity="0.3"
                          />
                          <polygon
                            points="50,15 85,75 15,75"
                            stroke={char.accent}
                            strokeWidth="2.5"
                            fill="none"
                            opacity="0.5"
                          />
                          <text
                            x="50"
                            y="58"
                            textAnchor="middle"
                            fill="white"
                            fontSize="14"
                            fontWeight="bold"
                            opacity="0.4"
                          >
                            AA
                          </text>
                        </svg>
                      </div>

                      <h2 className="text-xl font-bold text-white mb-2">
                        Page content is on the way&hellip;
                      </h2>
                      <p
                        className="text-sm max-w-md mx-auto mb-8"
                        style={{ color: "var(--nec-muted)" }}
                      >
                        This page is under construction. In the meantime, why not
                        take a fourth step?
                      </p>

                      {/* INVENTORY IN PROGRESS button */}
                      <button
                        type="button"
                        onClick={() => setShowGame(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            setShowGame(true)
                          }
                        }}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4"
                        style={{
                          background: `linear-gradient(135deg, rgba(${char.accentRgb},0.2) 0%, rgba(15,10,30,0.9) 50%, rgba(${char.accentRgb},0.15) 100%)`,
                          border: `2px solid rgba(${char.accentRgb},0.4)`,
                          boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 40px rgba(${char.accentRgb},0.1)`,
                          color: "white",
                          outlineColor: char.accent,
                        }}
                        aria-expanded={showGame}
                        aria-label={`Inventory in Progress. Click to play ${gameName}. ${gameDescription}`}
                      >
                        {/* Pulsing dot */}
                        <span className="relative flex h-3 w-3" aria-hidden="true">
                          <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{ backgroundColor: char.accent }}
                          />
                          <span
                            className="relative inline-flex rounded-full h-3 w-3"
                            style={{ backgroundColor: char.accent }}
                          />
                        </span>
                        Inventory in Progress
                        {/* Subtle arrow hint */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          className="opacity-50 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      <p
                        className="text-xs mt-4 italic"
                        style={{ color: "var(--nec-muted)" }}
                      >
                        &ldquo;Made a searching and fearless moral inventory&hellip;&rdquo; — Step 4
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Game header */}
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-white mb-1">
                          {gameName}
                        </h2>
                        <p
                          className="text-xs"
                          style={{ color: "var(--nec-muted)" }}
                        >
                          {gameDescription}
                        </p>
                      </div>

                      {/* Game component */}
                      <div aria-live="polite">
                        {children}
                      </div>

                      {/* Back button */}
                      <button
                        type="button"
                        onClick={() => setShowGame(false)}
                        className="mt-6 text-sm font-medium underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                        style={{
                          color: "var(--nec-muted)",
                          outlineColor: char.accent,
                        }}
                      >
                        ← Back to page
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
