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
    <div className="nec-reg-subcard rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-[var(--nec-text)]">Optional Scholarship Attribution</h3>
      <div>
        <label htmlFor="aaEntity" className="block text-sm text-[var(--nec-muted)] mb-1">
          YPAA Committee, Meeting, District, Area, or State (optional)
        </label>
        <input
          id="aaEntity"
          type="text"
          value={aaEntity}
          onChange={(e) => onAaEntityChange(e.target.value)}
          placeholder="Example: CT Bid for ICYPAA, District 5, CT Area 11, New Haven YP Meeting"
          className="w-full rounded-xl border border-[var(--nec-border)] bg-[var(--nec-card)] text-[var(--nec-text)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div className="space-y-2">
        <span className="block text-sm text-[var(--nec-muted)]" id="reserved-for-label">Reserved for individual (optional)</span>
        {reservedForPeople.map((name, index) => (
          <input
            key={`reserved-person-${index}`}
            type="text"
            value={name}
            onChange={(e) => onUpdateReservedPerson(index, e.target.value)}
            placeholder="John S, Middletown USA"
            aria-labelledby="reserved-for-label"
            aria-label={`Reserved for person ${index + 1}`}
            className="w-full rounded-xl border border-[var(--nec-border)] bg-[var(--nec-card)] text-[var(--nec-text)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        ))}
        {effectiveScholarshipQuantity > 1 && (
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onAddReservedPerson}
              disabled={reservedForPeople.length >= effectiveScholarshipQuantity}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-[var(--nec-text)] font-bold disabled:opacity-50 bg-[var(--nec-pink)]"
              aria-label="Add another name"
              title="Add another name"
            >
              +
            </button>
            <button
              type="button"
              onClick={onRemoveReservedPerson}
              disabled={reservedForPeople.length <= 1}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-[var(--nec-text)] font-bold disabled:opacity-50 bg-[rgba(var(--nec-purple-rgb),0.10)]"
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
