"use client"

/**
 * Reusable page-level art accents for inner pages.
 * Adds ambient glow blobs, edge graffiti, and steampunk motifs
 * that give every page the Mad Realm "through the looking glass" feel.
 *
 * Props:
 * - character: which character's portal art to feature as a ghost image
 * - accentColor: the dominant accent color (defaults to purple)
 * - variant: "full" (all effects) or "subtle" (just edge accents)
 *
 * All decorative — aria-hidden, pointer-events-none.
 */

import Image from "next/image"
import { Sparkle, Splatter, Drip } from "@/components/art/graffiti-elements"
import { Gear, KeyIcon } from "@/components/art/steampunk-elements"
import { GearCluster } from "@/components/art/steampunk-gears"
import OrnateDivider from "@/components/art/ornate-divider"

type Character = "mad-hatter" | "cheshire-cat" | "caterpillar"

interface PageArtAccentsProps {
  character?: Character
  accentColor?: string
  variant?: "full" | "subtle"
  dividerVariant?: "gear" | "key" | "potion" | "compass"
}

const CHARACTER_IMAGES: Record<Character, string> = {
  "mad-hatter": "/images/mad-hatter-character.png",
  "cheshire-cat": "/images/cheshire-cat-character.png",
  caterpillar: "/images/caterpillar-character.png",
}

const CHARACTER_ACCENT: Record<Character, string> = {
  "mad-hatter": "124,58,237",
  "cheshire-cat": "192,38,211",
  caterpillar: "212,160,23",
}

export default function PageArtAccents({
  character = "mad-hatter",
  accentColor = "var(--nec-purple)",
  variant = "full",
  dividerVariant = "gear",
}: PageArtAccentsProps) {
  const rgb = CHARACTER_ACCENT[character]

  return (
    <>
      {/* ── Ambient glow layer ─────────────────────── */}
      {variant === "full" && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full opacity-[0.06]"
            style={{
              background: "radial-gradient(circle, var(--nec-purple) 0%, transparent 65%)",
              filter: "blur(120px)",
            }}
          />
          <div
            className="absolute top-[40%] -right-20 w-[700px] h-[700px] rounded-full opacity-[0.05]"
            style={{
              background: `radial-gradient(circle, rgba(${rgb},1) 0%, transparent 65%)`,
              filter: "blur(120px)",
            }}
          />
          <div
            className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
            style={{
              background: "radial-gradient(circle, var(--nec-gold) 0%, transparent 65%)",
              filter: "blur(120px)",
            }}
          />
        </div>
      )}

      {/* ── Edge art accents (always shown) ────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden="true">
        {/* Top-left sparkle cluster */}
        <div className="absolute top-20 left-4 md:left-8">
          <Sparkle color="var(--nec-gold)" size={12} opacity={0.18} />
        </div>
        <div className="absolute top-28 left-8 md:left-14">
          <Sparkle color={accentColor} size={8} opacity={0.12} />
        </div>

        {/* Top-right gear */}
        <div className="absolute top-24 right-4 md:right-8 hidden md:block">
          <Gear size={36} opacity={0.05} color="var(--nec-gold)" />
        </div>

        {/* Left edge drips */}
        <div className="absolute top-[35%] left-2 hidden lg:block">
          <Drip color={accentColor} height={40} opacity={0.12} />
        </div>
        <div className="absolute top-[38%] left-5 hidden lg:block">
          <Drip color="var(--nec-pink)" height={28} opacity={0.08} />
        </div>

        {/* Right edge splatter */}
        <div className="absolute top-[50%] right-3 hidden lg:block">
          <Splatter color={accentColor} size={35} opacity={0.06} />
        </div>

        {/* Bottom-right sparkles */}
        <div className="absolute bottom-32 right-6 md:right-12">
          <Sparkle color="var(--nec-cyan)" size={10} opacity={0.15} />
        </div>
        <div className="absolute bottom-40 right-3 md:right-8 hidden md:block">
          <Sparkle color="var(--nec-gold)" size={14} opacity={0.12} />
        </div>

        {/* Bottom-left key/clock */}
        <div className="absolute bottom-28 left-4 hidden lg:block">
          <KeyIcon size={32} opacity={0.06} color="var(--nec-gold)" />
        </div>

        {/* Floating character ghost — deep in the background */}
        <div
          className="absolute bottom-8 right-6 w-20 h-28 opacity-[0.06] hidden md:block"
        >
          <Image
            src={CHARACTER_IMAGES[character]}
            alt=""
            width={80}
            height={112}
            className="w-full h-full object-contain"
            aria-hidden="true"
          />
        </div>

        {/* Gear cluster — left side */}
        <div className="absolute top-[65%] left-2 hidden xl:block">
          <GearCluster className="opacity-50" />
        </div>
      </div>

      {/* ── Bottom ornate divider (before footer) ──── */}
      <div className="container mx-auto px-4 mt-auto relative z-10" aria-hidden="true">
        <OrnateDivider variant={dividerVariant} color={accentColor} />
      </div>
    </>
  )
}
