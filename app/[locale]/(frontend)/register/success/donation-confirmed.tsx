import { Link } from "@/i18n/navigation"
import { Heart, Mail, Home, Sparkles } from "lucide-react"
import { CONTACT_EMAIL, SITE_URL } from "@/lib/constants"
import PageArtAccents from "@/components/art/page-art-accents"

export interface VerifiedDonation {
  donorName: string | null
  donorEmail: string | null
  amountTotalCents: number | null
  currency: string | null
}

function formatCurrency(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

export default function DonationConfirmed({ donation }: { donation: VerifiedDonation }) {
  const firstName = donation.donorName?.split(" ")[0] ?? null
  const heading = firstName ? `Thank you, ${firstName}.` : "Thank you."
  const amountLabel =
    donation.amountTotalCents != null ? formatCurrency(donation.amountTotalCents, donation.currency ?? "usd") : null

  return (
    <div className="min-h-screen-safe relative flex min-h-screen flex-col overflow-hidden bg-[var(--nec-navy)]">
      <PageArtAccents character="cheshire-cat" accentColor="var(--nec-pink)" variant="subtle" dividerVariant="compass" />

      <div
        className="nec-accent-bar fixed left-0 right-0 top-0 z-50 h-[2px]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--nec-pink) 20%, var(--nec-gold) 50%, var(--nec-orange) 80%, transparent 100%)",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 py-16 pt-24">
        <div className="mx-auto max-w-3xl">
          <div className="nec-success-card-purple overflow-hidden p-8 md:p-10">
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="nec-success-icon-purple flex h-20 w-20 items-center justify-center rounded-full">
                  <Heart className="h-10 w-10 text-[var(--nec-pink)]" aria-hidden="true" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--nec-pink)]">
                  Donation Received
                </p>
                <h1 className="nec-heading-shadow text-3xl font-black text-[var(--nec-text)]">{heading}</h1>
                {amountLabel && (
                  <p className="text-2xl font-semibold text-[var(--nec-gold)]">
                    {amountLabel} to the General Fund
                  </p>
                )}
              </div>

              <p className="text-base leading-relaxed text-[var(--nec-text)]">
                Every dollar of your gift covers a scholarship for someone who can&apos;t afford the price of admission.
                Because of you, there&apos;s a seat at this convention that wasn&apos;t there yesterday.
              </p>

              {donation.donorEmail && (
                <p className="text-sm text-[var(--nec-muted)]">
                  A Stripe receipt is on its way to{" "}
                  <strong className="text-[var(--nec-pink)]">{donation.donorEmail}</strong>. Hold onto it for your
                  records.
                </p>
              )}

              <div className="rounded-[1.4rem] border border-[rgba(var(--nec-gold-rgb),0.30)] bg-[rgba(var(--nec-gold-rgb),0.08)] p-5 text-left">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--nec-gold)]" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--nec-gold)]">
                      Where Your Donation Goes
                    </p>
                    <p className="text-sm leading-6 text-[var(--nec-text)]">
                      100% of General Fund donations cover scholarship registrations &mdash; people in early recovery
                      who would otherwise miss the convention. There is no overhead skim, no marketing line, no
                      administrative cut. Pooled and granted as need shows up.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                <Link href="/" className="btn-primary inline-flex items-center gap-2">
                  <Home className="h-4 w-4" aria-hidden="true" />
                  Back to Home
                </Link>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  Share the Site
                </a>
              </div>

              <div className="border-t border-[rgba(var(--nec-purple-rgb),0.10)] pt-4">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=NECYPAA%20donation%20question`}
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  Questions or a tax receipt request? Email {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
