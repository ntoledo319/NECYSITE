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
      className="relative overflow-hidden py-10 md:py-14 lg:py-16"
    >
      <div
        className="absolute inset-x-0 top-0 h-[70%] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(var(--nec-gold-rgb),0.08) 0%, transparent 55%), radial-gradient(ellipse at top right, rgba(var(--nec-purple-rgb),0.08) 0%, transparent 52%)",
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14">
          <div className="max-w-2xl">
            <span className="section-badge">Hartford 2026</span>

            <Image
              src="/images/mad-realm-logo-no-bg.webp"
              alt="Escaping the Mad Realm — NECYPAA XXXVI theme logo"
              width={360}
              height={192}
              priority
              sizes="(max-width: 768px) 70vw, 360px"
              className="mt-6 h-auto w-full max-w-[260px] sm:max-w-[320px] md:max-w-[360px]"
            />

            <div className="mt-7 space-y-5">
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

            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              {conventionDetails.map((detail) => {
                const Icon = detail.icon
                return (
                  <div
                    key={detail.label}
                    className="rounded-2xl border p-4"
                    style={{
                      background: "rgba(var(--nec-card-rgb),0.72)",
                      borderColor: "rgba(var(--nec-purple-rgb),0.12)",
                    }}
                  >
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
                Register for $40
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

          <div className="lg:justify-self-end">
            <div className="relative mx-auto max-w-[470px]">
              <div className="nec-card overflow-hidden p-3 sm:p-4">
                <div className="overflow-hidden rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.04)] p-2">
                  <Image
                    src="/images/mad-realm-poster-full.webp"
                    alt="NECYPAA XXXVI Escaping the Mad Realm poster art"
                    width={1100}
                    height={1467}
                    priority
                    sizes="(max-width: 768px) 88vw, (max-width: 1280px) 42vw, 470px"
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>

              <div className="absolute -bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-[230px]">
                <div className="rounded-2xl border bg-[rgba(var(--nec-card-rgb),0.94)] p-4 shadow-[0_18px_40px_rgba(44,24,16,0.12)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Pre-registration</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--nec-gold)]">$40</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
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
          January 3, 2027. Pre-registration is $40 at the Hartford Marriott Downtown.
        </p>
      </div>
    </section>
  )
}
