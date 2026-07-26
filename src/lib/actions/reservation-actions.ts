"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateEstimatedWaitTime } from "@/lib/utils/wait-time-calculator";

export async function joinWaitlist(formData: FormData) {
  const restaurantId = formData.get("restaurantId") as string;
  const customerName = formData.get("customerName") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const partySize = parseInt(formData.get("partySize") as string, 10);

  if (!restaurantId || !customerName || isNaN(partySize)) {
    return { error: "Missing required fields" };
  }

  const supabase = await createClient();

  // Get current waitlist count to determine queue position
  const { count, error: countError } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId)
    .eq("status", "waiting");

  if (countError) {
    console.error("Error fetching waitlist count:", countError);
    return { error: "Failed to join waitlist" };
  }

  const queuePosition = (count || 0) + 1;
  const estimatedWaitMinutes = await calculateEstimatedWaitTime(restaurantId);

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      restaurant_id: restaurantId,
      customer_name: customerName,
      customer_phone: customerPhone,
      party_size: partySize,
      status: "waiting",
      queue_position: queuePosition,
      estimated_wait_minutes: estimatedWaitMinutes,
    } as never)
    .select()
    .single();

  if (error) {
    console.error("Error inserting reservation:", error);
    return { error: "Failed to join waitlist" };
  }

  revalidatePath(`/reserve/${restaurantId}`);
  return { success: true, reservation: data };
}

export async function cancelReservation(reservationId: string, restaurantId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("reservations")
    .update({ status: "cancelled" } as never)
    .eq("id", reservationId);

  if (error) {
    console.error("Error cancelling reservation:", error);
    return { error: "Failed to cancel reservation" };
  }

  revalidatePath(`/reserve/${restaurantId}`);
  return { success: true };
}

export async function seatReservation(reservationId: string, restaurantId: string, tableId: string) {
  const supabase = await createClient();
  
  // 1. Mark reservation as seated and set table_id
  const { error: resError } = await supabase
    .from("reservations")
    .update({ status: "seated", table_id: tableId } as never)
    .eq("id", reservationId);

  if (resError) {
    console.error("Error seating reservation:", resError);
    return { error: "Failed to seat reservation" };
  }
  
  // 2. Mark table as occupied
  const { error: tableError } = await supabase
    .from("tables")
    .update({ status: "occupied", occupied_since: new Date().toISOString() } as never)
    .eq("id", tableId);
    
  if (tableError) {
    console.error("Error updating table status:", tableError);
    // Continue anyway as the primary action succeeded
  }

  revalidatePath(`/staff/reservations`);
  return { success: true };
}
