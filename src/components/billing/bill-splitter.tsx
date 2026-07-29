"use client";

import { useState } from "react";
import type { BillDetails } from "@/lib/actions/billing-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, Receipt, Minus, Plus } from "lucide-react";

export function BillSplitter({ details }: { details: BillDetails }) {
  const [mode, setMode] = useState<"none" | "equal" | "items">("none");
  const [splitCount, setSplitCount] = useState(2);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // array of order_item ids

  const { order, grandTotal, cgst, sgst, subtotal } = details;

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    );
  };

  const calculateCustomTotal = () => {
    const customSubtotal = order.order_items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.subtotal, 0);

    // Calculate tax proportionally
    const taxRatio = subtotal > 0 ? (cgst + sgst) / subtotal : 0;
    const customTax = customSubtotal * taxRatio;
    return customSubtotal + customTax;
  };

  if (mode === "none") {
    return (
      <div className="mt-6 flex gap-3 print:hidden">
        <Button
          variant="outline"
          className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
          onClick={() => setMode("equal")}
        >
          <Users className="w-4 h-4 mr-2" />
          Split Equally
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
          onClick={() => setMode("items")}
        >
          <Receipt className="w-4 h-4 mr-2" />
          Split by Item
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4 print:hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-stone-800 flex items-center gap-2">
          {mode === "equal" ? <Users className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
          {mode === "equal" ? "Split Equally" : "Split by Item"}
        </h3>
        <button
          onClick={() => {
            setMode("none");
            setSelectedItems([]);
            setSplitCount(2);
          }}
          className="text-xs text-stone-500 hover:text-stone-700 underline"
        >
          Cancel
        </button>
      </div>

      {mode === "equal" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-600">How many people?</span>
            <div className="flex items-center gap-3 bg-white border rounded-lg p-1">
              <button
                onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-stone-100 text-stone-600"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center font-bold text-stone-800">{splitCount}</span>
              <button
                onClick={() => setSplitCount(splitCount + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-stone-100 text-stone-600"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-amber-100 text-center shadow-sm">
            <p className="text-sm text-stone-500 mb-1">Each person pays</p>
            <p className="text-3xl font-bold text-amber-600">₹{(grandTotal / splitCount).toFixed(2)}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-stone-500 mb-2">Select the items you are paying for:</p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {order.order_items.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                    isSelected
                      ? "bg-amber-50 border-amber-300 shadow-sm"
                      : "bg-white border-stone-200 hover:border-amber-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                        isSelected ? "border-amber-500 bg-amber-500" : "border-stone-300"
                      )}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className={cn("text-sm font-medium", isSelected ? "text-amber-900" : "text-stone-700")}>
                      {item.menu_item.name} <span className="text-xs text-stone-400 font-normal">×{item.quantity}</span>
                    </span>
                  </div>
                  <span className={cn("text-sm font-semibold", isSelected ? "text-amber-700" : "text-stone-500")}>
                    ₹{item.subtotal.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="bg-white p-4 rounded-lg border border-amber-100 flex items-center justify-between shadow-sm">
            <span className="text-sm font-medium text-stone-600">Your Share (inc. tax)</span>
            <span className="text-2xl font-bold text-amber-600">₹{calculateCustomTotal().toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
