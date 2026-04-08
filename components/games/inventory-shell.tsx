"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import { GearCluster } from "@/components/art/steampunk-gears"
import PageArtAccents from "@/components/art/page-art-accents"

type Character = "mad-hatter" | "cheshire-cat" | "caterpillar"
type InventoryTheme = "faq" | "program" | "merch" | "prayer" | "asl" | "bid"

interface InventoryShellProps {
  badge: string
  title: string
  subtitle?: string
  character: Character
  theme?: InventoryTheme
  gameName: string
  gameDescription: string
  children: React.ReactNode
}

const CHARACTER_DATA = {
  "mad-hatter": {
    portal: "/images/mad-hatter-portal.webp",
    standalone: "/images/mad-hatter-character.png",
    alt: "The Mad Hatter character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-purple)",
    accentRgb: "var(--nec-purple-rgb)",
  },
  "cheshire-cat": {
    portal: "/images/cheshire-cat-portal.webp",
    standalone: "/images/cheshire-cat-character.png",
    alt: "The Cheshire Cat character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-pink)",
    accentRgb: "var(--nec-pink-rgb)",
  },
  caterpillar: {
    portal: "/images/caterpillar-portal.webp",
    standalone: "/images/caterpillar-character.png",
    alt: "The Caterpillar character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-gold)",
    accentRgb: "var(--nec-gold-rgb)",
  },
} as const

const THEME_STYLES: Record<
  InventoryTheme,
  {
    divider: "gear" | "key" | "potion" | "compass"
    panelBorder: string
    panelBackground: string
    accentBar: string
    buttonBackground: string
    buttonBorder: string
    gameFrameBorder: string
    gameFrameBackground: string
    contentLayout: string
    textAlign: string
  }
> = {
  faq: {
    divider: "gear",
    panelBorder: "rgba(var(--nec-pink-rgb),0.14)",
    panelBackground:
      "linear-gradient(145deg, rgba(var(--nec-pink-rgb),0.07) 0%, rgba(var(--nec-card-rgb),0.92) 42%, rgba(var(--nec-card-rgb),0.84) 100%)",
    accentBar:
      "linear-gradient(90deg, rgba(var(--nec-pink-rgb),0.40) 0%, rgba(var(--nec-purple-rgb),0.22) 45%, rgba(var(--nec-gold-rgb),0.28) 100%)",
    buttonBackground:
      "linear-gradient(135deg, rgba(var(--nec-pink-rgb),0.18) 0%, rgba(var(--nec-card-rgb),0.96) 52%, rgba(var(--nec-purple-rgb),0.12) 100%)",
    buttonBorder: "rgba(var(--nec-pink-rgb),0.36)",
    gameFrameBorder: "rgba(var(--nec-pink-rgb),0.18)",
    gameFrameBackground:
      "linear-gradient(145deg, rgba(var(--nec-card-rgb),0.96) 0%, rgba(var(--nec-pink-rgb),0.04) 100%)",
    contentLayout: "lg:grid-cols-[0.94fr_1.06fr]",
    textAlign: "text-left",
  },
  program: {
    divider: "compass",
    panelBorder: "rgba(var(--nec-cyan-rgb),0.16)",
    panelBackground:
      "linear-gradient(145deg, rgba(var(--nec-cyan-rgb),0.08) 0%, rgba(var(--nec-card-rgb),0.93) 40%, rgba(var(--nec-card-rgb),0.84) 100%)",
    accentBar:
      "linear-gradient(90deg, rgba(var(--nec-cyan-rgb),0.42) 0%, rgba(var(--nec-purple-rgb),0.18) 55%, rgba(var(--nec-gold-rgb),0.24) 100%)",
    buttonBackground:
      "linear-gradient(135deg, rgba(var(--nec-cyan-rgb),0.18) 0%, rgba(var(--nec-card-rgb),0.96) 56%, rgba(var(--nec-purple-rgb),0.10) 100%)",
    buttonBorder: "rgba(var(--nec-cyan-rgb),0.36)",
    gameFrameBorder: "rgba(var(--nec-cyan-rgb),0.18)",
    gameFrameBackground:
      "linear-gradient(145deg, rgba(var(--nec-card-rgb),0.96) 0%, rgba(var(--nec-cyan-rgb),0.04) 100%)",
    contentLayout: "lg:grid-cols-[1.02fr_0.98fr]",
    textAlign: "text-left",
  },
  merch: {
    divider: "key",
    panelBorder: "rgba(var(--nec-purple-rgb),0.18)",
    panelBackground:
      "linear-gradient(145deg, rgba(var(--nec-purple-rgb),0.08) 0%, rgba(var(--nec-card-rgb),0.92) 38%, rgba(var(--nec-card-rgb),0.84) 100%)",
    accentBar:
      "linear-gradient(90deg, rgba(var(--nec-purple-rgb),0.44) 0%, rgba(var(--nec-pink-rgb),0.28) 48%, rgba(var(--nec-gold-rgb),0.24) 100%)",
    buttonBackground:
      "linear-gradient(135deg, rgba(var(--nec-purple-rgb),0.18) 0%, rgba(var(--nec-card-rgb),0.96) 50%, rgba(var(--nec-gold-rgb),0.12) 100%)",
    buttonBorder: "rgba(var(--nec-purple-rgb),0.36)",
    gameFrameBorder: "rgba(var(--nec-purple-rgb),0.18)",
    gameFrameBackground:
      "linear-gradient(145deg, rgba(var(--nec-card-rgb),0.96) 0%, rgba(var(--nec-purple-rgb),0.05) 100%)",
    contentLayout: "lg:grid-cols-[0.92fr_1.08fr]",
    textAlign: "text-left",
  },
  prayer: {
    divider: "potion",
    panelBorder: "rgba(var(--nec-gold-rgb),0.18)",
    panelBackground:
      "linear-gradient(145deg, rgba(var(--nec-gold-rgb),0.07) 0%, rgba(var(--nec-card-rgb),0.94) 38%, rgba(var(--nec-card-rgb),0.86) 100%)",
    accentBar:
      "linear-gradient(90deg, rgba(var(--nec-gold-rgb),0.40) 0%, rgba(var(--nec-cyan-rgb),0.18) 52%, rgba(var(--nec-purple-rgb),0.20) 100%)",
    buttonBackground:
      "linear-gradient(135deg, rgba(var(--nec-gold-rgb),0.18) 0%, rgba(var(--nec-card-rgb),0.96) 56%, rgba(var(--nec-cyan-rgb),0.08) 100%)",
    buttonBorder: "rgba(var(--nec-gold-rgb),0.34)",
    gameFrameBorder: "rgba(var(--nec-gold-rgb),0.18)",
    gameFrameBackground:
      "linear-gradient(145deg, rgba(var(--nec-card-rgb),0.96) 0%, rgba(var(--nec-gold-rgb),0.04) 100%)",
    contentLayout: "lg:grid-cols-[0.98fr_1.02fr]",
    textAlign: "text-center lg:text-left",
  },
  asl: {
    divider: "key",
    panelBorder: "rgba(var(--nec-cyan-rgb),0.20)",
    panelBackground:
      "linear-gradient(145deg, rgba(var(--nec-cyan-rgb),0.08) 0%, rgba(var(--nec-card-rgb),0.95) 36%, rgba(var(--nec-card-rgb),0.86) 100%)",
    accentBar:
      "linear-gradient(90deg, rgba(var(--nec-cyan-rgb),0.46) 0%, rgba(var(--nec-pink-rgb),0.16) 60%, rgba(var(--nec-gold-rgb),0.18) 100%)",
    buttonBackground:
      "linear-gradient(135deg, rgba(var(--nec-cyan-rgb),0.18) 0%, rgba(var(--nec-card-rgb),0.97) 58%, rgba(var(--nec-gold-rgb),0.06) 100%)",
    buttonBorder: "rgba(var(--nec-cyan-rgb),0.34)",
    gameFrameBorder: "rgba(var(--nec-cyan-rgb),0.18)",
    gameFrameBackground:
      "linear-gradient(145deg, rgba(var(--nec-card-rgb),0.97) 0%, rgba(var(--nec-cyan-rgb),0.05) 100%)",
    contentLayout: "lg:grid-cols-[1fr_1fr]",
    textAlign: "text-left",
  },
  bid: {
    divider: "compass",
    panelBorder: "rgba(var(--nec-gold-rgb),0.18)",
    panelBackground:
      "linear-gradient(145deg, rgba(var(--nec-gold-rgb),0.06) 0%, rgba(var(--nec-card-rgb),0.95) 42%, rgba(var(--nec-card-rgb),0.84) 100%)",
    accentBar:
      "linear-gradient(90deg, rgba(var(--nec-gold-rgb),0.42) 0%, rgba(var(--nec-purple-rgb),0.18) 52%, rgba(var(--nec-cyan-rgb),0.18) 100%)",
    buttonBackground:
      "linear-gradient(135deg, rgba(var(--nec-gold-rgb),0.18) 0%, rgba(var(--nec-card-rgb),0.96) 56%, rgba(var(--nec-purple-rgb),0.08) 100%)",
    buttonBorder: "rgba(var(--nec-gold-rgb),0.34)",
    gameFrameBorder: "rgba(var(--nec-gold-rgb),0.18)",
    gameFrameBackground:
      "linear-gradient(145deg, rgba(var(--nec-card-rgb),0.96) 0%, rgba(var(--nec-gold-rgb),0.04) 100%)",
    contentLayout: "lg:grid-cols-[0.96fr_1.04fr]",
    textAlign: "text-left",
  },
}

const RELATED_LINKS: Record<InventoryTheme, Array<{ href: string; label: string }>> = {
  faq: [
    { href: "/register", label: "Register" },
    { href: "/events", label: "Events" },
    { href: "/accessibility", label: "Accessibility" },
    { href: "/service", label: "Service Opportunities" },
  ],
  program: [
    { href: "/events", label: "Events" },
    { href: "/breakfast", label: "Breakfast" },
    { href: "/register", label: "Register" },
    { href: "/faq", label: "FAQ" },
  ],
  merch: [
    { href: "/register", label: "Register" },
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
  ],
  prayer: [
    { href: "/journey", label: "Our Journey" },
    { href: "/alanon", label: "Al-Anon / Alateen" },
    { href: "/accessibility", label: "Accessibility" },
    { href: "/service", label: "Service Opportunities" },
  ],
  asl: [
    { href: "/accessibility", label: "Accessibility" },
    { href: "/register", label: "Register" },
    { href: "/alanon", label: "Al-Anon / Alateen" },
    { href: "/states", label: "Find Your State" },
  ],
  bid: [
    { href: "/service", label: "Service Opportunities" },
    { href: "/#business-meeting", label: "Business Meeting" },
    { href: "/states", label: "Find Your State" },
    { href: "/journey", label: "Our Journey" },
  ],
}

function ThemeHeroArt({
  theme,
  char,
}: {
  theme: InventoryTheme
  char: (typeof CHARACTER_DATA)[Character]
}) {
  if (theme === "program") {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-cyan-rgb),0.08),rgba(var(--nec-card-rgb),0.92))] p-5 shadow-[0_20px_48px_rgba(44,24,16,0.08)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(45,107,94,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(45,107,94,0.08) 1px, transparent 1px)",
            backgroundSize: "100% 4.75rem, 4.75rem 100%",
          }}
        />
        <div className="relative grid gap-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_14rem]">
            <div className="space-y-3">
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  className="rounded-[1rem] border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.84)] px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-[rgba(var(--nec-cyan-rgb),0.26)]" />
                    <div className="h-2 w-24 rounded-full bg-[rgba(var(--nec-cyan-rgb),0.18)]" />
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-[rgba(var(--nec-cyan-rgb),0.12)]" />
                </div>
              ))}
            </div>
            <div className="relative min-h-[17rem] overflow-hidden rounded-[1.4rem] border border-[rgba(var(--nec-cyan-rgb),0.18)] bg-[rgba(var(--nec-card-rgb),0.88)] p-2">
            <Image
              src={char.portal}
              alt=""
              width={600}
              height={900}
              sizes="(min-width: 640px) 224px, 100vw"
              className="h-full w-full rounded-[1rem] object-cover"
              aria-hidden="true"
            />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (theme === "merch") {
    return (
      <div className="relative min-h-[21rem] overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.18)] bg-[linear-gradient(145deg,rgba(var(--nec-purple-rgb),0.08),rgba(var(--nec-card-rgb),0.92))] p-5 shadow-[0_20px_48px_rgba(44,24,16,0.08)]">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute left-5 top-5 h-20 w-16 rounded-[1rem] border border-dashed border-[rgba(var(--nec-purple-rgb),0.18)] bg-[rgba(var(--nec-card-rgb),0.72)] rotate-[-8deg]" />
          <div className="absolute right-8 top-8 h-24 w-20 rounded-[1rem] border border-dashed border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-card-rgb),0.70)] rotate-[7deg]" />
          <div className="absolute bottom-5 left-10 h-16 w-24 rounded-[1rem] border border-dashed border-[rgba(var(--nec-pink-rgb),0.18)] bg-[rgba(var(--nec-card-rgb),0.70)] rotate-[5deg]" />
        </div>
        <div className="relative grid h-full gap-4 sm:grid-cols-[1.1fr_0.9fr] sm:items-end">
          <div className="relative overflow-hidden rounded-[1.6rem] border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.88)] p-2 shadow-[0_18px_32px_rgba(44,24,16,0.10)] rotate-[-3deg] sm:ml-5">
            <div className="pointer-events-none absolute inset-x-4 top-4 h-6 border-b border-dashed border-[rgba(var(--nec-purple-rgb),0.16)]" aria-hidden="true" />
            <Image
              src={char.portal}
              alt=""
              width={600}
              height={900}
              sizes="(min-width: 640px) 360px, 100vw"
              className="h-full w-full rounded-[1.15rem] object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="relative hidden sm:block">
            <Image
              src={char.standalone}
              alt=""
              width={220}
              height={300}
              sizes="220px"
              className="ml-auto h-56 w-auto object-contain opacity-90"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    )
  }

  if (theme === "prayer") {
    return (
      <div className="relative flex min-h-[21rem] items-center justify-center overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.07),rgba(var(--nec-card-rgb),0.92))] p-5 shadow-[0_20px_48px_rgba(44,24,16,0.08)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--nec-gold-rgb),0.18)]" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--nec-gold-rgb),0.12)]" />
          <div className="absolute left-1/2 top-1/2 h-84 w-84 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--nec-gold-rgb),0.08)]" />
        </div>
        <div className="relative flex flex-col items-center gap-5">
          <div className="relative overflow-hidden rounded-[999px] border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-card-rgb),0.84)] p-3">
            <Image
              src={char.portal}
              alt=""
              width={540}
              height={540}
              sizes="220px"
              className="h-52 w-52 rounded-[999px] object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="flex gap-3" aria-hidden="true">
            <div className="h-2.5 w-2.5 rounded-full bg-[rgba(var(--nec-gold-rgb),0.28)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[rgba(var(--nec-cyan-rgb),0.22)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[rgba(var(--nec-purple-rgb),0.18)]" />
          </div>
        </div>
      </div>
    )
  }

  if (theme === "asl") {
    return (
      <div className="relative overflow-hidden rounded-[1.5rem] border border-[rgba(var(--nec-cyan-rgb),0.18)] bg-[linear-gradient(145deg,rgba(var(--nec-cyan-rgb),0.09),rgba(var(--nec-card-rgb),0.94))] p-4 shadow-[0_20px_48px_rgba(44,24,16,0.08)]">
        <div className="grid gap-4 sm:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[17rem] overflow-hidden rounded-[1rem] border border-[rgba(var(--nec-cyan-rgb),0.18)] bg-[rgba(var(--nec-card-rgb),0.88)] p-2">
            <div className="pointer-events-none absolute inset-y-0 left-4 w-px bg-[rgba(var(--nec-cyan-rgb),0.14)]" aria-hidden="true" />
            <Image
              src={char.portal}
              alt=""
              width={600}
              height={900}
              sizes="(min-width: 640px) 380px, 100vw"
              className="h-full w-full rounded-[0.75rem] object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="grid gap-3">
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className="rounded-[0.95rem] border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.88)] px-4 py-4"
              >
                <div className="h-2 w-20 rounded-full bg-[rgba(var(--nec-cyan-rgb),0.22)]" />
                <div className="mt-3 h-2 w-full rounded-full bg-[rgba(var(--nec-cyan-rgb),0.12)]" />
                <div className="mt-2 h-2 w-3/4 rounded-full bg-[rgba(var(--nec-cyan-rgb),0.12)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (theme === "bid") {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.06),rgba(var(--nec-card-rgb),0.94))] p-5 shadow-[0_20px_48px_rgba(44,24,16,0.08)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(122,91,13,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(122,91,13,0.08) 1px, transparent 1px)",
            backgroundSize: "1.5rem 1.5rem",
          }}
        />
        <div className="relative grid gap-4 sm:grid-cols-[1fr_0.96fr]">
          <div className="relative min-h-[17rem] overflow-hidden rounded-[1.1rem] border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-card-rgb),0.88)] p-2">
            <div className="pointer-events-none absolute inset-3 border border-[rgba(var(--nec-gold-rgb),0.14)]" aria-hidden="true" />
            <Image
              src={char.portal}
              alt=""
              width={600}
              height={900}
              sizes="(min-width: 640px) 340px, 100vw"
              className="h-full w-full rounded-[0.8rem] object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="flex items-center justify-center rounded-[1.1rem] border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-card-rgb),0.82)] p-4">
            <div className="relative h-44 w-full max-w-[14rem]">
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-[58%] rotate-45 border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-gold-rgb),0.06)]" />
              <div className="absolute inset-x-5 top-7 h-px bg-[rgba(var(--nec-gold-rgb),0.16)]" />
              <div className="absolute inset-x-5 bottom-7 h-px bg-[rgba(var(--nec-gold-rgb),0.16)]" />
              <div className="absolute inset-y-7 left-5 w-px bg-[rgba(var(--nec-gold-rgb),0.16)]" />
              <div className="absolute inset-y-7 right-5 w-px bg-[rgba(var(--nec-gold-rgb),0.16)]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-pink-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-pink-rgb),0.08),rgba(var(--nec-card-rgb),0.92))] p-5 shadow-[0_20px_48px_rgba(44,24,16,0.08)]">
      <div className="grid gap-4 sm:grid-cols-[1fr_0.94fr]">
        <div className="relative min-h-[17rem] rounded-[1.25rem] border border-[rgba(var(--nec-pink-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.88)] p-2 rotate-[-2deg]">
          <div className="pointer-events-none absolute left-4 top-4 h-4 w-4 rounded-full bg-[rgba(var(--nec-pink-rgb),0.18)]" aria-hidden="true" />
          <div className="pointer-events-none absolute right-4 top-4 h-4 w-4 rounded-full bg-[rgba(var(--nec-gold-rgb),0.18)]" aria-hidden="true" />
          <Image
            src={char.portal}
            alt=""
            width={600}
            height={900}
            sizes="(min-width: 640px) 360px, 100vw"
            className="h-full w-full rounded-[0.95rem] object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="grid gap-3 sm:pt-6">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className={`rounded-[1rem] border border-[rgba(var(--nec-pink-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.88)] px-4 py-4 ${
                row === 1 ? "translate-x-4" : row === 2 ? "-translate-x-2" : ""
              }`}
            >
              <div className="h-2 w-16 rounded-full bg-[rgba(var(--nec-pink-rgb),0.22)]" />
              <div className="mt-3 h-2 w-full rounded-full bg-[rgba(var(--nec-pink-rgb),0.12)]" />
              <div className="mt-2 h-2 w-4/5 rounded-full bg-[rgba(var(--nec-gold-rgb),0.10)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ThemeMotif({
  theme,
  char,
}: {
  theme: InventoryTheme
  char: (typeof CHARACTER_DATA)[Character]
}) {
  if (theme === "prayer") {
    return (
      <div className="relative flex min-h-[19rem] items-center justify-center overflow-hidden rounded-[1.75rem] border border-[rgba(var(--nec-gold-rgb),0.14)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.06),rgba(var(--nec-card-rgb),0.86))] p-5">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--nec-gold-rgb),0.16)]" />
          <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--nec-gold-rgb),0.10)]" />
        </div>
        <Image
          src={char.standalone}
          alt=""
          width={220}
          height={300}
          sizes="220px"
          className="relative h-52 w-auto object-contain opacity-90"
          aria-hidden="true"
        />
      </div>
    )
  }

  if (theme === "asl") {
    return (
      <div className="relative min-h-[19rem] overflow-hidden rounded-[1.1rem] border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.86)] p-4">
        <div className="pointer-events-none absolute inset-y-4 left-4 w-px bg-[rgba(var(--nec-cyan-rgb),0.14)]" aria-hidden="true" />
        <div className="relative grid h-full gap-3">
          <div className="rounded-[0.95rem] border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[rgba(var(--nec-cyan-rgb),0.06)] p-2">
            <Image
              src={char.portal}
              alt=""
              width={600}
              height={900}
              sizes="(min-width: 1024px) 28vw, 100vw"
              className="h-44 w-full rounded-[0.7rem] object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="rounded-[0.95rem] border border-[rgba(var(--nec-cyan-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.88)] px-3 py-3"
              >
                <div className="h-2 w-12 rounded-full bg-[rgba(var(--nec-cyan-rgb),0.20)]" />
                <div className="mt-2 h-2 w-full rounded-full bg-[rgba(var(--nec-cyan-rgb),0.10)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (theme === "bid") {
    return (
      <div className="relative min-h-[19rem] overflow-hidden rounded-[1.5rem] border border-[rgba(var(--nec-gold-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.84)] p-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(122,91,13,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(122,91,13,0.08) 1px, transparent 1px)",
            backgroundSize: "1.25rem 1.25rem",
          }}
        />
        <div className="relative flex h-full items-center justify-center rounded-[1.1rem] border border-[rgba(var(--nec-gold-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.88)]">
          <Image
            src={char.standalone}
            alt=""
            width={220}
            height={300}
            sizes="220px"
            className="h-52 w-auto object-contain opacity-85"
            aria-hidden="true"
          />
        </div>
      </div>
    )
  }

  if (theme === "merch") {
    return (
      <div className="relative min-h-[19rem] overflow-hidden rounded-[1.6rem] border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.84)] p-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-4 top-4 h-12 w-12 rounded-[1rem] border border-dashed border-[rgba(var(--nec-purple-rgb),0.16)]" />
          <div className="absolute right-5 bottom-5 h-10 w-20 rounded-[0.95rem] border border-dashed border-[rgba(var(--nec-gold-rgb),0.16)]" />
        </div>
        <div className="relative grid h-full items-end gap-3 sm:grid-cols-[1fr_0.78fr]">
          <div className="overflow-hidden rounded-[1.1rem] border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.90)] p-2">
            <Image
              src={char.portal}
              alt={char.alt}
              width={600}
              height={900}
              sizes="(min-width: 1024px) 28vw, 100vw"
              className="h-44 w-full rounded-[0.8rem] object-cover"
            />
          </div>
          <Image
            src={char.standalone}
            alt=""
            width={180}
            height={240}
            sizes="180px"
            className="ml-auto h-40 w-auto object-contain opacity-88"
            aria-hidden="true"
          />
        </div>
      </div>
    )
  }

  if (theme === "program") {
    return (
      <div className="relative min-h-[19rem] overflow-hidden rounded-[1.6rem] border border-[rgba(var(--nec-cyan-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.86)] p-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(45,107,94,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(45,107,94,0.08) 1px, transparent 1px)",
            backgroundSize: "100% 3.8rem, 3.8rem 100%",
          }}
        />
        <div className="relative space-y-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-[1rem] border border-[rgba(var(--nec-cyan-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.90)] px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full border border-[rgba(var(--nec-cyan-rgb),0.18)] bg-[rgba(var(--nec-cyan-rgb),0.08)]" />
                <div className="flex-1">
                  <div className="h-2 w-24 rounded-full bg-[rgba(var(--nec-cyan-rgb),0.18)]" />
                  <div className="mt-2 h-2 w-full rounded-full bg-[rgba(var(--nec-cyan-rgb),0.10)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-[19rem] overflow-hidden rounded-[1.6rem] border border-[rgba(var(--nec-pink-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.86)] p-4">
      <div className="relative grid gap-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className={`rounded-[1rem] border border-[rgba(var(--nec-pink-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.90)] px-4 py-4 ${
              item === 1 ? "translate-x-4" : item === 2 ? "-translate-x-2" : ""
            }`}
          >
            <div className="h-2 w-16 rounded-full bg-[rgba(var(--nec-pink-rgb),0.20)]" />
            <div className="mt-2 h-2 w-full rounded-full bg-[rgba(var(--nec-pink-rgb),0.10)]" />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4" aria-hidden="true">
        <Image
          src={char.standalone}
          alt=""
          width={140}
          height={180}
          sizes="140px"
          className="h-32 w-auto object-contain opacity-12"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export default function InventoryShell({
  badge,
  title,
  subtitle,
  character,
  theme = "faq",
  gameName,
  gameDescription,
  children,
}: InventoryShellProps) {
  const [showGame, setShowGame] = useState(false)
  const char = CHARACTER_DATA[character]
  const themeStyle = THEME_STYLES[theme]
  const relatedLinks = RELATED_LINKS[theme]

  return (
    <div
      className="min-h-screen min-h-screen-safe flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents
        character={character}
        accentColor={char.accent}
        variant="subtle"
        dividerVariant={themeStyle.divider}
      />

      <div className="page-frame" role="region" aria-label="Page content">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className={`grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center ${theme === "prayer" ? "lg:min-h-[22rem]" : ""}`}>
              <div className={themeStyle.textAlign}>
                <span className="section-badge mb-4 inline-block">{badge}</span>
                <h1 className="section-heading mb-3">{title}</h1>
                {subtitle && (
                  <p
                    className={`text-lg max-w-2xl ${theme === "prayer" ? "mx-auto lg:mx-0" : ""}`}
                    style={{ color: "var(--nec-muted)" }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              <ThemeHeroArt theme={theme} char={char} />
            </div>

            <div className="relative mt-8 md:mt-10">
              <div
                className="absolute inset-x-[10%] top-6 h-56 pointer-events-none"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(ellipse 60% 65% at 50% 50%, rgba(${char.accentRgb},0.14) 0%, transparent 72%)`,
                  filter: "blur(44px)",
                }}
              />

              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius:
                    theme === "asl"
                      ? "1.5rem"
                      : theme === "merch"
                        ? "2rem"
                        : theme === "bid"
                          ? "1.75rem"
                          : "1.9rem",
                  border: `1px solid ${themeStyle.panelBorder}`,
                  background: themeStyle.panelBackground,
                  boxShadow: "var(--shadow-card-hover)",
                }}
              >
                <div
                  className="h-1 w-full"
                  aria-hidden="true"
                  style={{ background: themeStyle.accentBar }}
                />

                <div className="relative p-6 md:p-8">
                  <GearCluster className="absolute left-4 top-4 opacity-45" />
                  <GearCluster className="absolute bottom-4 right-4 opacity-35" />

                  {!showGame ? (
                    <div className={`grid gap-6 lg:items-center ${themeStyle.contentLayout}`}>
                      <div className="relative z-10">
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

                        <h2 className="text-xl font-bold text-[var(--nec-text)] mb-2">
                          The committee is working on this&hellip;
                        </h2>
                        <p
                          className="text-sm max-w-md mb-8"
                          style={{ color: "var(--nec-muted)" }}
                        >
                          This page is being put together by the host committee.
                          In the meantime, why not get to work on that fourth step?
                        </p>

                        <button
                          type="button"
                          onClick={() => setShowGame(true)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              setShowGame(true)
                            }
                          }}
                          className="group relative inline-flex items-center gap-3 px-8 py-4 font-black text-lg uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4"
                          style={{
                            background: themeStyle.buttonBackground,
                            border: `2px solid ${themeStyle.buttonBorder}`,
                            borderRadius:
                              theme === "asl"
                                ? "1rem"
                                : theme === "merch"
                                  ? "1.35rem"
                                  : "1.25rem",
                            boxShadow: `var(--shadow-card), 0 0 34px rgba(${char.accentRgb},0.08)`,
                            color: "white",
                            outlineColor: char.accent,
                          }}
                          aria-expanded={showGame}
                          aria-label={`Inventory in Progress. Click to play ${gameName}. ${gameDescription}`}
                        >
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

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                          {relatedLinks.map((link) => (
                            <Link
                              key={`${theme}-${link.href}`}
                              href={link.href}
                              className="rounded-[1rem] border px-4 py-3 text-sm font-semibold text-[var(--nec-text)] transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5"
                              style={{
                                borderColor: themeStyle.buttonBorder,
                                background: "rgba(var(--nec-card-rgb),0.82)",
                              }}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <ThemeMotif theme={theme} char={char} />
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 text-center">
                        <h2 className="text-lg font-bold text-[var(--nec-text)] mb-1">
                          {gameName}
                        </h2>
                        <p
                          className="text-xs"
                          style={{ color: "var(--nec-muted)" }}
                        >
                          {gameDescription}
                        </p>
                      </div>

                      <div
                        className="rounded-[1.35rem] p-4 md:p-5"
                        style={{
                          border: `1px solid ${themeStyle.gameFrameBorder}`,
                          background: themeStyle.gameFrameBackground,
                        }}
                      >
                        <div aria-live="polite">
                          {children}
                        </div>
                      </div>

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
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
