"use client";

import { useMemo } from "react";
import { OrderCard } from "./order-card";
import type { KanbanOrder } from "@/lib/hooks/use-realtime-orders";
import type { OrderStatus } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const COLUMNS: {
  status: OrderStatus;
  label: string;
  headerColor: string;
  dotColor: string;
  bgTint: string;
}[] = [
  {
    status: "placed",
    label: "Placed",
    headerColor: "text-blue-400",
    dotColor: "bg-blue-500",
    bgTint: "bg-blue-500/5",
  },
  {
    status: "confirmed",
    label: "Confirmed",
    headerColor: "text-purple-400",
    dotColor: "bg-purple-500",
    bgTint: "bg-purple-500/5",
  },
  {
    status: "preparing",
    label: "Preparing",
    headerColor: "text-orange-400",
    dotColor: "bg-orange-500",
    bgTint: "bg-orange-500/5",
  },
  {
    status: "ready",
    label: "Ready",
    headerColor: "text-emerald-400",
    dotColor: "bg-emerald-500",
    bgTint: "bg-emerald-500/5",
  },
];

interface OrderKanbanProps {
  orders: KanbanOrder[];
  onRefetch?: () => void;
}

export function OrderKanban({ orders, onRefetch }: OrderKanbanProps) {
  const grouped = useMemo(() => {
    const map: Record<string, KanbanOrder[]> = {};
    COLUMNS.forEach((col) => {
      map[col.status] = orders
        .filter((o) => o.status === col.status)
        .sort((a, b) => new Date(a.placed_at).getTime() - new Date(b.placed_at).getTime());
    });
    return map;
  }, [orders]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const columnOrders = grouped[col.status] ?? [];
        return (
          <div
            key={col.status}
            className={cn(
              "rounded-2xl border border-white/5 overflow-hidden min-h-[300px]",
              col.bgTint
            )}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", col.dotColor)} />
                <h3 className={cn("text-sm font-bold", col.headerColor)}>
                  {col.label}
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                {columnOrders.length}
              </span>
            </div>

            {/* Cards */}
            <div className="p-3 space-y-3">
              {columnOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                  <span className="text-3xl mb-2">✨</span>
                  <p className="text-xs font-medium">No orders</p>
                </div>
              ) : (
                columnOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onAdvanced={onRefetch}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
