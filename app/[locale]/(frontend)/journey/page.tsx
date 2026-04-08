import type { Metadata } from "next"
import Image from "next/image"
import { pastEvents } from "@/lib/data/events"
import { Calendar, MapPin } from "lucide-react"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import PageArtAccents from "@/components/art/page-art-accents"
import FlyerWithModal from "@/components/flyer-with-modal"

export const metadata: Metadata = {
  title: "The Journey Comes First — NECYPAA XXXVI",
  description:
    "An archive of the journey to NECYPAA XXXVI — past events, fundraisers, and milestones from the CT Host Committee.",
}

function getEventYear(date: string) {
  const match = date.match(/20\d{2}/)
  return match?.[0] ?? ""
}

export default function JourneyPage() {
  return (
    <div className="min-h-screen min-h-screen-safe flex flex-col relative overflow-hidden" style={{ backgroundColor: "var(--nec-navy)" }}>
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" dividerVariant="compass" />
      <div className="page-frame">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div className="relative max-w-3xl">
                <div className="hidden lg:block absolute -left-10 top-1/2 -translate-y-1/2 w-24 h-36 opacity-[0.09] pointer-events-none" aria-hidden="true">
                  <Image src="/images/caterpillar-character.png" alt="" width={96} height={144} sizes="96px" className="w-full h-full object-contain" aria-hidden="true" />
                </div>
                <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2 w-20 h-32 opacity-[0.07] pointer-events-none" aria-hidden="true">
                  <Image src="/images/mad-hatter-character.png" alt="" width={80} height={120} sizes="80px" className="w-full h-full object-contain" aria-hidden="true" />
                </div>
                <span className="section-badge mb-4 inline-block">Archive</span>
                <h1 className="section-heading mb-3">The Journey Comes First</h1>
                <p className="text-lg max-w-2xl text-[var(--nec-muted)]">
                  A look back at the events, fundraisers, and fellowship that brought us to Hartford. The
                  journey is the point.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-gold-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.07),rgba(var(--nec-card-rgb),0.92))] p-5 shadow-[0_22px_54px_rgba(44,24,16,0.08)]">
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <div className="absolute left-6 top-6 h-16 w-16 rounded-full border border-[rgba(var(--nec-gold-rgb),0.16)]" />
                  <div className="absolute right-8 top-10 h-12 w-20 rounded-[1rem] border border-[rgba(var(--nec-pink-rgb),0.14)]" />
                </div>
                <div className="relative grid gap-4 sm:grid-cols-3">
                  {pastEvents.slice(0, 3).map((event, index) => (
                    <div
                      key={event.id}
                      className={`overflow-hidden rounded-[1.25rem] border bg-[rgba(var(--nec-card-rgb),0.88)] p-2 shadow-[0_14px_28px_rgba(44,24,16,0.06)] ${
                        index === 1 ? "sm:translate-y-6" : index === 2 ? "sm:-translate-y-3" : ""
                      }`}
                      style={{
                        borderColor:
                          index === 0
                            ? "rgba(var(--nec-gold-rgb),0.14)"
                            : index === 1
                              ? "rgba(var(--nec-pink-rgb),0.14)"
                              : "rgba(var(--nec-purple-rgb),0.14)",
                      }}
                    >
                      <div className="aspect-[4/5] overflow-hidden rounded-[0.95rem] border border-[rgba(var(--nec-purple-rgb),0.10)]">
                        <Image
                          src={event.flyerSrc}
                          alt=""
                          width={400}
                          height={600}
                          sizes="(min-width: 640px) 160px, 100vw"
                          className="h-full w-full object-cover"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 relative">
              <div
                className="pointer-events-none absolute left-6 top-0 bottom-0 hidden w-px bg-[linear-gradient(180deg,rgba(var(--nec-gold-rgb),0.18),rgba(var(--nec-purple-rgb),0.12),transparent)] md:block"
                aria-hidden="true"
              />

              <div className="space-y-8">
                {(() => {
                  const grouped = new Map<string, typeof pastEvents>()
                  for (const ev of pastEvents) {
                    const year = getEventYear(ev.date)
                    if (!grouped.has(year)) grouped.set(year, [])
                    grouped.get(year)!.push(ev)
                  }
                  const years = [...grouped.keys()].sort((a, b) => Number(b) - Number(a))
                  return years.map((year) => (
                    <div key={year} className="space-y-6">
                      <h2 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(var(--nec-gold-rgb),0.22)] bg-[rgba(var(--nec-gold-rgb),0.08)] text-xs">
                          {year}
                        </span>
                        <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(var(--nec-gold-rgb),0.18),transparent)]" aria-hidden="true" />
                      </h2>
                      {grouped.get(year)!.map((event) => (
                  <article
                    key={event.id}
                    className="relative grid gap-5 overflow-hidden rounded-[1.9rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.90)] p-5 shadow-[0_18px_42px_rgba(44,24,16,0.08)] md:grid-cols-[4.5rem_14rem_minmax(0,1fr)] md:p-6"
                  >
                    <div className="relative hidden md:flex justify-center pt-2" aria-hidden="true">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-gold-rgb),0.08)] text-sm font-semibold text-[var(--nec-gold)]">
                        {getEventYear(event.date)}
                      </div>
                    </div>

                    <div className="md:max-w-[14rem]">
                      <FlyerWithModal
                        src={event.flyerSrc}
                        alt={event.flyerAlt}
                        title={event.title}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                        {event.title}
                      </h3>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-[var(--nec-muted)]">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 flex-shrink-0 text-[var(--nec-cyan)]" aria-hidden="true" />
                          {event.date}
                        </span>
                        {event.location && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 flex-shrink-0 text-[var(--nec-pink)]" aria-hidden="true" />
                            {event.location}
                          </span>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-sm leading-7 text-[var(--nec-text)]">
                          {event.description}
                        </p>
                      )}

                      {event.schedule.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {event.schedule.map((scheduleItem) => (
                            <span
                              key={scheduleItem.label}
                              className="nec-pill-subtle text-xs px-2.5 py-1 rounded-lg font-medium text-[var(--nec-cyan)]"
                            >
                              {scheduleItem.label}: {scheduleItem.time}
                            </span>
                          ))}
                        </div>
                      )}

                      {event.details.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {event.details.map((detail) => (
                            <span
                              key={detail.label}
                              className="nec-pill-pink text-xs px-2.5 py-1 rounded-lg font-medium text-[var(--nec-muted)]"
                            >
                              {detail.label}: {detail.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                      ))}
                    </div>
                  ))
                })()}
              </div>
            </div>

            <div className="mt-12 text-center space-y-2">
              <p className="text-base text-[var(--nec-text)] italic">
                Every event on this timeline brought people together. That&apos;s the whole point.
              </p>
              <p className="text-sm text-[var(--nec-muted)]">
                More events to come. The journey continues.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
