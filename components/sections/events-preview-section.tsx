"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import type { EventData } from "@/lib/data/events"
import FlyerWithModal from "@/components/flyer-with-modal"
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react"
import {
  SPRING_GENTLE,
  SpotlightCard,
  staggerContainer,
  staggerChild,
} from "@/components/ui/motion-primitives"

interface EventsPreviewSectionProps {
  upcomingEvent: EventData | null
  pastEvents: EventData[]
}

export default function EventsPreviewSection({ upcomingEvent, pastEvents }: EventsPreviewSectionProps) {
  const shouldReduce = useReducedMotion()

  return (
    <section id="events" aria-label="Events preview" className="px-4 md:px-0 space-y-10">
      {/* ── Featured Upcoming Event ──────────────────────────── */}
      <div>
        <motion.div
          className="mb-8"
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={SPRING_GENTLE}
        >
          <span className="section-badge section-badge-shimmer">Coming Up</span>
          <h2 className="section-heading mt-3" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            Next Event
          </h2>
          <p className="mt-2 text-base text-[var(--nec-muted)] max-w-xl">
            Our next fundraiser is right around the corner. Come hang!
          </p>
        </motion.div>

        {upcomingEvent ? (
          <SpotlightCard
            className="relative rounded-2xl overflow-hidden"
            spotlightColor="rgba(124,58,237,0.10)"
            spotlightSize={500}
          >
            <div
              className="absolute inset-0 rounded-[inherit] z-0"
              style={{
                boxShadow:
                  "0 8px 40px rgba(0,0,0,0.35), 0 0 60px rgba(124,58,237,0.08), 0 0 120px rgba(192,38,211,0.05)",
              }}
            />
            {/* Glow effects */}
            <div
              className="pointer-events-none absolute -top-12 -left-12 w-64 h-64 z-0"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle, rgba(124,58,237,0.20) 0%, rgba(192,38,211,0.08) 50%, transparent 70%)",
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-12 -right-12 w-64 h-64 z-0"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle, rgba(192,38,211,0.18) 0%, rgba(124,58,237,0.06) 50%, transparent 70%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 z-20"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(90deg, rgba(124,58,237,0.6) 0%, rgba(192,38,211,0.5) 50%, rgba(124,58,237,0.6) 100%)",
              }}
            />

            <div
              className="nec-event-card relative z-10 p-6 md:p-8"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26,16,48,0.85) 0%, rgba(15,10,30,0.9) 50%, rgba(26,16,48,0.85) 100%)",
                border: "1px solid rgba(124,58,237,0.15)",
              }}
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Flyer */}
                <div className="w-full lg:w-[340px] flex-shrink-0 relative">
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
                  <h3
                    className="text-2xl md:text-3xl font-black text-white"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
                  >
                    {upcomingEvent.title}
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 text-[var(--nec-muted)]">
                      <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-cyan)" }} aria-hidden="true" />
                      {upcomingEvent.date}
                    </span>
                    <span className="inline-flex items-center gap-2 text-[var(--nec-muted)]">
                      <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-gold)" }} aria-hidden="true" />
                      {upcomingEvent.location}
                    </span>
                  </div>

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
          </SpotlightCard>
        ) : (
          <div className="p-8 rounded-[2rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.8)] shadow-sm text-center">
            <h3 className="text-xl font-bold text-[var(--nec-text)] mb-2">No Upcoming Events</h3>
            <p className="text-[var(--nec-muted)]">The committee is planning the next big thing. Check back soon!</p>
          </div>
        )}
      </div>

      {/* ── Recent Past Events (compact scroll strip) ─────────── */}
      {pastEvents.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--nec-cyan)", textShadow: "0 0 12px rgba(20,184,166,0.15)" }}
            >
              Past Events
            </h2>
            <Link
              href="/events"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition-colors hover:opacity-80"
              style={{ color: "var(--nec-cyan)" }}
            >
              View All <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <motion.div
            className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-thin"
            role="list"
            aria-label="Recent past events"
            style={{ scrollbarColor: "rgba(124,58,237,0.25) transparent" }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {pastEvents.slice(0, 4).map((event) => (
              <motion.div
                key={event.id}
                role="listitem"
                className="flex-shrink-0 w-36 sm:w-40 snap-start group"
                variants={staggerChild}
              >
                <div
                  className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-2 transition-transform duration-200 group-hover:-translate-y-0.5"
                  style={{
                    border: "1px solid var(--nec-border)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  <FlyerWithModal
                    src={event.flyerSrc}
                    alt={event.flyerAlt}
                    className="rounded-xl"
                  />
                </div>
                <h3
                  className="text-xs font-bold leading-tight mb-0.5 line-clamp-2"
                  style={{ color: "var(--nec-text)" }}
                >
                  {event.title}
                </h3>
                <p className="text-[10px]" style={{ color: "var(--nec-muted)" }}>
                  {event.date.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*/, "")}
                </p>
              </motion.div>
            ))}

            {pastEvents.length > 4 && (
              <Link
                href="/events"
                className="flex-shrink-0 w-36 sm:w-40 snap-start flex flex-col items-center justify-center rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "rgba(26,16,48,0.5)",
                  border: "1px dashed rgba(124,58,237,0.25)",
                  aspectRatio: "3/4",
                }}
              >
                <span
                  className="text-lg font-black mb-1"
                  style={{ color: "var(--nec-purple)" }}
                >
                  +{pastEvents.length - 4}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--nec-muted)" }}
                >
                  More Events
                </span>
              </Link>
            )}
          </motion.div>
        </div>
      )}
    </section>
  )
}
