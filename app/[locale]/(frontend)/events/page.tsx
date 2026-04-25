import type { Metadata } from "next"
import Image from "next/image"
import { Calendar, CalendarPlus, MapPin } from "lucide-react"
import { getEvents } from "@/lib/data/fetch-utils"
import { getGoogleCalendarUrl } from "@/lib/calendar"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import FlyerWithModal from "@/components/flyer-with-modal"
import PageArtAccents from "@/components/art/page-art-accents"
import ShareMenu from "@/components/share-menu"
import { generateEventJsonLd } from "@/lib/event-jsonld"

export const metadata: Metadata = {
  title: "Events — NECYPAA XXXVI",
  description:
    "Fundraisers, pre-convention events, and activities hosted by the NECYPAA XXXVI CT Host Committee. Come build the road to Hartford with us.",
}

export default async function EventsPage() {
  const { upcoming: upcomingEvent, past: pastEvents } = await getEvents()
  const allEvents = [...(upcomingEvent ? [upcomingEvent] : []), ...pastEvents]
  const jsonLdItems = allEvents
    .map(generateEventJsonLd)
    .filter((ld): ld is Record<string, unknown> => ld !== null)

  return (
    <div className="relative flex min-h-screen min-h-screen-safe flex-col" style={{ backgroundColor: "var(--nec-navy)" }}>
      {jsonLdItems.map((ld, i) => (
        <script
          key={allEvents[i].id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <PageArtAccents character="mad-hatter" accentColor="var(--nec-purple)" dividerVariant="gear" />

      <div className="page-frame">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl page-stack">
            <header className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.74)] px-6 py-8 shadow-[0_22px_48px_rgba(44,24,16,0.08)] md:px-8 md:py-10">
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(var(--nec-pink-rgb),0) 0%, rgba(var(--nec-pink-rgb),0.48) 30%, rgba(var(--nec-purple-rgb),0.52) 72%, rgba(var(--nec-cyan-rgb),0.28) 100%)",
                }}
              />
              <div className="absolute right-6 top-6 hidden opacity-[0.08] lg:block" aria-hidden="true">
                <Image
                  src="/images/mad-hatter-character.webp"
                  alt=""
                  width={120}
                  height={180}
                  sizes="120px"
                  className="h-auto w-24"
                />
              </div>

              <div className="max-w-3xl">
                <span className="section-badge page-enter-1">Events</span>
                <h1 className="page-enter-2 mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl">
                  The road to Hartford.
                </h1>
                <p className="page-enter-3 mt-4 text-lg leading-8 text-[var(--nec-muted)]">
                  Fundraisers, fellowship nights, and committee momentum all lead toward NECYPAA XXXVI.
                </p>
                <div className="page-enter-4 mt-6">
                  <ShareMenu
                    text="Check out the events leading up to NECYPAA XXXVI — Escaping the Mad Realm!"
                    url="https://www.necypaact.com/events"
                    triggerClassName="btn-ghost"
                    triggerLabel="Share Events"
                  />
                </div>
              </div>
            </header>

            <section aria-label="Upcoming event" className="section-atmosphere-pink relative space-y-5">
              <div className="max-w-2xl">
                <span className="section-badge">Coming Up Next</span>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                  What&apos;s next on the road to Hartford.
                </h2>
                <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
                  Here&apos;s what&apos;s coming.
                </p>
              </div>

              {upcomingEvent ? (
                <article className="nec-card relative overflow-hidden p-6 md:p-8">
                  <div
                    className="absolute inset-x-0 top-0 h-[3px]"
                    aria-hidden="true"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(var(--nec-pink-rgb),0) 0%, rgba(var(--nec-pink-rgb),0.46) 34%, rgba(var(--nec-cyan-rgb),0.46) 100%)",
                    }}
                  />
                  <div className="grid gap-6 md:grid-cols-[260px_1fr] md:gap-8">
                    <div className="overflow-hidden rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.04)] p-2">
                      <FlyerWithModal
                        src={upcomingEvent.flyerSrc}
                        alt={upcomingEvent.flyerAlt}
                        title={upcomingEvent.title}
                        className="rounded-[1.1rem]"
                      />
                    </div>

                    <div className="space-y-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-pink)]">Featured Event</p>
                      <h3 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                        {upcomingEvent.title}
                      </h3>

                      <div className="flex flex-col gap-3 text-sm text-[var(--nec-muted)] sm:flex-row sm:flex-wrap">
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[var(--nec-cyan)]" aria-hidden="true" />
                          {upcomingEvent.date}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[var(--nec-gold)]" aria-hidden="true" />
                          {upcomingEvent.location}
                        </span>
                      </div>

                      <p className="text-base leading-7 text-[var(--nec-muted)]">{upcomingEvent.description}</p>

                      {(() => {
                        const calUrl = getGoogleCalendarUrl(upcomingEvent)
                        return calUrl ? (
                          <a
                            href={calUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost inline-flex items-center gap-2 self-start"
                          >
                            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                            Add to Calendar
                            <span className="sr-only"> (opens Google Calendar in new tab)</span>
                          </a>
                        ) : null
                      })()}

                      {upcomingEvent.schedule.length > 0 && (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {upcomingEvent.schedule.map((slot) => (
                            <div
                              key={slot.label}
                              className="rounded-[1.2rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] px-4 py-3"
                            >
                              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">{slot.time}</p>
                              <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">{slot.label}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {upcomingEvent.details.length > 0 && (
                        <dl className="grid gap-4 border-t border-[rgba(var(--nec-purple-rgb),0.08)] pt-5 sm:grid-cols-2">
                          {upcomingEvent.details.map((detail) => (
                            <div
                              key={detail.label}
                              className="rounded-[1.15rem] border border-[rgba(var(--nec-purple-rgb),0.08)] bg-[rgba(var(--nec-card-rgb),0.56)] px-4 py-3"
                            >
                              <dt className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)]">{detail.label}</dt>
                              <dd className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">{detail.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>
                  </div>
                </article>
              ) : (
                <div className="text-center py-12 rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.02)]">
                  <p className="text-[var(--nec-muted)] text-lg">No upcoming events scheduled at this time.</p>
                </div>
              )}
            </section>

            <section aria-label="Past events archive" className="space-y-5">
              <div className="max-w-2xl">
                <span className="section-badge">Archive</span>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                  Where we&apos;ve been.
                </h2>
                <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
                  A look back at the events and fundraisers that brought us here. Every one of these
                  brought people together and moved us closer to Hartford.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {pastEvents.map((event) => (
                  <article key={event.id} className="nec-card relative p-5">
                    <div
                      className="absolute inset-x-0 top-0 h-[2px]"
                      aria-hidden="true"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(var(--nec-cyan-rgb),0) 0%, rgba(var(--nec-cyan-rgb),0.28) 50%, rgba(var(--nec-cyan-rgb),0) 100%)",
                      }}
                    />
                    <div className="flex gap-4">
                      <div className="w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] p-1.5">
                        <FlyerWithModal
                          src={event.flyerSrc}
                          alt={event.flyerAlt}
                          title={event.title}
                          className="rounded-2xl"
                          sizes="96px"
                        />
                      </div>

                      <div className="min-w-0 space-y-3">
                        <h3 className="text-xl font-semibold leading-tight text-[var(--nec-text)]">{event.title}</h3>
                        <div className="space-y-2 text-sm text-[var(--nec-muted)]">
                          <p className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[var(--nec-cyan)]" aria-hidden="true" />
                            {event.date}
                          </p>
                          {event.location && (
                            <p className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-[var(--nec-gold)]" aria-hidden="true" />
                              {event.location}
                            </p>
                          )}
                        </div>
                        {event.schedule.length > 0 && (
                          <ul className="space-y-1 text-sm leading-6 text-[var(--nec-muted)]">
                            {event.schedule.slice(0, 3).map((slot) => (
                              <li key={slot.label}>
                                <span className="font-semibold text-[var(--nec-text)]">{slot.time}</span> {slot.label}
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="text-sm leading-6 text-[var(--nec-muted)]">{event.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
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
