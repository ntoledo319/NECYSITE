"use client"

import Link from "next/link"
import { ArrowRight, Calendar, CalendarPlus, MapPin } from "lucide-react"
import { upcomingEvent, pastEvents } from "@/lib/data/events"
import { getGoogleCalendarUrl } from "@/lib/calendar"
import FlyerWithModal from "@/components/flyer-with-modal"

export default function EventsPreviewSection() {
  return (
    <section id="events" aria-label="Events preview" className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <span className="section-badge">Road To Hartford</span>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
            The next event should be easy to spot.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--nec-muted)]">
            Fundraisers and fellowship nights build the convention long before everyone gets to the
            hotel. They deserve the same clarity as the registration flow.
          </p>
        </div>
        <Link href="/events" className="btn-ghost self-start sm:self-auto">
          View All Events
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <article className="nec-card relative overflow-hidden p-6 md:p-8">
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, rgba(var(--nec-pink-rgb),0) 0%, rgba(var(--nec-pink-rgb),0.5) 30%, rgba(var(--nec-cyan-rgb),0.5) 100%)",
          }}
        />
        <div className="grid gap-6 md:grid-cols-[240px_1fr] md:gap-8">
          <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.04)] p-2 sm:p-2.5">
            <FlyerWithModal
              src={upcomingEvent.flyerSrc}
              alt={upcomingEvent.flyerAlt}
              title={upcomingEvent.title}
              className="rounded-[1.2rem]"
            />
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-pink)]">Coming Up Next</p>
              <span className="hidden h-px flex-1 bg-[linear-gradient(90deg,rgba(var(--nec-pink-rgb),0.18),rgba(var(--nec-cyan-rgb),0.04))] sm:block" aria-hidden="true" />
            </div>
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
              <dl className="grid gap-3 border-t border-[rgba(var(--nec-purple-rgb),0.08)] pt-5 sm:grid-cols-2">
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

      {pastEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--nec-text)]">
              <span
                className="h-2 w-2 rounded-full bg-[var(--nec-cyan)]"
                aria-hidden="true"
              />
              Recent Events
            </h3>
            <Link
              href="/events"
              className="text-sm font-semibold text-[var(--nec-text)] underline decoration-[rgba(var(--nec-cyan-rgb),0.45)] underline-offset-4 transition-colors hover:text-[var(--nec-purple)]"
            >
              Browse Archive
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {pastEvents.slice(0, 4).map((event) => (
              <article
                key={event.id}
                className="relative rounded-[1.45rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.76)] p-4 shadow-[0_16px_34px_rgba(44,24,16,0.06)]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-[2px]"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(var(--nec-cyan-rgb),0) 0%, rgba(var(--nec-cyan-rgb),0.28) 50%, rgba(var(--nec-cyan-rgb),0) 100%)",
                  }}
                />
                <div className="flex gap-4">
                  <div className="w-20 flex-shrink-0 overflow-hidden rounded-[1rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] p-1.5">
                    <FlyerWithModal
                      src={event.flyerSrc}
                      alt={event.flyerAlt}
                      title={event.title}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <h4 className="text-base font-semibold leading-tight text-[var(--nec-text)]">{event.title}</h4>
                    <p className="text-sm leading-6 text-[var(--nec-muted)]">
                      {event.date.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*/, "")}
                    </p>
                    {event.location && (
                      <p className="text-sm leading-6 text-[var(--nec-muted)]">{event.location}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
