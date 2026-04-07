"use client"

import Link from "next/link"
import {
  ArrowRight,
  CheckCircle,
  Coffee,
  Home,
  Hotel,
  Mail,
  Sparkles,
} from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import PageArtAccents from "@/components/art/page-art-accents"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"
import {
  CONTACT_EMAIL,
  CONVENTION_DATES,
  CONVENTION_VENUE,
  HOTEL_BOOKING_URL,
} from "@/lib/constants"

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

const breakfastNotes = [
  {
    title: "Check in by name",
    copy: "No printout is required. Just give your name at the breakfast door and the team will handle the rest.",
  },
  {
    title: "Stay near the ballroom",
    copy: "Booking the host hotel keeps breakfast, meetings, and late-night fellowship on the same footprint.",
  },
  {
    title: "Complete the full weekend",
    copy: "If breakfast is booked before registration, finish the convention pass next so the whole itinerary is covered.",
  },
]

export default function BreakfastSuccessPage() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="relative min-h-screen min-h-screen-safe bg-[var(--nec-navy)]">
      <PageArtAccents
        character="caterpillar"
        accentColor="var(--nec-orange)"
        variant="subtle"
        dividerVariant="potion"
      />

      <div className="container relative z-10 mx-auto px-4 pb-16 pt-24">
        <motion.div
          className="mx-auto max-w-6xl"
          variants={shouldReduce ? undefined : staggerContainer}
          initial={shouldReduce ? undefined : "hidden"}
          animate="show"
        >
          <motion.header
            className="max-w-3xl"
            variants={shouldReduce ? undefined : fadeUp}
            transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
          >
            <span className="section-badge">Breakfast Confirmed</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl lg:text-6xl">
              Your seat at breakfast is set.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--nec-muted)]">
              You&apos;re covered for one of the easiest fellowship moments of the weekend: a warm
              meal, early connection, and a softer landing before the rest of convention unfolds.
            </p>
          </motion.header>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <motion.section
              className="space-y-6"
              variants={shouldReduce ? undefined : fadeUp}
              transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
              aria-label="Breakfast confirmation"
            >
              <div className="overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-orange-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-orange-rgb),0.12),rgba(var(--nec-card-rgb),0.86))] p-7 md:p-9">
                <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[rgba(var(--nec-orange-rgb),0.14)] pb-6">
                  <div className="max-w-2xl">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(var(--nec-gold-rgb),0.20)] bg-[rgba(var(--nec-gold-rgb),0.12)] text-[var(--nec-gold)]">
                      <CheckCircle className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--nec-gold)]">
                      Morning Plans Locked
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                      Breakfast tickets are confirmed.
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
                      A receipt was sent to the email you entered. Breakfast will be served at the{" "}
                      {CONVENTION_VENUE}, and your name is all you need when you check in.
                    </p>
                  </div>

                  <div className="grid min-w-[15rem] gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    <div className="rounded-[1.35rem] border border-[rgba(var(--nec-orange-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.68)] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">
                        Receipt
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">
                        Delivered by email
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] border border-[rgba(var(--nec-orange-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.68)] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">
                        Venue
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">
                        Hartford Marriott Downtown
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] border border-[rgba(var(--nec-orange-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.68)] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">
                        Weekend
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">
                        {CONVENTION_DATES}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {breakfastNotes.map((item, index) => (
                    <div
                      key={item.title}
                      className="rounded-[1.4rem] border border-[rgba(var(--nec-orange-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.64)] p-5"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-gold-rgb),0.10)] text-sm font-semibold text-[var(--nec-gold)]">
                        {index + 1}
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-[var(--nec-text)]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--nec-muted)]">
                        {item.copy}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[1.6rem] border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.10),rgba(var(--nec-card-rgb),0.78))] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-gold-rgb),0.10)] text-[var(--nec-gold)]">
                      <Coffee className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                        Breakfast Mood
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-[var(--nec-text)]">
                        A gentler start to New Year&apos;s morning
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--nec-muted)]">
                    This ticket is not just a meal. It buys you one more place to sit down with
                    people before the full pace of the weekend takes over.
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-[rgba(var(--nec-orange-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.74)] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(var(--nec-orange-rgb),0.18)] bg-[rgba(var(--nec-orange-rgb),0.10)] text-[var(--nec-orange)]">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-orange)]">
                        Questions?
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-[var(--nec-text)]">
                        We can sort out breakfast details quickly
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--nec-muted)]">
                    If you need help updating a ticket or confirming logistics, email the host
                    committee directly.
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--nec-cyan)] transition-opacity hover:opacity-80"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </motion.section>

            <motion.aside
              className="space-y-4 lg:sticky lg:top-28"
              variants={shouldReduce ? undefined : fadeUp}
              transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
            >
              <div className="nec-card p-6">
                <p className="form-section-label">Complete the Weekend</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                  Breakfast is set. Convention is next.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
                  If this was your first purchase, finish the rest of the trip while you&apos;re still
                  in planning mode.
                </p>

                <div className="mt-6 space-y-3">
                  <Link href="/register" className="btn-primary w-full !justify-center">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    Register for Convention
                  </Link>
                  <a
                    href={HOTEL_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full !justify-center"
                  >
                    <Hotel className="h-4 w-4" aria-hidden="true" />
                    Book Host Hotel
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <Link href="/" className="btn-ghost w-full !justify-center">
                    <Home className="h-4 w-4" aria-hidden="true" />
                    Back to Home
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.74)] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-purple-rgb),0.06)] text-[var(--nec-purple)]">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                      Hartford Reminder
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--nec-text)]">
                      Breakfast lives inside the larger convention weekend
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--nec-muted)]">
                  Staying close to the venue means one less commute, one less missed connection, and
                  more time where the fellowship actually happens.
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/breakfast"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--nec-muted)] transition-opacity hover:opacity-80"
                >
                  Buy more breakfast tickets
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
