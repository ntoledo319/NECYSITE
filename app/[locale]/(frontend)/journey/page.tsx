import type { Metadata } from "next"
import Image from "next/image"
import { pastEvents } from "@/lib/data/events"
import { Calendar, MapPin } from "lucide-react"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"

export const metadata: Metadata = {
  title: "The Journey Comes First — NECYPAA XXXVI",
  description:
    "An archive of the journey to NECYPAA XXXVI — past events, fundraisers, and milestones from the CT Host Committee.",
}

export default function JourneyPage() {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: "var(--nec-navy)" }}>
      <main className="flex-1 pt-24 pb-20 md:pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page header */}
            <div className="text-center mb-12 relative">
              {/* Caterpillar accent — left */}
              <div className="hidden lg:block absolute -left-10 top-1/2 -translate-y-1/2 w-24 h-36 opacity-[0.09] pointer-events-none" aria-hidden="true">
                <Image src="/images/caterpillar-character.png" alt="" width={96} height={144} className="w-full h-full object-contain" aria-hidden="true" />
              </div>
              {/* Mad Hatter accent — right */}
              <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2 w-20 h-32 opacity-[0.07] pointer-events-none" aria-hidden="true">
                <Image src="/images/mad-hatter-character.png" alt="" width={80} height={120} className="w-full h-full object-contain" aria-hidden="true" />
              </div>
              <span className="section-badge mb-4 inline-block">Archive</span>
              <h1 className="section-heading mb-3">The Journey Comes First</h1>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--nec-muted)" }}>
                A look back at the events, fundraisers, and fellowship that brought us to Hartford. The
                journey is the point.
              </p>
            </div>

            {/* Event timeline */}
            <div className="space-y-6">
              {pastEvents.map((event) => (
                <article
                  key={event.id}
                  className="nec-card p-6 md:p-8 transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Event info */}
                    <div className="flex-1 space-y-3">
                      <h2 className="text-xl md:text-2xl font-bold text-white">{event.title}</h2>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm" style={{ color: "var(--nec-muted)" }}>
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-cyan)" }} />
                          {event.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-pink)" }} />
                          {event.location}
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed" style={{ color: "var(--nec-text)" }}>
                        {event.description}
                      </p>

                      {/* Schedule */}
                      {event.schedule.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {event.schedule.map((s) => (
                            <span
                              key={s.label}
                              className="text-xs px-2.5 py-1 rounded-lg font-medium"
                              style={{
                                background: "rgba(124,58,237,0.08)",
                                border: "1px solid rgba(124,58,237,0.2)",
                                color: "var(--nec-cyan)",
                              }}
                            >
                              {s.label}: {s.time}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Details */}
                      {event.details.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {event.details.map((d) => (
                            <span
                              key={d.label}
                              className="text-xs px-2.5 py-1 rounded-lg font-medium"
                              style={{
                                background: "rgba(192,38,211,0.06)",
                                border: "1px solid rgba(192,38,211,0.15)",
                                color: "var(--nec-muted)",
                              }}
                            >
                              {d.label}: {d.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Bottom note */}
            <div className="mt-12 text-center">
              <p className="text-sm" style={{ color: "var(--nec-muted)" }}>
                More events to come. The journey continues.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
