"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { seatReservation, cancelReservation } from "@/lib/actions/reservation-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StaffReservationsClientProps {
  restaurant: { id: string; name: string };
  initialReservations: any[];
  initialTables: any[];
}

export function StaffReservationsClient({
  restaurant,
  initialReservations,
  initialTables,
}: StaffReservationsClientProps) {
  const [reservations, setReservations] = useState(initialReservations);
  const [tables, setTables] = useState(initialTables);
  const [loading, setLoading] = useState<string | null>(null); // reservationId
  const [selectedTables, setSelectedTables] = useState<Record<string, string>>({}); // reservationId -> tableId

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to reservations
    const reservationsChannel = supabase
      .channel("staff-reservations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reservations",
          filter: `restaurant_id=eq.${restaurant.id}`,
        },
        async () => {
          // Re-fetch to keep it simple and accurate
          const { data } = await supabase
            .from("reservations")
            .select("*")
            .eq("restaurant_id", restaurant.id)
            .in("status", ["waiting", "seated"])
            .order("created_at", { ascending: true });
            
          if (data) setReservations(data);
        }
      )
      .subscribe();

    // Subscribe to tables
    const tablesChannel = supabase
      .channel("staff-tables")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tables",
          filter: `restaurant_id=eq.${restaurant.id}`,
        },
        async () => {
          const { data } = await supabase
            .from("tables")
            .select("*")
            .eq("restaurant_id", restaurant.id)
            .order("table_number", { ascending: true });
            
          if (data) setTables(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reservationsChannel);
      supabase.removeChannel(tablesChannel);
    };
  }, [restaurant.id]);

  const handleSeat = async (reservation: any) => {
    const tableId = selectedTables[reservation.id];
    if (!tableId) {
      alert("Please select a table first.");
      return;
    }
    
    setLoading(reservation.id);
    await seatReservation(reservation.id, restaurant.id, tableId);
    setLoading(null);
  };

  const handleCancel = async (reservation: any) => {
    if (confirm(`Cancel reservation for ${reservation.customer_name}?`)) {
      setLoading(reservation.id);
      await cancelReservation(reservation.id, restaurant.id);
      setLoading(null);
    }
  };

  const freeTables = tables.filter(t => t.status === "free");
  const waitingReservations = reservations.filter(r => r.status === "waiting");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Queue & Reservations</h1>
            <Badge variant="secondary">{restaurant.name}</Badge>
          </div>
          <div className="text-sm font-medium text-slate-500">
            {waitingReservations.length} Waiting • {freeTables.length} Free Tables
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {waitingReservations.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
              No one is currently waiting.
            </div>
          ) : (
            waitingReservations.map((res, index) => (
              <Card key={res.id} className="shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{res.customer_name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">{res.customer_phone}</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none text-lg">
                    #{index + 1}
                  </Badge>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex gap-4 text-sm mb-4">
                    <div className="bg-slate-100 px-3 py-1.5 rounded-md flex-1 text-center">
                      <span className="text-slate-500 block text-xs">Party Size</span>
                      <span className="font-semibold text-lg">{res.party_size}</span>
                    </div>
                    <div className="bg-slate-100 px-3 py-1.5 rounded-md flex-1 text-center">
                      <span className="text-slate-500 block text-xs">Wait Time</span>
                      <span className="font-semibold text-lg">{res.estimated_wait_minutes}m</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500">Assign Table</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      value={selectedTables[res.id] || ""}
                      onChange={(e) => setSelectedTables(prev => ({ ...prev, [res.id]: e.target.value }))}
                    >
                      <option value="">Select a free table...</option>
                      {freeTables.map(t => (
                        <option key={t.id} value={t.id} disabled={t.capacity < res.party_size}>
                          Table {t.table_number} (Capacity: {t.capacity}) {t.capacity < res.party_size ? "- Too Small" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-slate-500" 
                    onClick={() => handleCancel(res)}
                    disabled={loading === res.id}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white" 
                    onClick={() => handleSeat(res)}
                    disabled={loading === res.id || !selectedTables[res.id]}
                  >
                    {loading === res.id ? "Seating..." : "Seat"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
