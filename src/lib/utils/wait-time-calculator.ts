import { createClient } from "@/lib/supabase/server";

export async function calculateEstimatedWaitTime(restaurantId: string): Promise<number> {
  const supabase = await createClient();
  
  // Get the number of people currently waiting in the queue
  const { data: waitingReservations, error: queueError } = await supabase
    .from('reservations')
    .select('id')
    .eq('restaurant_id', restaurantId)
    .eq('status', 'waiting');
    
  if (queueError) {
    console.error("Error fetching waitlist:", queueError);
    return 15; // default wait time
  }
  
  const partiesAhead = waitingReservations?.length || 0;
  
  // Simple formula: 10 minutes base + 5 minutes per party ahead
  // In a real scenario, you'd calculate this based on table turnover rate and active orders
  return 10 + (partiesAhead * 5);
}
