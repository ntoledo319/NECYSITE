import type { Metadata } from "next"
import Link from "next/link"
import { NECYPAA_STATES } from "@/lib/data/states"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import Image from "next/image"
import { ExternalLink, Hotel, Sparkles, FileText, Heart } from "lucide-react"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import AlAnonInfoAccordion from "@/components/alanon-info-accordion"
import YoungPersonsAlAnonDirectory from "@/components/young-persons-alanon-directory"

export const metadata: Metadata = {
  title: "Al-Anon & Alateen — NECYPAA XXXVI",
  description:
    "Resources for friends and family of alcoholics. Al-Anon and Alateen information, meetings at NECYPAA XXXVI, and state resources.",
}

export default function AlAnonPage() {
  return (
    <div className="min-h-screen min-h-screen-safe flex flex-col relative" style={{ backgroundColor: "var(--nec-navy)" }}>
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

      <div className="flex-1 pt-24 pb-20 md:pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* ── Al-Anon Logo & Header ──────────────────────────── */}
            <header className="text-center mb-12 md:mb-14">
              <span className="section-badge-alanon mb-6 inline-block" role="doc-subtitle">Al-Anon & Alateen</span>
              {/* Conference-approved Al-Anon Family Groups logo (adaptive for light/dark modes) */}
              <div className="flex justify-center mb-6 md:mb-8">
                <Image
                  src="/images/Al-anon-eng-logo-dark.svg"
                  alt="Al-Anon Family Groups — Hope and help for families and friends of alcoholics"
                  width={480}
                  height={117}
                  className="alanon-logo h-auto w-auto max-w-[280px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px]"
                  priority
                />
              </div>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-3"
                style={{ color: "var(--alanon-blue)" }}
              >
                Resources &amp; Support
              </h1>
              <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4" style={{ color: "var(--nec-muted)" }}>
                For friends and family members affected by someone else&apos;s drinking.
              </p>
            </header>

            {/* ── Tradition 6 Disclaimer ─────────────────────────── */}
            <aside
              className="rounded-xl p-4 sm:p-5 mb-8 md:mb-10 text-sm leading-relaxed"
              style={{
                background: "rgba(251,191,36,0.05)",
                border: "1px solid rgba(251,191,36,0.15)",
                color: "var(--nec-muted)",
              }}
              role="note"
              aria-label="Tradition 6 disclaimer"
            >
              <p>
                <strong style={{ color: "var(--nec-gold)" }}>A note on Tradition 6:</strong>{" "}
                NECYPAA is not affiliated with Al-Anon Family Groups, Inc. This page is provided as a
                resource for friends and family of alcoholics attending or interested in our convention.
                The links below are outbound resources — you will be leaving our site.
              </p>
            </aside>

            {/* ── Info Accordion (What Is / Who Are / Spouse) ────── */}
            <section className="mb-10" aria-label="About Al-Anon and Alateen">
              <AlAnonInfoAccordion />
            </section>

            {/* ── Quiz Banners (Dual Pattern: Adults & Teens) ─────── */}
            <section className="mb-8 md:mb-10" aria-label="Self-assessment quizzes">
              <h2 className="sr-only">Is Al-Anon or Alateen Right for You?</h2>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Al-Anon Quiz (Adults) */}
                <a
                  href="https://al-anon.org/newcomers/self-quiz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nec-alanon-quiz nec-quiz-card block rounded-xl p-5 sm:p-6 text-center group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alanon-blue)]"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,147,208,0.10) 0%, rgba(0,123,181,0.06) 100%)",
                    border: "1px solid rgba(0,147,208,0.20)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  }}
                  aria-label="Take the Al-Anon self-assessment quiz (opens in new tab)"
                >
                  <ExternalLink
                    className="w-5 h-5 mx-auto mb-3 opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--alanon-blue)" }}
                    aria-hidden="true"
                  />
                  <p
                    className="text-lg sm:text-xl md:text-2xl font-black text-white mb-2"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                  >
                    Is Al-Anon for Me?
                  </p>
                  <p className="text-xs sm:text-sm mb-4 leading-relaxed" style={{ color: "var(--nec-muted)" }}>
                    Not sure if Al-Anon is right for you? Take the self-assessment quiz.
                  </p>
                  <span className="btn-alanon text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5">
                    Take the Quiz
                  </span>
                </a>

                {/* Alateen Quiz (Teens) */}
                <a
                  href="https://al-anon.org/newcomers/self-quiz/teen-quiz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nec-alateen-quiz nec-quiz-card block rounded-xl p-5 sm:p-6 text-center group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4a5d6]"
                  style={{
                    background: "linear-gradient(135deg, rgba(180,140,210,0.12) 0%, rgba(164,120,192,0.06) 100%)",
                    border: "1px solid rgba(180,140,210,0.25)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  }}
                  aria-label="Take the Alateen self-assessment quiz (opens in new tab)"
                >
                  <Heart
                    className="w-5 h-5 mx-auto mb-3 opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#c4a5d6" }}
                    aria-hidden="true"
                  />
                  <p
                    className="text-lg sm:text-xl md:text-2xl font-black text-white mb-2"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                  >
                    Is Alateen for Me?
                  </p>
                  <p className="text-xs sm:text-sm mb-4 leading-relaxed" style={{ color: "var(--nec-muted)" }}>
                    For teens affected by someone else&apos;s drinking. Find support and hope.
                  </p>
                  <span className="btn-alateen text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5">
                    Take the Quiz
                  </span>
                </a>
              </div>
            </section>

            {/* ── NECYPAA Program Teaser ─────────────────────────── */}
            <section
              className="nec-alanon-program rounded-xl p-6 md:p-8 mb-10"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(15,10,30,0.5) 50%, rgba(0,147,208,0.04) 100%)",
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
              className="nec-alateen-paperwork rounded-xl p-6 md:p-8 mb-10 text-center"
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
              className="nec-alanon-finder rounded-xl p-6 md:p-8 mb-10 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(0,147,208,0.06) 0%, rgba(15,10,30,0.5) 100%)",
                border: "1px solid rgba(0,147,208,0.15)",
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
                className="btn-alanon"
              >
                Al-Anon Meeting Finder<span className="sr-only"> (opens in new tab)</span> <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </section>

            {/* ── Young Persons Al-Anon Meetings ─────────── */}
            <section className="mb-10" aria-label="Young Persons Al-Anon meetings">
              <YoungPersonsAlAnonDirectory />
            </section>

            {/* ── Al-Anon State Grid ─────────────────────────────── */}
            <section className="mb-8 md:mb-10" aria-labelledby="alanon-state-heading">
              <h2
                id="alanon-state-heading"
                className="text-base sm:text-lg font-bold uppercase tracking-widest mb-2 pl-1"
                style={{ color: "var(--alanon-blue)", textShadow: "0 0 12px rgba(0,147,208,0.15)" }}
              >
                Al-Anon by State
              </h2>
              <p className="text-xs sm:text-sm mb-4 sm:mb-6 pl-1" style={{ color: "var(--nec-muted)" }}>
                Find your state&apos;s Al-Anon resources. Each link takes you to that state&apos;s
                Al-Anon website.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {NECYPAA_STATES.map((state) => (
                  <a
                    key={state.abbreviation}
                    href={state.alanon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nec-alanon-state-card nec-state-card group rounded-lg sm:rounded-xl p-3 sm:p-4 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alanon-blue)]"
                    style={{
                      background: "rgba(15,10,30,0.4)",
                      border: "1px solid rgba(0,147,208,0.10)",
                    }}
                    aria-label={`${state.name} Al-Anon resources (opens in new tab)`}
                  >
                    <span
                      className="block text-xl sm:text-2xl font-black mb-0.5 sm:mb-1 group-hover:text-[var(--alanon-blue)] transition-colors"
                      style={{ color: "var(--nec-text)" }}
                      aria-hidden="true"
                    >
                      {state.abbreviation}
                    </span>
                    <span className="block text-xs font-medium" style={{ color: "var(--nec-muted)" }}>
                      {state.name}
                    </span>
                    <ExternalLink
                      className="w-3 h-3 mx-auto mt-1 sm:mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "var(--alanon-blue)" }}
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </section>

            {/* ── Alateen State Grid ─────────────────────────────── */}
            <section className="mb-10" aria-labelledby="alateen-state-heading">
              <h2
                id="alateen-state-heading"
                className="text-base sm:text-lg font-bold uppercase tracking-widest mb-2 pl-1"
                style={{ color: "#c4a5d6", textShadow: "0 0 12px rgba(180,140,210,0.12)" }}
              >
                Alateen by State
              </h2>
              <p className="text-xs sm:text-sm mb-4 sm:mb-6 pl-1" style={{ color: "var(--nec-muted)" }}>
                Alateen is for younger family members and friends of alcoholics. Some states share an
                Al-Anon/Alateen site; others have a dedicated Alateen page.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {NECYPAA_STATES.map((state) => {
                  const url = state.alanon.alateenUrl || state.alanon.url
                  return (
                    <a
                      key={state.abbreviation}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nec-alateen-state-card nec-state-card group rounded-lg sm:rounded-xl p-3 sm:p-4 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4a5d6]"
                      style={{
                        background: "rgba(15,10,30,0.4)",
                        border: "1px solid rgba(180,140,210,0.10)",
                      }}
                      aria-label={`${state.name} Alateen resources (opens in new tab)`}
                    >
                      <span
                        className="block text-xl sm:text-2xl font-black mb-0.5 sm:mb-1 group-hover:text-[#c4a5d6] transition-colors"
                        style={{ color: "var(--nec-text)" }}
                        aria-hidden="true"
                      >
                        {state.abbreviation}
                      </span>
                      <span className="block text-xs font-medium" style={{ color: "var(--nec-muted)" }}>
                        {state.name}
                      </span>
                      <ExternalLink
                        className="w-3 h-3 mx-auto mt-1 sm:mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
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
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
