"use client"

import Link from "next/link"
import { ShieldCheck, Hotel, Home, Mail, ArrowRight, UtensilsCrossed, KeyRound } from "lucide-react"
import { HOTEL_BOOKING_URL, CONTACT_EMAIL, CONVENTION_DATES, CONVENTION_VENUE } from "@/lib/constants"
import AddToCalendar from "@/components/add-to-calendar"
import ShareMenu from "@/components/share-menu"
import PageArtAccents from "@/components/art/page-art-accents"
import { motion, useReducedMotion } from "framer-motion"
import { SPRING_GENTLE } from "@/components/ui/motion-primitives"

export interface VerifiedRegistration {
  customerName: string | null
  customerEmail: string | null
  amountTotal: number | null
  currency: string | null
  purchaseType: string | null
  lineItems: {
    description: string
    quantity: number | null
    amountTotal: number
  }[]
}

interface Props {
  registration?: VerifiedRegistration
}

function formatCurrency(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export default function RegistrationConfirmed({ registration }: Props) {
  const shouldReduce = useReducedMotion()
  const isPaid = !!registration
  const name = registration?.customerName
  const email = registration?.customerEmail

  const heading = name ? `You\u2019re in, ${name}.` : "You\u2019re in."

  return (
    <div className="min-h-screen-safe relative flex min-h-screen flex-col overflow-hidden bg-[var(--nec-navy)]">
      <PageArtAccents
        character="cheshire-cat"
        accentColor="var(--nec-cyan)"
        variant="subtle"
        dividerVariant="compass"
      />

      <div
        className="nec-accent-bar fixed left-0 right-0 top-0 z-50 h-[2px]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--nec-pink) 20%, var(--nec-cyan) 50%, var(--nec-orange) 80%, transparent 100%)",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 py-16 pt-24">
        <motion.div
          className="mx-auto max-w-6xl"
          variants={shouldReduce ? undefined : staggerContainer}
          initial={shouldReduce ? undefined : "hidden"}
          animate="show"
        >
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <motion.div
              className="space-y-6"
              variants={shouldReduce ? undefined : fadeUp}
              transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
            >
              <div className="nec-success-card-purple overflow-hidden p-8 md:p-10">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                  <div className="space-y-5 text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start">
                      <div className="nec-success-icon-purple flex h-20 w-20 items-center justify-center rounded-full">
                        {isPaid ? (
                          <ShieldCheck className="h-10 w-10 text-[var(--nec-cyan)]" aria-hidden="true" />
                        ) : (
                          <KeyRound className="h-10 w-10 text-[var(--nec-cyan)]" aria-hidden="true" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="nec-heading-shadow text-3xl font-black text-[var(--nec-text)]">{heading}</h1>
                      <p className="text-base font-semibold text-[var(--nec-cyan)]">
                        NECYPAA XXXVI &middot; Hartford, CT
                      </p>
                      <p className="text-sm text-[var(--nec-muted)]">
                        {CONVENTION_DATES} &middot; {CONVENTION_VENUE}
                      </p>
                    </div>

                    {/* ── Verification badge ──────────────────── */}
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
                      style={{
                        background: "rgba(var(--nec-cyan-rgb), 0.12)",
                        border: "1px solid rgba(var(--nec-cyan-rgb), 0.24)",
                        color: "var(--nec-cyan)",
                      }}
                      role="status"
                      aria-live="polite"
                    >
                      {isPaid ? (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                          Payment Verified
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                          Access Code Accepted
                        </>
                      )}
                    </div>

                    <p className="text-sm leading-relaxed text-[var(--nec-text)]">
                      Your registration is confirmed.{" "}
                      {isPaid && email ? (
                        <>
                          A receipt was sent to <strong className="text-[var(--nec-cyan)]">{email}</strong>. Keep it for
                          your records &mdash; you&apos;ll need your registration confirmation at check-in.
                        </>
                      ) : isPaid ? (
                        <>
                          A receipt was sent to the email you provided. Keep it for your records &mdash; you&apos;ll
                          need your registration confirmation at check-in.
                        </>
                      ) : (
                        <>
                          Your access code has been redeemed. You&apos;ll need your registration confirmation at
                          check-in.
                        </>
                      )}
                    </p>
                    <p className="text-sm italic leading-relaxed text-[var(--nec-muted)]">
                      We can&apos;t wait to welcome you to Hartford. This is going to be special.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* ── Order receipt (paid flow only) ────── */}
                    {isPaid && registration.lineItems.length > 0 && (
                      <div className="rounded-[1.4rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.70)] p-5">
                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">
                          Order Summary
                        </p>
                        <div className="space-y-2">
                          {registration.lineItems.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-[var(--nec-text)]">
                                {item.description}
                                {item.quantity && item.quantity > 1 ? ` \u00d7${item.quantity}` : ""}
                              </span>
                              <span className="font-medium tabular-nums text-[var(--nec-muted)]">
                                {formatCurrency(item.amountTotal, registration.currency ?? "usd")}
                              </span>
                            </div>
                          ))}
                        </div>
                        {registration.amountTotal != null && (
                          <div className="mt-3 flex justify-between border-t border-[rgba(var(--nec-purple-rgb),0.10)] pt-3">
                            <span className="text-sm font-bold text-[var(--nec-text)]">Total Paid</span>
                            <span className="text-sm font-bold tabular-nums text-[var(--nec-cyan)]">
                              {formatCurrency(registration.amountTotal, registration.currency ?? "usd")}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Next steps ──────────────────────────── */}
                    <div className="rounded-[1.6rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.70)] p-6 text-left">
                      <p className="text-xs font-bold uppercase tracking-widest text-[var(--nec-muted)]">Next Steps</p>

                      <div className="mt-4 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="nec-step-badge-purple mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                            1
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--nec-text)]">Book your hotel room</p>
                            <p className="mt-0.5 text-xs text-[var(--nec-muted)]">
                              Secure your room at the Hartford Marriott Downtown at our special group rate before the
                              block fills up.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="nec-step-badge-purple mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                            2
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--nec-text)]">Save the dates</p>
                            <p className="mt-0.5 text-xs text-[var(--nec-muted)]">
                              {CONVENTION_DATES}. Plan for travel on both ends &mdash; it&apos;s New Year&apos;s Eve!
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="nec-step-badge-purple mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                            3
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--nec-text)]">Stay in the loop</p>
                            <p className="mt-0.5 text-xs text-[var(--nec-muted)]">
                              Check back at this site for schedule, speakers, and event updates as we get closer to
                              convention.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.94fr_1.06fr]">
                <motion.div
                  className="nec-reg-accent-orange space-y-3 p-5"
                  variants={shouldReduce ? undefined : fadeUp}
                  transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
                >
                  <div className="flex items-center gap-3">
                    <div className="nec-step-badge-orange flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                      <UtensilsCrossed className="h-5 w-5 text-[var(--nec-orange)]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--nec-text)]">Don&apos;t forget breakfast!</p>
                      <p className="mt-0.5 text-xs text-[var(--nec-muted)]">
                        Start your New Year right with the NECYPAA XXXVI breakfast event.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/breakfast"
                    className="btn-ghost w-full !justify-center border-[rgba(234,88,12,0.35)] !text-sm text-[var(--nec-orange)]"
                  >
                    Get Breakfast Tickets
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </motion.div>

                <motion.div
                  className="nec-reg-help-card space-y-4 rounded-[1.6rem] p-5"
                  variants={shouldReduce ? undefined : fadeUp}
                  transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
                >
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={HOTEL_BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex-1 !justify-center"
                    >
                      <Hotel className="h-4 w-4" aria-hidden="true" />
                      Book Hotel Now
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                    <AddToCalendar variant="ghost" className="flex-1 !justify-center" />
                  </div>

                  <div className="flex">
                    <Link href="/" className="btn-ghost flex-1 !justify-center">
                      <Home className="h-4 w-4" aria-hidden="true" />
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.aside
              className="space-y-4 lg:sticky lg:top-28"
              variants={shouldReduce ? undefined : fadeUp}
              transition={shouldReduce ? { duration: 0 } : SPRING_GENTLE}
            >
              <div className="text-center">
                <ShareMenu
                  text="I just registered for NECYPAA XXXVI \u2014 Escaping the Mad Realm! Hartford, CT \u00b7 New Year\u2019s Eve 2026"
                  url="https://www.necypaact.com/register"
                  triggerClassName="btn-ghost w-full !justify-center !text-sm"
                  triggerLabel="Tell Your Friends"
                />
              </div>

              <div className="nec-reg-help-card space-y-2 rounded-[1.6rem] p-5 text-center">
                <p className="text-xs text-[var(--nec-muted)]">Questions or need help with your registration?</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--nec-cyan)] transition-opacity hover:opacity-75"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div className="text-center">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1 text-xs text-[var(--nec-muted)] transition-colors hover:opacity-80"
                >
                  Register another person
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
