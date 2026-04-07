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
      className="min-h-screen min-h-screen-safe flex flex-col relative"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      <PageArtAccents character="mad-hatter" accentColor="var(--nec-purple)" dividerVariant="potion" />
      <div className="flex-1 pt-24 pb-20 md:pb-12 relative z-10" role="region" aria-label="Service opportunities content">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* ── Page Header ───────────────────────────────────────── */}
          <div className="text-center mb-14">
            <span className="section-badge mb-4 inline-block">Service</span>
            <h1 className="section-heading mb-4">Service Opportunities</h1>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto text-[var(--nec-muted)]">
              NECYPAA is always looking for trusted servants to help carry the
              work forward. Whether you are interested in a specific position or
              just want to get involved as a Member-at-Large, there is a place
              for you to plug in. Service is how we build the committee, support
              the fellowship, and help make NECYPAA happen.
            </p>
          </div>

          {/* ── Open Service Opportunities ─────────────────────────── */}
          <section aria-label="Open service opportunities" className="mb-12">
            <div
              className="nec-card p-6 md:p-8"
              style={{
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
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

          {/* ── Members-at-Large ───────────────────────────────────── */}
          <section aria-label="Members-at-Large" className="mb-12">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow:
                  "0 8px 40px rgba(0,0,0,0.35), 0 0 60px rgba(124,58,237,0.08)",
              }}
            >
              {/* Glow */}
              <div
                className="nec-glow-blob absolute -top-10 -left-10 w-56 h-56 z-0"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
                }}
              />
              <div
                className="nec-glow-blob absolute -bottom-10 -right-10 w-56 h-56 z-0"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle, rgba(192,38,211,0.14) 0%, transparent 70%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1 z-20"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(124,58,237,0.6) 0%, rgba(192,38,211,0.5) 50%, rgba(124,58,237,0.6) 100%)",
                }}
              />

              <div className="nec-featured-card relative z-10 p-6 md:p-8">
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

                {/* Cheshire Cat character accent */}
                <div className="hidden md:block absolute -bottom-4 -right-4 w-32 h-32 opacity-[0.12] pointer-events-none z-0" aria-hidden="true">
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
            </div>
          </section>

          {/* ── Why Get Involved ───────────────────────────────────── */}
          <section aria-label="Why get involved" className="mb-12">
            <div
              className="nec-card p-6 md:p-8"
              style={{
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
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

              <ul className="space-y-2.5 mb-2">
                {whyItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ArrowRight
                      className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--nec-purple)]"
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

          {/* ── How to Get Involved ────────────────────────────────── */}
          <section aria-label="How to get involved" className="mb-12">
            <div
              className="nec-card p-6 md:p-8 relative overflow-hidden"
              style={{
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            >
              {/* Steampunk gear accent */}
              <GearCluster className="absolute -bottom-2 -right-2 opacity-60" />
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
                  Register for NECYPAA — $40
                </Link>
              </div>
            </div>
          </section>

          {/* ── Closing ────────────────────────────────────────────── */}
          <p className="text-center text-sm italic leading-relaxed text-[var(--nec-muted)]">
            We need trusted servants, and we always need more
            Members-at-Large.
          </p>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
