import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import { ZOOM_MEETING_URL } from "@/lib/constants"
import { Video, Users, Heart, Sparkles, ArrowRight } from "lucide-react"
import { GearCluster } from "@/components/art/steampunk-gears"
import PageArtAccents from "@/components/art/page-art-accents"

export const metadata: Metadata = {
  title: "Service Opportunities — NECYPAA XXXVI",
  description:
    "Get involved with NECYPAA XXXVI. Open service positions, Members-at-Large opportunities, and ways to support the convention.",
}

const whyItems = [
  "Support the work of the committee",
  "Help plan and carry out events",
  "Grow your network",
  "Meet other young people in AA",
  "Do some really cool stuff",
]

export default function ServicePage() {
  return (
    <div
      className="min-h-screen min-h-screen-safe flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents
        character="mad-hatter"
        accentColor="var(--nec-purple)"
        dividerVariant="potion"
      />

      <div className="flex-1 pt-24 pb-20 md:pb-12 relative z-10" role="region" aria-label="Service opportunities content">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div className="max-w-3xl">
                <span className="section-badge mb-4 inline-block">Service</span>
                <h1 className="section-heading mb-4">Service Opportunities</h1>
                <p className="text-lg leading-relaxed max-w-2xl text-[var(--nec-muted)]">
                  NECYPAA is always looking for trusted servants to help carry the
                  work forward. Whether you are interested in a specific position or
                  just want to get involved as a Member-at-Large, there is a place
                  for you to plug in. Service is how we build the committee, support
                  the fellowship, and help make NECYPAA happen.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-purple-rgb),0.08),rgba(var(--nec-card-rgb),0.92))] p-5 shadow-[0_20px_48px_rgba(44,24,16,0.08)]">
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <div className="absolute left-6 top-6 h-20 w-20 rounded-full border border-[rgba(var(--nec-purple-rgb),0.16)]" />
                  <div className="absolute right-6 top-8 h-12 w-24 rounded-[1.2rem] border border-[rgba(var(--nec-cyan-rgb),0.16)]" />
                  <div className="absolute bottom-6 left-8 h-14 w-28 rounded-[1.1rem] border border-[rgba(var(--nec-gold-rgb),0.16)]" />
                </div>

                <div className="relative grid gap-4 sm:grid-cols-[1fr_0.92fr] sm:items-end">
                  <div className="grid gap-3">
                    {[0, 1, 2].map((item) => (
                      <div
                        key={item}
                        className={`rounded-[1.1rem] border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.88)] px-4 py-4 ${
                          item === 1 ? "translate-x-5" : item === 2 ? "-translate-x-1" : ""
                        }`}
                      >
                        <div className="h-2 w-16 rounded-full bg-[rgba(var(--nec-purple-rgb),0.20)]" />
                        <div className="mt-3 h-2 w-full rounded-full bg-[rgba(var(--nec-purple-rgb),0.12)]" />
                        <div className="mt-2 h-2 w-4/5 rounded-full bg-[rgba(var(--nec-cyan-rgb),0.10)]" />
                      </div>
                    ))}
                  </div>

                  <div className="relative min-h-[18rem] overflow-hidden rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.88)] p-2">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(var(--nec-purple-rgb),0.12),transparent)]" aria-hidden="true" />
                    <Image
                      src="/images/mad-hatter-portal.jpg"
                      alt=""
                      width={900}
                      height={1200}
                      sizes="(min-width: 640px) 320px, 100vw"
                      className="h-full w-full rounded-[1.1rem] object-cover"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
              <div className="space-y-6 lg:sticky lg:top-28">
                <section aria-label="Members-at-Large">
                  <div
                    className="relative rounded-[2rem] overflow-hidden border border-[rgba(var(--nec-pink-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-pink-rgb),0.08),rgba(var(--nec-card-rgb),0.92))] p-6 md:p-8 shadow-[0_20px_48px_rgba(44,24,16,0.08)]"
                  >
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-1"
                      aria-hidden="true"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(var(--nec-purple-rgb),0.40) 0%, rgba(var(--nec-pink-rgb),0.30) 50%, rgba(var(--nec-purple-rgb),0.40) 100%)",
                      }}
                    />

                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="nec-icon-badge-pink w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Users className="w-5 h-5 text-[var(--nec-pink)]" />
                      </div>
                      <h2 className="text-xl font-bold text-[var(--nec-text)]">
                        Members-at-Large
                      </h2>
                    </div>

                    <p className="text-sm leading-relaxed mb-3 text-[var(--nec-muted)]">
                      Not ready for a position yet? We also always need
                      Members-at-Large.
                    </p>
                    <p className="text-sm leading-relaxed mb-3 text-[var(--nec-muted)]">
                      Members-at-Large are the life and soul that keeps NECYPAA
                      moving. They help support committee work, do stuff at events,
                      bring ideas, pitch in where needed, and stay connected to the
                      larger effort. You do not need to hold a specific title to be
                      useful here. There is no time requirement.
                    </p>
                    <p className="text-sm font-semibold leading-relaxed text-[var(--nec-cyan)]">
                      Showing up consistently and being willing to help matters.
                    </p>

                    <div className="hidden md:block absolute -bottom-5 -right-5 w-36 h-36 opacity-[0.12] pointer-events-none z-0" aria-hidden="true">
                      <Image
                        src="/images/cheshire-cat-character.png"
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

                <section aria-label="How to get involved">
                  <div
                    className="relative overflow-hidden rounded-[1.85rem] border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-cyan-rgb),0.07),rgba(var(--nec-card-rgb),0.92))] p-6 md:p-8 shadow-[0_20px_48px_rgba(44,24,16,0.08)]"
                  >
                    <GearCluster className="absolute -bottom-2 -right-2 opacity-55" />

                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="nec-icon-badge w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Video className="w-5 h-5 text-[var(--nec-cyan)]" />
                      </div>
                      <h2 className="text-xl font-bold text-[var(--nec-text)]">
                        How to Get Involved
                      </h2>
                    </div>

                    <p className="text-sm leading-relaxed mb-5 text-[var(--nec-muted)]">
                      If you are interested in serving, here are a few ways to jump
                      in:
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="nec-pill-subtle flex items-start gap-3 p-3 rounded-xl">
                        <span className="text-xs font-bold uppercase tracking-widest mt-0.5 flex-shrink-0 text-[var(--nec-cyan)]">
                          01
                        </span>
                        <p className="text-sm text-[var(--nec-text)]">
                          Attend a <strong className="text-[var(--nec-text)]">business meeting</strong> on Zoom
                        </p>
                      </div>
                      <div className="nec-pill-subtle flex items-start gap-3 p-3 rounded-xl">
                        <span className="text-xs font-bold uppercase tracking-widest mt-0.5 flex-shrink-0 text-[var(--nec-cyan)]">
                          02
                        </span>
                        <p className="text-sm text-[var(--nec-text)]">
                          Attend a <strong className="text-[var(--nec-text)]">committee meeting</strong> also on Zoom
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
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
                        Register for NECYPAA — $40
                      </Link>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section aria-label="Open service opportunities">
                  <div
                    className="rounded-[1.85rem] border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-cyan-rgb),0.07),rgba(var(--nec-card-rgb),0.92))] p-6 md:p-8 shadow-[0_20px_48px_rgba(44,24,16,0.08)]"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="nec-icon-badge w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Sparkles className="w-5 h-5 text-[var(--nec-cyan)]" />
                      </div>
                      <h2 className="text-xl font-bold text-[var(--nec-text)]">
                        Open Service Opportunities
                      </h2>
                    </div>
                    <p className="text-sm leading-relaxed mb-3 text-[var(--nec-muted)]">
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

                <section aria-label="Why get involved">
                  <div
                    className="rounded-[1.85rem] border border-[rgba(var(--nec-gold-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.06),rgba(var(--nec-card-rgb),0.92))] p-6 md:p-8 shadow-[0_20px_48px_rgba(44,24,16,0.08)]"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="nec-icon-badge-gold w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                      >
                        <Heart className="w-5 h-5 text-[var(--nec-gold)]" />
                      </div>
                      <h2 className="text-xl font-bold text-[var(--nec-text)]">
                        Why Get Involved?
                      </h2>
                    </div>

                    <p className="text-sm leading-relaxed mb-4 text-[var(--nec-muted)]">
                      Service with NECYPAA is a chance to:
                    </p>

                    <div className="grid gap-3 md:grid-cols-2">
                      {whyItems.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 rounded-[1.05rem] border border-[rgba(var(--nec-gold-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.84)] px-4 py-4"
                        >
                          <ArrowRight
                            className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--nec-purple)]"
                            aria-hidden="true"
                          />
                          <span className="text-sm leading-relaxed text-[var(--nec-muted)]">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <p className="text-center text-sm italic leading-relaxed text-[var(--nec-muted)]">
                  We need trusted servants, and we always need more
                  Members-at-Large.
                </p>
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
