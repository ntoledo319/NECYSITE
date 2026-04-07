import type { Metadata } from "next"
import Image from "next/image"
import { Mail, Eye, Monitor, Ear, Keyboard, Globe } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/constants"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import AnonymousFeedbackForm from "@/components/anonymous-feedback-form"

export const metadata: Metadata = {
  title: "Accessibility — NECYPAA XXXVI",
  description:
    "Our commitment to accessibility and inclusion at NECYPAA XXXVI. Information about accommodations, ASL, and how to request support.",
}

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen min-h-screen-safe flex flex-col relative" style={{ backgroundColor: "var(--nec-navy)" }}>
      <div className="flex-1 pt-24 pb-20 md:pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 relative">
              {/* Caterpillar accent */}
              <div className="hidden md:block absolute -left-12 top-1/2 -translate-y-1/2 w-20 h-32 opacity-[0.07] pointer-events-none" aria-hidden="true">
                <Image src="/images/caterpillar-character.png" alt="" width={80} height={128} sizes="80px" className="w-full h-full object-contain" aria-hidden="true" />
              </div>
              <span className="section-badge mb-4 inline-block">Accessibility</span>
              <h1 className="section-heading mb-3">Accessibility &amp; Inclusion</h1>
              <p className="text-lg max-w-2xl mx-auto text-[var(--nec-muted)]">
                We&apos;re committed to making NECYPAA XXXVI accessible to everyone — online and in
                person. If you need accommodations, we want to hear from you.
              </p>
            </div>

            {/* Commitment statement */}
            <section className="nec-card p-6 md:p-8 mb-8">
              <h2 className="text-xl font-bold text-[var(--nec-text)] mb-3">Our Commitment</h2>
              <p className="text-sm leading-relaxed mb-3 text-[var(--nec-text)]">
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

            {/* Digital features grid */}
            <h2
              className="text-lg font-bold uppercase tracking-widest mb-4 pl-1 text-[var(--nec-cyan)] nec-section-label"
            >
              Digital Accessibility
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
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

            {/* In-person features */}
            <h2
              className="text-lg font-bold uppercase tracking-widest mb-4 pl-1 text-[var(--nec-pink)] nec-section-label"
            >
              In-Person Accessibility
            </h2>
            <div className="nec-card p-6 md:p-8 mb-10">
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

            {/* Request accommodations */}
            <section
              className="nec-gradient-card rounded-xl p-6 md:p-8 mb-10 text-center"
            >
              <Ear className="w-8 h-8 mx-auto mb-3 text-[var(--nec-cyan)]" />
              <h2 className="text-xl font-bold text-[var(--nec-text)] mb-2">Need Accommodations?</h2>
              <p className="text-sm mb-4 max-w-md mx-auto text-[var(--nec-muted)]">
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

            {/* Report a problem */}
            <section className="nec-card p-6 md:p-8 mb-10">
              <h2 className="text-xl font-bold text-[var(--nec-text)] mb-3">Report an Accessibility Problem</h2>
              <p className="text-sm leading-relaxed mb-4 text-[var(--nec-text)]">
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
            <section className="nec-card p-6 md:p-8 mb-10">
              <h2 className="text-xl font-bold text-[var(--nec-text)] mb-3">Anonymous Feedback</h2>
              <p className="text-sm leading-relaxed mb-4 text-[var(--nec-text)]">
                Want to share feedback without identifying yourself? Use this form. No email
                address or name is required.
              </p>
              <AnonymousFeedbackForm />
            </section>

            {/* Accessibility statement */}
            <section
              className="nec-statement-card rounded-xl p-5 text-xs leading-relaxed text-[var(--nec-muted)]"
            >
              <h3 className="text-sm font-bold text-[var(--nec-text)] mb-2">Accessibility Statement</h3>
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
