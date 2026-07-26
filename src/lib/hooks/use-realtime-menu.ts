"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MenuItem } from "@/lib/types/database";

/**
 * Subscribes to realtime changes on the `menu_items` table for a given restaurant.
 * Returns a live-updating array of menu items.
 *
 * When staff updates availability (available → low → out), the customer menu
 * updates instantly without a page refresh.
 */
export function useRealtimeMenu(
  restaurantId: string,
  initialItems: MenuItem[]
) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);

  // Re-sync when server data changes (e.g. on navigation)
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`menu-changes-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "menu_items",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          const updated = payload.new as MenuItem;
          setItems((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "menu_items",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          const newItem = payload.new as MenuItem;
          setItems((prev) => [...prev, newItem]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "menu_items",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          const deleted = payload.old as { id: string };
          setItems((prev) => prev.filter((item) => item.id !== deleted.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId]);

  return items;
}
