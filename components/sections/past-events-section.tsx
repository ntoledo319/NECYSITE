"use client"

import { pastEvents } from "@/lib/data/events"
import FlyerWithModal from "@/components/flyer-with-modal"

export default function PastEventsSection() {
  return (
    <section id="past-events" aria-label="Past events archive" className="px-4 md:px-0">
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
                  style={{ color: "var(--nec-cyan)", textShadow: "0 0 12px rgba(0,212,232,0.2)" }}
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
  )
}
