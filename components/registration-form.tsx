"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface RegistrationData {
  name: string
  state: string
  email: string
  accommodations: string
  interpretationNeeded: boolean
  handicapAccessibility: boolean
  willingToServe: boolean
  homegroup: string
  isScholarship: boolean
  scholarshipRecipientName: string
  scholarshipRecipientEmail: string
}

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
    handicapAccessibility: false,
    willingToServe: false,
    homegroup: "",
    isScholarship: false,
    scholarshipRecipientName: "",
    scholarshipRecipientEmail: "",
  })

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
      handicapAccessibility: false,
      willingToServe: false,
      homegroup: "",
      isScholarship: true,
      scholarshipRecipientName: "",
      scholarshipRecipientEmail: "",
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
      return formData.scholarshipRecipientName.trim() !== ""
    }

    return true
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {enableScholarship && (
          <div className="rounded-xl border p-3" style={{ background: "rgba(0,212,232,0.04)", borderColor: "var(--nec-border)" }}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-300 text-center sm:text-left">Buying registration for someone else?</p>
              <Button
                type="button"
                onClick={handleScholarshipQuickStart}
                className="w-full sm:w-auto text-white h-9 px-4" style={{ background: "rgba(42,53,82,0.8)", border: "1px solid var(--nec-border)" }}
              >
                Scholarship
              </Button>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="name" className="text-white">
            Name <span className="text-pink-400">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="text-white"
          />
        </div>

        <div>
          <Label htmlFor="state" className="text-white">
            State <span className="text-pink-400">*</span>
          </Label>
          <Input
            id="state"
            type="text"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="text-white"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-white">
            Email <span className="text-pink-400">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="text-white"
          />
        </div>

        <div>
          <Label htmlFor="accommodations" className="text-white">
            Accommodations
          </Label>
          <Textarea
            id="accommodations"
            value={formData.accommodations}
            onChange={(e) => setFormData({ ...formData, accommodations: e.target.value })}
            className="text-white"
            placeholder="Please describe any accommodation needs"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="interpretationNeeded"
              checked={formData.interpretationNeeded}
              onCheckedChange={(checked) => setFormData({ ...formData, interpretationNeeded: checked as boolean })}
              className="border-gray-700"
            />
            <Label htmlFor="interpretationNeeded" className="text-white font-normal">
              Interpretation Needed
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="handicapAccessibility"
              checked={formData.handicapAccessibility}
              onCheckedChange={(checked) => setFormData({ ...formData, handicapAccessibility: checked as boolean })}
              className="border-gray-700"
            />
            <Label htmlFor="handicapAccessibility" className="text-white font-normal">
              Handicap Accessibility
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="willingToServe"
              checked={formData.willingToServe}
              onCheckedChange={(checked) => setFormData({ ...formData, willingToServe: checked as boolean })}
              className="border-gray-700"
            />
            <Label htmlFor="willingToServe" className="text-white font-normal">
              Willing to be of Service
            </Label>
          </div>
        </div>

        <div>
          <Label htmlFor="homegroup" className="text-white">
            Homegroup/Committee <span className="text-pink-400">*</span>
          </Label>
          <Input
            id="homegroup"
            type="text"
            required
            value={formData.homegroup}
            onChange={(e) => setFormData({ ...formData, homegroup: e.target.value })}
            className="text-white"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isFormValid()}
        className="w-full text-white font-bold"
        style={{ background: "var(--nec-pink)", boxShadow: "0 2px 12px rgba(232,0,110,0.25)" }}
      >
        Continue to Policy Agreement
      </Button>
    </form>
  )
}
