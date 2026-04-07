"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"

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
    standalone: "/images/mad-hatter-character.png",
    alt: "The Mad Hatter character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-purple)",
    accentRgb: "var(--nec-purple-rgb)",
  },
  "cheshire-cat": {
    portal: "/images/cheshire-cat-portal.jpg",
    standalone: "/images/cheshire-cat-character.png",
    alt: "The Cheshire Cat character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-pink)",
    accentRgb: "var(--nec-pink-rgb)",
  },
  caterpillar: {
    portal: "/images/caterpillar-portal.jpg",
    standalone: "/images/caterpillar-character.png",
    alt: "The Caterpillar character escaping through ornate portal doors from the Mad Realm",
    accent: "var(--nec-gold)",
    accentRgb: "var(--nec-gold-rgb)",
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
  const shouldReduce = useReducedMotion()

  return (
    <div className="relative flex min-h-screen min-h-screen-safe flex-col" style={{ backgroundColor: "var(--nec-navy)" }}>
      <div className="page-frame">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <motion.div
              className="mb-8 text-center md:mb-10"
              initial={shouldReduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
            >
              <span className="section-badge mb-4 inline-flex">{badge}</span>
              <h1 className="section-heading mb-3">{title}</h1>
              {subtitle && (
                <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--nec-muted)]">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {children || (
              <motion.div
                className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]"
                initial={shouldReduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduce ? { duration: 0 } : { ...SPRING_GENTLE, delay: 0.08 }}
              >
                <div className="nec-card relative overflow-hidden p-8 md:p-10">
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    aria-hidden="true"
                    style={{
                      background: `linear-gradient(90deg, rgba(${char.accentRgb},0.55) 0%, rgba(var(--nec-gold-rgb),0.28) 100%)`,
                    }}
                  />

                  <div className="space-y-6">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Coming Soon</p>
                      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                        This room is still being built.
                      </h2>
                      <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
                        Instead of dropping you into a generic placeholder, we&apos;re pointing you toward the
                        pages that already matter most right now.
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <Link href="/register" className="rounded-2xl border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-purple-rgb),0.03)] px-4 py-4 transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.05)]">
                        <p className="text-sm font-semibold text-[var(--nec-text)]">Register for NECYPAA XXXVI</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--nec-muted)]">Secure your spot and start planning the weekend.</p>
                      </Link>
                      <Link href="/events" className="rounded-2xl border border-[rgba(var(--nec-gold-rgb),0.12)] bg-[rgba(var(--nec-gold-rgb),0.03)] px-4 py-4 transition-colors hover:bg-[rgba(var(--nec-gold-rgb),0.05)]">
                        <p className="text-sm font-semibold text-[var(--nec-text)]">See the road to Hartford</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--nec-muted)]">Follow fundraisers, fellowship nights, and updates.</p>
                      </Link>
                      <Link href="/faq" className="rounded-2xl border border-[rgba(var(--nec-cyan-rgb),0.12)] bg-[rgba(var(--nec-cyan-rgb),0.03)] px-4 py-4 transition-colors hover:bg-[rgba(var(--nec-cyan-rgb),0.05)]">
                        <p className="text-sm font-semibold text-[var(--nec-text)]">Read the FAQ</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--nec-muted)]">Find answers without leaving the site guessing.</p>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="nec-card overflow-hidden p-4">
                    <div className="overflow-hidden rounded-[1.25rem] border border-[rgba(var(--nec-purple-rgb),0.10)]">
                      <Image
                        src={char.portal}
                        alt={char.alt}
                        width={900}
                        height={1200}
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.76)] p-6">
                    <div className="flex items-center gap-4">
                      <div className="overflow-hidden rounded-2xl border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] p-2">
                        <Image
                          src={char.standalone}
                          alt=""
                          width={90}
                          height={120}
                          sizes="90px"
                          className="h-20 w-auto object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">In Progress</p>
                        <p className="mt-2 text-lg font-semibold text-[var(--nec-text)]">
                          The page is on the roadmap, not abandoned.
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
                          We&apos;re filling these sections with real content instead of keeping decorative emptiness on
                          the navigation forever.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
