"use client"

import type { RegistrationData, PolicyAgreements } from "@/lib/types"

/**
 * Versioned sessionStorage persistence for the registration draft. Keeping a
 * version field lets us drop incompatible drafts after a deploy without
 * crashing the form. Access code is intentionally NOT persisted — codes
 * should not linger in browser storage after the tab is closed.
 */

export const REGISTRATION_DRAFT_VERSION = 4 as const
export const REGISTRATION_DRAFT_KEY = "necypaa-registration-state"

export type Step = "info" | "policy" | "payment"

export interface RegistrationDraft {
  version: typeof REGISTRATION_DRAFT_VERSION
  savedAt: number
  currentStep: Step
  registrationData: RegistrationData | null
  policyAgreements: PolicyAgreements | null
}

function isStep(value: unknown): value is Step {
  return value === "info" || value === "policy" || value === "payment"
}

function isRegistrationData(value: unknown): value is RegistrationData {
  if (!value || typeof value !== "object") return false
  const v = value as Record<string, unknown>
  return (
    typeof v.name === "string" &&
    typeof v.email === "string" &&
    typeof v.state === "string" &&
    typeof v.homegroup === "string" &&
    typeof v.accommodations === "string" &&
    typeof v.interpretationNeeded === "boolean" &&
    typeof v.mobilityAccessibility === "boolean" &&
    typeof v.willingToServe === "boolean" &&
    typeof v.intent === "string" &&
    ["self", "self_plus_gift", "gift_only", "group", "donate"].includes(v.intent as string) &&
    Array.isArray(v.giftRecipients) &&
    typeof v.donationAmountCents === "number" &&
    typeof v.groupName === "string" &&
    typeof v.groupQuantity === "number"
  )
}

function isPolicyAgreements(value: unknown): value is PolicyAgreements {
  if (!value || typeof value !== "object") return false
  const v = value as Record<string, unknown>
  const keys: (keyof PolicyAgreements)[] = [
    "readPolicy",
    "understandQuestions",
    "acknowledgeBehavior",
    "understandAdmission",
    "understandReporting",
    "understandInvestigation",
    "signatureAgreement",
  ]
  return keys.every((k) => typeof v[k] === "boolean")
}

export function readRegistrationDraft(): RegistrationDraft | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(REGISTRATION_DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") return null
    const p = parsed as Record<string, unknown>
    if (p.version !== REGISTRATION_DRAFT_VERSION) return null
    if (!isStep(p.currentStep)) return null
    const regData = p.registrationData
    if (regData != null && !isRegistrationData(regData)) return null
    const policy = p.policyAgreements
    if (policy != null && !isPolicyAgreements(policy)) return null
    if (p.currentStep !== "info" && !regData) return null
    return {
      version: REGISTRATION_DRAFT_VERSION,
      savedAt: typeof p.savedAt === "number" ? p.savedAt : Date.now(),
      currentStep: p.currentStep,
      registrationData: (regData as RegistrationData | null) ?? null,
      policyAgreements: (policy as PolicyAgreements | null) ?? null,
    }
  } catch {
    return null
  }
}

export function writeRegistrationDraft(draft: Omit<RegistrationDraft, "version" | "savedAt">): void {
  if (typeof window === "undefined") return
  try {
    const sanitized: RegistrationDraft = {
      version: REGISTRATION_DRAFT_VERSION,
      savedAt: Date.now(),
      currentStep: draft.currentStep,
      registrationData: stripSecrets(draft.registrationData),
      policyAgreements: draft.policyAgreements,
    }
    window.sessionStorage.setItem(REGISTRATION_DRAFT_KEY, JSON.stringify(sanitized))
  } catch {
    // Quota / privacy modes — silently drop.
  }
}

export function clearRegistrationDraft(): void {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.removeItem(REGISTRATION_DRAFT_KEY)
  } catch {
    // Best effort.
  }
}

function stripSecrets(data: RegistrationData | null): RegistrationData | null {
  if (!data) return null
  return { ...data, accessCode: "" }
}
