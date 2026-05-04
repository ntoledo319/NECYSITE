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
  "mad-hatter": "/images/mad-hatter-character.webp",
  "cheshire-cat": "/images/cheshire-cat-character.webp",
  caterpillar: "/images/caterpillar-character.webp",
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
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute -left-40 -top-40 h-[900px] w-[900px] rounded-full opacity-[0.06]"
            style={{
              background: "radial-gradient(circle, var(--nec-purple) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute -right-20 top-[40%] h-[700px] w-[700px] rounded-full opacity-[0.05]"
            style={{
              background: `radial-gradient(circle, rgba(${rgb},1) 0%, transparent 65%)`,
            }}
          />
          <div
            className="absolute bottom-[10%] left-[20%] h-[600px] w-[600px] rounded-full opacity-[0.04]"
            style={{
              background: "radial-gradient(circle, var(--nec-gold) 0%, transparent 65%)",
            }}
          />
        </div>
      )}

      {/* ── Edge art accents (always shown) ────────── */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
        {/* Top-left sparkle cluster */}
        <div className="absolute left-4 top-20 md:left-8">
          <Sparkle color="var(--nec-gold)" size={12} opacity={0.18} />
        </div>
        <div className="absolute left-8 top-28 md:left-14">
          <Sparkle color={accentColor} size={8} opacity={0.12} />
        </div>

        {/* Top-right gear */}
        <div className="absolute right-4 top-24 hidden md:right-8 md:block">
          <Gear size={36} opacity={0.05} color="var(--nec-gold)" />
        </div>

        {/* Left edge drips */}
        <div className="absolute left-2 top-[35%] hidden lg:block">
          <Drip color={accentColor} height={40} opacity={0.12} />
        </div>
        <div className="absolute left-5 top-[38%] hidden lg:block">
          <Drip color="var(--nec-pink)" height={28} opacity={0.08} />
        </div>

        {/* Right edge splatter */}
        <div className="absolute right-3 top-[50%] hidden lg:block">
          <Splatter color={accentColor} size={35} opacity={0.06} />
        </div>

        {/* Bottom-right sparkles */}
        <div className="absolute bottom-32 right-6 md:right-12">
          <Sparkle color="var(--nec-cyan)" size={10} opacity={0.15} />
        </div>
        <div className="absolute bottom-40 right-3 hidden md:right-8 md:block">
          <Sparkle color="var(--nec-gold)" size={14} opacity={0.12} />
        </div>

        {/* Bottom-left key/clock */}
        <div className="absolute bottom-28 left-4 hidden lg:block">
          <KeyIcon size={32} opacity={0.06} color="var(--nec-gold)" />
        </div>

        {/* Floating character ghost — deep in the background */}
        <div className="absolute bottom-8 right-6 hidden h-28 w-20 opacity-[0.06] md:block">
          <Image
            src={CHARACTER_IMAGES[character]}
            alt=""
            width={80}
            height={112}
            sizes="80px"
            className="h-full w-full object-contain"
            aria-hidden="true"
          />
        </div>

        {/* Gear cluster — left side */}
        <div className="absolute left-2 top-[65%] hidden xl:block">
          <GearCluster className="opacity-50" />
        </div>
      </div>

      {/* ── Bottom ornate divider (before footer) ──── */}
      <div className="container relative z-10 mx-auto mt-auto px-4" aria-hidden="true">
        <OrnateDivider variant={dividerVariant} color={accentColor} />
      </div>
    </>
  )
}
