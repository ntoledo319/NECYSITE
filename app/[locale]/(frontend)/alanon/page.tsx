import type { Metadata } from "next"
import Link from "next/link"
import { NECYPAA_STATES } from "@/lib/data/states"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import { ExternalLink, Hotel, Sparkles, FileText } from "lucide-react"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import AlAnonInfoAccordion from "@/components/alanon-info-accordion"

export const metadata: Metadata = {
  title: "Al-Anon & Alateen — NECYPAA XXXVI",
  description:
    "Resources for friends and family of alcoholics. Al-Anon and Alateen information, meetings at NECYPAA XXXVI, and state resources.",
}

export default function AlAnonPage() {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: "var(--nec-navy)" }}>
      {/* ── Mad Realm edge bleed: top ────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 120% at 50% -20%, rgba(124,58,237,0.18) 0%, rgba(192,38,211,0.08) 40%, transparent 100%)",
        }}
      />
      {/* ── Mad Realm edge bleed: left ───────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-48 z-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to right, rgba(124,58,237,0.10) 0%, rgba(192,38,211,0.04) 40%, transparent 100%)",
        }}
      />
      {/* ── Mad Realm edge bleed: right ──────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-48 z-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to left, rgba(124,58,237,0.10) 0%, rgba(192,38,211,0.04) 40%, transparent 100%)",
        }}
      />
      {/* ── Mad Realm edge bleed: bottom ─────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 120% at 50% 120%, rgba(124,58,237,0.14) 0%, rgba(192,38,211,0.06) 40%, transparent 100%)",
        }}
      />

      <main id="main-content" className="flex-1 pt-24 pb-20 md:pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* ── Al-Anon Logo & Header ──────────────────────────── */}
            <div className="text-center mb-10">
              {/* Al-Anon participation logo */}
              <div className="flex justify-center mb-6">
                <div
                  className="relative w-24 h-24 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Al-Anon Family Groups">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(100,140,200,0.3)" strokeWidth="2" />
                    <polygon points="50,12 88,72 12,72" fill="none" stroke="#4a7ab5" strokeWidth="2.5" />
                    <polygon points="50,88 12,28 88,28" fill="none" stroke="#c0392b" strokeWidth="2.5" />
                    <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(100,140,200,0.4)" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <span className="section-badge mb-4 inline-block">Al-Anon & Alateen</span>
              <h1 className="section-heading mb-3">Al-Anon / Alateen</h1>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--nec-muted)" }}>
                Resources for friends and family members affected by someone else&apos;s drinking.
              </p>
            </div>

            {/* ── Tradition 6 Disclaimer ─────────────────────────── */}
            <div
              className="rounded-xl p-5 mb-10 text-sm leading-relaxed"
              style={{
                background: "rgba(251,191,36,0.05)",
                border: "1px solid rgba(251,191,36,0.15)",
                color: "var(--nec-muted)",
              }}
            >
              <p>
                <strong style={{ color: "var(--nec-gold)" }}>A note on Tradition 6:</strong>{" "}
                NECYPAA is not affiliated with Al-Anon Family Groups, Inc. This page is provided as a
                resource for friends and family of alcoholics attending or interested in our convention.
                The links below are outbound resources — you will be leaving our site.
              </p>
            </div>

            {/* ── Info Accordion (What Is / Who Are / Spouse) ────── */}
            <section className="mb-10" aria-label="About Al-Anon and Alateen">
              <AlAnonInfoAccordion />
            </section>

            {/* ── Quiz Banner ────────────────────────────────────── */}
            <a
              href="https://al-anon.org/newcomers/self-quiz/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl p-6 md:p-8 mb-10 text-center transition-all hover:scale-[1.005] group"
              style={{
                background: "linear-gradient(135deg, rgba(74,122,181,0.15) 0%, rgba(192,57,43,0.10) 100%)",
                border: "1px solid rgba(100,140,200,0.25)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              <p
                className="text-2xl md:text-3xl font-black text-white mb-2"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
              >
                Is Al-Anon for Me?
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--nec-muted)" }}>
                Not sure if Al-Anon is right for you? Take the self-assessment quiz.
              </p>
              <span
                className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-lg text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, rgba(74,122,181,0.35) 0%, rgba(100,140,200,0.45) 100%)",
                  border: "1px solid rgba(100,140,200,0.35)",
                  boxShadow: "0 2px 12px rgba(100,140,200,0.2)",
                }}
              >
                Take the Quiz <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </span>
            </a>

            {/* ── NECYPAA Program Teaser ─────────────────────────── */}
            <section
              className="rounded-xl p-6 md:p-8 mb-10"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(15,10,30,0.5) 50%, rgba(192,38,211,0.04) 100%)",
                border: "1px solid rgba(124,58,237,0.15)",
              }}
              aria-label="Al-Anon and Alateen at NECYPAA XXXVI"
            >
              <div className="text-center space-y-4">
                <Sparkles className="w-8 h-8 mx-auto" style={{ color: "var(--nec-gold)" }} aria-hidden="true" />
                <h2
                  className="text-xl md:text-2xl font-black text-white"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                >
                  Al-Anon & Alateen at NECYPAA XXXVI
                </h2>
                <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: "var(--nec-text)" }}>
                  Al-Anon and Alateen meetings will be part of NECYPAA XXXVI! We have an extensive
                  program planned with workshops, keynote speakers, panels, and activities.
                  The full program is coming soon!
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    href="/register"
                    className="btn-primary inline-flex items-center justify-center gap-2"
                  >
                    Pre-Register Today
                  </Link>
                  <a
                    href={HOTEL_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    <Hotel className="w-4 h-4" aria-hidden="true" />
                    Book Your Hotel Room
                  </a>
                </div>
              </div>
            </section>

            {/* ── Alateen Paperwork Placeholder ──────────────────── */}
            <section
              className="rounded-xl p-6 md:p-8 mb-10 text-center"
              style={{
                background: "rgba(15,10,30,0.45)",
                border: "1px dashed rgba(180,140,210,0.25)",
              }}
              aria-label="Alateen paperwork information"
            >
              <FileText className="w-8 h-8 mx-auto mb-3" style={{ color: "#c4a5d6" }} aria-hidden="true" />
              <h2
                className="text-lg font-bold text-white mb-2"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
              >
                Alateen Paperwork
              </h2>
              <p className="text-sm max-w-md mx-auto" style={{ color: "var(--nec-muted)" }}>
                The portal is opening soon. Alateen participation forms and
                information are on their way — stay tuned for details.
              </p>
            </section>

            {/* ── Al-Anon Meeting Finder ─────────────────────────── */}
            <section
              className="rounded-xl p-6 md:p-8 mb-10 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(100,140,200,0.06) 0%, rgba(15,10,30,0.5) 100%)",
                border: "1px solid rgba(100,140,200,0.15)",
              }}
            >
              <h2 className="text-xl font-bold text-white mb-2">Find an Al-Anon Meeting</h2>
              <p className="text-sm mb-4" style={{ color: "var(--nec-muted)" }}>
                Search for Al-Anon meetings near you or anywhere in the world.
              </p>
              <a
                href="https://al-anon.org/al-anon-meetings/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-lg transition-all text-white"
                style={{
                  background: "linear-gradient(135deg, rgba(100,140,200,0.25) 0%, rgba(70,110,180,0.35) 100%)",
                  border: "1px solid rgba(100,140,200,0.3)",
                  boxShadow: "0 2px 12px rgba(100,140,200,0.15)",
                }}
              >
                Al-Anon Meeting Finder <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </section>

            {/* ── Al-Anon State Grid ─────────────────────────────── */}
            <section className="mb-10" aria-label="Al-Anon resources by state">
              <h2
                className="text-lg font-bold uppercase tracking-widest mb-2 pl-1"
                style={{ color: "#93b5e0", textShadow: "0 0 12px rgba(100,140,200,0.15)" }}
              >
                Al-Anon by State
              </h2>
              <p className="text-sm mb-6 pl-1" style={{ color: "var(--nec-muted)" }}>
                Find your state&apos;s Al-Anon resources. Each link takes you to that state&apos;s
                Al-Anon website.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {NECYPAA_STATES.map((state) => (
                  <a
                    key={state.abbreviation}
                    href={state.alanon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl p-4 text-center transition-all duration-200"
                    style={{
                      background: "rgba(15,10,30,0.4)",
                      border: "1px solid rgba(100,140,200,0.10)",
                    }}
                  >
                    <span
                      className="block text-2xl font-black mb-1 transition-colors"
                      style={{ color: "var(--nec-text)" }}
                    >
                      {state.abbreviation}
                    </span>
                    <span className="block text-xs font-medium" style={{ color: "var(--nec-muted)" }}>
                      {state.name}
                    </span>
                    <ExternalLink
                      className="w-3 h-3 mx-auto mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#93b5e0" }}
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </section>

            {/* ── Alateen State Grid ─────────────────────────────── */}
            <section className="mb-10" aria-label="Alateen resources by state">
              <h2
                className="text-lg font-bold uppercase tracking-widest mb-2 pl-1"
                style={{ color: "#c4a5d6", textShadow: "0 0 12px rgba(180,140,210,0.12)" }}
              >
                Alateen by State
              </h2>
              <p className="text-sm mb-6 pl-1" style={{ color: "var(--nec-muted)" }}>
                Alateen is for younger family members and friends of alcoholics. Some states share an
                Al-Anon/Alateen site; others have a dedicated Alateen page.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {NECYPAA_STATES.map((state) => {
                  const url = state.alanon.alateenUrl || state.alanon.url
                  return (
                    <a
                      key={state.abbreviation}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-xl p-4 text-center transition-all duration-200"
                      style={{
                        background: "rgba(15,10,30,0.4)",
                        border: "1px solid rgba(180,140,210,0.10)",
                      }}
                    >
                      <span
                        className="block text-2xl font-black mb-1 transition-colors"
                        style={{ color: "var(--nec-text)" }}
                      >
                        {state.abbreviation}
                      </span>
                      <span className="block text-xs font-medium" style={{ color: "var(--nec-muted)" }}>
                        {state.name}
                      </span>
                      <ExternalLink
                        className="w-3 h-3 mx-auto mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#c4a5d6" }}
                        aria-hidden="true"
                      />
                    </a>
                  )
                })}
              </div>
            </section>

          </div>
        </div>
      </main>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
