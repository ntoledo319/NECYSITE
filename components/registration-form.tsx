"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import type { RegistrationData } from "@/lib/types"

interface RegistrationFormProps {
  onComplete: (data: RegistrationData) => void
  enableScholarship?: boolean
}

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

  const validateField = (field: string, value: string) => {
    let error = ""
    switch (field) {
      case "name":
        if (!value.trim()) error = "Name is required"
        break
      case "email":
        if (!value.trim()) error = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email"
        break
      case "state":
        if (!value) error = "Please select a state"
        break
    }
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  const handleScholarshipQuickStart = () => {
    onComplete({
      name: "",
      state: "",
      email: "",
      accommodations: "",
      interpretationNeeded: false,
      mobilityAccessibility: false,
      willingToServe: false,
      homegroup: "",
      isScholarship: true,
      scholarshipRecipientName: "",
      scholarshipRecipientEmail: "",
      accessCode: "",
    })
  }

  const isFormValid = () => {
    const baseValid =
      formData.name.trim() !== "" &&
      formData.state.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.homegroup.trim() !== ""

    if (!baseValid) {
      return false
    }

    if (enableScholarship && formData.isScholarship) {
      return (formData.scholarshipRecipientName ?? "").trim() !== ""
    }

    return true
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {enableScholarship && !hasAccessCode && (
          <div className="rounded-xl border border-[var(--nec-border)] p-3 bg-[rgba(124,58,237,0.05)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--nec-muted)] text-center sm:text-left">Buying registration for someone else?</p>
              <Button
                type="button"
                onClick={handleScholarshipQuickStart}
                className="w-full sm:w-auto text-[var(--nec-text)] h-9 px-4 bg-[rgba(var(--nec-purple-rgb),0.10)] border border-[var(--nec-border)]"
              >
                Scholarship
              </Button>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="name" className="text-[var(--nec-text)]">
            Name <span className="text-[var(--nec-pink)]" aria-hidden="true">*</span><span className="sr-only"> (required)</span>
          </Label>
          <Input
            id="name"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              if (errors.name) setErrors(prev => ({ ...prev, name: "" }))
            }}
            onBlur={(e) => validateField("name", e.target.value)}
            className="text-[var(--nec-text)]"
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-xs mt-1 text-[var(--nec-pink)]">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="state" className="text-[var(--nec-text)]">
            State <span className="text-[var(--nec-pink)]" aria-hidden="true">*</span><span className="sr-only"> (required)</span>
          </Label>
          <Input
            id="state"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors.state}
            aria-describedby={errors.state ? "state-error" : undefined}
            value={formData.state}
            onChange={(e) => {
              setFormData({ ...formData, state: e.target.value })
              if (errors.state) setErrors(prev => ({ ...prev, state: "" }))
            }}
            onBlur={(e) => validateField("state", e.target.value)}
            className="text-[var(--nec-text)]"
          />
          {errors.state && (
            <p id="state-error" role="alert" className="text-xs mt-1 text-[var(--nec-pink)]">
              {errors.state}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-[var(--nec-text)]">
            Email <span className="text-[var(--nec-pink)]" aria-hidden="true">*</span><span className="sr-only"> (required)</span>
          </Label>
          <Input
            id="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              if (errors.email) setErrors(prev => ({ ...prev, email: "" }))
            }}
            onBlur={(e) => validateField("email", e.target.value)}
            className="text-[var(--nec-text)]"
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-xs mt-1 text-[var(--nec-pink)]">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="accommodations" className="text-[var(--nec-text)]">
            Accommodations
          </Label>
          <Textarea
            id="accommodations"
            value={formData.accommodations}
            onChange={(e) => setFormData({ ...formData, accommodations: e.target.value })}
            className="text-[var(--nec-text)]"
            placeholder="Please describe any accommodation needs"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="interpretationNeeded"
              checked={formData.interpretationNeeded}
              onCheckedChange={(checked) => setFormData({ ...formData, interpretationNeeded: checked as boolean })}
              className="border-[var(--nec-border)]"
            />
            <Label htmlFor="interpretationNeeded" className="text-[var(--nec-text)] font-normal">
              Interpretation Needed
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="mobilityAccessibility"
              checked={formData.mobilityAccessibility}
              onCheckedChange={(checked) => setFormData({ ...formData, mobilityAccessibility: checked as boolean })}
              className="border-[var(--nec-border)]"
            />
            <Label htmlFor="mobilityAccessibility" className="text-[var(--nec-text)] font-normal">
              Wheelchair / Mobility Access
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="willingToServe"
              checked={formData.willingToServe}
              onCheckedChange={(checked) => setFormData({ ...formData, willingToServe: checked as boolean })}
              className="border-[var(--nec-border)]"
            />
            <Label htmlFor="willingToServe" className="text-[var(--nec-text)] font-normal">
              Willing to be of Service
            </Label>
          </div>
        </div>

        <div>
          <Label htmlFor="homegroup" className="text-[var(--nec-text)]">
            Homegroup/Committee <span className="text-[var(--nec-pink)]" aria-hidden="true">*</span><span className="sr-only"> (required)</span>
          </Label>
          <Input
            id="homegroup"
            type="text"
            required
            aria-required="true"
            value={formData.homegroup}
            onChange={(e) => setFormData({ ...formData, homegroup: e.target.value })}
            className="text-[var(--nec-text)]"
          />
        </div>
      </div>

      {/* Registration Access Code */}
      <div
        className="rounded-xl border border-[var(--nec-border)] p-3 bg-[rgba(124,58,237,0.05)]"
      >
        <button
          type="button"
          onClick={() => setShowAccessCode(!showAccessCode)}
          aria-expanded={showAccessCode}
          aria-controls="access-code-section"
          className="w-full flex items-center justify-between text-sm text-[var(--nec-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-lg px-1 py-0.5"
        >
          <span>Have a Registration Access Code?</span>
          <span className="text-xs font-medium text-[var(--nec-cyan)]">
            {showAccessCode ? "Hide" : "Show"}
          </span>
        </button>
        {showAccessCode && (
          <div id="access-code-section" className="pt-3">
            <Label htmlFor="accessCode" className="text-[var(--nec-text)] text-sm">
              Registration Access Code
            </Label>
            <p id="accessCode-description" className="text-xs text-[var(--nec-muted)] mt-1 mb-2">
              For cash or scholarship registration only. Leave blank for standard paid registration.
            </p>
            <Input
              id="accessCode"
              type="text"
              value={formData.accessCode}
              onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
              className="text-[var(--nec-text)]"
              placeholder="Enter your access code"
              autoComplete="off"
              aria-describedby="accessCode-description"
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isFormValid()}
        className="w-full text-[var(--nec-text)] font-bold bg-[var(--nec-pink)] shadow-md"
      >
        Continue to Policy Agreement
      </Button>
    </form>
  )
}
