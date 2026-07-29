import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { Ingredient } from "@/lib/types/database";
import { InventoryClient } from "./inventory-client";

export const metadata: Metadata = {
  title: "Inventory Management — Staff",
  description: "Manage raw ingredients and stock levels in real time.",
};

export default async function InventoryPage() {
  const supabase = await createClient();

  const { data: restaurantRaw } = await supabase
    .from("restaurants")
    .select("id, name")
    .limit(1)
    .single();

  const restaurant = restaurantRaw as { id: string; name: string } | null;

  if (!restaurant) {
    redirect("/login");
  }

  const { data: ingredients } = await supabase
    .from("ingredients")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("name", { ascending: true });

  return (
    <InventoryClient
      restaurant={restaurant}
      initialIngredients={(ingredients ?? []) as Ingredient[]}
    />
  );
}
