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
    <div className="rounded-2xl p-6 border border-[var(--nec-border)] space-y-4 bg-[rgba(26,16,48,0.6)]">
      <h3 className="text-lg font-semibold text-white">New Years Day Breakfast!</h3>
      <p className="text-sm text-[var(--nec-muted)]">
        Keep your mornings simple at the convention hotel. Friday is especially useful since many local restaurants
        are closed on New Year&apos;s Day.
      </p>

      {fridayProduct && (
        <button
          type="button"
          onClick={() => onToggle(fridayProduct.id, !breakfastSelections[fridayProduct.id])}
          aria-pressed={breakfastSelections[fridayProduct.id] || false}
          className="w-full text-left rounded-xl px-4 py-3 transition-colors border"
          style={{
            background: breakfastSelections[fridayProduct.id] ? "rgba(212,160,23,0.12)" : "rgba(212,160,23,0.04)",
            borderColor: breakfastSelections[fridayProduct.id] ? "rgba(212,160,23,0.5)" : "rgba(212,160,23,0.15)",
          }}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              id={fridayProduct.id}
              checked={breakfastSelections[fridayProduct.id] || false}
              onCheckedChange={(checked) => onToggle(fridayProduct.id, checked as boolean)}
              className="mt-1 border-[var(--nec-gold)] data-[state=checked]:bg-[var(--nec-gold)] data-[state=checked]:border-[var(--nec-gold)]"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Label htmlFor={fridayProduct.id} className="text-sm text-white font-semibold cursor-pointer">Friday - New Year&apos;s Day</Label>
                <span className="text-sm text-white font-semibold">$25</span>
              </div>
              <p className="text-[var(--nec-gold)] text-xs mt-1">
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
            className="nec-breakfast-option w-full text-left rounded-xl px-3 py-2.5 transition-colors border"
            style={{
              background: breakfastSelections[bp.id] ? "rgba(45,31,78,0.6)" : "rgba(26,16,48,0.6)",
              borderColor: breakfastSelections[bp.id] ? "rgba(212,160,23,0.5)" : "var(--nec-border)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <Checkbox
                id={bp.id}
                checked={breakfastSelections[bp.id] || false}
                onCheckedChange={(checked) => onToggle(bp.id, checked as boolean)}
                className="border-[var(--nec-border)] data-[state=checked]:bg-[var(--nec-gold)] data-[state=checked]:border-[var(--nec-gold)]"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 flex items-center justify-between">
                <Label htmlFor={bp.id} className="text-sm text-white cursor-pointer">
                  {bp.id === "breakfast-saturday" ? "Saturday Breakfast" : "Sunday Breakfast"}
                </Label>
                <span className="text-sm text-white font-medium">$25</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
