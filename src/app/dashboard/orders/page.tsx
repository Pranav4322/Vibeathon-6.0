import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { StaffOrdersClient } from "./staff-orders-client";

export const metadata: Metadata = {
  title: "Kitchen Orders — Staff",
  description: "Realtime kitchen order management.",
};

export default async function StaffOrdersPage() {
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

  return <StaffOrdersClient restaurant={restaurant} />;
}
