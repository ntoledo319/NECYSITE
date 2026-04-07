import type { Metadata } from "next"
import { Calendar, MapPin } from "lucide-react"
import { pastEvents } from "@/lib/data/events"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import PageArtAccents from "@/components/art/page-art-accents"
import FlyerWithModal from "@/components/flyer-with-modal"

export const metadata: Metadata = {
  title: "The Journey Comes First — NECYPAA XXXVI",
  description:
    "An archive of the journey to NECYPAA XXXVI — past events, fundraisers, and milestones from the CT Host Committee.",
}

export default function JourneyPage() {
  return (
    <div className="relative flex min-h-screen min-h-screen-safe flex-col" style={{ backgroundColor: "var(--nec-navy)" }}>
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" dividerVariant="compass" />

      <div className="relative z-10 flex-1 pb-20 pt-24 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-10">
            <header className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="max-w-3xl">
                <span className="section-badge inline-flex">Archive</span>
                <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl">
                  The journey comes first.
                </h1>
                <p className="mt-4 text-lg leading-8 text-[var(--nec-muted)]">
                  Hartford does not begin when people check into the hotel. It begins in borrowed halls,
                  after-meeting fundraisers, strange themes, late-night drives, and the little nights where a host committee becomes real.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-[1.5rem] border border-[rgba(var(--nec-gold-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.84)] px-4 py-4 shadow-[0_16px_34px_rgba(44,24,16,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Events Archived</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--nec-text)]">{pastEvents.length}</p>
                </div>
                <div className="rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.84)] px-4 py-4 shadow-[0_16px_34px_rgba(44,24,16,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">What It Holds</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">Fundraisers, dances, panels, and the committee’s mileage</p>
                </div>
                <div className="rounded-[1.5rem] border border-[rgba(var(--nec-pink-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.84)] px-4 py-4 shadow-[0_16px_34px_rgba(44,24,16,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">Point of View</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">The journey is not marketing. It is the substance.</p>
                </div>
              </div>
            </header>

            <section className="rounded-[1.9rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[linear-gradient(135deg,rgba(var(--nec-card-rgb),0.88),rgba(var(--nec-gold-rgb),0.04))] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)] md:px-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                    Why this page exists
                  </p>
                  <p className="mt-3 text-base leading-7 text-[var(--nec-muted)]">
                    Recovery events become lore fast. This archive keeps the flyers, the locations, and the strange little facts that would otherwise disappear once the next event poster takes over.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                    How to read it
                  </p>
                  <p className="mt-3 text-base leading-7 text-[var(--nec-muted)]">
                    Think of this less like a schedule graveyard and more like a yearbook wall. The poster art, themes, and details tell the story of how Hartford got built.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-8" aria-label="Road to Hartford event archive">
              {pastEvents.map((event, index) => (
                <article
                  key={event.id}
                  className="grid gap-5 lg:grid-cols-[90px_1fr] lg:gap-6"
                >
                  <div className="hidden lg:flex justify-center">
                    <div className="flex w-full max-w-[90px] flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.92)] text-sm font-semibold text-[var(--nec-text)] shadow-[0_16px_32px_rgba(44,24,16,0.08)]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      {index < pastEvents.length - 1 && (
                        <div className="mt-3 h-full min-h-[90px] w-px bg-[linear-gradient(180deg,rgba(var(--nec-purple-rgb),0.18),rgba(var(--nec-gold-rgb),0.08))]" />
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.85rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.84)] p-5 shadow-[0_22px_48px_rgba(44,24,16,0.08)] md:p-6">
                    <div className="grid gap-5 md:grid-cols-[140px_1fr]">
                      <div className="w-full max-w-[180px] overflow-hidden rounded-[1.25rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.04)] p-2">
                        <FlyerWithModal
                          src={event.flyerSrc}
                          alt={event.flyerAlt}
                          title={event.title}
                          className="rounded-[1rem]"
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                            Road Marker {String(index + 1).padStart(2, "0")}
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                            {event.title}
                          </h2>
                        </div>

                        <div className="flex flex-col gap-2 text-sm text-[var(--nec-muted)] sm:flex-row sm:flex-wrap sm:gap-4">
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[var(--nec-cyan)]" aria-hidden="true" />
                            {event.date}
                          </span>
                          {event.location && (
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-[var(--nec-pink)]" aria-hidden="true" />
                              {event.location}
                            </span>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-base leading-7 text-[var(--nec-muted)]">{event.description}</p>
                        )}

                        {event.schedule.length > 0 && (
                          <div className="grid gap-2 sm:grid-cols-2">
                            {event.schedule.map((slot) => (
                              <div
                                key={slot.label}
                                className="rounded-[1.15rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.9)] px-4 py-3"
                              >
                                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">{slot.time}</p>
                                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">{slot.label}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {event.details.length > 0 && (
                          <div className="flex flex-wrap gap-2 border-t border-[rgba(var(--nec-purple-rgb),0.08)] pt-4">
                            {event.details.map((detail) => (
                              <span
                                key={detail.label}
                                className="rounded-full border border-[rgba(var(--nec-gold-rgb),0.14)] bg-[rgba(var(--nec-gold-rgb),0.05)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--nec-gold)]"
                              >
                                {detail.label}: {detail.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
