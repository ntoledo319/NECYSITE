import { Link } from "@/i18n/navigation"
import { Mail, Calendar, Users, Hotel, AlertCircle } from "lucide-react"
import { CONTACT_EMAIL, CONVENTION_DATES, CONVENTION_VENUE, HOTEL_BOOKING_URL } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"

export interface VerifiedGroupRegistration {
  organizationName: string
  contactName: string | null
  contactEmail: string
  quantity: number
  submissionDeadline: string
  amountTotalCents: number | null
}

function formatDeadline(iso: string): string {
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return iso
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
}

function formatCurrency(cents: number | null): string | null {
  if (cents == null) return null
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100)
}

export default function GroupConfirmed({ registration }: { registration: VerifiedGroupRegistration }) {
  const deadline = formatDeadline(registration.submissionDeadline)
  const totalLabel = formatCurrency(registration.amountTotalCents)
  const firstName = registration.contactName?.split(" ")[0] ?? null
  const greeting = firstName ? `You're set, ${firstName}.` : "You're set."

  const mailtoSubject = encodeURIComponent(
    `NECYPAA XXXVI attendee names — ${registration.organizationName}`,
  )
  const mailtoBody = encodeURIComponent(
    `Hi NECYPAA Host Committee,\n\nHere are the attendee names for our ${registration.quantity} reserved seats:\n\n1. Full name — email (optional)\n2.\n3.\n\nThanks,\n${registration.contactName ?? ""}\n${registration.organizationName}`,
  )

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
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-6">
              <div className="nec-success-card-purple overflow-hidden p-8 md:p-10">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="nec-success-icon-purple flex h-16 w-16 items-center justify-center rounded-full">
                      <Users className="h-8 w-8 text-[var(--nec-cyan)]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--nec-cyan)]">
                        Group Purchase Confirmed
                      </p>
                      <h1 className="nec-heading-shadow mt-1 text-3xl font-black text-[var(--nec-text)]">{greeting}</h1>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-base text-[var(--nec-text)]">
                      <strong>{registration.quantity} seats</strong> reserved for{" "}
                      <strong>{registration.organizationName}</strong> at NECYPAA XXXVI &mdash; Hartford, CT.
                    </p>
                    <p className="text-sm text-[var(--nec-muted)]">
                      {CONVENTION_DATES} &middot; {CONVENTION_VENUE}
                    </p>
                    {totalLabel && (
                      <p className="text-sm text-[var(--nec-muted)]">Total charged: {totalLabel}</p>
                    )}
                  </div>

                  <div className="rounded-[1.4rem] border border-[rgba(var(--nec-gold-rgb),0.36)] bg-[rgba(var(--nec-gold-rgb),0.10)] p-5">
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--nec-gold)]" aria-hidden="true" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--nec-gold)]">
                          Submit Attendee Names By
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[var(--nec-text)]">{deadline}</p>
                        <p className="mt-1 text-xs text-[var(--nec-muted)]">
                          The day the convention starts. After this date, unassigned seats can still be used onsite for
                          walk-ins.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-[1.4rem] border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.7)] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--nec-muted)]">
                      How To Send Names
                    </p>
                    <ol className="space-y-2 text-sm leading-7 text-[var(--nec-text)]">
                      <li>
                        <strong>1.</strong> Check your inbox for a confirmation email at{" "}
                        <strong className="text-[var(--nec-cyan)]">{registration.contactEmail}</strong>.
                      </li>
                      <li>
                        <strong>2.</strong> Reply to that email with the full name (and email, if you have it) for each
                        of your {registration.quantity} attendees.
                      </li>
                      <li>
                        <strong>3.</strong> We&apos;ll email each attendee the convention policy directly. Every
                        attendee signs the policy in their own name &mdash; you don&apos;t sign on their behalf.
                      </li>
                    </ol>
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`}
                      className="btn-primary mt-2 inline-flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      Send Names Now
                    </a>
                  </div>

                  <div className="flex items-start gap-3 rounded-[1.4rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.5)] p-4 text-sm leading-6 text-[var(--nec-muted)]">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--nec-purple)]" aria-hidden="true" />
                    <p>
                      Receipt from Stripe is on its way to {registration.contactEmail}. Hold onto it for your records.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28">
              <div className="nec-reg-help-card space-y-4 rounded-[1.6rem] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--nec-muted)]">Next Up</p>
                <a
                  href={HOTEL_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full !justify-center"
                >
                  <Hotel className="h-4 w-4" aria-hidden="true" />
                  Book Hotel Block
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
                <p className="text-xs text-[var(--nec-muted)]">
                  Hartford Marriott Downtown &mdash; group rate available. Reserve early; rooms go fast.
                </p>
              </div>

              <div className="nec-reg-help-card space-y-2 rounded-[1.6rem] p-5 text-center">
                <p className="text-xs text-[var(--nec-muted)]">Questions or changes?</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--nec-cyan)] transition-opacity hover:opacity-75"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div className="text-center">
                <Link href="/" className="btn-ghost w-full !justify-center !text-sm">
                  Back to Home
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
