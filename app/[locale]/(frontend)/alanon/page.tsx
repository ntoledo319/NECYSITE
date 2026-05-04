import type { Metadata } from "next"
import Link from "next/link"
import { NECYPAA_STATES } from "@/lib/data/states"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import Image from "next/image"
import { ExternalLink, Hotel, Sparkles, Heart } from "lucide-react"
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
    <div
      className="min-h-screen-safe relative flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--nec-navy)" }}
    >
      {/* ── Mad Realm edge bleed: top ────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-48"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 120% at 50% -20%, rgba(var(--nec-purple-rgb),0.12) 0%, rgba(var(--nec-pink-rgb),0.05) 40%, transparent 100%)",
        }}
      />
      {/* ── Mad Realm edge bleed: left ───────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-32 md:w-48"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to right, rgba(var(--nec-purple-rgb),0.08) 0%, rgba(var(--nec-pink-rgb),0.03) 40%, transparent 100%)",
        }}
      />
      {/* ── Mad Realm edge bleed: right ──────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-32 md:w-48"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to left, rgba(var(--nec-purple-rgb),0.08) 0%, rgba(var(--nec-pink-rgb),0.03) 40%, transparent 100%)",
        }}
      />
      {/* ── Mad Realm edge bleed: bottom ─────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 120% at 50% 120%, rgba(var(--nec-purple-rgb),0.10) 0%, rgba(var(--nec-pink-rgb),0.04) 40%, transparent 100%)",
        }}
      />

      <div className="page-frame">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* ── Al-Anon Logo & Header ──────────────────────────── */}
            <header
              className="relative mb-12 overflow-hidden rounded-[2rem] border px-6 py-8 text-center shadow-[0_22px_48px_rgba(44,24,16,0.08)] md:mb-14 md:px-8 md:py-10"
              style={{
                background: "rgba(var(--nec-card-rgb),0.78)",
                borderColor: "rgba(0,147,208,0.14)",
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,147,208,0) 0%, rgba(0,147,208,0.45) 36%, rgba(180,140,210,0.45) 100%)",
                }}
              />
              <span className="section-badge-alanon page-enter-1 mb-6 inline-block" role="doc-subtitle">
                Al-Anon & Alateen
              </span>
              {/* Conference-approved Al-Anon Family Groups logo (adaptive for light/dark modes) */}
              <div className="mb-6 flex justify-center md:mb-8">
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
                className="page-enter-2 mb-3 text-xl font-bold sm:text-2xl md:text-3xl"
                style={{ color: "var(--alanon-blue)" }}
              >
                Resources &amp; Support
              </h1>
              <p
                className="page-enter-3 mx-auto max-w-2xl px-4 text-sm sm:text-base md:text-lg"
                style={{ color: "var(--nec-muted)" }}
              >
                For friends and family members affected by someone else&apos;s drinking.
              </p>
            </header>

            {/* ── Tradition 6 Disclaimer ─────────────────────────── */}
            <aside
              className="mb-8 rounded-[1.4rem] p-4 text-sm leading-relaxed sm:p-5 md:mb-10"
              style={{
                background: "rgba(251,191,36,0.05)",
                border: "1px solid rgba(251,191,36,0.15)",
                color: "var(--nec-muted)",
              }}
              role="note"
              aria-label="Tradition 6 disclaimer"
            >
              <p>
                <strong style={{ color: "var(--nec-gold)" }}>A note on Tradition 6:</strong> NECYPAA is not affiliated
                with Al-Anon Family Groups, Inc. This page is provided as a resource for friends and family of
                alcoholics attending or interested in our convention. The links below are outbound resources — you will
                be leaving our site.
              </p>
            </aside>

            {/* ── Quiz Banners — meet them where they are, before the explanation ── */}
            <section className="mb-8 md:mb-10" aria-label="Self-assessment quizzes">
              <h2 className="sr-only">Is Al-Anon or Alateen Right for You?</h2>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {/* Al-Anon Quiz (Adults) */}
                <a
                  href="https://al-anon.org/newcomers/self-quiz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nec-alanon-quiz nec-quiz-card group relative block overflow-hidden rounded-[1.7rem] p-5 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alanon-blue)] sm:p-6"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,147,208,0.10) 0%, rgba(0,123,181,0.06) 100%)",
                    border: "1px solid rgba(0,147,208,0.20)",
                    boxShadow: "0 18px 36px rgba(44,24,16,0.06)",
                  }}
                  aria-label="Take the Al-Anon self-assessment quiz (opens in new tab)"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[3px]"
                    aria-hidden="true"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(0,147,208,0) 0%, rgba(0,147,208,0.56) 50%, rgba(0,147,208,0) 100%)",
                    }}
                  />
                  <ExternalLink
                    className="mx-auto mb-3 h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
                    style={{ color: "var(--alanon-blue)" }}
                    aria-hidden="true"
                  />
                  <p className="mb-2 text-lg font-black text-[var(--nec-text)] sm:text-xl md:text-2xl">
                    Is Al-Anon for Me?
                  </p>
                  <p className="mb-4 text-xs leading-relaxed sm:text-sm" style={{ color: "var(--nec-muted)" }}>
                    Not sure if Al-Anon is right for you? Take the self-assessment quiz.
                  </p>
                  <span className="btn-alanon px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm">Take the Quiz</span>
                </a>

                {/* Alateen Quiz (Teens) */}
                <a
                  href="https://al-anon.org/newcomers/self-quiz/teen-quiz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nec-alateen-quiz nec-quiz-card group relative block overflow-hidden rounded-[1.7rem] p-5 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-alateen)] sm:p-6"
                  style={{
                    background: "linear-gradient(135deg, rgba(180,140,210,0.12) 0%, rgba(164,120,192,0.06) 100%)",
                    border: "1px solid rgba(180,140,210,0.25)",
                    boxShadow: "0 18px 36px rgba(44,24,16,0.06)",
                  }}
                  aria-label="Take the Alateen self-assessment quiz (opens in new tab)"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[3px]"
                    aria-hidden="true"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(180,140,210,0) 0%, rgba(180,140,210,0.56) 50%, rgba(180,140,210,0) 100%)",
                    }}
                  />
                  <Heart
                    className="mx-auto mb-3 h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
                    style={{ color: "#c4a5d6" }}
                    aria-hidden="true"
                  />
                  <p className="mb-2 text-lg font-black text-[var(--nec-text)] sm:text-xl md:text-2xl">
                    Is Alateen for Me?
                  </p>
                  <p className="mb-4 text-xs leading-relaxed sm:text-sm" style={{ color: "var(--nec-muted)" }}>
                    For teens affected by someone else&apos;s drinking. Find support and hope.
                  </p>
                  <span className="btn-alateen px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm">Take the Quiz</span>
                </a>
              </div>
            </section>

            {/* ── Info Accordion (What Is / Who Are / Spouse) ────── */}
            <section className="section-atmosphere-purple mb-10" aria-label="About Al-Anon and Alateen">
              <AlAnonInfoAccordion />
            </section>

            {/* ── NECYPAA Program Teaser ─────────────────────────── */}
            <section
              className="nec-alanon-program section-atmosphere-cyan mb-10 rounded-[1.8rem] p-6 md:p-8"
              style={{
                background:
                  "linear-gradient(135deg, rgba(var(--nec-purple-rgb),0.04) 0%, rgba(var(--nec-card-rgb),0.5) 50%, rgba(0,147,208,0.04) 100%)",
                border: "1px solid rgba(var(--nec-purple-rgb),0.12)",
              }}
              aria-label="Al-Anon and Alateen at NECYPAA XXXVI"
            >
              <div className="space-y-4 text-center">
                <Sparkles className="mx-auto h-8 w-8" style={{ color: "var(--nec-gold)" }} aria-hidden="true" />
                <h2 className="text-xl font-black text-[var(--nec-text)] md:text-2xl">
                  Al-Anon & Alateen at NECYPAA XXXVI
                </h2>
                <p className="mx-auto max-w-xl text-sm leading-relaxed" style={{ color: "var(--nec-text)" }}>
                  Al-Anon and Alateen meetings will be part of NECYPAA XXXVI! We have an extensive program planned with
                  workshops, keynote speakers, panels, and activities. The full program is coming soon!
                </p>

                <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                  <Link href="/register" className="btn-primary inline-flex items-center justify-center gap-2">
                    Pre-Register Today
                  </Link>
                  <a
                    href={HOTEL_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    <Hotel className="h-4 w-4" aria-hidden="true" />
                    Book Your Hotel Room
                  </a>
                </div>
              </div>
            </section>

            {/* ── Alateen Resources — real help, not a placeholder ── */}
            <section
              className="nec-alateen-paperwork mb-10 rounded-[1.7rem] p-6 md:p-8"
              style={{
                background: "linear-gradient(135deg, rgba(180,140,210,0.06) 0%, rgba(var(--nec-card-rgb),0.5) 100%)",
                border: "1px solid rgba(180,140,210,0.18)",
              }}
              aria-label="Alateen resources and support"
            >
              <Heart className="mx-auto mb-3 h-8 w-8" style={{ color: "#c4a5d6" }} aria-hidden="true" />
              <h2 className="mb-2 text-lg font-bold text-[var(--nec-text)]">Alateen Resources</h2>
              <p className="mx-auto mb-5 max-w-lg text-sm" style={{ color: "var(--nec-muted)" }}>
                If you&apos;re a teenager affected by someone else&apos;s drinking, you&apos;re not alone. Alateen is a
                fellowship of young people whose lives have been affected by someone else&apos;s drinking.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a href="tel:1-888-425-2666" className="btn-alateen inline-flex items-center gap-2 text-sm">
                  Call 1-888-4AL-ANON
                </a>
                <a
                  href="https://al-anon.org/newcomers/teen-corner-alateen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center gap-2 text-sm"
                  style={{ color: "var(--nec-alateen, #c4a5d6)" }}
                >
                  Alateen Teen Corner
                  <span className="sr-only"> (opens al-anon.org in new tab)</span>
                </a>
              </div>
              <p className="mx-auto mt-4 max-w-md text-xs" style={{ color: "var(--nec-muted)", opacity: 0.8 }}>
                Alateen participation forms for NECYPAA XXXVI are being finalized and will be available here.
              </p>
            </section>

            {/* ── Al-Anon Meeting Finder ─────────────────────────── */}
            <section
              className="nec-alanon-finder mb-10 rounded-[1.7rem] p-6 text-center md:p-8"
              style={{
                background: "linear-gradient(135deg, rgba(0,147,208,0.06) 0%, rgba(var(--nec-card-rgb),0.5) 100%)",
                border: "1px solid rgba(0,147,208,0.15)",
              }}
            >
              <h2 className="mb-2 text-xl font-bold text-[var(--nec-text)]">Find an Al-Anon Meeting</h2>
              <p className="mb-4 text-sm" style={{ color: "var(--nec-muted)" }}>
                Search for Al-Anon meetings near you or anywhere in the world.
              </p>
              <a
                href="https://al-anon.org/al-anon-meetings/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-alanon"
              >
                Al-Anon Meeting Finder<span className="sr-only"> (opens in new tab)</span>{" "}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </section>

            {/* ── Young Persons Al-Anon Meetings ─────────── */}
            <section className="mb-10" aria-label="Young Persons Al-Anon meetings">
              <YoungPersonsAlAnonDirectory />
            </section>

            {/* ── Al-Anon State Grid ─────────────────────────────── */}
            <section
              className="mb-8 rounded-[1.9rem] border p-5 md:mb-10 md:p-6"
              style={{
                background: "rgba(var(--nec-card-rgb),0.62)",
                borderColor: "rgba(0,147,208,0.12)",
              }}
              aria-labelledby="alanon-state-heading"
            >
              <h2
                id="alanon-state-heading"
                className="mb-2 pl-1 text-base font-bold uppercase tracking-widest sm:text-lg"
                style={{ color: "var(--alanon-blue-text)", textShadow: "0 0 12px rgba(0,147,208,0.12)" }}
              >
                Al-Anon by State
              </h2>
              <p className="mb-4 pl-1 text-xs sm:mb-6 sm:text-sm" style={{ color: "var(--nec-muted)" }}>
                Find your state&apos;s Al-Anon resources. Each link takes you to that state&apos;s Al-Anon website.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
                {NECYPAA_STATES.map((state) => (
                  <a
                    key={state.abbreviation}
                    href={state.alanon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nec-alanon-state-card nec-state-card group rounded-[1.1rem] p-3 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alanon-blue)] sm:p-4"
                    style={{
                      background: "rgba(var(--nec-card-rgb),0.54)",
                      border: "1px solid rgba(0,147,208,0.10)",
                    }}
                    aria-label={`${state.name} Al-Anon resources (opens in new tab)`}
                  >
                    <span
                      className="mb-0.5 block text-xl font-black transition-colors group-hover:text-[var(--alanon-blue)] sm:mb-1 sm:text-2xl"
                      style={{ color: "var(--nec-text)" }}
                      aria-hidden="true"
                    >
                      {state.abbreviation}
                    </span>
                    <span className="block text-xs font-medium" style={{ color: "var(--nec-muted)" }}>
                      {state.name}
                    </span>
                    <ExternalLink
                      className="mx-auto mt-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 sm:mt-1.5"
                      style={{ color: "var(--alanon-blue)" }}
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </section>

            {/* ── Alateen State Grid ─────────────────────────────── */}
            <section
              className="mb-10 rounded-[1.9rem] border p-5 md:p-6"
              style={{
                background: "rgba(var(--nec-card-rgb),0.62)",
                borderColor: "rgba(180,140,210,0.14)",
              }}
              aria-labelledby="alateen-state-heading"
            >
              <h2
                id="alateen-state-heading"
                className="mb-2 pl-1 text-base font-bold uppercase tracking-widest sm:text-lg"
                style={{ color: "var(--nec-alateen)", textShadow: "0 0 12px rgba(180,140,210,0.10)" }}
              >
                Alateen by State
              </h2>
              <p className="mb-4 pl-1 text-xs sm:mb-6 sm:text-sm" style={{ color: "var(--nec-muted)" }}>
                Alateen is for younger family members and friends of alcoholics. Some states share an Al-Anon/Alateen
                site; others have a dedicated Alateen page.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
                {NECYPAA_STATES.map((state) => {
                  const url = state.alanon.alateenUrl || state.alanon.url
                  return (
                    <a
                      key={state.abbreviation}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nec-alateen-state-card nec-state-card group rounded-[1.1rem] p-3 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nec-alateen)] sm:p-4"
                      style={{
                        background: "rgba(var(--nec-card-rgb),0.54)",
                        border: "1px solid rgba(180,140,210,0.10)",
                      }}
                      aria-label={`${state.name} Alateen resources (opens in new tab)`}
                    >
                      <span
                        className="mb-0.5 block text-xl font-black transition-colors group-hover:text-[var(--nec-alateen)] sm:mb-1 sm:text-2xl"
                        style={{ color: "var(--nec-text)" }}
                        aria-hidden="true"
                      >
                        {state.abbreviation}
                      </span>
                      <span className="block text-xs font-medium" style={{ color: "var(--nec-muted)" }}>
                        {state.name}
                      </span>
                      <ExternalLink
                        className="mx-auto mt-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 sm:mt-1.5"
                        style={{ color: "var(--nec-alateen)" }}
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
