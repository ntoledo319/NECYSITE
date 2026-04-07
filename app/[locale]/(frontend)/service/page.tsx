import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Heart, Sparkles, Users, Video } from "lucide-react"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import { ZOOM_MEETING_URL } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"

export const metadata: Metadata = {
  title: "Service Opportunities — NECYPAA XXXVI",
  description:
    "Get involved with NECYPAA XXXVI. Open service positions, Members-at-Large opportunities, and ways to support the convention.",
}

const contributionLines = [
  "Support the work of the committee",
  "Help plan and carry out events",
  "Build real friendships through service",
  "Carry the convention with more than just attendance",
]

const serviceLanes = [
  {
    title: "Open positions",
    body: "There are chairs, support roles, and practical holes that open up as the committee keeps moving. This is where people step into responsibility.",
    accent: "var(--nec-purple)",
    border: "rgba(var(--nec-purple-rgb),0.14)",
    bg: "rgba(var(--nec-purple-rgb),0.05)",
  },
  {
    title: "Members-at-Large",
    body: "No title required. Just show up, stay close, help at events, and become part of the engine that keeps NECYPAA alive between business meetings.",
    accent: "var(--nec-pink)",
    border: "rgba(var(--nec-pink-rgb),0.14)",
    bg: "rgba(var(--nec-pink-rgb),0.05)",
  },
  {
    title: "Committee meetings",
    body: "Zoom meetings are the easiest doorway in. If you want to understand the rhythm of host, start where the actual work gets discussed.",
    accent: "var(--nec-cyan)",
    border: "rgba(var(--nec-cyan-rgb),0.14)",
    bg: "rgba(var(--nec-cyan-rgb),0.05)",
  },
]

export default function ServicePage() {
  return (
    <div className="relative flex min-h-screen min-h-screen-safe flex-col" style={{ backgroundColor: "var(--nec-navy)" }}>
      <PageArtAccents character="mad-hatter" accentColor="var(--nec-purple)" dividerVariant="potion" />

      <div className="relative z-10 flex-1 pb-20 pt-24 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-10">
            <header className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-end">
              <div className="max-w-3xl">
                <span className="section-badge inline-flex">Service</span>
                <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl">
                  The convention gets built by people who keep showing up.
                </h1>
                <p className="mt-4 text-lg leading-8 text-[var(--nec-muted)]">
                  NECYPAA is always looking for trusted servants. Some people step into a role. Some become Members-at-Large.
                  Both matter. Service is how this whole thing moves from poster art into an actual weekend.
                </p>
              </div>

              <aside className="rounded-[1.85rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[linear-gradient(135deg,rgba(var(--nec-card-rgb),0.88),rgba(var(--nec-purple-rgb),0.05))] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                  Quickest Way In
                </p>
                <h2 className="mt-3 text-xl font-semibold text-[var(--nec-text)]">Join a meeting before you overthink it.</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--nec-muted)]">
                  The cleanest first move is to show up on Zoom, listen, meet people, and let the next right service ask reveal itself.
                </p>
              </aside>
            </header>

            <section className="grid gap-4 md:grid-cols-3" aria-label="Ways into service">
              {serviceLanes.map((lane) => (
                <article
                  key={lane.title}
                  className="rounded-[1.6rem] border px-5 py-5 shadow-[0_16px_34px_rgba(44,24,16,0.06)]"
                  style={{
                    background: lane.bg,
                    borderColor: lane.border,
                  }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: lane.accent }}>
                    {lane.title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--nec-muted)]">{lane.body}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
              <article className="rounded-[1.85rem] border border-[rgba(var(--nec-gold-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.86)] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(var(--nec-gold-rgb),0.16)] bg-[rgba(var(--nec-gold-rgb),0.06)]">
                    <Heart className="h-5 w-5 text-[var(--nec-gold)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                      Why it is worth it
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-[var(--nec-text)]">Service pays people back in strange ways.</h2>
                  </div>
                </div>

                <ul className="mt-5 space-y-3">
                  {contributionLines.map((line) => (
                    <li key={line} className="flex items-start gap-3 text-sm leading-6 text-[var(--nec-muted)]">
                      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--nec-purple)]" aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-[1.85rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.86)] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[rgba(var(--nec-cyan-rgb),0.06)]">
                    <Sparkles className="h-5 w-5 text-[var(--nec-cyan)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-cyan)]">
                      How to jump in
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-[var(--nec-text)]">Two useful next steps, no ceremony required.</h2>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-[1.25rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.92)] px-4 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">01</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--nec-text)]">Attend a business meeting on Zoom</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
                      Learn what the committee is handling right now, hear what is open, and meet the people actually carrying the work.
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-[rgba(var(--nec-pink-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.92)] px-4 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-pink)]">02</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--nec-text)]">Stay close as a Member-at-Large</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
                      You do not need a title to be essential. Consistency and willingness still change what this committee can do.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={ZOOM_MEETING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    <Video className="h-4 w-4" aria-hidden="true" />
                    Join on Zoom<span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <Link href="/register" className="btn-ghost inline-flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    Register for NECYPAA
                  </Link>
                </div>
              </article>
            </section>

            <p className="text-center text-sm italic leading-7 text-[var(--nec-muted)]">
              Trusted servants build conventions. Members-at-Large make them feel alive.
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
