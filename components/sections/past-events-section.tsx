"use client"

import { pastEvents, upcomingEvent } from "@/lib/data/events"
import FlyerWithModal from "@/components/flyer-with-modal"
import { Calendar, MapPin, IceCream, Sparkles } from "lucide-react"

export default function PastEventsSection() {
  return (
    <div className="px-4 md:px-0 space-y-16">
      {/* ── Featured Upcoming Event ─────────────────────────────── */}
      <section id="next-event" aria-label="Next upcoming event">
        <div className="mb-6">
          <span className="section-badge">Coming Up</span>
          <h2 className="section-heading mt-3" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            Next Event
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Our next fundraiser is right around the corner. Come hang!
          </p>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.35), 0 0 60px rgba(124,58,237,0.08), 0 0 120px rgba(192,38,211,0.05)",
          }}
        >
          {/* Theme bleed: top-left corner glow */}
          <div
            className="pointer-events-none absolute -top-12 -left-12 w-64 h-64 z-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.20) 0%, rgba(192,38,211,0.08) 50%, transparent 70%)",
            }}
          />
          {/* Theme bleed: bottom-right corner glow */}
          <div
            className="pointer-events-none absolute -bottom-12 -right-12 w-64 h-64 z-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle, rgba(192,38,211,0.18) 0%, rgba(124,58,237,0.06) 50%, transparent 70%)",
            }}
          />
          {/* Theme bleed: top edge */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1 z-20"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(90deg, rgba(124,58,237,0.6) 0%, rgba(192,38,211,0.5) 50%, rgba(124,58,237,0.6) 100%)",
            }}
          />

          <div
            className="relative z-10 p-6 md:p-8"
            style={{
              background:
                "linear-gradient(135deg, rgba(26,16,48,0.85) 0%, rgba(15,10,30,0.9) 50%, rgba(26,16,48,0.85) 100%)",
              border: "1px solid rgba(124,58,237,0.15)",
            }}
          >
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Flyer — large, with theme border bleed */}
              <div className="w-full lg:w-[340px] flex-shrink-0 relative">
                {/* Purple/magenta glow behind flyer */}
                <div
                  className="absolute -inset-3 rounded-2xl z-0"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(192,38,211,0.15) 50%, rgba(124,58,237,0.20) 100%)",
                    filter: "blur(12px)",
                  }}
                />
                <div
                  className="relative z-10 rounded-xl overflow-hidden"
                  style={{
                    border: "2px solid rgba(124,58,237,0.30)",
                    boxShadow:
                      "0 4px 24px rgba(0,0,0,0.4), 0 0 20px rgba(124,58,237,0.12)",
                  }}
                >
                  <FlyerWithModal
                    src={upcomingEvent.flyerSrc}
                    alt={upcomingEvent.flyerAlt}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Event info */}
              <div className="flex-1 space-y-4 min-w-0">
                <div className="flex items-center gap-2">
                  <IceCream className="w-5 h-5 flex-shrink-0" style={{ color: "var(--nec-pink)" }} aria-hidden="true" />
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "var(--nec-pink)" }}
                  >
                    Ice Cream Social / Speed Fellowship
                  </span>
                </div>

                <h3
                  className="text-2xl md:text-3xl font-black text-white"
                  style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
                >
                  {upcomingEvent.title}
                </h3>

                <div className="flex flex-col sm:flex-row gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-cyan)" }} aria-hidden="true" />
                    {upcomingEvent.date}
                  </span>
                  <span className="inline-flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-gold)" }} aria-hidden="true" />
                    {upcomingEvent.location}
                  </span>
                </div>

                {upcomingEvent.schedule.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {upcomingEvent.schedule.map((s) => (
                      <span
                        key={s.label}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                        style={{
                          background: "rgba(124,58,237,0.10)",
                          border: "1px solid rgba(124,58,237,0.25)",
                          color: "var(--nec-cyan)",
                        }}
                      >
                        {s.time} — {s.label}
                      </span>
                    ))}
                  </div>
                )}

                {upcomingEvent.details.length > 0 && (
                  <div className="space-y-1.5">
                    {upcomingEvent.details.map((d) => (
                      <p key={d.label} className="text-sm text-gray-300">
                        <span className="font-semibold text-gray-400">{d.label}: </span>
                        {d.value}
                      </p>
                    ))}
                  </div>
                )}

                <p
                  className="text-sm leading-relaxed italic"
                  style={{ color: "var(--nec-muted)" }}
                >
                  {upcomingEvent.description}
                </p>

                <div
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg"
                  style={{
                    background: "rgba(124,58,237,0.10)",
                    border: "1px solid rgba(124,58,237,0.20)",
                    color: "var(--nec-purple)",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  See you there!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Past Events Archive ─────────────────────────────────── */}
      <section id="past-events" aria-label="Past events archive">
        <div className="mb-6">
          <span className="section-badge">Archive</span>
          <h2 className="section-heading mt-3" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Past Events</h2>
          <p className="mt-2 text-sm text-gray-400">
            A look back at the events that brought us here. Thanks to everyone who showed up.
          </p>
        </div>

        <div className="space-y-5">
          {pastEvents.map((event) => (
            <div
              key={event.id}
              className="nec-card p-5 md:p-6 group transition-all duration-200 hover:-translate-y-0.5"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)" }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Info */}
                <div className="flex-1 space-y-3 min-w-0">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--nec-purple)", textShadow: "0 0 12px rgba(124,58,237,0.2)" }}
                  >
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <span className="text-gray-300">
                      <span className="font-semibold text-gray-400">Date: </span>
                      {event.date}
                    </span>
                    {event.location && (
                      <span className="text-gray-300">
                        <span className="font-semibold text-gray-400">Location: </span>
                        {event.location}
                      </span>
                    )}
                  </div>

                  {event.schedule.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Schedule</p>
                      <ul className="space-y-0.5">
                        {event.schedule.map((s) => (
                          <li key={s.label} className="text-sm text-gray-300">
                            <span className="font-semibold text-gray-400">{s.time}</span>
                            {" — "}
                            {s.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {event.details.length > 0 && (
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                      {event.details.map((d) => (
                        <span key={d.label} className="text-sm text-gray-300">
                          <span className="font-semibold text-gray-400">{d.label}: </span>
                          {d.value}
                        </span>
                      ))}
                    </div>
                  )}

                  {event.description && (
                    <p className="text-sm text-gray-500 italic leading-relaxed">{event.description}</p>
                  )}
                </div>

                {/* Flyer */}
                <div
                  className="w-full md:w-56 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200"
                  style={{ border: "1px solid var(--nec-border)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
                >
                  <FlyerWithModal
                    src={event.flyerSrc}
                    alt={event.flyerAlt}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
