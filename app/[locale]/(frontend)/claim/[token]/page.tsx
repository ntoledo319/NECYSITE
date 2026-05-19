import type { Metadata } from "next"
import { loadGiftForClaim } from "@/actions/claim-gift"
import ClaimForm from "@/components/claim/claim-form"
import ClaimUnavailable from "@/components/claim/claim-unavailable"
import PageArtAccents from "@/components/art/page-art-accents"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Claim Your NECYPAA XXXVI Registration",
  description: "Someone bought you a registration. Fill in a few details and you're in.",
}

interface Params {
  token: string
}

export default async function ClaimPage({ params }: { params: Promise<Params> }) {
  const { token } = await params
  const gift = await loadGiftForClaim(token)

  return (
    <div className="min-h-screen-safe relative min-h-screen bg-[var(--nec-navy)]">
      <PageArtAccents character="cheshire-cat" accentColor="var(--nec-cyan)" variant="subtle" dividerVariant="compass" />
      <div className="container relative z-10 mx-auto px-4 pb-12 pt-24">
        <div className="mx-auto max-w-3xl">
          {gift.status === "ok" ? (
            <>
              <header className="max-w-2xl">
                <span className="section-badge page-enter-1">Claim Your Registration</span>
                <h1 className="page-enter-2 mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--nec-text)] sm:text-5xl">
                  {gift.sponsorName} bought you a spot.
                </h1>
                <p className="page-enter-3 mt-4 text-lg leading-8 text-[var(--nec-muted)]">
                  Fill in a few details and review the convention policy &mdash; that&apos;s the whole process. No
                  payment required.
                </p>
                {gift.sponsorMessage && (
                  <blockquote className="page-enter-4 mt-6 rounded-[1.25rem] border-l-4 border-[var(--nec-purple)] bg-[rgba(var(--nec-purple-rgb),0.06)] px-5 py-4">
                    <p className="text-base italic leading-7 text-[var(--nec-text)]">
                      &ldquo;{gift.sponsorMessage}&rdquo;
                    </p>
                    <p className="mt-2 text-sm text-[var(--nec-muted)]">— {gift.sponsorName}</p>
                  </blockquote>
                )}
              </header>
              <div className="mt-10">
                <ClaimForm token={token} suggestedName={gift.recipientName} sponsorName={gift.sponsorName} />
              </div>
            </>
          ) : (
            <ClaimUnavailable status={gift.status} />
          )}
        </div>
      </div>
    </div>
  )
}
