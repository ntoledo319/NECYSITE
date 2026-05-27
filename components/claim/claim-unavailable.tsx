import { Link } from "@/i18n/navigation"
import { AlertCircle, CheckCircle2, Mail } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/constants"

interface Props {
  status: "claimed" | "void" | "not_found" | "error"
}

export default function ClaimUnavailable({ status }: Props) {
  const copy = status === "claimed"
    ? {
        icon: CheckCircle2,
        tone: "var(--nec-cyan)",
        title: "This gift has already been claimed.",
        body: "If that was you, you're already registered — you should have received a confirmation. If it wasn't you and someone else used your link, email us and we'll sort it out.",
      }
    : status === "void"
      ? {
          icon: AlertCircle,
          tone: "var(--nec-pink)",
          title: "This gift was canceled.",
          body: "We voided this gift code (refund, manual cleanup, or sponsor request). If you think that's wrong, email us with this URL.",
        }
      : status === "not_found"
        ? {
            icon: AlertCircle,
            tone: "var(--nec-pink)",
            title: "We can't find this claim link.",
            body: "Either the link is mistyped or the gift was deleted. Double-check the URL or email us so we can re-issue.",
          }
        : {
            icon: AlertCircle,
            tone: "var(--nec-pink)",
            title: "We hit a problem looking up your gift.",
            body: "Try refreshing in a minute. If it keeps happening, email us — we can register you manually.",
          }

  const Icon = copy.icon
  return (
    <div className="nec-reg-card space-y-5 p-8 text-center md:p-10" role="alert" aria-live="polite">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: `rgba(${copy.tone === "var(--nec-cyan)" ? "var(--nec-cyan-rgb)" : "var(--nec-pink-rgb)"},0.12)`, border: `1px solid rgba(${copy.tone === "var(--nec-cyan)" ? "var(--nec-cyan-rgb)" : "var(--nec-pink-rgb)"},0.24)` }}
      >
        <Icon className="h-8 w-8" aria-hidden="true" style={{ color: copy.tone }} />
      </div>
      <h1 className="text-2xl font-black text-[var(--nec-text)] md:text-3xl">{copy.title}</h1>
      <p className="leading-7 text-[var(--nec-muted)]">{copy.body}</p>
      <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
        <Link href="/" className="btn-ghost">
          Go Home
        </Link>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=NECYPAA%20claim%20link%20question`}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Email {CONTACT_EMAIL}
        </a>
      </div>
    </div>
  )
}
