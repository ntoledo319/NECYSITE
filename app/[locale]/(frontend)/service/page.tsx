import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import ScrollReveal from "@/components/scroll-reveal"
import OrnateDivider from "@/components/art/ornate-divider"
import { ZOOM_MEETING_URL } from "@/lib/constants"
import { Video, Users, Heart, Sparkles, ArrowRight, Calendar } from "lucide-react"
import { GearCluster } from "@/components/art/steampunk-gears"
import PageArtAccents from "@/components/art/page-art-accents"
import CalendarSection from "@/components/calendar/calendar-section"

export const metadata: Metadata = {
  title: "Service Opportunities — NECYPAA XXXVI",
  description:
    "Get involved with NECYPAA XXXVI. Committee calendar, open service positions, Members-at-Large opportunities, and ways to support the convention.",
}

function CalendarSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-label="Loading calendar">
      <div className="flex gap-2">
        <div className="h-7 w-32 rounded-lg" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.06)" }} />
        <div className="h-7 w-20 rounded-full" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.06)" }} />
        <div className="h-7 w-18 rounded-full" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.06)" }} />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-2.5 px-2 py-1.5">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.06)" }} />
          <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.08)" }} />
          <div className="h-4 flex-1 rounded" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.04)" }} />
        </div>
      ))}
    </div>
  )
}

export default function ServicePage() {
  return (
    <div
      className="min-h-screen min-h-screen-safe flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents
        character="mad-hatter"
        accentColor="var(--nec-purple)"
        variant="full"
        dividerVariant="potion"
      />

      <div className="page-frame" role="region" aria-label="Service opportunities content">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl page-stack">

            {/* ═══════════════════════════════════════════════
                HEADER — bounded card with ghost character,
                matches events page header pattern
                ═══════════════════════════════════════════════ */}
            <header className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.74)] px-6 py-8 shadow-[0_22px_48px_rgba(44,24,16,0.08)] md:px-8 md:py-10">
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(var(--nec-pink-rgb),0) 0%, rgba(var(--nec-pink-rgb),0.48) 30%, rgba(var(--nec-purple-rgb),0.52) 72%, rgba(var(--nec-cyan-rgb),0.28) 100%)",
                }}
              />

              <div className="max-w-3xl">
                <span className="section-badge page-enter-1">Service</span>
                <h1 className="page-enter-2 mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl">
                  Service Opportunities
                </h1>
                <p className="page-enter-3 mt-4 text-lg leading-8 text-[var(--nec-muted)]">
                  NECYPAA is always looking for trusted servants to help carry the
                  work forward. Whether you want a specific position or just want
                  to show up and help — there is a place for you.
                </p>
              </div>
            </header>

            {/* ═══════════════════════════════════════════════
                MEMBERS-AT-LARGE — the hero card.
                Dark immersive treatment from the featured event
                card pattern. Fixed dark bg = poster's world.
                Hardcoded light colors for AAA contrast.
                ═══════════════════════════════════════════════ */}
            <ScrollReveal>
              <section
                aria-label="Members-at-Large"
                className="relative rounded-[1.85rem] overflow-hidden"
                style={{
                  boxShadow:
                    "0 8px 40px rgba(0,0,0,0.35), 0 0 60px rgba(var(--nec-pink-rgb),0.08), 0 0 120px rgba(var(--nec-purple-rgb),0.05)",
                }}
              >
                {/* Glow blobs — pink top-left, purple bottom-right */}
                <div
                  className="pointer-events-none absolute -top-12 -left-12 w-64 h-64 z-0"
                  aria-hidden="true"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(var(--nec-pink-rgb),0.20) 0%, rgba(var(--nec-purple-rgb),0.06) 50%, transparent 70%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute -bottom-12 -right-12 w-64 h-64 z-0"
                  aria-hidden="true"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(var(--nec-purple-rgb),0.18) 0%, rgba(var(--nec-pink-rgb),0.06) 50%, transparent 70%)",
                  }}
                />

                {/* Accent bar — 3px, pink-purple shimmer */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[3px] z-20"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(var(--nec-pink-rgb),0.6) 0%, rgba(var(--nec-purple-rgb),0.5) 50%, rgba(var(--nec-pink-rgb),0.6) 100%)",
                  }}
                />

                {/* Dark gradient — the poster's world.
                    Fixed dark bg is intentional: this card always lives
                    in the poster's color space regardless of theme.
                    Text colors below are hardcoded light for AAA contrast. */}
                <div
                  className="relative z-10 p-6 md:p-8"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(26,16,48,0.85) 0%, rgba(15,10,30,0.9) 50%, rgba(26,16,48,0.85) 100%)",
                    border: "1px solid rgba(var(--nec-pink-rgb),0.15)",
                    borderRadius: "1.85rem",
                  }}
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Text content */}
                    <div className="flex-1 min-w-0 space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "rgba(var(--nec-pink-rgb),0.15)",
                            border: "1px solid rgba(var(--nec-pink-rgb),0.30)",
                          }}
                          aria-hidden="true"
                        >
                          <Users className="w-5 h-5" style={{ color: "#D4748E" }} />
                        </div>
                        <div>
                          <p
                            className="text-[10px] uppercase tracking-[0.18em] font-bold"
                            style={{ color: "#D4748E" }}
                          >
                            Featured Service
                          </p>
                          <h2
                            className="text-2xl md:text-3xl font-black text-white"
                            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
                          >
                            Members-at-Large
                          </h2>
                        </div>
                      </div>

                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "rgba(232,223,208,0.80)" }}
                      >
                        Members-at-Large are the life and soul that keeps NECYPAA
                        moving. They pitch in where needed, bring ideas, and stay
                        connected. No title or time requirement needed.
                      </p>

                      <div
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg"
                        style={{
                          background: "rgba(var(--nec-purple-rgb),0.10)",
                          border: "1px solid rgba(var(--nec-purple-rgb),0.20)",
                          color: "#7cd4c0",
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                        Showing up consistently matters.
                      </div>
                    </div>

                    {/* Cheshire Cat — portrait with blur-glow backdrop.
                        Tail extends LEFT → placed on RIGHT side of card.
                        Visible at 0.85 opacity, not a ghost sticker. */}
                    <div className="hidden sm:block flex-shrink-0 w-28 md:w-32 relative" aria-hidden="true">
                      {/* Blur glow behind character — art as light source */}
                      <div
                        className="absolute -inset-3 rounded-2xl z-0"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(var(--nec-pink-rgb),0.25) 0%, rgba(var(--nec-purple-rgb),0.15) 50%, rgba(var(--nec-pink-rgb),0.20) 100%)",
                          filter: "blur(12px)",
                        }}
                      />
                      <div
                        className="relative z-10 rounded-xl overflow-hidden"
                        style={{
                          border: "2px solid rgba(var(--nec-pink-rgb),0.30)",
                          boxShadow:
                            "0 4px 24px rgba(0,0,0,0.4), 0 0 20px rgba(var(--nec-pink-rgb),0.12)",
                        }}
                      >
                        <Image
                          src="/images/cheshire-cat-character.webp"
                          alt=""
                          width={130}
                          height={195}
                          sizes="130px"
                          className="w-full h-auto object-contain opacity-[0.85]"
                          style={{
                            filter: "drop-shadow(0 2px 12px rgba(var(--nec-pink-rgb), 0.30))",
                          }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* ═══════════════════════════════════════════════
                CALENDAR — distinct visual zone.
                Stronger treatment than a plain card:
                3px accent bar, corner glow, border emphasis.
                ═══════════════════════════════════════════════ */}
            <ScrollReveal delay={1}>
              <section
                aria-label="Committee calendar"
                className="relative overflow-hidden rounded-[1.85rem] p-5 md:p-6"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(var(--nec-purple-rgb),0.06), rgba(var(--nec-card-rgb),0.92))",
                  border: "1px solid rgba(var(--nec-purple-rgb),0.14)",
                  boxShadow:
                    "var(--shadow-card), 0 0 40px rgba(var(--nec-purple-rgb),0.04)",
                }}
              >
                {/* Accent bar — tri-color gradient, 3px */}
                <div
                  className="absolute inset-x-0 top-0 h-[3px] pointer-events-none"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(var(--nec-purple-rgb),0.55), rgba(var(--nec-pink-rgb),0.40), rgba(var(--nec-cyan-rgb),0.35))",
                  }}
                />

                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-[var(--nec-purple)]" aria-hidden="true" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--nec-purple)]">
                    What&rsquo;s Coming Up
                  </h2>
                </div>

                <Suspense fallback={<CalendarSkeleton />}>
                  {/* @ts-expect-error Async Server Component */}
                  <CalendarSection />
                </Suspense>
              </section>
            </ScrollReveal>

            {/* ═══════════════════════════════════════════════
                DIVIDER — steampunk breathing between zones.
                Above: the pitch (MAL + calendar).
                Below: the action (get involved, opportunities).
                ═══════════════════════════════════════════════ */}
            <OrnateDivider variant="gear" color="var(--nec-purple)" />

            {/* ═══════════════════════════════════════════════
                HOW TO GET INVOLVED — CTA-focused card.
                Full width to give CTAs room to breathe.
                ═══════════════════════════════════════════════ */}
            <ScrollReveal>
              <section aria-label="How to get involved">
                <div
                  className="relative overflow-hidden rounded-[1.85rem] p-5 md:p-6"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(var(--nec-cyan-rgb),0.06), rgba(var(--nec-card-rgb),0.92))",
                    border: "1px solid rgba(var(--nec-cyan-rgb),0.16)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  {/* Accent bar */}
                  <div
                    className="absolute inset-x-0 top-0 h-[2px] pointer-events-none"
                    aria-hidden="true"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(var(--nec-cyan-rgb),0.50), rgba(var(--nec-purple-rgb),0.35))",
                    }}
                  />

                  <GearCluster className="absolute -bottom-2 -right-2 opacity-55" />

                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className="nec-icon-badge w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                    >
                      <Video className="w-4 h-4 text-[var(--nec-cyan)]" />
                    </div>
                    <h2 className="text-lg font-bold text-[var(--nec-text)]">
                      How to Get Involved
                    </h2>
                  </div>

                  <p className="text-sm leading-relaxed mb-3 text-[var(--nec-muted)]">
                    Show up to a business or committee meeting on Zoom. That&rsquo;s it.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <a
                      href={ZOOM_MEETING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nec-cta-accent inline-flex items-center justify-center gap-2 font-bold text-sm rounded-xl px-5 py-2.5 transition-all duration-200 uppercase tracking-wide text-[var(--nec-cyan)]"
                    >
                      <Video className="w-4 h-4" aria-hidden="true" />
                      Join on Zoom
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                    <Link
                      href="/register"
                      className="btn-primary !py-2.5 !px-5 !text-sm text-center"
                    >
                      Register for NECYPAA
                    </Link>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* ═══════════════════════════════════════════════
                OPEN OPPORTUNITIES + WHY GET INVOLVED
                Two-column informational cards, lighter weight.
                ═══════════════════════════════════════════════ */}
            <div className="grid gap-4 md:gap-5 md:grid-cols-2 section-atmosphere-gold">
              <ScrollReveal>
                <section aria-label="Open service opportunities">
                  <div className="h-full rounded-[1.85rem] border border-[rgba(var(--nec-cyan-rgb),0.14)] bg-[linear-gradient(145deg,rgba(var(--nec-cyan-rgb),0.05),rgba(var(--nec-card-rgb),0.90))] p-5 md:p-6 shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div
                        className="nec-icon-badge w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Sparkles className="w-4 h-4 text-[var(--nec-cyan)]" />
                      </div>
                      <h2 className="text-lg font-bold text-[var(--nec-text)]">
                        Open Opportunities
                      </h2>
                    </div>
                    <p className="text-sm leading-relaxed mb-2 text-[var(--nec-muted)]">
                      NECYPAA regularly has positions to fill across committees and
                      service areas. Openings may include elected, appointed, or other
                      roles depending on current needs.
                    </p>
                    <p className="text-sm leading-relaxed text-[var(--nec-muted)]">
                      If you are looking to get more involved, this is a great place
                      to start.
                    </p>
                  </div>
                </section>
              </ScrollReveal>

              <ScrollReveal delay={1}>
                <section aria-label="Why get involved">
                  <div className="h-full rounded-[1.85rem] border border-[rgba(var(--nec-gold-rgb),0.14)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.05),rgba(var(--nec-card-rgb),0.90))] p-5 md:p-6 shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div
                        className="nec-icon-badge-gold w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Heart className="w-4 h-4 text-[var(--nec-gold)]" />
                      </div>
                      <h2 className="text-lg font-bold text-[var(--nec-text)]">
                        Why Get Involved?
                      </h2>
                    </div>

                    <ul className="space-y-2">
                      {[
                        "Support the work of the committee",
                        "Help plan and carry out events",
                        "Grow your network",
                        "Meet other young people in AA",
                        "Do some really cool stuff",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <ArrowRight
                            className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[var(--nec-gold)]"
                            aria-hidden="true"
                          />
                          <span className="text-sm leading-relaxed text-[var(--nec-muted)]">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
