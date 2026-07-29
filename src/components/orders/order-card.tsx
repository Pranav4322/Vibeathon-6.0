"use client";

import { useTransition } from "react";
import { Clock, ChevronRight, Utensils, Plus } from "lucide-react";
import { advanceOrderStatus, updateChefOverride, fireOrderItem } from "@/lib/actions/order-actions";
import type { KanbanOrder } from "@/lib/hooks/use-realtime-orders";
import type { OrderStatus } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Confirm",
  confirmed: "Start Prep",
  preparing: "Mark Ready",
  ready: "Serve",
  served: "Bill",
  billed: "Done",
};

const STATUS_COLORS: Record<OrderStatus, { button: string; accent: string }> = {
  placed: { button: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30", accent: "text-blue-400" },
  confirmed: { button: "bg-purple-500 hover:bg-purple-600 shadow-purple-500/30", accent: "text-purple-400" },
  preparing: { button: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30", accent: "text-orange-400" },
  ready: { button: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30", accent: "text-emerald-400" },
  served: { button: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30", accent: "text-amber-400" },
  billed: { button: "bg-stone-500 hover:bg-stone-600 shadow-stone-500/30", accent: "text-stone-400" },
};

interface OrderCardProps {
  order: KanbanOrder;
  onAdvanced?: () => void;
}

export function OrderCard({ order, onAdvanced }: OrderCardProps) {
  const [isPending, startTransition] = useTransition();
  const colors = STATUS_COLORS[order.status];
  const actionLabel = STATUS_LABELS[order.status];

  function handleAdvance() {
    startTransition(async () => {
      const result = await advanceOrderStatus(order.id);
      if (result.success) {
        onAdvanced?.();
      }
    });
  }

  function handleOverride(minutes: number) {
    startTransition(async () => {
      const currentOverride = order.chef_override_minutes || 0;
      await updateChefOverride(order.id, currentOverride + minutes);
      onAdvanced?.();
    });
  }

  function handleFireItem(itemId: string) {
    startTransition(async () => {
      await fireOrderItem(itemId);
      onAdvanced?.();
    });
  }

  const isNew = order.elapsed_minutes <= 1;

  return (
    <div
      className={cn(
        "bg-white/[0.04] rounded-2xl border border-white/[0.06] p-4 space-y-3 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.1]",
        isNew && "animate-pulse ring-2 ring-amber-500/20"
      )}
    >
      {/* Order header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">
            #{order.id.slice(-6).toUpperCase()}
          </span>
          {isNew && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
              New
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock size={12} />
          <span className={cn(
            "font-semibold",
            order.elapsed_minutes > 30 ? "text-red-400" : order.elapsed_minutes > 15 ? "text-amber-400" : "text-slate-400"
          )}>
            {order.elapsed_minutes}m
          </span>
          {(order.status === "confirmed" || order.status === "preparing") && (
            <button
              onClick={() => handleOverride(5)}
              disabled={isPending}
              className="ml-1 flex items-center justify-center p-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
              title="Add 5 min to wait time"
            >
              <Plus size={10} />5m
            </button>
          )}
        </div>
      </div>

      {/* Table info */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
          <Utensils size={12} className="text-slate-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-300">Table {order.table_number}</p>
          {order.customer_name && (
            <p className="text-[10px] text-slate-500">{order.customer_name}</p>
          )}
        </div>
      </div>

      {/* Items list grouped by course */}
      <div className="space-y-3">
        {(['starter', 'main', 'dessert', 'beverage'] as const).map(course => {
          const courseItems = order.items.filter(item => item.course_category === course);
          if (courseItems.length === 0) return null;
          
          return (
            <div key={course} className="space-y-1.5">
              <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {course}s
              </h4>
              {courseItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-sm border flex items-center justify-center",
                      item.is_veg ? "border-green-500" : "border-red-500"
                    )}
                  >
                    <div className={cn("w-1 h-1 rounded-full", item.is_veg ? "bg-green-500" : "bg-red-500")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-slate-300 truncate block">{item.menu_item_name}</span>
                    {/* Render modifiers if present */}
                    {item.modifiers && item.modifiers.length > 0 && (
                      <span className="text-[9px] text-slate-500 block truncate">
                        {item.modifiers.map(m => m.name).join(", ")}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                    ×{item.quantity}
                  </span>
                  
                  {/* Fire button if held */}
                  {item.is_held && (
                    <button 
                      onClick={() => handleFireItem(item.id)}
                      disabled={isPending}
                      className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors disabled:opacity-50"
                    >
                      FIRE
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Special instructions */}
      {order.special_instructions && (
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
          <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-0.5">Note</p>
          <p className="text-xs text-amber-200/70 line-clamp-2">{order.special_instructions}</p>
        </div>
      )}

      {/* Action button */}
      {order.status !== "billed" && (
        <button
          onClick={handleAdvance}
          disabled={isPending}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-bold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
            colors.button
          )}
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {actionLabel}
              <ChevronRight size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
