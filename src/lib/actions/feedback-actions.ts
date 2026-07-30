"use server";

import { createClient } from "@/lib/supabase/server";

export interface SubmitFeedbackPayload {
  restaurantId: string;
  orderId: string;
  foodRating: number;
  serviceRating: number;
  ambianceRating: number;
  reviewText?: string;
}

export async function submitFeedback(payload: SubmitFeedbackPayload) {
  const supabase = await createClient();

  const { error } = await supabase.from("feedback").insert({
    restaurant_id: payload.restaurantId,
    order_id: payload.orderId,
    food_rating: payload.foodRating,
    service_rating: payload.serviceRating,
    ambiance_rating: payload.ambianceRating,
    review_text: payload.reviewText || null,
  } as any);

  if (error) {
    console.error("Failed to submit feedback:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getFeedbackStats(restaurantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("feedback")
    .select("food_rating, service_rating, ambiance_rating, review_text, created_at, orders(customer_name)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch feedback:", error);
    return { success: false, error: error.message, data: null };
  }

  // Calculate averages
  let totalFood = 0;
  let totalService = 0;
  let totalAmbiance = 0;
  const count = data.length;

  (data as any[]).forEach((f: any) => {
    totalFood += f.food_rating;
    totalService += f.service_rating;
    totalAmbiance += f.ambiance_rating;
  });

  const stats = {
    count,
    avgFood: count > 0 ? (totalFood / count).toFixed(1) : "0.0",
    avgService: count > 0 ? (totalService / count).toFixed(1) : "0.0",
    avgAmbiance: count > 0 ? (totalAmbiance / count).toFixed(1) : "0.0",
    recentReviews: (data as any[]).slice(0, 10).map((r: any) => ({
      ...r,
      customer_name: r.orders?.customer_name || "Guest"
    }))
  };

  return { success: true, data: stats };
}

export async function hasFeedbackForOrder(orderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("id")
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) {
    return false;
  }
  return !!data;
}
