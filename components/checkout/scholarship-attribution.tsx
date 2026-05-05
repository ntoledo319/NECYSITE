"use client"

import { Input } from "@/components/ui/input"

interface ScholarshipAttributionProps {
  aaEntity: string
  onAaEntityChange: (value: string) => void
  reservedForPeople: string[]
  onUpdateReservedPerson: (index: number, value: string) => void
  onAddReservedPerson: () => void
  onRemoveReservedPerson: () => void
  effectiveScholarshipQuantity: number
}

export default function ScholarshipAttribution({
  aaEntity,
  onAaEntityChange,
  reservedForPeople,
  onUpdateReservedPerson,
  onAddReservedPerson,
  onRemoveReservedPerson,
  effectiveScholarshipQuantity,
}: ScholarshipAttributionProps) {
  return (
    <div className="nec-reg-subcard space-y-4 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-[var(--nec-text)]">Optional Scholarship Attribution</h3>
      <div>
        <label htmlFor="aaEntity" className="mb-1 block text-sm text-[var(--nec-muted)]">
          YPAA Committee, Meeting, District, Area, or State (optional)
        </label>
        <Input
          id="aaEntity"
          type="text"
          value={aaEntity}
          onChange={(e) => onAaEntityChange(e.target.value)}
          placeholder="Example: CT Bid for ICYPAA, District 5, CT Area 11, New Haven YP Meeting"
          maxLength={200}
          aria-invalid={false}
          aria-describedby="aaEntity-help"
          className="w-full"
        />
        <p id="aaEntity-help" className="sr-only">
          Optional attribution for this scholarship purchase
        </p>
      </div>

      <div className="space-y-2">
        <span className="block text-sm text-[var(--nec-muted)]" id="reserved-for-label">
          Reserved for individual (optional)
        </span>
        {reservedForPeople.map((name, index) => (
          <Input
            key={`reserved-person-${index}`}
            type="text"
            value={name}
            onChange={(e) => onUpdateReservedPerson(index, e.target.value)}
            placeholder="John S, Middletown USA"
            aria-labelledby="reserved-for-label"
            aria-label={`Reserved for person ${index + 1}`}
            maxLength={200}
            aria-invalid={false}
            aria-describedby="reserved-for-label"
            className="w-full"
          />
        ))}
        {effectiveScholarshipQuantity > 1 && (
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onAddReservedPerson}
              disabled={reservedForPeople.length >= effectiveScholarshipQuantity}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--nec-pink)] font-bold text-[var(--nec-text)] disabled:opacity-50"
              aria-label="Add another name"
              title="Add another name"
            >
              +
            </button>
            <button
              type="button"
              onClick={onRemoveReservedPerson}
              disabled={reservedForPeople.length <= 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(var(--nec-purple-rgb),0.10)] font-bold text-[var(--nec-text)] disabled:opacity-50"
              aria-label="Remove last name"
              title="Remove last name"
            >
              -
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
