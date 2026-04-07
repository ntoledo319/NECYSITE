"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { BREAKFAST_PRODUCTS } from "@/lib/registration-products"

export interface BreakfastSelections {
  [productId: string]: boolean
}

interface BreakfastTicketSelectorProps {
  selections: BreakfastSelections
  onChange: (selections: BreakfastSelections) => void
}

export default function BreakfastTicketSelector({
  selections,
  onChange,
}: BreakfastTicketSelectorProps) {
  const handleToggle = (productId: string, checked: boolean) => {
    onChange({ ...selections, [productId]: checked })
  }

  const fridayProduct = BREAKFAST_PRODUCTS.find((p) => p.id === "breakfast-friday")

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--nec-text)]">
          Add Breakfast Tickets{" "}
          <span className="text-[var(--nec-muted)] text-sm font-normal">(Optional)</span>
        </h3>
        <p className="text-[var(--nec-muted)] text-sm mt-1">
          $25.00 each - Enjoy breakfast at the convention each morning.
        </p>
      </div>

      {/* Friday - New Year's Day callout */}
      {fridayProduct && (
        <div className="rounded-xl border p-4" style={{ background: "rgba(212,160,23,0.06)", borderColor: "rgba(212,160,23,0.25)" }}>
          <div className="flex items-start gap-3">
            <Checkbox
              id={fridayProduct.id}
              checked={selections[fridayProduct.id] || false}
              onCheckedChange={(checked) =>
                handleToggle(fridayProduct.id, checked as boolean)
              }
              className="mt-1 border-[var(--nec-gold)] data-[state=checked]:bg-[var(--nec-gold)] data-[state=checked]:border-[var(--nec-gold)]"
            />
            <div className="flex-1">
              <Label
                htmlFor={fridayProduct.id}
                className="text-[var(--nec-text)] font-semibold cursor-pointer"
              >
                {fridayProduct.name}
              </Label>
              <p className="text-[var(--nec-gold)] text-sm mt-1">
                New Year's Day - most local restaurants will be closed! Start
                your new year right with breakfast and fellowship at the
                convention.
              </p>
              <p className="text-[var(--nec-text)] font-medium text-sm mt-1">$25.00</p>
            </div>
          </div>
        </div>
      )}

      {/* Saturday and Sunday */}
      <div className="space-y-3">
        {BREAKFAST_PRODUCTS.filter((p) => p.id !== "breakfast-friday").map(
          (product) => (
            <div
              key={product.id}
              className="nec-breakfast-option rounded-xl border p-4" style={{ background: "var(--nec-card)", borderColor: "var(--nec-border)" }}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={product.id}
                  checked={selections[product.id] || false}
                  onCheckedChange={(checked) =>
                    handleToggle(product.id, checked as boolean)
                  }
                  className="mt-1 border-[var(--nec-border)] data-[state=checked]:bg-[var(--nec-gold)] data-[state=checked]:border-[var(--nec-gold)]"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={product.id}
                    className="text-[var(--nec-text)] font-medium cursor-pointer"
                  >
                    {product.name}
                  </Label>
                  <p className="text-[var(--nec-muted)] text-sm mt-1">
                    {product.description}
                  </p>
                  <p className="text-[var(--nec-text)] font-medium text-sm mt-1">$25.00</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
