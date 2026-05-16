import { Mail } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/constants"

interface RegistrationPausedCardProps {
  reason?: string | null
}

export default function RegistrationPausedCard({ reason }: RegistrationPausedCardProps) {
  return (
    <div className="nec-reg-card space-y-5 p-8 md:p-10" role="alert" aria-live="polite">
      <p className="form-section-label">Heads Up</p>
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
        Online registration is paused while we sort something out.
      </h2>
      <p className="text-base leading-7 text-[var(--nec-muted)]">
        {reason ??
          "We took the form down to keep registrations clean. We're not closed — we're being careful."}{" "}
        Email us and we'll register you manually the moment a human sees it.
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}?subject=NECYPAA%20XXXVI%20Registration%20(form%20paused)`}
        className="btn-primary inline-flex items-center gap-2"
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        Email {CONTACT_EMAIL}
      </a>
      <p className="text-sm leading-6 text-[var(--nec-muted)]">
        Include your name, state, homegroup, and how many spots you want. We'll confirm and send a payment link by reply.
      </p>
    </div>
  )
}
