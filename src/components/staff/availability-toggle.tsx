"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Circle } from "lucide-react";
import { updateMenuAvailability } from "@/lib/actions/order-actions";
import type { AvailabilityStatus } from "@/lib/types/database";

const STATUS_CONFIG: Record<AvailabilityStatus, { label: string; color: string; dotColor: string; bgColor: string }> = {
  available: {
    label: "Available",
    color: "text-emerald-700",
    dotColor: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  low: {
    label: "Low Stock",
    color: "text-amber-700",
    dotColor: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  out: {
    label: "Out of Stock",
    color: "text-red-700",
    dotColor: "text-red-500",
    bgColor: "bg-red-50",
  },
};

interface AvailabilityToggleProps {
  menuItemId: string;
  currentStatus: AvailabilityStatus;
}

export function AvailabilityToggle({ menuItemId, currentStatus }: AvailabilityToggleProps) {
  const [status, setStatus] = useState<AvailabilityStatus>(currentStatus);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const config = STATUS_CONFIG[status];

  function handleSelect(newStatus: AvailabilityStatus) {
    if (newStatus === status) {
      setOpen(false);
      return;
    }

    setOpen(false);
    setStatus(newStatus); // Optimistic update
    startTransition(async () => {
      const result = await updateMenuAvailability(menuItemId, newStatus);
      if (!result.success) {
        // Revert on failure
        setStatus(status);
      }
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${config.bgColor} ${config.color} border-transparent hover:border-stone-200 disabled:opacity-50`}
      >
        <Circle size={8} className={`${config.dotColor} fill-current`} />
        {config.label}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden min-w-[160px] animate-in fade-in-0 zoom-in-95 duration-150">
            {(Object.keys(STATUS_CONFIG) as AvailabilityStatus[]).map((key) => {
              const opt = STATUS_CONFIG[key];
              const isActive = key === status;
              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-left transition-colors hover:bg-stone-50 ${
                    isActive ? "bg-stone-50 font-semibold" : ""
                  }`}
                >
                  <Circle
                    size={8}
                    className={`${opt.dotColor} fill-current`}
                  />
                  <span className={opt.color}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
