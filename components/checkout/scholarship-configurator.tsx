"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatUsdFromCents } from "@/lib/registration-products"

interface ScholarshipConfiguratorProps {
  quantity: number
  defaultUnitAmountCents: number
  useCustomAmount: boolean
  amountInput: string
  amountError?: string | null
  currentUnitAmountCents?: number | null
  currentTotalCents?: number | null
  onDecreaseQuantity: () => void
  onIncreaseQuantity: () => void
  onToggleCustomAmount: () => void
  onAmountInputChange: (value: string) => void
  onAmountInputBlur?: () => void
  removeAction?: {
    label: string
    onClick: () => void
  }
  title?: string
  description?: string
}

export default function ScholarshipConfigurator({
  quantity,
  defaultUnitAmountCents,
  useCustomAmount,
  amountInput,
  amountError,
  currentUnitAmountCents,
  currentTotalCents,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onToggleCustomAmount,
  onAmountInputChange,
  onAmountInputBlur,
  removeAction,
  title = "Scholarship Settings",
  description = "Default scholarship amount follows the current pre-registration price. Switch to custom if you need to cover a different amount.",
}: ScholarshipConfiguratorProps) {
  const stepperButtonClassName =
    "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.92)] text-lg font-semibold text-[var(--nec-text)] transition-colors hover:border-[rgba(var(--nec-purple-rgb),0.24)] hover:bg-[rgba(var(--nec-purple-rgb),0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:opacity-50"
  const amountModeButtonClassName =
    "rounded-[1.15rem] border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
  const scholarshipCountLabel = `${quantity} scholarship${quantity === 1 ? "" : "s"}`

  return (
    <div className="nec-reg-subcard rounded-[1.8rem] p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-[var(--nec-text)]">{title}</p>
          <p className="max-w-2xl text-sm leading-7 text-[var(--nec-muted)]">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[rgba(var(--nec-gold-rgb),0.18)] bg-[rgba(var(--nec-gold-rgb),0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--nec-text)]">
            {useCustomAmount ? "Custom amount" : "Synced to pre-registration"}
          </span>
          <span className="rounded-full border border-[rgba(var(--nec-purple-rgb),0.16)] bg-[rgba(var(--nec-purple-rgb),0.05)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--nec-text)]">
            {scholarshipCountLabel}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <div className="rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.9)] p-4">
          <div className="space-y-1">
            <p className="form-section-label">Quantity</p>
            <p className="text-sm leading-6 text-[var(--nec-muted)]">
              Adjust how many registrations this scholarship purchase should cover.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.25rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-purple-rgb),0.04)] p-3">
            <button
              type="button"
              onClick={onDecreaseQuantity}
              className={stepperButtonClassName}
              disabled={quantity <= 1}
              aria-label="Decrease scholarship quantity"
            >
              -
            </button>

            <div className="min-w-0 text-center">
              <p
                className="text-3xl font-semibold tracking-[-0.04em] text-[var(--nec-text)]"
                aria-live="polite"
                aria-atomic="true"
              >
                {quantity}
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--nec-muted)]">
                {quantity === 1 ? "Registration" : "Registrations"}
              </p>
            </div>

            <button
              type="button"
              onClick={onIncreaseQuantity}
              className={stepperButtonClassName}
              disabled={quantity >= 20}
              aria-label="Increase scholarship quantity"
            >
              +
            </button>
          </div>

          {removeAction && (
            <button
              type="button"
              onClick={removeAction.onClick}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-[rgba(185,28,28,0.16)] bg-[rgba(185,28,28,0.08)] px-4 text-sm font-semibold text-[rgb(153,27,27)] transition-colors hover:bg-[rgba(185,28,28,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
              aria-label={removeAction.label}
            >
              Remove scholarship
            </button>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-[rgba(var(--nec-gold-rgb),0.12)] bg-[linear-gradient(145deg,rgba(var(--nec-gold-rgb),0.06),rgba(var(--nec-card-rgb),0.92))] p-4">
          <div className="space-y-1">
            <p className="form-section-label">Amount</p>
            <p className="text-sm leading-6 text-[var(--nec-muted)]">
              Keep the amount tied to the live pre-registration price, or switch to a custom amount for each
              scholarship.
            </p>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2" role="group" aria-label="Scholarship amount type">
            <button
              type="button"
              onClick={onToggleCustomAmount}
              aria-pressed={!useCustomAmount}
              className={`${amountModeButtonClassName} ${
                !useCustomAmount
                  ? "border-[rgba(var(--nec-purple-rgb),0.24)] bg-[rgba(var(--nec-purple-rgb),0.08)] text-[var(--nec-text)]"
                  : "border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.84)] text-[var(--nec-muted)] hover:border-[rgba(var(--nec-purple-rgb),0.18)] hover:text-[var(--nec-text)]"
              }`}
            >
              <span className="block text-sm font-semibold">Use synced amount</span>
              <span className="mt-1 block text-xs leading-6">${formatUsdFromCents(defaultUnitAmountCents)} each</span>
            </button>

            <button
              type="button"
              onClick={onToggleCustomAmount}
              aria-pressed={useCustomAmount}
              aria-controls="scholarship-custom-amount-section"
              className={`${amountModeButtonClassName} ${
                useCustomAmount
                  ? "border-[rgba(var(--nec-pink-rgb),0.26)] bg-[rgba(var(--nec-pink-rgb),0.08)] text-[var(--nec-text)]"
                  : "border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.84)] text-[var(--nec-muted)] hover:border-[rgba(var(--nec-purple-rgb),0.18)] hover:text-[var(--nec-text)]"
              }`}
            >
              <span className="block text-sm font-semibold">Use custom amount</span>
              <span className="mt-1 block text-xs leading-6">Override the amount per scholarship</span>
            </button>
          </div>

          {!useCustomAmount ? (
            <div className="mt-4 rounded-[1.25rem] border border-[rgba(var(--nec-gold-rgb),0.16)] bg-[rgba(var(--nec-gold-rgb),0.05)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--nec-muted)]">
                Default Scholarship Amount
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--nec-text)]">
                ${formatUsdFromCents(defaultUnitAmountCents)}
              </p>
              <p className="mt-1 text-xs leading-6 text-[var(--nec-muted)]">
                This stays synced with the current pre-registration price.
              </p>
            </div>
          ) : (
            <div id="scholarship-custom-amount-section" className="mt-4 space-y-2">
              <Label htmlFor="scholarship-custom-amount" className="text-[var(--nec-text)]">
                Custom amount per scholarship
              </Label>
              <div className="flex items-center gap-3 rounded-xl border border-[rgba(var(--nec-purple-rgb),0.14)] bg-[rgba(var(--nec-card-rgb),0.92)] px-4 py-2">
                <span className="text-sm font-semibold text-[var(--nec-muted)]">$</span>
                <Input
                  id="scholarship-custom-amount"
                  type="text"
                  inputMode="decimal"
                  value={amountInput}
                  onChange={(event) => onAmountInputChange(event.target.value)}
                  onBlur={onAmountInputBlur}
                  aria-invalid={!!amountError}
                  aria-describedby={amountError ? "scholarship-custom-amount-error" : "scholarship-custom-amount-help"}
                  placeholder={formatUsdFromCents(defaultUnitAmountCents)}
                  className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </div>
              {amountError ? (
                <p
                  id="scholarship-custom-amount-error"
                  role="alert"
                  aria-live="assertive"
                  className="text-sm text-[var(--nec-pink)]"
                >
                  {amountError}
                </p>
              ) : (
                <p id="scholarship-custom-amount-help" className="text-xs leading-6 text-[var(--nec-muted)]">
                  Use numbers like 40, 40.00, or 55.50. This amount applies to each scholarship.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {currentUnitAmountCents != null && currentTotalCents != null && (
        <div className="mt-4 flex flex-col gap-3 rounded-[1.35rem] border border-[rgba(var(--nec-purple-rgb),0.12)] bg-[rgba(var(--nec-card-rgb),0.92)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--nec-text)]">Current scholarship total</p>
            <p className="text-xs leading-6 text-[var(--nec-muted)]">
              {quantity} x ${formatUsdFromCents(currentUnitAmountCents)}
            </p>
          </div>
          <p className="text-lg font-semibold text-[var(--nec-gold)]">${formatUsdFromCents(currentTotalCents)}</p>
        </div>
      )}
    </div>
  )
}
