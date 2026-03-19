import type { Metadata } from "next"
import Image from "next/image"
import { faqData } from "@/lib/data/faq"
import FAQAccordion from "@/components/faq-accordion"
import SiteFooter from "@/components/site-footer"
import MobileCtaBar from "@/components/mobile-cta-bar"
import PageArtAccents from "@/components/art/page-art-accents"

export const metadata: Metadata = {
  title: "FAQ — NECYPAA XXXVI",
  description:
    "Frequently asked questions about NECYPAA XXXVI, registration, the hotel, and the convention experience.",
}

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: "var(--nec-navy)" }}>
      <PageArtAccents character="cheshire-cat" accentColor="var(--nec-pink)" dividerVariant="key" />
      <main className="flex-1 pt-24 pb-20 md:pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Page header */}
            <div className="text-center mb-12 relative">
              {/* Cheshire Cat accent */}
              <div className="hidden md:block absolute -right-12 top-0 w-24 h-36 opacity-[0.08] pointer-events-none" aria-hidden="true">
                <Image src="/images/cheshire-cat-character.png" alt="" width={96} height={144} className="w-full h-full object-contain" aria-hidden="true" />
              </div>
              <span className="section-badge mb-4 inline-block">FAQ</span>
              <h1 className="section-heading mb-3">Frequently Asked Questions</h1>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--nec-muted)" }}>
                Got questions? We&apos;ve got answers. If you don&apos;t see what you&apos;re looking
                for, reach out at{" "}
                <a
                  href="mailto:info@necypaa.org"
                  className="underline transition-colors"
                  style={{ color: "var(--nec-cyan)" }}
                >
                  info@necypaa.org
                </a>
                .
              </p>
            </div>

            {/* FAQ categories */}
            <div className="space-y-10">
              {faqData.map((category) => (
                <section key={category.name}>
                  <h2
                    className="text-lg font-bold uppercase tracking-widest mb-4 pl-1"
                    style={{ color: "var(--nec-cyan)", textShadow: "0 0 16px rgba(124,58,237,0.2)" }}
                  >
                    {category.name}
                  </h2>
                  <FAQAccordion items={category.items} />
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
      <MobileCtaBar />
    </div>
  )
}
