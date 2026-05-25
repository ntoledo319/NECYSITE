"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { NECYPAA_STATES } from "@/lib/data/states"
import type { RegistrationData, RegistrationIntent, GiftRecipient } from "@/lib/types"
import { REGISTRATION_PRODUCTS, formatUsdFromCents, parseUsdInputToCents } from "@/lib/registration-products"
import EmailTypoHint from "@/components/ui/email-typo-hint"
import { CONVENTION_START_DATE } from "@/lib/constants"
import { usePricing } from "@/lib/use-pricing"

interface RegistrationFormProps {
  initialData?: RegistrationData
  onComplete: (data: RegistrationData) => void
  showAccessCode?: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STATE_OPTIONS = [...NECYPAA_STATES.map((s) => s.name), "Other / International"]
const MAX_RECIPIENTS = 20
const COMPILED_REGISTRATION_PRICE_CENTS = REGISTRATION_PRODUCTS[0]?.priceInCents ?? 4000

const GROUP_DEADLINE_DISPLAY = new Date(CONVENTION_START_DATE).toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
})

const preferenceOptions = [
  {
    id: "interpretationNeeded" as const,
    label: "Interpretation support",
    description: "Let us know if you need interpretation services during the weekend.",
  },
  {
    id: "mobilityAccessibility" as const,
    label: "Mobility access",
    description: "Share wheelchair or other mobility access needs ahead of time.",
  },
  {
    id: "willingToServe" as const,
    label: "Available for service",
    description: "If you want to help during the weekend, we'll make it easy to connect.",
  },
]

interface IntentOption {
  value: RegistrationIntent
  badge: string
  title: string
  description: string
}

const INTENT_OPTIONS: IntentOption[] = [
  {
    value: "self",
    badge: "Standard",
    title: "Register myself.",
    description: "I'm coming to the convention. The basic path — fill out attendee info, sign the policy, pay.",
  },
  {
    value: "self_plus_gift",
    badge: "Register + Sponsor",
    title: "Register myself AND sponsor someone.",
    description:
      "I'm coming AND I want to pay for someone else's registration. They'll get a claim link in their email.",
  },
  {
    value: "gift_only",
    badge: "Sponsor Individuals",
    title: "Sponsor specific people.",
    description:
      "I'm not attending — I just want to pay for one or more people I know by name. Each recipient gets a claim link.",
  },
  {
    value: "group",
    badge: "Group / Institution",
    title: "Buy bulk seats for our group.",
    description:
      "Our recovery house, treatment center, or service body wants to register a number of folks. Pay now; send us the names by the convention start date.",
  },
  {
    value: "donate",
    badge: "General Fund",
    title: "Donate to the General Fund.",
    description:
      "Help cover scholarships for those who can't afford the price of admission. Suggested $40. No registration attached.",
  },
]

function defaultData(): RegistrationData {
  return {
    intent: "self",
    name: "",
    email: "",
    state: "",
    homegroup: "",
    accommodations: "",
    interpretationNeeded: false,
    mobilityAccessibility: false,
    willingToServe: false,
    giftRecipients: [],
    // donationAmountCents stays 0 by default — the form seeds it to the
    // current registration price when the user switches to the donate intent.
    // Leaving the field 0 here means a stale value can't leak into a self
    // registration submission.
    donationAmountCents: 0,
    groupName: "",
    groupQuantity: 0,
    accessCode: "",
  }
}

export default function RegistrationForm({ initialData, onComplete, showAccessCode = true }: RegistrationFormProps) {
  const pricing = usePricing()
  const REGISTRATION_PRICE_CENTS = pricing.registrationCents
  const [data, setData] = useState<RegistrationData>(() => ({ ...defaultData(), ...(initialData ?? {}) }))
  const [showAccessCodeField, setShowAccessCodeField] = useState(Boolean((initialData?.accessCode ?? "").trim()))
  const [donationInput, setDonationInput] = useState(() =>
    formatUsdFromCents(initialData?.donationAmountCents ?? COMPILED_REGISTRATION_PRICE_CENTS),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const errorSummaryRef = useRef<HTMLDivElement | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)

  // Focus the first input on mount so keyboard users (and screen readers)
  // know where they are after step transitions. Skip on iOS to avoid the
  // jarring keyboard-popup-on-load behavior.
  useEffect(() => {
    const isTouch = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches
    if (isTouch) return
    nameInputRef.current?.focus({ preventScroll: true })
  }, [])

  const isBuyerAttendee = data.intent === "self" || data.intent === "self_plus_gift"
  const showRecipients = data.intent === "self_plus_gift" || data.intent === "gift_only"
  const showDonation = data.intent === "donate"
  const showGroup = data.intent === "group"
  const hasAccessCode = (data.accessCode ?? "").trim().length > 0

  const update = <K extends keyof RegistrationData>(field: K, value: RegistrationData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field as string]) return prev
      const next = { ...prev }
      delete next[field as string]
      return next
    })
  }

  const updateIntent = (next: RegistrationIntent) => {
    setData((prev) => {
      const out: RegistrationData = { ...prev, intent: next, accessCode: "" }
      // Reset recipient list to a single empty slot when entering a gift flow.
      if (next === "self_plus_gift" || next === "gift_only") {
        if (prev.giftRecipients.length === 0) {
          out.giftRecipients = [{ name: "", email: "", message: "" }]
        }
      } else {
        out.giftRecipients = []
      }
      if (next === "donate") {
        out.donationAmountCents = parseUsdInputToCents(donationInput) ?? REGISTRATION_PRICE_CENTS
      } else {
        out.donationAmountCents = 0
      }
      if (next === "group") {
        out.groupQuantity = prev.groupQuantity > 1 ? prev.groupQuantity : 5
        out.groupName = prev.groupName
      } else {
        out.groupQuantity = 0
        out.groupName = ""
      }
      return out
    })
    setShowAccessCodeField(false)
    setErrors({})
  }

  const updateRecipient = (index: number, patch: Partial<GiftRecipient>) => {
    setData((prev) => {
      const next = [...prev.giftRecipients]
      next[index] = { ...next[index], ...patch }
      return { ...prev, giftRecipients: next }
    })
    const fieldKey = `recipient_${index}`
    setErrors((prev) => {
      if (!prev[fieldKey]) return prev
      const next = { ...prev }
      delete next[fieldKey]
      return next
    })
  }

  const addRecipient = () => {
    setData((prev) =>
      prev.giftRecipients.length < MAX_RECIPIENTS
        ? { ...prev, giftRecipients: [...prev.giftRecipients, { name: "", email: "", message: "" }] }
        : prev,
    )
  }

  const removeRecipient = (index: number) => {
    setData((prev) => ({
      ...prev,
      giftRecipients: prev.giftRecipients.filter((_, i) => i !== index),
    }))
  }

  const handleDonationBlur = () => {
    const parsed = parseUsdInputToCents(donationInput)
    if (parsed != null) {
      setDonationInput(formatUsdFromCents(parsed))
      update("donationAmountCents", parsed)
    }
  }

  const handleDonationChange = (raw: string) => {
    setDonationInput(raw)
    const parsed = parseUsdInputToCents(raw)
    if (parsed != null) update("donationAmountCents", parsed)
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!data.name.trim()) next.name = "Name is required."
    if (!data.email.trim()) next.email = "Email is required."
    else if (!EMAIL_REGEX.test(data.email)) next.email = "Please enter a valid email address."

    if (isBuyerAttendee) {
      if (!data.state.trim()) next.state = "Please choose a state or region."
      if (!data.homegroup.trim()) next.homegroup = "Homegroup or committee is required."
    }

    if (showRecipients) {
      if (data.giftRecipients.length === 0) {
        next.giftRecipients = "Add at least one recipient."
      }
      data.giftRecipients.forEach((r, i) => {
        if (!r.name.trim()) next[`recipient_${i}`] = "Recipient name is required."
        else if (r.email.trim() && !EMAIL_REGEX.test(r.email)) {
          next[`recipient_${i}`] = "Recipient email must be valid or empty."
        }
      })
    }

    if (showDonation) {
      const parsed = parseUsdInputToCents(donationInput)
      if (parsed == null || parsed < 1000) {
        next.donationAmountCents = "Donation must be at least $10."
      }
    }

    if (showGroup) {
      if (!data.groupName.trim()) next.groupName = "Organization name is required."
      if (data.groupQuantity < 2) next.groupQuantity = "Buy 2 or more seats for a group purchase."
      if (data.groupQuantity > 100) next.groupQuantity = "For more than 100 seats, email us to arrange a custom invoice."
    }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onComplete(data)
  }

  const errorEntries = Object.entries(errors)

  const giftSummary = useMemo(() => {
    if (!showRecipients) return null
    const count = data.giftRecipients.filter((r) => r.name.trim()).length
    if (count === 0) return null
    const total = count * REGISTRATION_PRICE_CENTS
    return `${count} ${count === 1 ? "sponsored registration" : "sponsored registrations"} at $${formatUsdFromCents(REGISTRATION_PRICE_CENTS)} each → $${formatUsdFromCents(total)}`
  }, [data.giftRecipients, showRecipients])

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {errorEntries.length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="rounded-[1.25rem] border border-[rgba(var(--nec-pink-rgb),0.30)] bg-[rgba(var(--nec-pink-rgb),0.06)] p-5 outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        >
          <p className="text-sm font-semibold text-[var(--nec-text)]">Please fix the following before continuing:</p>
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

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="form-section-label">Pick Your Path</p>
          <p className="form-support-text">
            Four ways to participate. The form changes based on which one you choose.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {INTENT_OPTIONS.map((opt) => {
            const active = data.intent === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateIntent(opt.value)}
                aria-pressed={active}
                className="form-option-card rounded-[1.5rem] p-5 text-left"
                data-active={active ? "true" : "false"}
              >
                <p className="form-section-label">{opt.badge}</p>
                <p className="mt-3 text-lg font-semibold text-[var(--nec-text)]">{opt.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--nec-muted)]">{opt.description}</p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Purchaser / attendee details — always collected; labels shift by intent. */}
      <section className="space-y-5">
        <div className="space-y-2">
          <p className="form-section-label">
            {isBuyerAttendee ? "Attendee Information" : data.intent === "donate" ? "Donor Information" : "Purchaser Information"}
          </p>
          <p className="form-support-text">
            {isBuyerAttendee
              ? "These details confirm your registration and help us support you onsite."
              : data.intent === "donate"
                ? "Just enough to send you a receipt."
                : "Tell us who's buying. Each recipient will fill out their own info on the claim page."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[var(--nec-text)]">
              {isBuyerAttendee ? "Full name" : data.intent === "donate" ? "Donor name" : "Purchaser name"}{" "}
              <span className="text-[var(--nec-pink)]">*</span>
            </Label>
            <Input
              id="name"
              ref={nameInputRef}
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={!!errors.name}
              placeholder={isBuyerAttendee ? "Your full name" : "Who is making this purchase?"}
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
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby="email-typo-hint"
              placeholder="name@email.com"
            />
            {errors.email && <p className="text-sm text-[var(--nec-pink)]">{errors.email}</p>}
            <EmailTypoHint value={data.email} fieldId="email" onAccept={(v) => update("email", v)} />
          </div>

          {isBuyerAttendee && (
            <>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-[var(--nec-text)]">
                  State / region <span className="text-[var(--nec-pink)]">*</span>
                </Label>
                <select
                  id="state"
                  value={data.state}
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
                  value={data.homegroup}
                  onChange={(e) => update("homegroup", e.target.value)}
                  aria-invalid={!!errors.homegroup}
                  placeholder="Homegroup, committee, or service body"
                />
                {errors.homegroup && <p className="text-sm text-[var(--nec-pink)]">{errors.homegroup}</p>}
              </div>
            </>
          )}
        </div>
      </section>

      {isBuyerAttendee && (
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="form-section-label">Accessibility And Service</p>
            <p className="form-support-text">
              These preferences help us prepare the weekend around real people instead of generic assumptions.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {preferenceOptions.map((opt) => (
              <div
                key={opt.id}
                className="form-option-card flex items-start gap-3 rounded-[1.4rem] p-4"
                data-active={data[opt.id] ? "true" : "false"}
              >
                <Checkbox
                  id={opt.id}
                  checked={data[opt.id]}
                  onCheckedChange={(v) => update(opt.id, Boolean(v))}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor={opt.id} className="text-sm font-semibold text-[var(--nec-text)]">
                    {opt.label}
                  </Label>
                  <p className="text-sm leading-6 text-[var(--nec-muted)]">{opt.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="accommodations" className="text-[var(--nec-text)]">
              Accommodation details
            </Label>
            <Textarea
              id="accommodations"
              value={data.accommodations}
              onChange={(e) => update("accommodations", e.target.value)}
              placeholder="Share any accessibility, mobility, or accommodation needs here."
            />
          </div>
        </section>
      )}

      {showRecipients && (
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="form-section-label">Recipients</p>
            <p className="form-support-text">
              Name is required. Email is optional — if you provide it, we email the claim link directly. If not, we
              email the link to <strong>you</strong> to forward.
            </p>
            {giftSummary && (
              <p className="text-sm text-[var(--nec-text)]">
                <span className="text-[var(--nec-muted)]">Running total:</span> {giftSummary}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {data.giftRecipients.map((r, i) => (
              <div
                key={i}
                className="space-y-3 rounded-[1.25rem] border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.6)] p-4"
              >
                <div className="grid gap-3 md:grid-cols-[1.1fr_1.1fr_auto]">
                  <div className="space-y-1">
                    <Label
                      htmlFor={`recipient_${i}_name`}
                      className="text-xs uppercase tracking-wider text-[var(--nec-muted)]"
                    >
                      Recipient {i + 1} name <span className="text-[var(--nec-pink)]">*</span>
                    </Label>
                    <Input
                      id={`recipient_${i}_name`}
                      value={r.name}
                      onChange={(e) => updateRecipient(i, { name: e.target.value })}
                      placeholder="Their full name"
                      aria-invalid={!!errors[`recipient_${i}`]}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor={`recipient_${i}_email`}
                      className="text-xs uppercase tracking-wider text-[var(--nec-muted)]"
                    >
                      Email <span className="text-[var(--nec-muted)]">(optional)</span>
                    </Label>
                    <Input
                      id={`recipient_${i}_email`}
                      type="email"
                      value={r.email}
                      onChange={(e) => updateRecipient(i, { email: e.target.value })}
                      placeholder="Leave blank to forward yourself"
                      aria-invalid={!!errors[`recipient_${i}`]}
                    />
                    <EmailTypoHint
                      value={r.email}
                      fieldId={`recipient_${i}_email`}
                      onAccept={(v) => updateRecipient(i, { email: v })}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeRecipient(i)}
                      disabled={data.giftRecipients.length <= 1}
                      className="rounded-md border border-[rgba(var(--nec-purple-rgb),0.20)] px-3 py-2 text-sm text-[var(--nec-text)] transition-colors hover:bg-[rgba(var(--nec-purple-rgb),0.08)] disabled:opacity-40"
                      aria-label={`Remove recipient ${i + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor={`recipient_${i}_message`}
                    className="text-xs uppercase tracking-wider text-[var(--nec-muted)]"
                  >
                    Note from you <span className="text-[var(--nec-muted)]">(optional)</span>
                  </Label>
                  <Textarea
                    id={`recipient_${i}_message`}
                    value={r.message}
                    onChange={(e) => updateRecipient(i, { message: e.target.value })}
                    placeholder={`Say hello — they'll see this on the claim page and in the email. Like, "Joey here — can't wait to see you in Hartford."`}
                    maxLength={500}
                    rows={2}
                  />
                  <p className="text-xs text-[var(--nec-muted)]">{r.message.length}/500 characters</p>
                </div>
                {errors[`recipient_${i}`] && (
                  <p className="text-sm text-[var(--nec-pink)]">{errors[`recipient_${i}`]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={addRecipient}
              disabled={data.giftRecipients.length >= MAX_RECIPIENTS}
            >
              + Add Another Recipient
            </Button>
            <p className="text-xs text-[var(--nec-muted)]">Up to {MAX_RECIPIENTS} recipients per transaction.</p>
          </div>
          {errors.giftRecipients && <p className="text-sm text-[var(--nec-pink)]">{errors.giftRecipients}</p>}
        </section>
      )}

      {showDonation && (
        <section className="space-y-4">
          <div className="space-y-2">
            <p className="form-section-label">Donation Amount</p>
            <p className="form-support-text">
              Suggested $40 (the price of one registration). Donate any amount of $10 or more.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-[200px_1fr] md:items-center">
            <div className="space-y-1">
              <Label htmlFor="donationAmountCents" className="text-xs uppercase tracking-wider text-[var(--nec-muted)]">
                Amount (USD) <span className="text-[var(--nec-pink)]">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-lg text-[var(--nec-muted)]">$</span>
                <Input
                  id="donationAmountCents"
                  inputMode="decimal"
                  value={donationInput}
                  onChange={(e) => handleDonationChange(e.target.value)}
                  onBlur={handleDonationBlur}
                  aria-invalid={!!errors.donationAmountCents}
                  placeholder="40.00"
                />
              </div>
              {errors.donationAmountCents && (
                <p className="text-sm text-[var(--nec-pink)]">{errors.donationAmountCents}</p>
              )}
            </div>
            <p className="text-sm leading-6 text-[var(--nec-muted)]">
              100% of donations to the General Fund go toward scholarships. You won&apos;t be registered as an attendee
              — this is a contribution only.
            </p>
          </div>
        </section>
      )}

      {showGroup && (
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="form-section-label">Group Purchase</p>
            <p className="form-support-text">
              Pay now for a block of seats — no need to know who&apos;s coming yet. We&apos;ll email you a receipt and a
              clear deadline to send us the attendee names. Each attendee will receive the convention policy when their
              name reaches us; you (the purchaser) don&apos;t need to sign on their behalf.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="groupName" className="text-[var(--nec-text)]">
                Organization name <span className="text-[var(--nec-pink)]">*</span>
              </Label>
              <Input
                id="groupName"
                value={data.groupName}
                onChange={(e) => update("groupName", e.target.value)}
                aria-invalid={!!errors.groupName}
                placeholder="Hope House, District 12, Hartford YPAA, etc."
                maxLength={200}
              />
              {errors.groupName && <p className="text-sm text-[var(--nec-pink)]">{errors.groupName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupQuantity" className="text-[var(--nec-text)]">
                Number of seats <span className="text-[var(--nec-pink)]">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => update("groupQuantity", Math.max(2, data.groupQuantity - 1))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.92)] text-lg font-semibold text-[var(--nec-text)] hover:border-[rgba(var(--nec-purple-rgb),0.24)] hover:bg-[rgba(var(--nec-purple-rgb),0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:opacity-50"
                  aria-label="Decrease seat count"
                  disabled={data.groupQuantity <= 2}
                >
                  −
                </button>
                <Input
                  id="groupQuantity"
                  type="number"
                  inputMode="numeric"
                  min={2}
                  max={100}
                  value={data.groupQuantity}
                  onChange={(e) => {
                    const n = Number.parseInt(e.target.value, 10)
                    if (Number.isFinite(n)) update("groupQuantity", Math.max(0, Math.min(100, n)))
                    else update("groupQuantity", 0)
                  }}
                  aria-invalid={!!errors.groupQuantity}
                  className="w-24 text-center"
                />
                <button
                  type="button"
                  onClick={() => update("groupQuantity", Math.min(100, Math.max(2, data.groupQuantity) + 1))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.92)] text-lg font-semibold text-[var(--nec-text)] hover:border-[rgba(var(--nec-purple-rgb),0.24)] hover:bg-[rgba(var(--nec-purple-rgb),0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:opacity-50"
                  aria-label="Increase seat count"
                  disabled={data.groupQuantity >= 100}
                >
                  +
                </button>
                <span className="text-sm text-[var(--nec-muted)]">
                  × ${formatUsdFromCents(REGISTRATION_PRICE_CENTS)} ={" "}
                  <strong className="text-[var(--nec-text)]">
                    ${formatUsdFromCents(Math.max(0, data.groupQuantity) * REGISTRATION_PRICE_CENTS)}
                  </strong>
                </span>
              </div>
              {errors.groupQuantity && <p className="text-sm text-[var(--nec-pink)]">{errors.groupQuantity}</p>}
              <p className="text-xs text-[var(--nec-muted)]">
                2–100 seats per purchase. Need more? Email us and we&apos;ll arrange a custom invoice.
              </p>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-[rgba(var(--nec-gold-rgb),0.30)] bg-[rgba(var(--nec-gold-rgb),0.08)] p-5">
            <p className="form-section-label">How This Works</p>
            <ol className="mt-3 space-y-2 text-sm leading-7 text-[var(--nec-text)]">
              <li>
                <strong>1.</strong> Pay for your seats today.
              </li>
              <li>
                <strong>2.</strong> We&apos;ll send your confirmation to the email above. Reply to that email with the
                attendee names by{" "}
                <strong className="text-[var(--nec-gold)]">{GROUP_DEADLINE_DISPLAY}</strong> (the day the convention
                starts).
              </li>
              <li>
                <strong>3.</strong> As each name arrives, we&apos;ll email that attendee directly with the convention
                policy to review and sign. They&apos;ll be checked in onsite under their own name.
              </li>
            </ol>
            <p className="mt-3 text-xs italic leading-6 text-[var(--nec-muted)]">
              Seats not assigned by the deadline are still yours — you can hand them off to walk-ins at the door, or
              reach out and we&apos;ll release them to the scholarship pool.
            </p>
          </div>
        </section>
      )}

      {showAccessCode && data.intent === "self" && (
        <section className="space-y-4 rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-purple-rgb),0.03)] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="form-section-label">Access Code</p>
              <p className="text-sm leading-6 text-[var(--nec-muted)]">
                Have a cash-paid or scholarship code from your committee? Enter it here instead of paying.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAccessCodeField((v) => !v)}
              aria-expanded={showAccessCodeField}
              className="btn-ghost !min-h-0 self-start !px-4 !py-2 sm:self-auto"
            >
              {showAccessCodeField ? "Hide Code Field" : "Enter Access Code"}
            </button>
          </div>
          {showAccessCodeField && (
            <div className="space-y-2">
              <Label htmlFor="accessCode" className="text-[var(--nec-text)]">
                Registration access code
              </Label>
              <Input
                id="accessCode"
                value={data.accessCode}
                onChange={(e) => update("accessCode", e.target.value)}
                placeholder="Enter your code"
                maxLength={50}
                autoComplete="off"
              />
            </div>
          )}
        </section>
      )}

      <Button type="submit" className="w-full">
        {hasAccessCode || !isBuyerAttendee
          ? "Continue"
          : "Continue to Policy Agreement"}
      </Button>
    </form>
  )
}
