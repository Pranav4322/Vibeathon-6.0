"use client";

import { useState, useEffect } from "react";
import { Utensils, Clock, CheckCircle2, ChefHat, Bell, Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Order, OrderStatus, Table } from "@/lib/types/database";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { GamifiedWaitCard } from "@/components/orders/gamified-wait";

const STATUS_STEPS = [
  { key: "placed",    label: "Placed",     icon: Receipt,     color: "text-blue-500",   bg: "bg-blue-50"   },
  { key: "confirmed", label: "Confirmed",  icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-50" },
  { key: "preparing", label: "Preparing",  icon: ChefHat,     color: "text-orange-500", bg: "bg-orange-50" },
  { key: "ready",     label: "Ready",      icon: Bell,        color: "text-amber-500",  bg: "bg-amber-50"  },
  { key: "served",    label: "Served",     icon: Utensils,    color: "text-green-500",  bg: "bg-green-50"  },
  { key: "billed",    label: "Billed",     icon: Receipt,     color: "text-stone-500",  bg: "bg-stone-50"  },
] as const;

interface OrderItemWithMenuItem {
  id: string;
  quantity: number;
  subtotal: number;
  menu_items: { name: string; is_veg: boolean } | null;
}

interface OrderTrackingClientProps {
  initialOrder: Order;
  tableData: Table | null;
  orderItems: OrderItemWithMenuItem[];
}

export function OrderTrackingClient({ initialOrder, tableData, orderItems }: OrderTrackingClientProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  useNotifications({ restaurantId: order.restaurant_id, orderId: order.id });

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-dvh bg-[#faf8f5] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <Utensils size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-stone-800">Order #{order.id.slice(-6).toUpperCase()}</h1>
            <p className="text-xs text-stone-500">Table {tableData?.table_number ?? "—"}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Status tracker */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Order Status</h2>
          <div className="relative">
            {/* Background line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-stone-100" />
            {/* Progress line */}
            <div
              className="absolute top-5 left-5 h-0.5 bg-amber-400 transition-all duration-700"
              style={{
                width: currentStepIndex >= 0
                  ? `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`
                  : "0%",
              }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {STATUS_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const done = idx < currentStepIndex;
                const active = idx === currentStepIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        done
                          ? "bg-amber-400 border-amber-400"
                          : active
                          ? `${step.bg} border-amber-400 ring-4 ring-amber-100 animate-pulse`
                          : "bg-stone-50 border-stone-200"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={
                          done ? "text-white" : active ? step.color : "text-stone-300"
                        }
                      />
                    </div>
                    <span
                      className={`text-[10px] font-semibold transition-colors duration-500 ${
                        active ? "text-amber-600" : done ? "text-stone-600" : "text-stone-300"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Your Items</h2>
          <div className="space-y-2">
            {orderItems.map((oi) => (
              <div key={oi.id} className="flex items-center justify-between py-1.5 border-b border-stone-50 last:border-0">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${
                      oi.menu_items?.is_veg ? "border-green-600" : "border-red-600"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        oi.menu_items?.is_veg ? "bg-green-600" : "bg-red-600"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-stone-700">{oi.menu_items?.name ?? "Item"}</span>
                  <span className="text-xs text-stone-400">×{oi.quantity}</span>
                </div>
                <span className="text-sm font-semibold text-stone-700">₹{Number(oi.subtotal).toFixed(0)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex justify-between">
            <span className="text-sm font-bold text-stone-600">Total</span>
            <span className="text-base font-bold text-stone-800">₹{Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Gamified Wait Experience */}
        {(order.status === "confirmed" || order.status === "preparing") && (
          <GamifiedWaitCard />
        )}

        {/* Status message */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center transition-all duration-300">
          <div className="flex items-center justify-center gap-2 text-amber-700">
            <Clock size={14} className="animate-pulse" />
            <span className="text-sm font-medium">
              {order.status === "placed" && "Your order is in! We're double-checking the details (and trying not to drool)."}
              {order.status === "confirmed" && "Order confirmed! We've told the kitchen to make it extra delicious."}
              {order.status === "preparing" && "The chefs are working their magic! 🍳 (Cue the dramatic cooking montage)."}
              {order.status === "ready" && "Ding ding! Your food is ready and on its way. Prepare your tastebuds! 🎉"}
              {order.status === "served" && "Enjoy your meal! Try not to eat the plate. 😋"}
              {order.status === "billed" && "Hope you had a great meal! See you next time. 👋"}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
