"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Order, OrderItem, MenuItem, Table } from "@/lib/types/database";

/** An order with its items and table info, used in the kitchen kanban */
export interface KanbanOrder extends Order {
  table_number: string;
  items: (OrderItem & { menu_item_name: string; is_veg: boolean })[];
  elapsed_minutes: number;
}

/**
 * Subscribes to realtime changes on the `orders` table for a given restaurant.
 * Returns live-updating arrays of orders grouped by status for the kanban view.
 */
export function useRealtimeOrders(restaurantId: string) {
  const [orders, setOrders] = useState<KanbanOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch all active orders on mount
  const fetchOrders = useCallback(async () => {
    const supabase = createClient();

    // Fetch non-billed orders
    const { data: ordersRaw } = await supabase
      .from("orders")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .in("status", ["placed", "confirmed", "preparing", "ready", "served"])
      .order("placed_at", { ascending: true });

    if (!ordersRaw || ordersRaw.length === 0) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const ordersList = ordersRaw as Order[];

    // Fetch all order_items for these orders
    const orderIds = ordersList.map((o) => o.id);
    const { data: itemsRaw } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);
    const allItems = (itemsRaw ?? []) as OrderItem[];

    // Fetch menu item names
    const menuItemIds = [...new Set(allItems.map((i) => i.menu_item_id))];
    const { data: menuRaw } = menuItemIds.length > 0
      ? await supabase.from("menu_items").select("id, name, is_veg").in("id", menuItemIds)
      : { data: [] as Array<{ id: string; name: string; is_veg: boolean }> };
    const menuMap = new Map((menuRaw ?? []).map((m) => [m.id, m]));

    // Fetch table numbers
    const tableIds = [...new Set(ordersList.map((o) => o.table_id))];
    const { data: tablesRaw } = await supabase
      .from("tables")
      .select("id, table_number")
      .in("id", tableIds);
    const tableMap = new Map(
      ((tablesRaw ?? []) as Pick<Table, "id" | "table_number">[]).map((t) => [t.id, t.table_number])
    );

    const now = Date.now();
    const kanbanOrders: KanbanOrder[] = ordersList.map((o) => ({
      ...o,
      table_number: tableMap.get(o.table_id) ?? "—",
      items: allItems
        .filter((i) => i.order_id === o.id)
        .map((i) => ({
          ...i,
          menu_item_name: menuMap.get(i.menu_item_id)?.name ?? "Unknown",
          is_veg: menuMap.get(i.menu_item_id)?.is_veg ?? true,
        })),
      elapsed_minutes: Math.floor((now - new Date(o.placed_at).getTime()) / 60000),
    }));

    setOrders(kanbanOrders);
    setLoading(false);
  }, [restaurantId]);

  // Update elapsed times every minute
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      setOrders((prev) =>
        prev.map((o) => ({
          ...o,
          elapsed_minutes: Math.floor((now - new Date(o.placed_at).getTime()) / 60000),
        }))
      );
    }, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Subscribe to realtime changes
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`orders-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            import('@/lib/utils/audio').then(m => m.playKitchenPing());
          }
          // Re-fetch all orders on any change for simplicity
          // (inserts, updates, and deletes all handled)
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, fetchOrders]);

  return { orders, loading, refetch: fetchOrders };
}
