import type { Metadata } from "next"
import Image from "next/image"
import { Mail, Eye, Monitor, Ear, Keyboard, Globe } from "lucide-react"
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

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen min-h-screen-safe flex flex-col relative overflow-hidden" style={{ backgroundColor: "var(--nec-navy)" }}>
      <PageArtAccents character="caterpillar" accentColor="var(--nec-cyan)" variant="subtle" dividerVariant="key" />
      <div className="page-frame">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl page-stack">
            {/* Header */}
            <div className="relative grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div className="max-w-3xl">
              {/* Caterpillar accent */}
                <div className="hidden md:block absolute -left-12 top-1/2 -translate-y-1/2 w-20 h-32 opacity-[0.07] pointer-events-none" aria-hidden="true">
                <Image src="/images/caterpillar-character.png" alt="" width={80} height={128} sizes="80px" className="w-full h-full object-contain" aria-hidden="true" />
                </div>
                <span className="section-badge mb-4 inline-block">Accessibility</span>
                <h1 className="section-heading mb-3">Accessibility &amp; Inclusion</h1>
                <p className="text-lg max-w-2xl text-[var(--nec-muted)]">
                We&apos;re committed to making NECYPAA XXXVI accessible to everyone — online and in
                person. If you need accommodations, we want to hear from you.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(var(--nec-cyan-rgb),0.16)] bg-[linear-gradient(145deg,rgba(var(--nec-cyan-rgb),0.07),rgba(var(--nec-card-rgb),0.92))] p-5 shadow-[0_22px_54px_rgba(44,24,16,0.08)]">
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <div className="absolute left-6 top-6 h-16 w-16 rounded-full border border-[rgba(var(--nec-cyan-rgb),0.16)]" />
                  <div className="absolute right-8 top-8 h-12 w-20 rounded-[1rem] border border-[rgba(var(--nec-gold-rgb),0.14)]" />
                </div>
                <div className="relative grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-[rgba(var(--nec-cyan-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.88)] p-5">
                    <Eye className="w-6 h-6 text-[var(--nec-cyan)]" aria-hidden="true" />
                  </div>
                  <div className="rounded-[1.2rem] border border-[rgba(var(--nec-cyan-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.88)] p-5">
                    <Monitor className="w-6 h-6 text-[var(--nec-cyan)]" aria-hidden="true" />
                  </div>
                  <div className="rounded-[1.2rem] border border-[rgba(var(--nec-cyan-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.88)] p-5">
                    <Keyboard className="w-6 h-6 text-[var(--nec-cyan)]" aria-hidden="true" />
                  </div>
                  <div className="rounded-[1.2rem] border border-[rgba(var(--nec-cyan-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.88)] p-5">
                    <Globe className="w-6 h-6 text-[var(--nec-cyan)]" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="space-y-6 md:space-y-8">
                <section className="nec-card p-6 md:p-8">
                  <h2 className="mb-3 text-xl font-bold text-[var(--nec-text)]">Our Commitment</h2>
                  <p className="mb-3 text-sm leading-relaxed text-[var(--nec-text)]">
                    Every person deserves equal access to recovery resources and fellowship events. Our
                    accessibility guidelines are developed in partnership with the NECYPAA XXXVI
                    Accessibilities Chair and informed by the experiences of our community.
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--nec-text)]">
                    We target WCAG 2.1 AAA compliance wherever achievable, with AA as our absolute
                    floor. Connecticut state accessibility requirements and ADA Title III standards are
                    also met.
                  </p>
                </section>

                <div>
                  <h2
                    className="nec-section-label mb-4 pl-1 text-lg font-bold uppercase tracking-widest text-[var(--nec-cyan)]"
                  >
                    Digital Accessibility
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FeatureCard
                      icon={<Eye className="w-5 h-5" />}
                      title="Visual Settings"
                      items={[
                        "Dark & light mode",
                        "High-contrast mode",
                        "Adjustable text size",
                        "Grayscale mode",
                        "Dyslexia-friendly font option",
                      ]}
                    />
                    <FeatureCard
                      icon={<Monitor className="w-5 h-5" />}
                      title="Motion & Media"
                      items={[
                        "Ability to turn off all animations",
                        "No flashing or strobe effects",
                        "All media is opt-in (no autoplay)",
                        "Alt text on all images",
                        "Captions on all video content",
                      ]}
                    />
                    <FeatureCard
                      icon={<Keyboard className="w-5 h-5" />}
                      title="Navigation"
                      items={[
                        "Full keyboard navigation",
                        "Skip-to-content links",
                        "Visible focus indicators",
                        "Escape key closes all modals",
                        "No timed content or auto-advance",
                      ]}
                    />
                    <FeatureCard
                      icon={<Globe className="w-5 h-5" />}
                      title="Language & Tone"
                      items={[
                        "Plain, clear language throughout",
                        "Spanish translation (in progress)",
                        "ASL video content (planned)",
                        "Gender-neutral greetings",
                        "Person-first language",
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div>
                  <h2
                    className="nec-section-label mb-4 pl-1 text-lg font-bold uppercase tracking-widest text-[var(--nec-pink)]"
                  >
                    In-Person Accessibility
                  </h2>
                  <div className="nec-card p-6 md:p-8">
                    <ul className="space-y-2.5 text-sm text-[var(--nec-text)]">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--nec-cyan)]">•</span>
                        Wheelchair accessible venue (ramps, elevators, accessible restrooms)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--nec-cyan)]">•</span>
                        ASL interpreters available on request
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--nec-cyan)]">•</span>
                        Quiet / sensory break room
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--nec-cyan)]">•</span>
                        Dietary food options (halal, kosher, vegan, gluten-free, allergy-safe)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--nec-cyan)]">•</span>
                        Sliding scale pricing and financial assistance
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--nec-cyan)]">•</span>
                        Childcare and kid-friendly options under consideration
                      </li>
                    </ul>
                  </div>
                </div>

                <section
                  className="nec-gradient-card rounded-xl p-6 text-center md:p-8"
                >
                  <Ear className="mx-auto mb-3 h-8 w-8 text-[var(--nec-cyan)]" />
                  <h2 className="mb-2 text-xl font-bold text-[var(--nec-text)]">Need Accommodations?</h2>
                  <p className="mx-auto mb-4 max-w-md text-sm text-[var(--nec-muted)]">
                    If you need any accommodations — ASL interpretation, dietary needs, mobility
                    assistance, or anything else — please let us know. We want to help.
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Accommodation%20Request`}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" /> Request Accommodations
                  </a>
                </section>
              </div>
            </div>

            {/* Report a problem */}
            <section className="nec-card p-6 md:p-8">
              <h2 className="mb-3 text-xl font-bold text-[var(--nec-text)]">Report an Accessibility Problem</h2>
              <p className="mb-4 text-sm leading-relaxed text-[var(--nec-text)]">
                Found something on this site that isn&apos;t accessible? We want to fix it. You can
                report issues by email, and anonymous reports are welcome.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Accessibility%20Issue`}
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Email Us
                </a>
              </div>
            </section>

            {/* Anonymous feedback form */}
            <section className="nec-card p-6 md:p-8">
              <h2 className="mb-3 text-xl font-bold text-[var(--nec-text)]">Anonymous Feedback</h2>
              <p className="mb-4 text-sm leading-relaxed text-[var(--nec-text)]">
                Want to share feedback without identifying yourself? Use this form. No email
                address or name is required.
              </p>
              <AnonymousFeedbackForm />
            </section>

            {/* Accessibility statement */}
            <section
              className="nec-statement-card rounded-xl p-5 text-xs leading-relaxed text-[var(--nec-muted)]"
            >
              <h3 className="mb-2 text-sm font-bold text-[var(--nec-text)]">Accessibility Statement</h3>
              <p className="mb-2">
                NECYPAA XXXVI is committed to ensuring digital accessibility for people of all
                abilities. We continually improve the user experience for everyone and apply relevant
                accessibility standards. This site targets WCAG 2.1 Level AAA conformance wherever
                achievable, with Level AA as our absolute minimum.
              </p>
              <p>
                If you encounter any accessibility barriers on this site, please contact us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="underline text-[var(--nec-cyan)]"
                >
                  {CONTACT_EMAIL}
                </a>
                . We take all feedback seriously and will work to address issues promptly.
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

function FeatureCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode
  title: string
  items: string[]
}) {
  return (
    <div className="nec-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[var(--nec-cyan)]">{icon}</span>
        <h3 className="text-sm font-bold text-[var(--nec-text)]">{title}</h3>
      </div>
      <ul className="space-y-1.5 text-xs text-[var(--nec-text)]">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-0.5 text-[10px] text-[var(--nec-cyan)]">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
