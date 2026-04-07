import type { Metadata } from "next"
import { Ear, Eye, Keyboard, Mail, Monitor, Globe } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/constants"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import AnonymousFeedbackForm from "@/components/anonymous-feedback-form"
import PageArtAccents from "@/components/art/page-art-accents"

export const metadata: Metadata = {
  title: "Accessibility — NECYPAA XXXVI",
  description:
    "Our commitment to accessibility and inclusion at NECYPAA XXXVI. Information about accommodations, ASL, and how to request support.",
}

const digitalFeatures = [
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Visual settings",
    items: ["Light and dark mode", "High contrast mode", "Adjustable text size", "Grayscale mode", "Dyslexia-friendly font"],
  },
  {
    icon: <Monitor className="h-5 w-5" />,
    title: "Motion and media",
    items: ["Reduced motion controls", "No autoplay media", "Alt text on imagery", "Captions planned for video content"],
  },
  {
    icon: <Keyboard className="h-5 w-5" />,
    title: "Keyboard support",
    items: ["Skip links", "Visible focus states", "Modal escape handling", "Full keyboard navigation"],
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Language and clarity",
    items: ["Plain language", "Person-first recovery language", "Spanish support in progress", "No jargon-first explanations"],
  },
]

const venueFeatures = [
  "Wheelchair-accessible venue with elevators and accessible restrooms",
  "ASL interpretation planning and coordination on request",
  "Quiet and sensory break space",
  "Dietary accommodation planning",
  "Sliding-scale and scholarship support",
  "Extra help available through direct committee contact",
]

export default function AccessibilityPage() {
  return (
    <div className="relative flex min-h-screen min-h-screen-safe flex-col" style={{ backgroundColor: "var(--nec-navy)" }}>
      <PageArtAccents character="caterpillar" accentColor="var(--nec-cyan)" dividerVariant="key" />

      <div className="relative z-10 flex-1 pb-20 pt-24 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-10">
            <header className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-end">
              <div className="max-w-3xl">
                <span className="section-badge inline-flex">Accessibility</span>
                <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl">
                  Access is part of the design, not cleanup after.
                </h1>
                <p className="mt-4 text-lg leading-8 text-[var(--nec-muted)]">
                  NECYPAA XXXVI is committed to making the site and the in-person convention usable, legible, and welcoming for as many people as we can. If something gets in your way, we want to know early enough to help.
                </p>
              </div>

              <aside className="rounded-[1.85rem] border border-[rgba(var(--nec-cyan-rgb),0.12)] bg-[linear-gradient(135deg,rgba(var(--nec-card-rgb),0.9),rgba(var(--nec-cyan-rgb),0.05))] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-cyan)]">
                  Working Standard
                </p>
                <p className="mt-3 text-base leading-7 text-[var(--nec-muted)]">
                  The site targets WCAG 2.1 AAA wherever achievable, with AA as the floor, and the convention team coordinates accommodations directly instead of making people guess what is possible.
                </p>
              </aside>
            </header>

            <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <article className="rounded-[1.85rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.86)] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                  Our commitment
                </p>
                <div className="mt-4 space-y-4 text-base leading-7 text-[var(--nec-muted)]">
                  <p>
                    Every person deserves equal access to recovery resources, fellowship, and convention information.
                    This page exists to say what we are doing, where we are still improving, and how to reach us before a barrier becomes a bad weekend.
                  </p>
                  <p>
                    Accessibility is treated as real infrastructure here: interaction design, content clarity, accommodation planning, and a feedback loop that the committee is expected to respond to.
                  </p>
                </div>
              </article>

              <article className="rounded-[1.85rem] border border-[rgba(var(--nec-gold-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.86)] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                  Need something specific?
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                  Tell us before the weekend gets here.
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--nec-muted)]">
                  If you need ASL interpretation, mobility support, sensory adjustments, dietary accommodation, or something not listed, email the committee directly so the request can be planned rather than improvised.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Accommodation%20Request`}
                  className="btn-secondary mt-5 inline-flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Request accommodations
                </a>
              </article>
            </section>

            <section aria-label="Digital accessibility features" className="space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-cyan)]">
                  Digital Accessibility
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                  What the site is already doing.
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {digitalFeatures.map((feature) => (
                  <article
                    key={feature.title}
                    className="rounded-[1.6rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.84)] px-5 py-5 shadow-[0_16px_34px_rgba(44,24,16,0.06)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[rgba(var(--nec-cyan-rgb),0.06)] text-[var(--nec-cyan)]">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--nec-text)]">{feature.title}</h3>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--nec-muted)]">
                      {feature.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <article className="rounded-[1.85rem] border border-[rgba(var(--nec-pink-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.86)] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-pink)]">
                  In-Person Support
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                  What we are planning for the venue.
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm leading-6 text-[var(--nec-muted)]">
                  {venueFeatures.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </article>

              <article className="rounded-[1.85rem] border border-[rgba(var(--nec-gold-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.86)] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(var(--nec-gold-rgb),0.16)] bg-[rgba(var(--nec-gold-rgb),0.06)]">
                    <Ear className="h-5 w-5 text-[var(--nec-gold)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-gold)]">
                      Feedback and fixes
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                      Tell us where the barrier is.
                    </h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--nec-muted)]">
                  If something on the site or at the convention is not working for you, email us directly or use the anonymous form below. We take feedback seriously and use it to update both the site and the event planning.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Accessibility%20Issue`}
                  className="btn-ghost mt-5 inline-flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Report an issue
                </a>
              </article>
            </section>

            <section className="rounded-[1.9rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.88)] px-6 py-6 shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-purple)]">
                Anonymous Feedback
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
                Say it without naming yourself.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--nec-muted)]">
                If anonymous feedback makes it easier to be direct, use the form here. No name or email is required.
              </p>
              <div className="mt-5">
                <AnonymousFeedbackForm />
              </div>
            </section>

            <section className="rounded-[1.9rem] border border-[rgba(var(--nec-cyan-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.84)] px-6 py-6 text-sm leading-7 text-[var(--nec-muted)] shadow-[0_22px_50px_rgba(44,24,16,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nec-cyan)]">
                Accessibility Statement
              </p>
              <p className="mt-4">
                NECYPAA XXXVI is committed to improving digital and in-person accessibility for people of all abilities. This site aims for WCAG 2.1 Level AAA wherever achievable, with Level AA as the minimum baseline. We continue to review content, interactions, and accommodation processes as planning evolves.
              </p>
              <p className="mt-4">
                If you encounter a barrier, contact{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[var(--nec-cyan)] underline">
                  {CONTACT_EMAIL}
                </a>
                . Feedback helps us improve both the website and the convention itself.
              </p>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
