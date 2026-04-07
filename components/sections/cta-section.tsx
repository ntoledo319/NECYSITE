"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink, Hotel, Users } from "lucide-react"
import { HOTEL_BOOKING_URL } from "@/lib/constants"

const registrationHighlights = [
  "Panels, speakers, outreach, dances, and fellowship all weekend.",
  "A central downtown hotel so the whole convention feels connected.",
  "A clearer road map for first-timers and returning YPAA people alike.",
]

export default function CTASection() {
  return (
    <section aria-label="Plan your convention weekend" className="space-y-6">
      <div className="max-w-2xl">
        <span className="section-badge">Plan Your Weekend</span>
        <h2 className="section-heading mt-5">Start with the two decisions that matter most.</h2>
        <p className="mt-4 text-lg leading-8 text-[var(--nec-muted)]">
          Register early, book the hotel, and let the rest of the weekend unfold from there. The
          site should feel like a guide, not a maze, so these actions stay close to the top.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <article className="nec-card relative overflow-hidden p-8 md:p-10">
          <div
            className="absolute inset-y-0 right-0 hidden w-40 md:block"
            aria-hidden="true"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(var(--nec-purple-rgb),0.04) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-[3px]"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(90deg, rgba(var(--nec-gold-rgb),0) 0%, rgba(var(--nec-gold-rgb),0.45) 26%, rgba(var(--nec-purple-rgb),0.5) 64%, rgba(var(--nec-purple-rgb),0) 100%)",
            }}
          />
          <div className="absolute right-6 top-6 hidden opacity-[0.08] md:block" aria-hidden="true">
            <Image
              src="/images/mad-realm-logo-no-bg.webp"
              alt=""
              width={140}
              height={140}
              sizes="140px"
              className="h-auto w-28"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                Registration Open
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)] md:text-4xl">
                Secure your spot before the holiday weekend gets crowded.
              </h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--nec-muted)]">
                Pre-registration is $40 for NECYPAA XXXVI. If someone lands on this page unsure what
                to do next, the answer should be immediate.
              </p>
            </div>

            <div className="grid gap-4 rounded-[1.65rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] p-5 md:grid-cols-[auto_1fr] md:items-center">
              <div className="rounded-[1.25rem] border border-[rgba(var(--nec-gold-rgb),0.16)] bg-[rgba(var(--nec-gold-rgb),0.06)] px-4 py-3 text-center">
                <div className="text-4xl font-semibold text-[var(--nec-gold)]">$40</div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--nec-text)]">Pre-registration price</p>
                <p className="text-sm leading-6 text-[var(--nec-muted)]">
                  The fastest way to get from “I should go” to “I’m in.”
                </p>
              </div>
            </div>

            <ul className="grid gap-3 md:grid-cols-3">
              {registrationHighlights.map((item) => (
                <li
                  key={item}
                  className="rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.74)] px-4 py-4 text-sm leading-6 text-[var(--nec-muted)] shadow-[0_14px_28px_rgba(44,24,16,0.04)]"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/register" className="btn-primary">
                Register Now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/faq" className="btn-ghost">
                Read the FAQ
              </Link>
            </div>
          </div>
        </article>

        <div className="grid gap-6">
          <article className="nec-card relative overflow-hidden p-7">
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(90deg, rgba(var(--nec-gold-rgb),0) 0%, rgba(var(--nec-gold-rgb),0.48) 50%, rgba(var(--nec-gold-rgb),0) 100%)",
              }}
            />
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(var(--nec-gold-rgb),0.16)] bg-[rgba(var(--nec-gold-rgb),0.06)]">
                <Hotel className="h-5 w-5 text-[var(--nec-gold)]" aria-hidden="true" />
              </div>
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-gold)]">Host Hotel</p>
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--nec-text)]">
                  Stay where the weekend is happening.
                </h3>
                <p className="text-sm leading-7 text-[var(--nec-muted)]">
                  Hartford Marriott Downtown keeps the convention centralized and the schedule easy to
                  navigate. Around New Year&apos;s Eve, that convenience matters.
                </p>
                <a href={HOTEL_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Book Hotel
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </div>
            </div>
          </article>

          <article className="nec-card relative overflow-hidden p-7">
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(90deg, rgba(var(--nec-cyan-rgb),0) 0%, rgba(var(--nec-cyan-rgb),0.48) 50%, rgba(var(--nec-cyan-rgb),0) 100%)",
              }}
            />
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[rgba(var(--nec-cyan-rgb),0.06)]">
                <Users className="h-5 w-5 text-[var(--nec-cyan)]" aria-hidden="true" />
              </div>
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--nec-cyan)]">Get Involved</p>
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--nec-text)]">
                  Bringing a committee, a homegroup, or just your willingness?
                </h3>
                <p className="text-sm leading-7 text-[var(--nec-muted)]">
                  Business meetings and service opportunities are part of the story here. The site
                  should make that invitation obvious instead of hiding it three clicks deep.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/service" className="btn-ghost">
                    Service Opportunities
                  </Link>
                  <Link href="/#business-meeting" className="btn-ghost">
                    Next Business Meeting
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
