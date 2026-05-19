"use client"

import { useEffect, useState, useRef, type FormEvent } from "react"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import PolicyAgreement from "@/components/policy-agreement"
import EmailTypoHint from "@/components/ui/email-typo-hint"
import { submitGiftClaim, type ClaimFormInput } from "@/actions/claim-gift"
import { NECYPAA_STATES } from "@/lib/data/states"
import type { PolicyAgreements } from "@/lib/types"
import { CONTACT_EMAIL } from "@/lib/constants"

interface Props {
  token: string
  suggestedName: string
  sponsorName: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STATE_OPTIONS = [...NECYPAA_STATES.map((s) => s.name), "Other / International"]

const preferenceOptions = [
  { id: "interpretationNeeded" as const, label: "Interpretation support" },
  { id: "mobilityAccessibility" as const, label: "Mobility access" },
  { id: "willingToServe" as const, label: "Available for service" },
]

type Step = "info" | "policy"

export default function ClaimForm({ token, suggestedName, sponsorName }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<Step>("info")
  const [form, setForm] = useState<ClaimFormInput>({
    name: suggestedName,
    email: "",
    state: "",
    homegroup: "",
    accommodations: "",
    interpretationNeeded: false,
    mobilityAccessibility: false,
    willingToServe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<{ message: string; correlationId?: string } | null>(null)
  const errorSummaryRef = useRef<HTMLDivElement | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (step !== "info") return
    const isTouch = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches
    if (isTouch) return
    nameInputRef.current?.focus({ preventScroll: true })
  }, [step])

  const update = <K extends keyof ClaimFormInput>(field: K, value: ClaimFormInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field as string]) return prev
      const next = { ...prev }
      delete next[field as string]
      return next
    })
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = "Name is required."
    if (!form.email.trim()) next.email = "Email is required."
    else if (!EMAIL_REGEX.test(form.email)) next.email = "Please enter a valid email address."
    if (!form.state.trim()) next.state = "Please choose a state or region."
    if (!form.homegroup.trim()) next.homegroup = "Homegroup or committee is required."
    setErrors(next)
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => {
        errorSummaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        errorSummaryRef.current?.focus()
      })
      return false
    }
    return true
  }

  const handleInfoSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate()) setStep("policy")
  }

  const handlePolicyComplete = async (agreements: PolicyAgreements) => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await submitGiftClaim(token, form, agreements)
      if (!result.success) {
        setSubmitError({ message: result.error.userMessage, correlationId: result.error.correlationId })
        return
      }
      router.push(`/register/success?flow=access-code&t=${encodeURIComponent(result.successToken)}`)
    } catch (err) {
      setSubmitError({
        message: `Something went wrong. Try again, or email ${CONTACT_EMAIL}.${
          err instanceof Error && err.message ? ` Detail: ${err.message}` : ""
        }`,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (step === "policy") {
    return (
      <div className="nec-reg-card space-y-6 p-6 md:p-8 lg:p-10">
        <div className="border-b border-[rgba(var(--nec-purple-rgb),0.10)] pb-5">
          <p className="form-section-label">Step Two</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
            Review the policy agreement.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
            Every attendee signs this directly &mdash; {sponsorName} didn&apos;t sign for you. Take a minute, then
            confirm.
          </p>
        </div>
        {submitError && (
          <div
            className="rounded-lg border border-red-700 bg-red-900/30 p-3 text-sm text-red-200"
            role="alert"
            aria-live="assertive"
          >
            <p>{submitError.message}</p>
            {submitError.correlationId && (
              <p className="mt-1 text-xs text-red-300">
                Reference: <code>{submitError.correlationId}</code>
              </p>
            )}
          </div>
        )}
        <PolicyAgreement
          onComplete={handlePolicyComplete}
          onBack={() => setStep("info")}
          continueLabel={submitting ? "Completing…" : "Complete Registration"}
        />
      </div>
    )
  }

  const errorEntries = Object.entries(errors)

  return (
    <form onSubmit={handleInfoSubmit} className="nec-reg-card space-y-8 p-6 md:p-8 lg:p-10" noValidate>
      <div className="border-b border-[rgba(var(--nec-purple-rgb),0.10)] pb-5">
        <p className="form-section-label">Step One</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--nec-text)]">
          Tell us about you.
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--nec-muted)]">
          We&apos;ll use this to confirm your registration and support you onsite.
        </p>
      </div>

      {errorEntries.length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="rounded-[1.25rem] border border-[rgba(var(--nec-pink-rgb),0.30)] bg-[rgba(var(--nec-pink-rgb),0.06)] p-5 outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        >
          <p className="text-sm font-semibold text-[var(--nec-text)]">Please fix the following:</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--nec-text)]">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#${field}`}
                  className="underline decoration-[var(--nec-pink)] underline-offset-4"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(field)?.focus()
                  }}
                >
                  {field}
                </a>
                : {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[var(--nec-text)]">
            Full name <span className="text-[var(--nec-pink)]">*</span>
          </Label>
          <Input
            id="name"
            ref={nameInputRef}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={!!errors.name}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-sm text-[var(--nec-pink)]">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[var(--nec-text)]">
            Email <span className="text-[var(--nec-pink)]">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={!!errors.email}
            placeholder="name@email.com"
          />
          {errors.email && <p className="text-sm text-[var(--nec-pink)]">{errors.email}</p>}
          <EmailTypoHint value={form.email} fieldId="email" onAccept={(v) => update("email", v)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-[var(--nec-text)]">
            State / region <span className="text-[var(--nec-pink)]">*</span>
          </Label>
          <select
            id="state"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            aria-invalid={!!errors.state}
            className="flex h-12 w-full rounded-xl border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.92)] px-4 py-3 text-sm text-[var(--nec-text)]"
          >
            <option value="">Select a state or region</option>
            {STATE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-sm text-[var(--nec-pink)]">{errors.state}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="homegroup" className="text-[var(--nec-text)]">
            Homegroup / committee <span className="text-[var(--nec-pink)]">*</span>
          </Label>
          <Input
            id="homegroup"
            value={form.homegroup}
            onChange={(e) => update("homegroup", e.target.value)}
            aria-invalid={!!errors.homegroup}
            placeholder="Homegroup, committee, or service body"
          />
          {errors.homegroup && <p className="text-sm text-[var(--nec-pink)]">{errors.homegroup}</p>}
        </div>
      </section>

      <section className="space-y-4">
        <p className="form-section-label">Accessibility And Service</p>
        <div className="grid gap-4 md:grid-cols-3">
          {preferenceOptions.map((opt) => (
            <div
              key={opt.id}
              className="form-option-card flex items-start gap-3 rounded-[1.4rem] p-4"
              data-active={form[opt.id] ? "true" : "false"}
            >
              <Checkbox
                id={opt.id}
                checked={form[opt.id]}
                onCheckedChange={(v) => update(opt.id, Boolean(v))}
                className="mt-1"
              />
              <Label htmlFor={opt.id} className="text-sm font-semibold text-[var(--nec-text)]">
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="accommodations" className="text-[var(--nec-text)]">
            Accommodation details
          </Label>
          <Textarea
            id="accommodations"
            value={form.accommodations}
            onChange={(e) => update("accommodations", e.target.value)}
            placeholder="Share any accessibility or accommodation needs here."
          />
        </div>
      </section>

      <Button type="submit" className="w-full">
        Continue to Policy Agreement
      </Button>
    </form>
  )
}
