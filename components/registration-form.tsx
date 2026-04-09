"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { NECYPAA_STATES } from "@/lib/data/states"
import type { RegistrationData } from "@/lib/types"

interface RegistrationFormProps {
  onComplete: (data: RegistrationData) => void
  enableScholarship?: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STATE_OPTIONS = [...NECYPAA_STATES.map((state) => state.name), "Other / International"]

const preferenceOptions = [
  {
    id: "interpretationNeeded",
    label: "Interpretation support",
    description: "Let us know if you need interpretation services during the weekend.",
  },
  {
    id: "mobilityAccessibility",
    label: "Mobility access",
    description: "Share wheelchair or other mobility access needs ahead of time.",
  },
  {
    id: "willingToServe",
    label: "Available for service",
    description: "If you want to help during the weekend, we’ll make it easy to connect.",
  },
] as const

export default function RegistrationForm({ onComplete, enableScholarship = false }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    state: "",
    email: "",
    accommodations: "",
    interpretationNeeded: false,
    mobilityAccessibility: false,
    willingToServe: false,
    homegroup: "",
    isScholarship: false,
    scholarshipRecipientName: "",
    scholarshipRecipientEmail: "",
    accessCode: "",
  })
  const [showAccessCode, setShowAccessCode] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const hasAccessCode = (formData.accessCode ?? "").trim().length > 0

  const sectionCopy = useMemo(() => {
    if (formData.isScholarship) {
      return {
        introTitle: "Purchaser information",
        introCopy: "Tell us who is buying the registration and where to send updates.",
      }
    }

    return {
      introTitle: "Attendee information",
      introCopy: "These details help us confirm your registration and support you on site.",
    }
  }, [formData.isScholarship])

  const updateField = <K extends keyof RegistrationData>(field: K, value: RegistrationData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field as string]) return prev
      const next = { ...prev }
      delete next[field as string]
      return next
    })
  }

  const validate = (data: RegistrationData) => {
    const nextErrors: Record<string, string> = {}

    if (!data.name.trim()) nextErrors.name = "Name is required."
    if (!data.email.trim()) nextErrors.email = "Email is required."
    else if (!EMAIL_REGEX.test(data.email)) nextErrors.email = "Please enter a valid email address."
    if (!data.state.trim()) nextErrors.state = "Please choose a state or region."
    if (!data.homegroup.trim()) nextErrors.homegroup = "Homegroup or committee is required."

    if (data.isScholarship) {
      if (!(data.scholarshipRecipientName ?? "").trim()) {
        nextErrors.scholarshipRecipientName = "Please tell us who the scholarship registration is for."
      }
      if ((data.scholarshipRecipientEmail ?? "").trim() && !EMAIL_REGEX.test(data.scholarshipRecipientEmail ?? "")) {
        nextErrors.scholarshipRecipientEmail = "Please enter a valid recipient email, or leave it blank."
      }
    }

    return nextErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(formData)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onComplete(formData)
  }

  const checkboxCards = preferenceOptions.map((option) => {
    const checked = formData[option.id]

    return (
      <div
        key={option.id}
        className="form-option-card flex items-start gap-3 rounded-[1.4rem] p-4"
        data-active={checked ? "true" : "false"}
      >
        <Checkbox
          id={option.id}
          checked={checked}
          onCheckedChange={(next) => updateField(option.id, Boolean(next))}
          className="mt-1"
        />
        <div className="space-y-1">
          <Label htmlFor={option.id} className="text-sm font-semibold text-[var(--nec-text)]">
            {option.label}
          </Label>
          <p className="text-sm leading-6 text-[var(--nec-muted)]">{option.description}</p>
        </div>
      </div>
    )
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {enableScholarship && !hasAccessCode && (
        <section className="space-y-4">
          <div className="space-y-2">
            <p className="form-section-label">Choose Your Path</p>
            <p className="form-support-text">
              Register for yourself, or sponsor someone else and continue straight to payment.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              className="form-option-card rounded-[1.5rem] p-5 text-left"
              data-active={!formData.isScholarship ? "true" : "false"}
              onClick={() => updateField("isScholarship", false)}
            >
              <p className="form-section-label">Standard Registration</p>
              <p className="mt-3 text-lg font-semibold text-[var(--nec-text)]">I’m registering myself.</p>
              <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
                Fill out attendee information, review the policy agreement, then continue to payment.
              </p>
            </button>

            <button
              type="button"
              className="form-option-card rounded-[1.5rem] p-5 text-left"
              data-active={formData.isScholarship ? "true" : "false"}
              onClick={() => updateField("isScholarship", true)}
            >
              <p className="form-section-label">Scholarship Purchase</p>
              <p className="mt-3 text-lg font-semibold text-[var(--nec-text)]">I’m sponsoring someone else.</p>
              <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">
                We’ll collect purchaser details here, then take you straight to payment for the sponsored registration.
              </p>
            </button>
          </div>
        </section>
      )}

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="form-section-label">{sectionCopy.introTitle}</p>
          <p className="form-support-text">{sectionCopy.introCopy}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[var(--nec-text)]">
              {formData.isScholarship ? "Purchaser name" : "Full name"}{" "}
              <span className="text-[var(--nec-pink)]" aria-hidden="true">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={formData.isScholarship ? "Who is making this purchase?" : "Your full name"}
            />
            {errors.name && <p id="name-error" role="alert" aria-live="assertive" className="text-sm text-[var(--nec-pink)]">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--nec-text)]">
              Email <span className="text-[var(--nec-pink)]" aria-hidden="true">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="name@email.com"
            />
            {errors.email && <p id="email-error" role="alert" aria-live="assertive" className="text-sm text-[var(--nec-pink)]">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-[var(--nec-text)]">
              State / region <span className="text-[var(--nec-pink)]" aria-hidden="true">*</span>
            </Label>
            <select
              id="state"
              required
              aria-required="true"
              aria-invalid={!!errors.state}
              aria-describedby={errors.state ? "state-error" : undefined}
              value={formData.state}
              onChange={(e) => updateField("state", e.target.value)}
              className="flex h-12 w-full rounded-xl border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.92)] px-4 py-3 text-sm text-[var(--nec-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
            >
              <option value="">Select a state or region</option>
              {STATE_OPTIONS.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p id="state-error" role="alert" aria-live="assertive" className="text-sm text-[var(--nec-pink)]">{errors.state}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="homegroup" className="text-[var(--nec-text)]">
              Homegroup / committee <span className="text-[var(--nec-pink)]" aria-hidden="true">*</span>
            </Label>
            <Input
              id="homegroup"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!errors.homegroup}
              aria-describedby={errors.homegroup ? "homegroup-error" : undefined}
              value={formData.homegroup}
              onChange={(e) => updateField("homegroup", e.target.value)}
              placeholder="Homegroup, committee, or service body"
            />
            {errors.homegroup && <p id="homegroup-error" role="alert" aria-live="assertive" className="text-sm text-[var(--nec-pink)]">{errors.homegroup}</p>}
          </div>
        </div>
      </section>

      {formData.isScholarship ? (
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="form-section-label">Sponsored Registration</p>
            <p className="form-support-text">
              Tell us who this scholarship registration is intended for. If you don&apos;t know the email yet,
              you can leave it blank.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scholarshipRecipientName" className="text-[var(--nec-text)]">
                Recipient name <span className="text-[var(--nec-pink)]" aria-hidden="true">*</span>
              </Label>
              <Input
                id="scholarshipRecipientName"
                type="text"
                value={formData.scholarshipRecipientName}
                onChange={(e) => updateField("scholarshipRecipientName", e.target.value)}
                aria-invalid={!!errors.scholarshipRecipientName}
                aria-describedby={errors.scholarshipRecipientName ? "recipient-name-error" : undefined}
                placeholder="Who is this registration for?"
              />
              {errors.scholarshipRecipientName && (
                <p id="recipient-name-error" role="alert" aria-live="assertive" className="text-sm text-[var(--nec-pink)]">
                  {errors.scholarshipRecipientName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scholarshipRecipientEmail" className="text-[var(--nec-text)]">
                Recipient email <span className="text-[var(--nec-muted)]">(optional)</span>
              </Label>
              <Input
                id="scholarshipRecipientEmail"
                type="email"
                value={formData.scholarshipRecipientEmail}
                onChange={(e) => updateField("scholarshipRecipientEmail", e.target.value)}
                aria-invalid={!!errors.scholarshipRecipientEmail}
                aria-describedby={errors.scholarshipRecipientEmail ? "recipient-email-error" : "recipient-email-hint"}
                placeholder="Add an email if you have it"
              />
              {errors.scholarshipRecipientEmail ? (
                <p id="recipient-email-error" role="alert" aria-live="assertive" className="text-sm text-[var(--nec-pink)]">
                  {errors.scholarshipRecipientEmail}
                </p>
              ) : (
                <p id="recipient-email-hint" className="text-sm leading-6 text-[var(--nec-muted)]">
                  We&apos;ll still process the scholarship even if the email isn&apos;t available yet.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="form-section-label">Accessibility And Service</p>
            <p className="form-support-text">
              These preferences help us prepare the weekend around real people instead of generic assumptions.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">{checkboxCards}</div>

          <div className="space-y-2">
            <Label htmlFor="accommodations" className="text-[var(--nec-text)]">
              Accommodation details
            </Label>
            <Textarea
              id="accommodations"
              value={formData.accommodations}
              onChange={(e) => updateField("accommodations", e.target.value)}
              placeholder="Share any accessibility, mobility, or accommodation needs here."
            />
          </div>
        </section>
      )}

      <section className="space-y-4 rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="form-section-label">Access Code</p>
            <p className="text-sm leading-6 text-[var(--nec-muted)]">
              Using a cash or scholarship code instead of standard checkout?
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAccessCode((prev) => !prev)}
            aria-expanded={showAccessCode}
            aria-controls="access-code-section"
            className="btn-ghost self-start !min-h-0 !px-4 !py-2 sm:self-auto"
          >
            {showAccessCode ? "Hide Code Field" : "Enter Access Code"}
          </button>
        </div>

        {showAccessCode && (
          <div id="access-code-section" className="space-y-2">
            <Label htmlFor="accessCode" className="text-[var(--nec-text)]">
              Registration access code
            </Label>
            <Input
              id="accessCode"
              type="text"
              value={formData.accessCode}
              onChange={(e) => updateField("accessCode", e.target.value)}
              placeholder="Enter your code"
              autoComplete="off"
            />
            <p className="text-sm leading-6 text-[var(--nec-muted)]">
              Leave this blank for normal paid registration.
            </p>
          </div>
        )}
      </section>

      <Button type="submit" className="w-full">
        {formData.isScholarship || hasAccessCode ? "Continue to Payment" : "Continue to Policy Agreement"}
      </Button>
    </form>
  )
}
