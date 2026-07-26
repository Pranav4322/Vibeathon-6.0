import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { StaffReservationsClient } from "./staff-reservations-client";

export const metadata: Metadata = {
  title: "Reservations — Staff",
  description: "Realtime reservation and queue management.",
};

export default async function StaffReservationsPage() {
  const supabase = await createClient();

  // For now, use the first restaurant. In production this would come from the authenticated staff member's restaurant.
  const { data: restaurantRaw } = await supabase
    .from("restaurants")
    .select("id, name")
    .limit(1)
    .single();

  const restaurant = restaurantRaw as { id: string; name: string } | null;

  if (!restaurant) {
    redirect("/login");
  }
  
  // Fetch initial reservations and tables
  const { data: initialReservations } = await supabase
    .from("reservations")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .in("status", ["waiting", "seated"])
    .order("created_at", { ascending: true });
    
  const { data: initialTables } = await supabase
    .from("tables")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("table_number", { ascending: true });

  return (
    <StaffReservationsClient 
      restaurant={restaurant} 
      initialReservations={initialReservations || []} 
      initialTables={initialTables || []} 
    />
  );
}
