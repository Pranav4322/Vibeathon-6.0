"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  disabled = false,
}: QuantitySelectorProps) {
  if (quantity === 0) {
    return (
      <button
        onClick={onIncrement}
        disabled={disabled}
        className="w-full py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95"
      >
        Add
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between bg-amber-50 rounded-full border border-amber-200">
      <button
        onClick={onDecrement}
        className="w-8 h-8 flex items-center justify-center rounded-full text-amber-600 hover:bg-amber-100 transition-colors active:scale-90"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span className="min-w-[20px] text-center text-sm font-bold text-amber-800">
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        className="w-8 h-8 flex items-center justify-center rounded-full text-amber-600 hover:bg-amber-100 transition-colors active:scale-90"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
