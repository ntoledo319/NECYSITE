"use client"

import Link from "next/link"
import {
  ArrowRight,
  CheckCircle,
  Hotel,
  Home,
  Mail,
  Receipt,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import AddToCalendar from "@/components/add-to-calendar"
import ShareMenu from "@/components/share-menu"
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

const nextSteps = [
  {
    title: "Book the host hotel",
    copy:
      "Keep the whole weekend within walking distance of the ballroom, marathon rooms, and breakfast events.",
  },
  {
    title: "Save the convention dates",
    copy:
      `${CONVENTION_DATES}. Plan for travel on both ends so you can land without rushing the weekend.`,
  },
  {
    title: "Watch for program updates",
    copy:
      "Speaker, workshop, and entertainment details will keep filling in as the committee releases more of the schedule.",
  },
]

const confirmationNotes = [
  { label: "Receipt", value: "Sent to your email" },
  { label: "Check-in", value: "Use your registration name" },
  { label: "Venue", value: CONVENTION_VENUE },
]

export default function RegistrationSuccessPage() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="relative min-h-screen min-h-screen-safe bg-[var(--nec-navy)]">
      <PageArtAccents
        character="cheshire-cat"
        accentColor="var(--nec-cyan)"
        variant="subtle"
        dividerVariant="compass"
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
            <span className="section-badge">Registration Confirmed</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl lg:text-6xl">
              You&apos;re officially in for NECYPAA XXXVI.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--nec-muted)]">
              Your registration is locked in. Keep this page as your weekend launchpad for hotel,
              calendar, breakfast, and the next details you&apos;ll want before Hartford.
            </p>
          </motion.header>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <motion.section
              className="space-y-6"
              variants={shouldReduce ? undefined : fadeUp}
              transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
              aria-label="Registration confirmation"
            >
              <div className="nec-reg-card overflow-hidden p-7 md:p-9">
                <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[rgba(var(--nec-purple-rgb),0.10)] pb-6">
                  <div className="max-w-2xl">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(var(--nec-cyan-rgb),0.18)] bg-[rgba(var(--nec-cyan-rgb),0.08)] text-[var(--nec-cyan)]">
                      <CheckCircle className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--nec-cyan)]">
                      Confirmation Archived
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                      Hartford has your name on the list.
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
                      A receipt was sent to the email you provided. Hold on to it for your records,
                      and use your registration name at check-in when you arrive at convention.
                    </p>
                  </div>

                  <div className="grid min-w-[15rem] gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    {confirmationNotes.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.68)] p-4"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-muted)]">
                          {item.label}
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--nec-text)]">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {nextSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="rounded-[1.4rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.64)] p-5"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(var(--nec-cyan-rgb),0.18)] bg-[rgba(var(--nec-cyan-rgb),0.08)] text-sm font-semibold text-[var(--nec-cyan)]">
                        {index + 1}
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-[var(--nec-text)]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--nec-muted)]">
                        {step.copy}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.6rem] border border-[rgba(var(--nec-orange-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-orange-rgb),0.10),rgba(var(--nec-card-rgb),0.82))] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(var(--nec-orange-rgb),0.18)] bg-[rgba(var(--nec-orange-rgb),0.10)] text-[var(--nec-orange)]">
                      <UtensilsCrossed className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-orange)]">
                        Morning Add-On
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-[var(--nec-text)]">
                        Breakfast tickets still available
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--nec-muted)]">
                    If you want the weekend to open with coffee, fellowship, and one less line to
                    think about, grab breakfast before you close this tab.
                  </p>
                  <Link
                    href="/breakfast"
                    className="btn-secondary mt-5 border-[rgba(var(--nec-orange-rgb),0.24)] text-[var(--nec-orange)]"
                  >
                    Get Breakfast Tickets
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>

                <div className="rounded-[1.6rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.72)] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-purple-rgb),0.06)] text-[var(--nec-purple)]">
                      <Receipt className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                        Need Changes?
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-[var(--nec-text)]">
                        Registration help is one email away
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--nec-muted)]">
                    Questions about scholarship purchases, accessibility requests, or correcting a
                    registration detail can go directly to the host committee.
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
                <p className="form-section-label">Weekend Ready</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                  Your next moves are simple.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
                  Hotel, calendar, and home base. The rest of the program can arrive gradually.
                </p>

                <div className="mt-6 space-y-3">
                  <a
                    href={HOTEL_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full !justify-center"
                  >
                    <Hotel className="h-4 w-4" aria-hidden="true" />
                    Book Host Hotel
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <AddToCalendar className="w-full !justify-center" />
                  <Link href="/" className="btn-ghost w-full !justify-center">
                    <Home className="h-4 w-4" aria-hidden="true" />
                    Back to Home
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.08),rgba(var(--nec-card-rgb),0.78))] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-gold-rgb),0.10)] text-[var(--nec-gold)]">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                      Convention Window
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--nec-text)]">
                      {CONVENTION_DATES}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--nec-muted)]">
                  New Year&apos;s weekend moves fast. Reserving the basics now lets the rest of the
                  experience stay loose, present, and fun.
                </p>
              </div>

              <div className="text-center">
                <ShareMenu
                  text="I just registered for NECYPAA XXXVI in Hartford. Come make the trip with me."
                  url="https://www.necypaact.com/register"
                  triggerClassName="btn-ghost w-full !justify-center"
                  triggerLabel="Tell Your Friends"
                />
              </div>

              <div className="text-center">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--nec-muted)] transition-opacity hover:opacity-80"
                >
                  Register another person
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
