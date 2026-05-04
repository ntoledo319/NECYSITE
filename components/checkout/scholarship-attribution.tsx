"use client"

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
        <input
          id="aaEntity"
          type="text"
          value={aaEntity}
          onChange={(e) => onAaEntityChange(e.target.value)}
          placeholder="Example: CT Bid for ICYPAA, District 5, CT Area 11, New Haven YP Meeting"
          className="w-full rounded-xl border border-[var(--nec-border)] bg-[var(--nec-card)] px-3 py-2 text-sm text-[var(--nec-text)] focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div className="space-y-2">
        <span className="block text-sm text-[var(--nec-muted)]" id="reserved-for-label">
          Reserved for individual (optional)
        </span>
        {reservedForPeople.map((name, index) => (
          <input
            key={`reserved-person-${index}`}
            type="text"
            value={name}
            onChange={(e) => onUpdateReservedPerson(index, e.target.value)}
            placeholder="John S, Middletown USA"
            aria-labelledby="reserved-for-label"
            aria-label={`Reserved for person ${index + 1}`}
            className="w-full rounded-xl border border-[var(--nec-border)] bg-[var(--nec-card)] px-3 py-2 text-sm text-[var(--nec-text)] focus:outline-none focus:ring-2 focus:ring-pink-500"
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
