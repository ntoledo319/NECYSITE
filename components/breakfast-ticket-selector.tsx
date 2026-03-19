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
        <h3 className="text-lg font-semibold text-white">
          Add Breakfast Tickets{" "}
          <span className="text-gray-300 text-sm font-normal">(Optional)</span>
        </h3>
        <p className="text-gray-300 text-sm mt-1">
          $20.00 each - Enjoy breakfast at the convention each morning.
        </p>
      </div>

      {/* Friday - New Year's Day callout */}
      {fridayProduct && (
        <div className="rounded-xl border p-4" style={{ background: "rgba(249,115,22,0.06)", borderColor: "rgba(249,115,22,0.25)" }}>
          <div className="flex items-start gap-3">
            <Checkbox
              id={fridayProduct.id}
              checked={selections[fridayProduct.id] || false}
              onCheckedChange={(checked) =>
                handleToggle(fridayProduct.id, checked as boolean)
              }
              className="mt-1 border-orange-600 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
            />
            <div className="flex-1">
              <Label
                htmlFor={fridayProduct.id}
                className="text-white font-semibold cursor-pointer"
              >
                {fridayProduct.name}
              </Label>
              <p className="text-orange-400 text-sm mt-1">
                New Year's Day - most local restaurants will be closed! Start
                your new year right with breakfast and fellowship at the
                convention.
              </p>
              <p className="text-white font-medium text-sm mt-1">$20.00</p>
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
              className="nec-breakfast-option rounded-xl border p-4" style={{ background: "rgba(26,16,48,0.6)", borderColor: "var(--nec-border)" }}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={product.id}
                  checked={selections[product.id] || false}
                  onCheckedChange={(checked) =>
                    handleToggle(product.id, checked as boolean)
                  }
                  className="mt-1 border-gray-600 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={product.id}
                    className="text-white font-medium cursor-pointer"
                  >
                    {product.name}
                  </Label>
                  <p className="text-gray-300 text-sm mt-1">
                    {product.description}
                  </p>
                  <p className="text-white font-medium text-sm mt-1">$20.00</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
