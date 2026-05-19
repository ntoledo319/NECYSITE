"use client"

import { useMemo } from "react"
import { suggestEmailFix } from "@/lib/email-typo"

interface Props {
  value: string
  onAccept: (corrected: string) => void
  /** Stable id used to associate with the field for screen readers. */
  fieldId: string
}

/**
 * Inline "did you mean?" suggestion that appears below an email input when
 * the entered domain looks like a typo of a common provider. The button is
 * keyboard-accessible and announces politely so it doesn't interrupt typing.
 */
export default function EmailTypoHint({ value, onAccept, fieldId }: Props) {
  const suggestion = useMemo(() => suggestEmailFix(value), [value])
  if (!suggestion) return null
  return (
    <p
      id={`${fieldId}-typo-hint`}
      className="text-sm text-[var(--nec-muted)]"
      role="status"
      aria-live="polite"
    >
      Did you mean{" "}
      <button
        type="button"
        onClick={() => onAccept(suggestion.suggested)}
        className="font-semibold text-[var(--nec-text)] underline decoration-[var(--nec-pink)] decoration-2 underline-offset-4 transition-opacity hover:opacity-80"
      >
        {suggestion.suggested}
      </button>
      ?
    </p>
  )
}
