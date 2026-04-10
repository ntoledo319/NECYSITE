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
    <div className="space-y-4 animate-pulse" aria-label="Loading calendar">
      <div className="flex gap-2">
        <div className="h-8 w-36 rounded-lg" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.06)" }} />
        <div className="h-8 w-24 rounded-full" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.06)" }} />
        <div className="h-8 w-20 rounded-full" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.06)" }} />
      </div>
      <div
        className="rounded-[1.85rem] border p-5 h-24"
        style={{ borderColor: "rgba(var(--nec-purple-rgb), 0.08)", backgroundColor: "rgba(var(--nec-card-rgb), 0.6)" }}
      >
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 rounded-xl flex-shrink-0" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.06)" }} />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-16 rounded" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.08)" }} />
            <div className="h-4 w-48 rounded" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.06)" }} />
            <div className="h-3 w-32 rounded" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.04)" }} />
          </div>
        </div>
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-3 px-3 py-2">
          <div className="w-6 h-4 rounded" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.06)" }} />
          <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: "rgba(var(--nec-purple-rgb), 0.08)" }} />
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

      {/* ── Mad Hatter portal ghost — atmospheric backdrop ── */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[50vw] max-w-[600px] h-[70vh] opacity-[0.04] z-0 hidden lg:block"
        aria-hidden="true"
      >
        <Image
          src="/images/mad-hatter-portal.webp"
          alt=""
          width={900}
          height={1200}
          sizes="50vw"
          className="w-full h-full object-cover object-top"
          style={{ maskImage: "linear-gradient(to bottom, black 30%, transparent 90%)" }}
          aria-hidden="true"
        />
      </div>

      {/* ── Atmospheric radial glows ── */}
      <div
        className="pointer-events-none absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full z-0"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse, rgba(var(--nec-purple-rgb), 0.04) 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute top-[40%] right-[5%] w-[400px] h-[400px] rounded-full z-0"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse, rgba(var(--nec-pink-rgb), 0.03) 0%, transparent 70%)" }}
      />

      <div className="page-frame relative z-10" role="region" aria-label="Service opportunities content">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl space-y-4 md:space-y-5">

            {/* ═══ HERO — copy + calendar left, MAL right ═══ */}
            <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">

              <div className="space-y-4">
                <div>
                  <span className="section-badge page-enter-1 mb-2 inline-block">Service</span>
                  <h1 className="section-heading page-enter-2 mb-2">
                    Service Opportunities
                  </h1>
                  <p className="page-enter-3 text-sm leading-relaxed max-w-xl text-[var(--nec-muted)]">
                    NECYPAA is always looking for trusted servants to help carry the
                    work forward. Whether you want a specific position or just want
                    to show up and help — there is a place for you.
                  </p>
                </div>

                <section aria-label="Committee calendar" className="page-enter-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="nec-icon-badge w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[var(--nec-purple)]" />
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--nec-purple)]">
                      What&rsquo;s Coming Up
                    </h2>
                  </div>

                  <Suspense fallback={<CalendarSkeleton />}>
                    {/* @ts-expect-error Async Server Component */}
                    <CalendarSection />
                  </Suspense>
                </section>
              </div>

              <div className="space-y-4 lg:sticky lg:top-24">
                <ScrollReveal>
                  <section aria-label="Members-at-Large" className="section-atmosphere-pink">
                    <div
                      className="relative rounded-[1.85rem] overflow-hidden border border-[rgba(var(--nec-pink-rgb),0.18)] bg-[linear-gradient(145deg,rgba(var(--nec-pink-rgb),0.10),rgba(var(--nec-card-rgb),0.92))] p-5 md:p-6 shadow-[var(--shadow-card)]"
                    >
                      {/* Accent bar — thicker, more visible */}
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
                        aria-hidden="true"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(var(--nec-purple-rgb),0.40), rgba(var(--nec-pink-rgb),0.50), rgba(var(--nec-purple-rgb),0.40))",
                        }}
                      />

                      <div className="flex items-center gap-2.5 mb-3">
                        <div
                          className="nec-icon-badge-pink w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          aria-hidden="true"
                        >
                          <Users className="w-4 h-4 text-[var(--nec-pink)]" />
                        </div>
                        <h2 className="text-lg font-bold text-[var(--nec-text)]">
                          Members-at-Large
                        </h2>
                      </div>

                      <p className="text-sm leading-relaxed mb-2 text-[var(--nec-muted)]">
                        Not ready for a position yet? We also always need
                        Members-at-Large.
                      </p>
                      <p className="text-sm leading-relaxed mb-2 text-[var(--nec-muted)]">
                        Members-at-Large are the life and soul that keeps NECYPAA
                        moving. They help support committee work, do stuff at events,
                        bring ideas, pitch in where needed, and stay connected to the
                        larger effort. No title or time requirement needed.
                      </p>
                      <p className="text-sm font-semibold leading-relaxed text-[var(--nec-cyan)]">
                        Showing up consistently and being willing to help matters.
                      </p>

                      {/* Cheshire Cat — visible on all screens */}
                      <div className="absolute -bottom-3 -right-3 w-32 h-32 opacity-[0.18] pointer-events-none z-0" aria-hidden="true">
                        <Image
                          src="/images/cheshire-cat-character.webp"
                          alt=""
                          width={150}
                          height={225}
                          sizes="150px"
                          className="w-full h-full object-contain"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </section>
                </ScrollReveal>

                <ScrollReveal delay={1}>
                  <section aria-label="How to get involved">
                    <div
                      className="relative overflow-hidden rounded-[1.85rem] border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-cyan-rgb),0.07),rgba(var(--nec-card-rgb),0.92))] p-5 md:p-6 shadow-[var(--shadow-card)]"
                    >
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

                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={ZOOM_MEETING_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="nec-cta-accent inline-flex items-center justify-center gap-2 font-bold text-sm rounded-xl px-5 py-2.5 transition-all duration-200 uppercase tracking-wide text-[var(--nec-cyan)]"
                        >
                          <Video className="w-4 h-4" aria-hidden="true" />
                          Join on Zoom<span className="sr-only"> (opens in new tab)</span>
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
              </div>
            </div>

            {/* ═══════════════════════════════════════════════
                DIVIDER — ornate steampunk, Mad Realm energy
                ═══════════════════════════════════════════════ */}
            <OrnateDivider variant="gear" color="var(--nec-purple)" className="-my-1" />

            <div className="grid gap-4 md:gap-5 md:grid-cols-2 section-atmosphere-gold relative">
              {/* Caterpillar ghost — bottom section atmosphere */}
              <div className="pointer-events-none absolute -bottom-8 -left-8 w-28 h-28 opacity-[0.08] z-0 hidden md:block" aria-hidden="true">
                <Image
                  src="/images/caterpillar-character.webp"
                  alt=""
                  width={100}
                  height={150}
                  sizes="100px"
                  className="w-full h-full object-contain"
                  aria-hidden="true"
                />
              </div>
              <ScrollReveal>
                <section aria-label="Open service opportunities">
                  <div
                    className="h-full rounded-[1.85rem] border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-cyan-rgb),0.07),rgba(var(--nec-card-rgb),0.92))] p-5 md:p-6 shadow-[var(--shadow-card)]"
                  >
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
                  <div
                    className="h-full rounded-[1.85rem] border border-[rgba(var(--nec-gold-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.06),rgba(var(--nec-card-rgb),0.92))] p-5 md:p-6 shadow-[var(--shadow-card)]"
                  >
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

                    <ul className="space-y-2.5">
                      {[
                        "Support the work of the committee",
                        "Help plan and carry out events",
                        "Grow your network",
                        "Meet other young people in AA",
                        "Do some really cool stuff",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
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
