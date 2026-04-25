"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { BREAKFAST_PRODUCTS } from "@/lib/registration-products"

interface BreakfastAddOnsProps {
  breakfastSelections: Record<string, boolean>
  onToggle: (productId: string, checked: boolean) => void
}

export default function BreakfastAddOns({ breakfastSelections, onToggle }: BreakfastAddOnsProps) {
  const fridayProduct = BREAKFAST_PRODUCTS.find((p) => p.id === "breakfast-friday")
  const weekendProducts = BREAKFAST_PRODUCTS.filter((p) => p.id !== "breakfast-friday")

  return (
    <div className="nec-reg-subcard space-y-4 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-[var(--nec-text)]">New Years Day Breakfast!</h3>
      <p className="text-sm text-[var(--nec-muted)]">
        Keep your mornings simple at the convention hotel. Friday is especially useful since many local restaurants are
        closed on New Year&apos;s Day.
      </p>

      {fridayProduct && (
        <button
          type="button"
          onClick={() => onToggle(fridayProduct.id, !breakfastSelections[fridayProduct.id])}
          aria-pressed={breakfastSelections[fridayProduct.id] || false}
          className="w-full rounded-xl border px-4 py-3 text-left transition-colors"
          style={{
            background: breakfastSelections[fridayProduct.id]
              ? "rgba(var(--nec-gold-rgb),0.12)"
              : "rgba(var(--nec-gold-rgb),0.04)",
            borderColor: breakfastSelections[fridayProduct.id]
              ? "rgba(var(--nec-gold-rgb),0.5)"
              : "rgba(var(--nec-gold-rgb),0.15)",
          }}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              id={fridayProduct.id}
              checked={breakfastSelections[fridayProduct.id] || false}
              onCheckedChange={(checked) => onToggle(fridayProduct.id, checked as boolean)}
              className="mt-1 border-[var(--nec-gold)] data-[state=checked]:border-[var(--nec-gold)] data-[state=checked]:bg-[var(--nec-gold)]"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={fridayProduct.id}
                  className="cursor-pointer text-sm font-semibold text-[var(--nec-text)]"
                >
                  Friday - New Year&apos;s Day
                </Label>
                <span className="text-sm font-semibold text-[var(--nec-text)]">$25</span>
              </div>
              <p className="mt-1 text-xs text-[var(--nec-gold)]">
                Strongly recommended: most local restaurants are closed.
              </p>
            </div>
          </div>
        </button>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {weekendProducts.map((bp) => (
          <button
            key={bp.id}
            type="button"
            onClick={() => onToggle(bp.id, !breakfastSelections[bp.id])}
            aria-pressed={breakfastSelections[bp.id] || false}
            className="nec-breakfast-option w-full rounded-xl border px-3 py-2.5 text-left transition-colors"
            style={{
              background: breakfastSelections[bp.id] ? "rgba(var(--nec-purple-rgb),0.08)" : "var(--nec-card)",
              borderColor: breakfastSelections[bp.id] ? "rgba(var(--nec-gold-rgb),0.5)" : "var(--nec-border)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <Checkbox
                id={bp.id}
                checked={breakfastSelections[bp.id] || false}
                onCheckedChange={(checked) => onToggle(bp.id, checked as boolean)}
                className="border-[var(--nec-border)] data-[state=checked]:border-[var(--nec-gold)] data-[state=checked]:bg-[var(--nec-gold)]"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex flex-1 items-center justify-between">
                <Label htmlFor={bp.id} className="cursor-pointer text-sm text-[var(--nec-text)]">
                  {bp.id === "breakfast-saturday" ? "Saturday Breakfast" : "Sunday Breakfast"}
                </Label>
                <span className="text-sm font-medium text-[var(--nec-text)]">$25</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
