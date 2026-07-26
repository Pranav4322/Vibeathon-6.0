"use client";

import { BellRing, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { OrderKanban } from "@/components/orders/order-kanban";
import { useRealtimeOrders } from "@/lib/hooks/use-realtime-orders";
import type { Restaurant } from "@/lib/types/database";

interface Props {
  restaurant: Pick<Restaurant, "id" | "name">;
}

export function StaffOrdersClient({ restaurant }: Props) {
  const { orders, loading, refetch } = useRealtimeOrders(restaurant.id);

  // New orders placed in the last 2 minutes
  const newOrdersCount = orders.filter((o) => o.status === "placed" && o.elapsed_minutes <= 2).length;

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/staff/menu"
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={16} className="text-slate-400" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 relative">
              <BellRing size={18} className="text-white" />
              {newOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
              )}
              {newOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">Kitchen Orders</h1>
              <p className="text-xs text-slate-400">{restaurant.name}</p>
            </div>
          </div>

          {newOrdersCount > 0 && (
            <div className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
              {newOrdersCount} New Order{newOrdersCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Loading orders...</p>
          </div>
        ) : (
          <OrderKanban orders={orders} onRefetch={refetch} />
        )}
      </main>
    </div>
  );
}
