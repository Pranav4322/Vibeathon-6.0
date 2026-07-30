import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { MenuItem, Category } from "@/lib/types/database";
import { StaffMenuClient } from "./staff-menu-client";

export const metadata: Metadata = {
  title: "Menu Management — Staff",
  description: "Manage menu item availability in real time.",
};

export default async function StaffMenuPage() {
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

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order", { ascending: true });

  // Fetch menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: true });

  const uniqueMenuItems = Array.from(
    new Map(menuItems?.map((item) => [item.name, item])).values()
  );

  return (
    <StaffMenuClient
      restaurant={restaurant}
      categories={(categories ?? []) as Category[]}
      menuItems={uniqueMenuItems as MenuItem[]}
    />
  );
}
