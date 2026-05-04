import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import type { LucideIcon } from "lucide-react"
import { ArrowRight, CalendarDays, Sparkles, Users, Video } from "lucide-react"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import ScrollReveal from "@/components/scroll-reveal"
import OrnateDivider from "@/components/art/ornate-divider"
import { CONTACT_EMAIL, ZOOM_MEETING_URL } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"
import CalendarSection from "@/components/calendar/calendar-section"

import { fetchCalendarEvents } from "@/lib/calendar/fetch"
import { getBlogPostBySlug } from "@/lib/data/fetch-utils"

export const metadata: Metadata = {
  title: "Service Opportunities — NECYPAA XXXVI",
  description:
    "Get involved with NECYPAA XXXVI. Committee calendar, open service positions, Members-at-Large opportunities, and ways to support the convention.",
}

type AccentKey = "purple" | "pink" | "gold" | "cyan"

type ServiceTrack = {
  title: string
  description: string
  details: string[]
  actionLabel: string
  actionHref: string
  actionExternal?: boolean
  accent: AccentKey
  icon: LucideIcon
}

function buildServiceTracks(bizMeetingDetails: string[]): ServiceTrack[] {
  return [
    {
      title: "Members-at-Large",
      description:
        "The easiest way in. Show up, stay available, and help wherever the committee needs an extra pair of hands.",
      details: ["No election required", "Flexible commitment", "Best first step for most people"],
      actionLabel: "See the Calendar",
      actionHref: "#committee-calendar",
      accent: "pink",
      icon: Users,
    },
    {
      title: "Host Committee Business Meetings",
      description:
        "Hear updates on NECYPAA XXXVI planning, learn where the work is moving, and find the committee or project that makes sense for you.",
      details: bizMeetingDetails,
      actionLabel: "See the Calendar",
      actionHref: "#committee-calendar",
      accent: "purple",
      icon: CalendarDays,
    },
    {
      title: "Open Positions",
      description:
        "Roles shift as the committee grows. Some are elected, some are appointed, and some simply need someone willing.",
      details: ["Openings change over time", "Ask at a meeting", "Email if you want to be considered"],
      actionLabel: "Email the Committee",
      actionHref: `mailto:${CONTACT_EMAIL}?subject=NECYPAA%20Service%20Opportunities`,
      accent: "gold",
      icon: Sparkles,
    },
  ]
}

const FIRST_MEETING_STEPS = [
  "Hop on Zoom. Hear where the committee stands right now.",
  "Listen for the pieces that need help, energy, or ideas.",
  "Speak up or stay after — ask where you can plug in.",
  "Leave with names, dates, and a way back into the work.",
]

const SERVICE_BENEFITS = [
  "Support the host committee in a way that is concrete and useful.",
  "Help shape fundraisers, outreach, hospitality, and the convention weekend itself.",
  "Build relationships with other young people in AA across the region.",
  "Practice reliability, accountability, and showing up for something bigger than yourself.",
]

const COMMITTEE_FUNCTIONS = [
  "Hospitality",
  "Outreach",
  "Events & Fundraising",
  "Registration",
  "Program",
  "Merch",
  "Website & Tech",
  "Treasury",
]

function CalendarSkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-label="Loading calendar">
      <div className="flex gap-2">
        <div className="h-7 w-32 rounded-lg bg-[rgba(var(--nec-purple-rgb),0.06)]" />
        <div className="h-7 w-20 rounded-full bg-[rgba(var(--nec-purple-rgb),0.06)]" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-2.5 px-2 py-1.5">
          <div className="h-4 w-6 rounded bg-[rgba(var(--nec-purple-rgb),0.06)]" />
          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[rgba(var(--nec-purple-rgb),0.08)]" />
          <div className="h-4 flex-1 rounded bg-[rgba(var(--nec-purple-rgb),0.04)]" />
        </div>
      ))}
    </div>
  )
}

function getAccentStyles(accent: AccentKey) {
  const map = {
    pink: {
      border: "border-[rgba(var(--nec-pink-rgb),0.12)]",
      surface: "bg-[rgba(var(--nec-pink-rgb),0.03)]",
      icon: "nec-icon-badge-pink",
      text: "text-[var(--nec-pink)]",
      line: "rgba(var(--nec-pink-rgb),0.42)",
    },
    gold: {
      border: "border-[rgba(var(--nec-gold-rgb),0.14)]",
      surface: "bg-[rgba(var(--nec-gold-rgb),0.04)]",
      icon: "nec-icon-badge-gold",
      text: "text-[var(--nec-gold)]",
      line: "rgba(var(--nec-gold-rgb),0.38)",
    },
    cyan: {
      border: "border-[rgba(var(--nec-cyan-rgb),0.14)]",
      surface: "bg-[rgba(var(--nec-cyan-rgb),0.04)]",
      icon: "nec-icon-badge",
      text: "text-[var(--nec-cyan)]",
      line: "rgba(var(--nec-cyan-rgb),0.42)",
    },
    purple: {
      border: "border-[rgba(var(--nec-purple-rgb),0.12)]",
      surface: "bg-[rgba(var(--nec-purple-rgb),0.03)]",
      icon: "nec-icon-badge",
      text: "text-[var(--nec-purple)]",
      line: "rgba(var(--nec-purple-rgb),0.42)",
    },
  }
  return map[accent] || map.purple
}

function TrackAction({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const isMailto = href.startsWith("mailto:")
  if (external || isMailto) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="btn-ghost inline-flex items-center gap-2 self-start"
      >
        {label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
        {external && <span className="sr-only"> (opens in new tab)</span>}
      </a>
    )
  }
  return (
    <a href={href} className="btn-ghost inline-flex items-center gap-2 self-start">
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  )
}

export default async function ServicePage() {
  const SERVICE_STORY = await getBlogPostBySlug("ypaa-saved-my-life")
  const events = await fetchCalendarEvents()
  const now = new Date()

  // Pull the next upcoming host-business meetings from the live calendar
  const upcomingBizMeetings = events.filter((e) => e.category === "host-business" && new Date(e.start) >= now)
  const nextBizMeeting = upcomingBizMeetings[0]

  // Derive display strings from the actual calendar data
  const nextMeetingLabel = nextBizMeeting
    ? `Next Business Meeting — ${new Date(nextBizMeeting.start).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "America/New_York",
      })}`
    : "Browse the Calendar"

  const nextMeetingTime = nextBizMeeting?.start.includes("T")
    ? new Date(nextBizMeeting.start).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
        timeZoneName: "short",
      })
    : null

  // Build hero chips from live calendar data instead of hardcoding
  const heroChips = [
    nextBizMeeting
      ? new Date(nextBizMeeting.start).toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          timeZone: "America/New_York",
        })
      : "See calendar for dates",
    nextMeetingTime ?? "See calendar for time",
    "No title required",
    "All are welcome",
  ]

  // Build business meeting track details from calendar
  const bizMeetingDetails = [
    nextBizMeeting
      ? `Next: ${new Date(nextBizMeeting.start).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          timeZone: "America/New_York",
        })}`
      : "See calendar for dates",
    nextMeetingTime ?? "See calendar for time",
    "All are welcome",
  ]

  const SERVICE_TRACKS = buildServiceTracks(bizMeetingDetails)
  return (
    <div
      className="min-h-screen-safe relative flex min-h-screen flex-col overflow-hidden"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" variant="subtle" dividerVariant="gear" />

      <div className="page-frame">
        <div className="container mx-auto px-4">
          <div className="page-stack-roomy mx-auto flex max-w-6xl flex-col">
            {/* ── 1. IMMERSIVE HERO ─────────────────────────────── */}
            <header
              className="relative overflow-hidden rounded-[2.2rem] border border-[rgba(var(--nec-purple-rgb),0.10)] shadow-[0_24px_56px_rgba(44,24,16,0.10)]"
              role="banner"
            >
              {/* Surface — warm card gradient, BELOW the texture */}
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(var(--nec-card-rgb),0.98) 0%, rgba(var(--nec-card-rgb),0.92) 54%, rgba(var(--nec-gold-rgb),0.08) 100%)",
                }}
              />
              {/* Atmospheric texture — sits ON TOP of surface, blends through */}
              <div
                className="absolute inset-0 opacity-[0.05]"
                aria-hidden="true"
                style={{
                  backgroundImage: "url(/images/mad-realm-textures-sheet.webp)",
                  backgroundSize: "cover",
                  backgroundPosition: "center 30%",
                  mixBlendMode: "multiply",
                }}
              />
              <div
                className="absolute inset-x-0 top-0 z-10 h-[3px] rounded-t-[2.2rem]"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(var(--nec-gold-rgb),0) 0%, rgba(var(--nec-gold-rgb),0.42) 24%, rgba(var(--nec-purple-rgb),0.52) 64%, rgba(var(--nec-cyan-rgb),0.32) 100%)",
                }}
              />

              {/* Character art — bleeds off right on desktop, subtle on mobile */}
              <div
                className="pointer-events-none absolute -bottom-4 right-2 w-28 opacity-[0.16] sm:w-36 sm:opacity-[0.22] lg:-right-8 lg:bottom-0 lg:w-[22rem] lg:opacity-[0.38]"
                aria-hidden="true"
              >
                <Image
                  src="/images/caterpillar-character.webp"
                  alt=""
                  width={842}
                  height={1264}
                  sizes="22rem"
                  className="h-auto w-full drop-shadow-[0_18px_40px_rgba(44,24,16,0.30)]"
                  aria-hidden="true"
                />
              </div>

              {/* Hero content — directly on atmosphere, not in a sub-card */}
              <div className="relative z-10 px-6 py-8 md:px-8 md:py-10 lg:max-w-[65%] lg:px-10 lg:py-12">
                <span className="section-badge page-enter-1">Service</span>
                <h1 className="page-enter-2 mt-5 text-4xl font-semibold tracking-[-0.05em] text-[var(--nec-text)] sm:text-5xl lg:text-[3.6rem] lg:leading-[1.06]">
                  The committee only gets built if people show&nbsp;up.
                </h1>
                <p className="page-enter-3 mt-5 max-w-2xl text-lg leading-8 text-[var(--nec-muted)]">
                  NECYPAA XXXVI needs trusted servants, not perfect résumés. If you want to help, there is already a
                  place for you. Start with a meeting, learn the rhythm, and plug into the work that keeps Hartford
                  moving closer.
                </p>

                <div className="page-enter-4 mt-7 flex flex-wrap gap-2.5">
                  {heroChips.map((item) => (
                    <span
                      key={item}
                      className="inline-flex min-h-[2.5rem] items-center rounded-full border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.82)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--nec-muted)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Two CTAs only — hero + bottom. That's it. */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={ZOOM_MEETING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center justify-center gap-2"
                  >
                    <Video className="h-4 w-4" aria-hidden="true" />
                    Join on Zoom
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <a href="#committee-calendar" className="btn-ghost inline-flex items-center justify-center gap-2">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    {nextMeetingLabel}
                  </a>
                </div>
              </div>
            </header>

            {/* ── 2. CALENDAR — promoted, the most actionable element ── */}
            <section
              id="committee-calendar"
              aria-label="Committee calendar"
              className="section-atmosphere-cyan relative"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.80)] p-5 shadow-[0_24px_56px_rgba(44,24,16,0.08)] md:p-7">
                <div
                  className="absolute inset-x-0 top-0 h-[3px]"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(var(--nec-cyan-rgb),0.45) 0%, rgba(var(--nec-purple-rgb),0.42) 55%, rgba(var(--nec-gold-rgb),0.26) 100%)",
                  }}
                />

                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="section-badge">Committee Rhythm</span>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)] sm:text-3xl">
                      What&rsquo;s coming up.
                    </h2>
                  </div>
                  <p
                    className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl"
                    style={{
                      fontFamily: "var(--font-display), Georgia, serif",
                      color: "var(--nec-purple)",
                      opacity: 0.25,
                    }}
                    aria-hidden="true"
                  >
                    {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>

                <Suspense fallback={<CalendarSkeleton />}>
                  {/* @ts-expect-error TypeScript JSX types do not yet support async Server Components in all contexts. This is valid Next.js 15 + React 19 RSC syntax. */}
                  <CalendarSection />
                </Suspense>
              </div>
            </section>

            {/* ── 3. PULL-QUOTE — typography moment, no card ─────── */}
            {SERVICE_STORY && (
              <section aria-label="Service story" className="relative py-6 md:py-10 lg:py-14">
                <div className="mx-auto max-w-3xl text-center">
                  <blockquote
                    className="text-xl italic leading-9 tracking-[-0.01em] text-[var(--nec-text)] sm:text-2xl sm:leading-10 md:text-[1.7rem] md:leading-[2.4rem]"
                    style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                  >
                    &ldquo;{SERVICE_STORY.excerpt}&rdquo;
                  </blockquote>
                  <div
                    className="mx-auto mt-5 h-px w-16"
                    aria-hidden="true"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(var(--nec-gold-rgb),0.40), transparent)",
                    }}
                  />
                  <Link
                    href={`/blog/${SERVICE_STORY.slug}`}
                    className="mt-4 inline-block text-sm font-medium text-[var(--nec-purple)] underline decoration-[rgba(var(--nec-purple-rgb),0.30)] underline-offset-4 transition-colors hover:text-[var(--nec-pink)]"
                  >
                    Read the full story
                  </Link>
                </div>
              </section>
            )}

            <OrnateDivider variant="gear" color="var(--nec-gold)" />

            {/* ── 4. SERVICE TRACKS ─────────────────────────────── */}
            <ScrollReveal>
              <section aria-label="Ways to plug in" className="section-atmosphere-purple relative">
                <div className="max-w-3xl">
                  <span className="section-badge">Ways In</span>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-4xl">
                    Three clean ways to plug into the committee.
                  </h2>
                  <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
                    Start where you can reliably show up, then let the committee show you the next right responsibility.
                  </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-3">
                  {SERVICE_TRACKS.map((track) => {
                    const accent = getAccentStyles(track.accent)
                    const Icon = track.icon
                    return (
                      <article
                        key={track.title}
                        className="nec-card nec-interactive-card relative h-full overflow-hidden p-6 md:p-7"
                      >
                        <div
                          className="absolute inset-x-0 top-0 h-[3px]"
                          aria-hidden="true"
                          style={{
                            background: `linear-gradient(90deg, transparent 0%, ${accent.line} 35%, ${accent.line} 100%)`,
                          }}
                        />
                        <div className="flex h-full flex-col">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${accent.icon}`}
                              aria-hidden="true"
                            >
                              <Icon className={`h-5 w-5 ${accent.text}`} />
                            </div>
                            <div>
                              <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${accent.text}`}>
                                Service Track
                              </p>
                              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                                {track.title}
                              </h3>
                            </div>
                          </div>
                          <p className="mt-5 text-sm leading-7 text-[var(--nec-muted)]">{track.description}</p>
                          <ul className="mt-5 grid gap-3">
                            {track.details.map((detail) => (
                              <li
                                key={detail}
                                className={`rounded-[1.1rem] border px-4 py-3 text-sm leading-6 text-[var(--nec-text)] ${accent.border} ${accent.surface}`}
                              >
                                {detail}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-auto pt-6">
                            <TrackAction
                              href={track.actionHref}
                              label={track.actionLabel}
                              external={track.actionExternal}
                            />
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            </ScrollReveal>

            {/* ── 5. FIRST MEETING + WHAT THE COMMITTEE DOES ───── */}
            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <ScrollReveal className="h-full">
                <section aria-label="What your first meeting looks like">
                  <div className="nec-card relative h-full overflow-hidden p-6 md:p-8">
                    <div
                      className="absolute inset-x-0 top-0 h-[3px]"
                      aria-hidden="true"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(var(--nec-purple-rgb),0.20) 0%, rgba(var(--nec-cyan-rgb),0.42) 50%, rgba(var(--nec-cyan-rgb),0.12) 100%)",
                      }}
                    />
                    <span className="section-badge">First Meeting</span>
                    <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)] sm:text-3xl">
                      What it feels like to walk in.
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
                      Most people start by listening, asking a question, and finding where they can help.
                    </p>
                    <ol className="mt-6 space-y-3">
                      {FIRST_MEETING_STEPS.map((step, i) => (
                        <li
                          key={step}
                          className="flex items-start gap-3 rounded-[1.15rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] px-4 py-3"
                        >
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(var(--nec-purple-rgb),0.10)] text-sm font-semibold text-[var(--nec-purple)]">
                            {i + 1}
                          </div>
                          <p className="pt-0.5 text-sm leading-6 text-[var(--nec-muted)]">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>
              </ScrollReveal>

              {/* Right column — Why It Matters, NO card wrapper (editorial break) */}
              <ScrollReveal className="h-full">
                <section
                  aria-label="Why people stay in service"
                  className="relative h-full rounded-[1.5rem] bg-[rgba(var(--nec-card-rgb),0.40)] p-5 md:rounded-none md:bg-transparent md:p-0 md:py-4 lg:pl-4"
                >
                  <div className="max-w-xl">
                    <span className="section-badge">Why It Matters</span>
                    <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)] sm:text-3xl">
                      Why people keep coming back to this work.
                    </h2>
                  </div>

                  <ul className="mt-6 grid gap-4">
                    {SERVICE_BENEFITS.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div
                          className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--nec-gold)]"
                          aria-hidden="true"
                        />
                        <p className="text-sm leading-7 text-[var(--nec-muted)]">{item}</p>
                      </li>
                    ))}
                  </ul>

                  {/* Committee functions — helps newcomers self-identify */}
                  <div className="mt-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                      Where You Might Fit
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
                      The committee runs on these functions. Most people gravitate toward one.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {COMMITTEE_FUNCTIONS.map((fn) => (
                        <span
                          key={fn}
                          className="inline-flex items-center rounded-full border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] px-3 py-1.5 text-[11px] font-medium text-[var(--nec-text)]"
                        >
                          {fn}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              </ScrollReveal>
            </div>

            {/* ── 6. BOTTOM CTA ────────────────────────────── */}
            <section aria-label="Ready to join the committee" className="relative">
              <div className="relative overflow-hidden rounded-[2.1rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[linear-gradient(135deg,rgba(var(--nec-purple-rgb),0.06)_0%,rgba(var(--nec-card-rgb),0.95)_48%,rgba(var(--nec-gold-rgb),0.05)_100%)] px-6 py-8 shadow-[0_24px_56px_rgba(44,24,16,0.10)] md:px-8 md:py-10">
                <div
                  className="absolute inset-x-0 top-0 h-[3px]"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(var(--nec-purple-rgb),0.50) 0%, rgba(var(--nec-gold-rgb),0.40) 100%)",
                  }}
                />

                {/* Mad Hatter — bookends with caterpillar in hero */}
                <div
                  className="pointer-events-none absolute -right-4 bottom-0 w-24 opacity-[0.12] sm:w-32 sm:opacity-[0.18] lg:-right-10 lg:w-64 lg:opacity-[0.30]"
                  aria-hidden="true"
                >
                  <Image
                    src="/images/mad-hatter-character.webp"
                    alt=""
                    width={842}
                    height={1264}
                    sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 256px"
                    className="h-auto w-full drop-shadow-[0_18px_36px_rgba(44,24,16,0.30)]"
                    aria-hidden="true"
                  />
                </div>

                <div className="relative z-10 max-w-3xl lg:max-w-[70%]">
                  <span className="section-badge">Ready When You Are</span>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-4xl">
                    You do not need the perfect introduction. You just need to show&nbsp;up.
                  </h2>
                  <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
                    Join the next meeting, tell someone you want to help, and let the work get more specific from there.
                    NECYPAA grows because people keep raising their hand.
                  </p>

                  {/* Two CTAs — hero had the first pair, this is the second and last */}
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={ZOOM_MEETING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center justify-center gap-2"
                    >
                      <Video className="h-4 w-4" aria-hidden="true" />
                      Join on Zoom
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                    <Link href="/register" className="btn-secondary inline-flex items-center justify-center gap-2">
                      Register for NECYPAA
                    </Link>
                  </div>

                  {/* Email as inline text, not a third button */}
                  <p className="mt-4 text-sm text-[var(--nec-muted)]">
                    Questions?{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=NECYPAA%20Service%20Questions`}
                      className="font-medium text-[var(--nec-purple)] underline decoration-[rgba(var(--nec-purple-rgb),0.30)] underline-offset-4 transition-colors hover:text-[var(--nec-pink)]"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
