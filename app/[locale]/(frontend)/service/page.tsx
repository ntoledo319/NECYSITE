import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import type { LucideIcon } from "lucide-react"
import { ArrowRight, BadgeCheck, CalendarDays, Clock3, Mail, Sparkles, Users, Video } from "lucide-react"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import ScrollReveal from "@/components/scroll-reveal"
import OrnateDivider from "@/components/art/ornate-divider"
import { CONTACT_EMAIL, ZOOM_MEETING_URL } from "@/lib/constants"
import { GearCluster } from "@/components/art/steampunk-gears"
import PageArtAccents from "@/components/art/page-art-accents"
import CalendarSection from "@/components/calendar/calendar-section"

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

const SERVICE_TRACKS: ServiceTrack[] = [
  {
    title: "Members-at-Large",
    description:
      "The easiest way in. Show up, stay available, and help wherever the committee needs an extra pair of hands.",
    details: ["No election required", "Flexible commitment", "Best first step for most people"],
    actionLabel: "Join on Zoom",
    actionHref: ZOOM_MEETING_URL,
    actionExternal: true,
    accent: "pink",
    icon: Users,
  },
  {
    title: "Business Meetings",
    description:
      "Hear updates, learn where the work is moving, and find the committee or project that makes sense for you.",
    details: ["First and third Sundays", "2:00 PM Eastern", "All are welcome"],
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

const FIRST_MEETING_STEPS = [
  "You hop on Zoom and hear where the committee is at right now.",
  "You listen for the pieces that need help, energy, or ideas.",
  "You speak up during the meeting or stay after and ask where you can plug in.",
  "You leave with names, dates, and a way back into the work.",
]

const SERVICE_BENEFITS = [
  "Support the host committee in a way that is concrete and useful.",
  "Help shape fundraisers, outreach, hospitality, and the convention weekend itself.",
  "Build relationships with other young people in AA across the region.",
  "Practice reliability, accountability, and showing up for something bigger than yourself.",
]

function CalendarSkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-label="Loading calendar">
      <div className="flex gap-2">
        <div className="h-7 w-32 rounded-lg bg-[rgba(var(--nec-purple-rgb),0.06)]" />
        <div className="h-7 w-20 rounded-full bg-[rgba(var(--nec-purple-rgb),0.06)]" />
        <div className="h-7 w-16 rounded-full bg-[rgba(var(--nec-purple-rgb),0.06)]" />
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
  switch (accent) {
    case "pink":
      return {
        border: "border-[rgba(var(--nec-pink-rgb),0.12)]",
        surface: "bg-[rgba(var(--nec-pink-rgb),0.03)]",
        icon: "nec-icon-badge-pink",
        text: "text-[var(--nec-pink)]",
        line: "rgba(var(--nec-pink-rgb),0.42)",
      }
    case "gold":
      return {
        border: "border-[rgba(var(--nec-gold-rgb),0.14)]",
        surface: "bg-[rgba(var(--nec-gold-rgb),0.04)]",
        icon: "nec-icon-badge-gold",
        text: "text-[var(--nec-gold)]",
        line: "rgba(var(--nec-gold-rgb),0.38)",
      }
    case "cyan":
      return {
        border: "border-[rgba(var(--nec-cyan-rgb),0.14)]",
        surface: "bg-[rgba(var(--nec-cyan-rgb),0.04)]",
        icon: "nec-icon-badge",
        text: "text-[var(--nec-cyan)]",
        line: "rgba(var(--nec-cyan-rgb),0.42)",
      }
    default:
      return {
        border: "border-[rgba(var(--nec-purple-rgb),0.12)]",
        surface: "bg-[rgba(var(--nec-purple-rgb),0.03)]",
        icon: "nec-icon-badge",
        text: "text-[var(--nec-purple)]",
        line: "rgba(var(--nec-purple-rgb),0.42)",
      }
  }
}

function TrackAction({ href, label, external }: { href: string; label: string; external?: boolean }) {
  if (external || href.startsWith("mailto:")) {
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

export default function ServicePage() {
  return (
    <div
      className="min-h-screen-safe relative flex min-h-screen flex-col overflow-hidden"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" variant="subtle" dividerVariant="gear" />

      <div className="page-frame">
        <div className="container mx-auto px-4">
          <div className="page-stack-roomy mx-auto flex max-w-6xl flex-col">
            <header className="relative overflow-hidden rounded-[2.2rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[linear-gradient(135deg,rgba(var(--nec-card-rgb),0.96)_0%,rgba(var(--nec-card-rgb),0.88)_54%,rgba(var(--nec-gold-rgb),0.05)_100%)] px-6 py-8 shadow-[0_24px_56px_rgba(44,24,16,0.10)] md:px-8 md:py-10 lg:px-10">
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(var(--nec-gold-rgb),0) 0%, rgba(var(--nec-gold-rgb),0.42) 24%, rgba(var(--nec-purple-rgb),0.52) 64%, rgba(var(--nec-cyan-rgb),0.32) 100%)",
                }}
              />
              <div
                className="pointer-events-none absolute -right-24 top-0 hidden h-full w-[28rem] rounded-full lg:block"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(var(--nec-gold-rgb),0.10) 0%, rgba(var(--nec-purple-rgb),0.06) 42%, transparent 72%)",
                }}
              />

              <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                <div className="relative z-10 max-w-3xl">
                  <span className="section-badge page-enter-1">Service</span>
                  <h1 className="page-enter-2 mt-5 text-4xl font-semibold tracking-[-0.05em] text-[var(--nec-text)] sm:text-5xl lg:text-[3.6rem]">
                    The committee only gets built if people show up.
                  </h1>
                  <p className="page-enter-3 mt-5 max-w-2xl text-lg leading-8 text-[var(--nec-muted)]">
                    NECYPAA XXXVI needs trusted servants, not perfect résumés. If you want to help, there is already a
                    place for you. Start with a meeting, learn the rhythm, and plug into the work that keeps Hartford
                    moving closer.
                  </p>

                  <div className="page-enter-4 mt-7 flex flex-wrap gap-3">
                    {["First & Third Sundays", "2:00 PM Eastern", "No title required", "All are welcome"].map(
                      (item) => (
                        <span
                          key={item}
                          className="inline-flex min-h-[2.75rem] items-center rounded-full border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.82)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--nec-muted)]"
                        >
                          {item}
                        </span>
                      ),
                    )}
                  </div>

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
                      Browse the Calendar
                    </a>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="relative mx-auto max-w-[24rem]">
                    <div
                      className="absolute -inset-6 rounded-[2rem]"
                      aria-hidden="true"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(var(--nec-gold-rgb),0.18) 0%, rgba(var(--nec-purple-rgb),0.09) 45%, transparent 74%)",
                        filter: "blur(22px)",
                      }}
                    />
                    <div className="relative rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.78)] p-3 shadow-[0_22px_48px_rgba(44,24,16,0.12)]">
                      <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(var(--nec-gold-rgb),0.16)] bg-[rgba(var(--nec-gold-rgb),0.04)]">
                        <Image
                          src="/images/caterpillar-portal.webp"
                          alt=""
                          width={900}
                          height={1200}
                          sizes="(max-width: 1024px) 100vw, 28rem"
                          className="h-auto w-full object-cover"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div className="absolute -left-3 top-6 rounded-[1.15rem] border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-card-rgb),0.92)] px-4 py-3 shadow-[0_16px_34px_rgba(44,24,16,0.10)]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                        Start Here
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">
                        Members-at-Large is the easiest way into the work.
                      </p>
                    </div>

                    <div className="absolute -bottom-4 right-2 rounded-[1.15rem] border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.94)] px-4 py-3 shadow-[0_16px_34px_rgba(44,24,16,0.10)]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                        Service Rhythm
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">
                        Show up. Stay available. Keep coming back.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <ScrollReveal>
              <section aria-label="Ways to plug in" className="section-atmosphere-purple relative">
                <div className="max-w-3xl">
                  <span className="section-badge">Ways In</span>
                  <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-4xl">
                    Three clean ways to plug into the committee.
                  </h2>
                  <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
                    If the whole thing feels big from the outside, reduce it to this: start where you can reliably show
                    up, then let the committee show you the next right responsibility.
                  </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-3">
                  {SERVICE_TRACKS.map((track, index) => {
                    const accent = getAccentStyles(track.accent)
                    const Icon = track.icon

                    return (
                      <ScrollReveal key={track.title} delay={(index + 1) as 1 | 2 | 3} className="h-full">
                        <article className="nec-card nec-interactive-card relative h-full overflow-hidden p-6 md:p-7">
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

                            <div className="mt-6">
                              <TrackAction
                                href={track.actionHref}
                                label={track.actionLabel}
                                external={track.actionExternal}
                              />
                            </div>
                          </div>
                        </article>
                      </ScrollReveal>
                    )
                  })}
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <section
                id="committee-calendar"
                aria-label="Committee calendar"
                className="section-atmosphere-cyan relative"
              >
                <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.80)] p-6 shadow-[0_24px_56px_rgba(44,24,16,0.08)] md:p-8">
                  <div
                    className="absolute inset-x-0 top-0 h-[3px]"
                    aria-hidden="true"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(var(--nec-cyan-rgb),0.45) 0%, rgba(var(--nec-purple-rgb),0.42) 55%, rgba(var(--nec-gold-rgb),0.26) 100%)",
                    }}
                  />
                  <GearCluster className="absolute -right-2 top-3 hidden opacity-45 lg:block" />

                  <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
                    <div className="space-y-5">
                      <div>
                        <span className="section-badge">Committee Rhythm</span>
                        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--nec-text)]">
                          Keep up with the work in real time.
                        </h2>
                        <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
                          The calendar is the cleanest way to follow committee movement. Use it to see business
                          meetings, host events, and the rest of the road to Hartford without guessing where the action
                          is.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <div className="rounded-[1.2rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] px-4 py-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                            What You’ll See
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
                            Host business, host events, and outside commitments are all filterable from one place.
                          </p>
                        </div>
                        <div className="rounded-[1.2rem] border border-[rgba(var(--nec-cyan-rgb),0.12)] bg-[rgba(var(--nec-cyan-rgb),0.03)] px-4 py-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-cyan)]">
                            Best Practice
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
                            If you want to be useful, know the calendar. It tells you where to show up next.
                          </p>
                        </div>
                      </div>

                      <a
                        href={ZOOM_MEETING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex items-center gap-2"
                      >
                        <Video className="h-4 w-4" aria-hidden="true" />
                        Join the Next Meeting
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    </div>

                    <div className="rounded-[1.6rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.92)] p-4 shadow-[0_16px_34px_rgba(44,24,16,0.06)] md:p-5">
                      <Suspense fallback={<CalendarSkeleton />}>
                        {/* @ts-expect-error Async Server Component */}
                        <CalendarSection />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            <OrnateDivider variant="gear" color="var(--nec-gold)" />

            <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
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
                    <div className="max-w-2xl">
                      <span className="section-badge">First Meeting</span>
                      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--nec-text)]">
                        What it usually feels like to walk in.
                      </h2>
                      <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
                        The first meeting does not need to be dramatic. Most people start by listening, asking one or
                        two questions, and finding the next place they can be helpful.
                      </p>
                    </div>

                    <ol className="mt-8 space-y-4">
                      {FIRST_MEETING_STEPS.map((step, index) => (
                        <li
                          key={step}
                          className="flex items-start gap-4 rounded-[1.25rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] px-4 py-4"
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(var(--nec-purple-rgb),0.10)] text-sm font-semibold text-[var(--nec-purple)]">
                            {index + 1}
                          </div>
                          <p className="pt-1 text-sm leading-7 text-[var(--nec-muted)]">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>
              </ScrollReveal>

              <ScrollReveal delay={1} className="h-full">
                <section aria-label="Why people stay in service">
                  <div className="relative h-full overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-gold-rgb),0.14)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.05),rgba(var(--nec-card-rgb),0.92))] p-6 shadow-[0_20px_44px_rgba(44,24,16,0.08)] md:p-8">
                    <div
                      className="absolute inset-x-0 top-0 h-[3px]"
                      aria-hidden="true"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(var(--nec-gold-rgb),0.45) 0%, rgba(var(--nec-pink-rgb),0.34) 100%)",
                      }}
                    />
                    <div className="max-w-xl">
                      <span className="section-badge">Why It Matters</span>
                      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--nec-text)]">
                        Why people keep coming back to this work.
                      </h2>
                    </div>

                    <ul className="mt-8 grid gap-4">
                      {SERVICE_BENEFITS.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <div className="nec-icon-badge-gold mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl">
                            <BadgeCheck className="h-4 w-4 text-[var(--nec-gold)]" aria-hidden="true" />
                          </div>
                          <p className="text-sm leading-7 text-[var(--nec-muted)]">{item}</p>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 rounded-[1.4rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.80)] px-5 py-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                        Keep It Practical
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
                        Open opportunities shift throughout the year. The fastest way to hear what needs help is still
                        the simplest one: show up to the meeting, ask where the gaps are, and stay reachable.
                      </p>
                    </div>
                  </div>
                </section>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={2}>
              <section aria-label="Ready to join the committee">
                <div className="relative overflow-hidden rounded-[2.1rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[linear-gradient(135deg,rgba(var(--nec-purple-rgb),0.07)_0%,rgba(var(--nec-card-rgb),0.94)_48%,rgba(var(--nec-gold-rgb),0.06)_100%)] px-6 py-8 shadow-[0_24px_56px_rgba(44,24,16,0.10)] md:px-8 md:py-10">
                  <div
                    className="absolute inset-x-0 top-0 h-[3px]"
                    aria-hidden="true"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(var(--nec-purple-rgb),0.50) 0%, rgba(var(--nec-gold-rgb),0.40) 100%)",
                    }}
                  />
                  <div className="absolute bottom-0 right-4 hidden opacity-[0.12] md:block" aria-hidden="true">
                    <Image
                      src="/images/mad-hatter-character.webp"
                      alt=""
                      width={160}
                      height={240}
                      sizes="160px"
                      className="h-auto w-32 lg:w-36"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="max-w-3xl">
                    <span className="section-badge">Ready When You Are</span>
                    <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-4xl">
                      You do not need the perfect introduction. You just need to show up.
                    </h2>
                    <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
                      Join the next meeting, tell someone you want to help, and let the work get more specific from
                      there. NECYPAA grows because people keep raising their hand.
                    </p>

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
                      <a
                        href={`mailto:${CONTACT_EMAIL}?subject=NECYPAA%20Service%20Questions`}
                        className="btn-ghost inline-flex items-center justify-center gap-2"
                      >
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        Email {CONTACT_EMAIL}
                      </a>
                      <Link href="/register" className="btn-secondary inline-flex items-center justify-center gap-2">
                        <Clock3 className="h-4 w-4" aria-hidden="true" />
                        Register for NECYPAA
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
