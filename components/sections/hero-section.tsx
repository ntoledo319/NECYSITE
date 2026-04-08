"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Hotel, MapPin, Sparkles } from "lucide-react"
import { HOTEL_BOOKING_URL } from "@/lib/constants"
import AddToCalendar from "@/components/add-to-calendar"

const conventionDetails = [
  {
    label: "Dates",
    value: "December 31, 2026 to January 3, 2027",
    icon: CalendarDays,
    accent: "var(--nec-purple)",
  },
  {
    label: "Stay",
    value: "Hartford Marriott Downtown",
    icon: Hotel,
    accent: "var(--nec-gold)",
  },
  {
    label: "Host City",
    value: "Hartford, Connecticut",
    icon: MapPin,
    accent: "var(--nec-cyan)",
  },
]

export default function HeroSection() {
  return (
    <section
      aria-label="NECYPAA XXXVI Convention Hero — Escaping the Mad Realm"
      className="relative overflow-hidden pb-12 pt-8 md:pb-16 md:pt-12 lg:pb-20 lg:pt-16"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[78%]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(var(--nec-gold-rgb),0.10) 0%, transparent 55%), radial-gradient(ellipse at top right, rgba(var(--nec-purple-rgb),0.10) 0%, transparent 52%), linear-gradient(180deg, rgba(var(--nec-card-rgb),0.12) 0%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px md:inset-x-8"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(var(--nec-purple-rgb),0.18) 20%, rgba(var(--nec-gold-rgb),0.3) 50%, rgba(var(--nec-purple-rgb),0.18) 80%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-14">
          <div className="relative max-w-3xl">
            <div className="nec-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-11">
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(var(--nec-gold-rgb),0) 0%, rgba(var(--nec-gold-rgb),0.45) 25%, rgba(var(--nec-purple-rgb),0.55) 65%, rgba(var(--nec-purple-rgb),0) 100%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-40 lg:block"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(var(--nec-purple-rgb),0.04) 100%)",
                }}
              />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="section-badge">Hartford 2026</span>
                  <span className="hidden h-px flex-1 bg-[linear-gradient(90deg,rgba(var(--nec-purple-rgb),0.16),rgba(var(--nec-gold-rgb),0.04))] sm:block" aria-hidden="true" />
                </div>

                <div className="mt-6 grid gap-7 xl:grid-cols-[auto_1fr] xl:items-end">
                  <Image
                    src="/images/mad-realm-logo-no-bg.webp"
                    alt="Escaping the Mad Realm — NECYPAA XXXVI theme logo"
                    width={360}
                    height={192}
                    priority
                    sizes="(max-width: 768px) 70vw, 360px"
                    className="h-auto w-full max-w-[260px] sm:max-w-[320px] md:max-w-[360px]"
                  />

                  <div className="space-y-5">
                    <h1
                      className="text-4xl font-semibold leading-[0.92] tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl md:text-6xl"
                      style={{ fontFamily: "var(--font-display), var(--font-heading), Georgia, serif" }}
                    >
                      NECYPAA XXXVI
                    </h1>
                    <p className="max-w-xl text-lg leading-8 text-[var(--nec-muted)] md:text-xl">
                      Four days of fellowship, workshops, speakers, dancing, and sober joy at the Hartford
                      Marriott Downtown. The art already gives this weekend a world. The convention brings
                      the people.
                    </p>
                  </div>
                </div>

                <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                  {conventionDetails.map((detail) => {
                    const Icon = detail.icon
                    return (
                      <div
                        key={detail.label}
                        className="relative overflow-hidden rounded-[1.4rem] border p-4"
                        style={{
                          background: "rgba(var(--nec-card-rgb),0.72)",
                          borderColor: "rgba(var(--nec-purple-rgb),0.12)",
                        }}
                      >
                        <div
                          className="absolute inset-x-0 top-0 h-[2px]"
                          aria-hidden="true"
                          style={{ background: `linear-gradient(90deg, transparent 0%, ${detail.accent} 45%, transparent 100%)` }}
                        />
                        <dt className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">
                          <Icon className="h-4 w-4" style={{ color: detail.accent }} aria-hidden="true" />
                          {detail.label}
                        </dt>
                        <dd className="mt-3 text-sm font-semibold leading-6 text-[var(--nec-text)]">
                          {detail.value}
                        </dd>
                      </div>
                    )
                  })}
                </dl>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link href="/register" className="btn-primary">
                    Register Now
                  </Link>
                  <a href={HOTEL_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    Book the Hotel
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <Link href="/events" className="btn-ghost">
                    Explore Events
                  </Link>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-[rgba(var(--nec-purple-rgb),0.10)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-sm text-[var(--nec-muted)]">
                    <Sparkles className="h-4 w-4 text-[var(--nec-gold)]" aria-hidden="true" />
                    Young people and the young at heart, all weekend long.
                  </p>
                  <AddToCalendar variant="inline" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div className="relative mx-auto max-w-[520px]">
              <div
                className="pointer-events-none absolute inset-5 rounded-[2rem] border border-[rgba(var(--nec-gold-rgb),0.14)]"
                aria-hidden="true"
              />
              <div className="nec-card relative overflow-hidden p-3 sm:p-4">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(var(--nec-gold-rgb),0) 0%, rgba(var(--nec-gold-rgb),0.45) 38%, rgba(var(--nec-purple-rgb),0.45) 72%, rgba(var(--nec-purple-rgb),0) 100%)",
                  }}
                />
                <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.04)] p-2 sm:p-2.5">
                  <Image
                    src="/images/mad-realm-poster-full.webp"
                    alt="NECYPAA XXXVI Escaping the Mad Realm poster art"
                    width={1100}
                    height={1467}
                    priority
                    sizes="(max-width: 768px) 88vw, (max-width: 1280px) 42vw, 470px"
                    className="h-auto w-full rounded-[1.15rem] object-cover"
                  />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 sm:-bottom-5 sm:left-auto sm:right-6 sm:w-[260px]">
                <div className="rounded-[1.6rem] border border-[rgba(var(--nec-gold-rgb),0.16)] bg-[rgba(var(--nec-card-rgb),0.95)] p-4 shadow-[0_18px_40px_rgba(44,24,16,0.12)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-gold)]">Pre-registration Open</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--nec-muted)]">
                    Lock in your spot early, reserve your room, and arrive with the weekend already
                    mapped out.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="sr-only">
          NECYPAA XXXVI — Escaping the Mad Realm. Hartford, Connecticut. December 31, 2026 through
          January 3, 2027. Pre-registration is open at the Hartford Marriott Downtown.
        </p>
      </div>
    </section>
  )
}
