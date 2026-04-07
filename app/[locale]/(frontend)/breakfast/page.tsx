"use client"

import BreakfastCheckout from "@/components/breakfast-checkout"
import PageArtAccents from "@/components/art/page-art-accents"
import { CONVENTION_VENUE } from "@/lib/constants"

const breakfastNotes = [
  {
    label: "Friday matters most",
    value: "New Year’s Day is the hardest restaurant day of the weekend. This is the one to lock in early.",
  },
  {
    label: "Weekend rhythm",
    value: "Saturday and Sunday breakfast tickets keep the mornings easy once the convention pace really kicks in.",
  },
  {
    label: "Dietary planning",
    value: "If you need accommodations, tell us in advance so breakfast feels welcoming and not improvised.",
  },
]

export default function BreakfastPage() {
  return (
    <div className="relative min-h-screen min-h-screen-safe bg-[var(--nec-navy)]">
      <PageArtAccents character="caterpillar" accentColor="var(--nec-gold)" variant="subtle" dividerVariant="compass" />

      <div className="relative z-10 container mx-auto px-4 pb-12 pt-24">
        <div className="mx-auto max-w-5xl space-y-8">
          <header className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
            <div className="max-w-3xl">
              <span className="section-badge inline-flex">Breakfast</span>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl">
                Mornings deserve their own plan.
              </h1>
              <p className="mt-4 text-lg leading-8 text-[var(--nec-muted)]">
                Breakfast is not an afterthought at NECYPAA XXXVI. It is how people start the day fed,
                less frantic, and already in fellowship before the rest of the convention opens up.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-[rgba(var(--nec-gold-rgb),0.14)] bg-[linear-gradient(135deg,rgba(var(--nec-card-rgb),0.88),rgba(var(--nec-gold-rgb),0.06))] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                Host Hotel Breakfast
              </p>
              <p className="mt-3 text-xl font-semibold text-[var(--nec-text)]">{CONVENTION_VENUE}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
                Buy the mornings you know you want now, then walk into the weekend without having to improvise food around the schedule.
              </p>
            </div>
          </header>

          <section className="grid gap-3 md:grid-cols-3">
            {breakfastNotes.map((note, index) => (
              <article
                key={note.label}
                className="rounded-[1.5rem] border bg-[rgba(var(--nec-card-rgb),0.84)] px-5 py-5 shadow-[0_16px_34px_rgba(44,24,16,0.06)]"
                style={{
                  borderColor:
                    index === 0
                      ? "rgba(var(--nec-gold-rgb),0.16)"
                      : index === 1
                        ? "rgba(var(--nec-purple-rgb),0.14)"
                        : "rgba(var(--nec-cyan-rgb),0.14)",
                }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    color:
                      index === 0
                        ? "var(--nec-gold)"
                        : index === 1
                          ? "var(--nec-purple)"
                          : "var(--nec-cyan)",
                  }}
                >
                  {note.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--nec-muted)]">{note.value}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
            <aside className="rounded-[1.8rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.84)] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                Before You Buy
              </p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-[var(--nec-muted)]">
                <p>
                  Friday breakfast is the high-priority one because the neighborhood options tighten up around the holiday.
                </p>
                <p>
                  Saturday and Sunday are still worth booking if you want the mornings to be easy, on-site, and already surrounded by fellows.
                </p>
                <p>
                  The checkout below handles your selections directly. Pick the mornings you want and move through it like a real plan, not a maybe.
                </p>
              </div>
            </aside>

            <div className="nec-reg-card p-6 md:p-8">
              <BreakfastCheckout />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
