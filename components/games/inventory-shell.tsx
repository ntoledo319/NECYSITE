"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Gamepad2 } from "lucide-react"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import { GearCluster } from "@/components/art/steampunk-gears"
import PageArtAccents from "@/components/art/page-art-accents"

type Character = "mad-hatter" | "cheshire-cat" | "caterpillar"
type DividerVariant = "gear" | "key" | "potion" | "compass"
type AccentTone = "purple" | "pink" | "gold" | "cyan"

interface InventoryDetail {
  label: string
  value: string
  accent?: AccentTone
}

interface InventoryNote {
  title: string
  body: string
}

interface InventoryLink {
  href: string
  label: string
  description: string
  external?: boolean
  accent?: AccentTone
}

interface InventoryShellProps {
  badge: string
  title: string
  subtitle?: string
  character: Character
  gameName: string
  gameDescription: string
  children: React.ReactNode
  dividerVariant?: DividerVariant
  statusLabel: string
  statusTitle: string
  statusCopy: string
  detailItems: InventoryDetail[]
  bridgeLinks: InventoryLink[]
  notesTitle: string
  notes: InventoryNote[]
  committeeNote: string
  portalCaption: string
  gamePrompt?: string
}

const CHARACTER_DATA = {
  "mad-hatter": {
    portal: "/images/mad-hatter-portal.jpg",
    standalone: "/images/mad-hatter-character.png",
    alt: "The Mad Hatter character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-purple)",
    accentRgb: "var(--nec-purple-rgb)",
    dividerVariant: "potion" as const,
  },
  "cheshire-cat": {
    portal: "/images/cheshire-cat-portal.jpg",
    standalone: "/images/cheshire-cat-character.png",
    alt: "The Cheshire Cat character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-pink)",
    accentRgb: "var(--nec-pink-rgb)",
    dividerVariant: "gear" as const,
  },
  caterpillar: {
    portal: "/images/caterpillar-portal.jpg",
    standalone: "/images/caterpillar-character.png",
    alt: "The Caterpillar character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-gold)",
    accentRgb: "var(--nec-gold-rgb)",
    dividerVariant: "compass" as const,
  },
}

const ACCENT_STYLES: Record<
  AccentTone,
  { color: string; bg: string; border: string }
> = {
  purple: {
    color: "var(--nec-purple)",
    bg: "rgba(var(--nec-purple-rgb),0.05)",
    border: "rgba(var(--nec-purple-rgb),0.16)",
  },
  pink: {
    color: "var(--nec-pink)",
    bg: "rgba(var(--nec-pink-rgb),0.05)",
    border: "rgba(var(--nec-pink-rgb),0.16)",
  },
  gold: {
    color: "var(--nec-gold)",
    bg: "rgba(var(--nec-gold-rgb),0.05)",
    border: "rgba(var(--nec-gold-rgb),0.16)",
  },
  cyan: {
    color: "var(--nec-cyan)",
    bg: "rgba(var(--nec-cyan-rgb),0.05)",
    border: "rgba(var(--nec-cyan-rgb),0.16)",
  },
}

function BridgeLinkCard({ link }: { link: InventoryLink }) {
  const accent = ACCENT_STYLES[link.accent ?? "purple"]
  const className =
    "block rounded-[1.35rem] border px-4 py-4 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={{
          background: accent.bg,
          borderColor: accent.border,
          outlineColor: accent.color,
        }}
      >
        <p className="flex items-center gap-2 text-sm font-semibold text-[var(--nec-text)]">
          {link.label}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only"> (opens in new tab)</span>
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">{link.description}</p>
      </a>
    )
  }

  return (
    <Link
      href={link.href}
      className={className}
      style={{
        background: accent.bg,
        borderColor: accent.border,
        outlineColor: accent.color,
      }}
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-[var(--nec-text)]">
        {link.label}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">{link.description}</p>
    </Link>
  )
}

export default function InventoryShell({
  badge,
  title,
  subtitle,
  character,
  gameName,
  gameDescription,
  children,
  dividerVariant,
  statusLabel,
  statusTitle,
  statusCopy,
  detailItems,
  bridgeLinks,
  notesTitle,
  notes,
  committeeNote,
  portalCaption,
  gamePrompt = "Need a detour while this room is still under construction?",
}: InventoryShellProps) {
  const [showGame, setShowGame] = useState(false)
  const char = CHARACTER_DATA[character]

  return (
    <div className="relative flex min-h-screen min-h-screen-safe flex-col" style={{ backgroundColor: "var(--nec-navy)" }}>
      <PageArtAccents
        character={character}
        accentColor={char.accent}
        variant="subtle"
        dividerVariant={dividerVariant ?? char.dividerVariant}
      />

      <div className="relative z-10 flex-1 pb-20 pt-24 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <header className="mx-auto max-w-3xl text-center">
              <span className="section-badge inline-flex">{badge}</span>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--nec-muted)]">
                  {subtitle}
                </p>
              )}
            </header>

            <div className="mt-10 grid gap-8 lg:grid-cols-[0.96fr_1.04fr]">
              <div className="space-y-6">
                <article className="nec-card overflow-hidden p-6 md:p-7">
                  <div
                    className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
                    style={{
                      background: `rgba(${char.accentRgb},0.07)`,
                      border: `1px solid rgba(${char.accentRgb},0.16)`,
                    }}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: char.accent }}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                      {statusTitle}
                    </h2>
                    <p className="max-w-2xl text-base leading-7 text-[var(--nec-muted)]">
                      {statusCopy}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {detailItems.map((item) => {
                      const accent = ACCENT_STYLES[item.accent ?? "purple"]
                      return (
                        <div
                          key={item.label}
                          className="rounded-[1.25rem] border px-4 py-4"
                          style={{
                            background: accent.bg,
                            borderColor: accent.border,
                          }}
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent.color }}>
                            {item.label}
                          </p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">
                            {item.value}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </article>

                <article className="rounded-[1.75rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.82)] p-6 shadow-[0_20px_44px_rgba(44,24,16,0.08)]">
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full"
                      style={{
                        background: `rgba(${char.accentRgb},0.08)`,
                        border: `1px solid rgba(${char.accentRgb},0.16)`,
                      }}
                    >
                      <Image
                        src={char.standalone}
                        alt=""
                        width={42}
                        height={56}
                        sizes="42px"
                        className="h-8 w-auto object-contain"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: char.accent }}>
                        Committee Note
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[var(--nec-muted)]">{committeeNote}</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {bridgeLinks.map((link) => (
                      <BridgeLinkCard key={link.label} link={link} />
                    ))}
                  </div>
                </article>
              </div>

              <div className="space-y-6">
                <article className="nec-card overflow-hidden p-4 md:p-5">
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.04)] p-2">
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-20"
                      aria-hidden="true"
                      style={{
                        background: `linear-gradient(180deg, rgba(${char.accentRgb},0.14) 0%, transparent 100%)`,
                      }}
                    />
                    <Image
                      src={char.portal}
                      alt={char.alt}
                      width={1200}
                      height={1200}
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="relative h-auto w-full rounded-[1.2rem] object-cover"
                    />
                  </div>

                  <div className="mt-4 flex items-start gap-4">
                    <GearCluster className="opacity-50" />
                    <p className="text-sm leading-6 text-[var(--nec-muted)]">{portalCaption}</p>
                  </div>
                </article>

                <article className="rounded-[1.75rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.84)] p-6 shadow-[0_20px_44px_rgba(44,24,16,0.08)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: char.accent }}>
                        {notesTitle}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                        What this page is being shaped to hold.
                      </h2>
                    </div>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{
                        background: `rgba(${char.accentRgb},0.08)`,
                        border: `1px solid rgba(${char.accentRgb},0.16)`,
                      }}
                    >
                      <Gamepad2 className="h-4 w-4" style={{ color: char.accent }} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {notes.map((note) => (
                      <div
                        key={note.title}
                        className="rounded-[1.25rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.86)] px-4 py-4"
                      >
                        <p className="text-sm font-semibold text-[var(--nec-text)]">{note.title}</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">{note.body}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-[1.75rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[linear-gradient(135deg,rgba(var(--nec-card-rgb),0.88),rgba(var(--nec-purple-rgb),0.04))] p-6 shadow-[0_22px_48px_rgba(44,24,16,0.10)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-xl">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: char.accent }}>
                        Side Quest
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                        {gameName}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[var(--nec-muted)]">
                        {gamePrompt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowGame((current) => !current)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.96)] px-4 py-2.5 text-sm font-semibold text-[var(--nec-text)] transition-[border-color,background,transform] duration-200 hover:-translate-y-0.5 hover:border-[rgba(var(--nec-purple-rgb),0.24)] hover:bg-[rgba(var(--nec-purple-rgb),0.05)] focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ outlineColor: char.accent }}
                      aria-expanded={showGame}
                    >
                      {showGame ? "Hide the game" : "Open the game"}
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[var(--nec-muted)]">{gameDescription}</p>

                  {showGame && (
                    <div className="mt-5 rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.86)] p-4">
                      <div aria-live="polite">{children}</div>
                    </div>
                  )}
                </article>
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
