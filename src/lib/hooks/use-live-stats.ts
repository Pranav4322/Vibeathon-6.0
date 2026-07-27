"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Table } from "@/lib/types/database";

export function useLiveRestaurantStats(restaurantId: string) {
  const [availableTables, setAvailableTables] = useState<number>(0);
  const [totalTables, setTotalTables] = useState<number>(0);
  const [waitlistCount, setWaitlistCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    async function fetchStats() {
      // Fetch tables
      const { data } = await supabase
        .from("tables")
        .select("status")
        .eq("restaurant_id", restaurantId);
        
      const tables = data as Table[] | null;
      if (tables) {
        setTotalTables(tables.length);
        setAvailableTables(tables.filter(t => t.status === 'free').length);
      }

      // Fetch waitlist (reservations with 'waiting' status)
      const { count } = await supabase
        .from("reservations")
        .select("*", { count: 'exact', head: true })
        .eq("restaurant_id", restaurantId)
        .eq("status", "waiting");
        
      if (count !== null) setWaitlistCount(count);
      setLoading(false);
    }

    fetchStats();

    // Subscribe to table changes
    const tablesChannel = supabase.channel(`tables-${restaurantId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tables',
        filter: `restaurant_id=eq.${restaurantId}`
      }, fetchStats)
      .subscribe();

    // Subscribe to reservation changes
    const resChannel = supabase.channel(`res-${restaurantId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reservations',
        filter: `restaurant_id=eq.${restaurantId}`
      }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(tablesChannel);
      supabase.removeChannel(resChannel);
    };
  }, [restaurantId]);

  // Rough estimation: 15 mins per party in queue if no tables are free
  const estimatedWaitTime = availableTables > 0 ? 0 : Math.max(15, waitlistCount * 15);

  return {
    availableTables,
    totalTables,
    waitlistCount,
    estimatedWaitTime,
    loading
  };
}
