import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MenuClientView } from "./menu-client-view";

interface Props {
  params: Promise<{ restaurantId: string }>;
  searchParams: Promise<{ table?: string }>;
}

export const metadata: Metadata = {
  title: "Menu — Smart Restaurant",
  description: "Browse our menu and place your order right from the table.",
};

export default async function MenuPage({ params, searchParams }: Props) {
  const supabase = await createClient();
  const { restaurantId } = await params;
  const { table } = await searchParams;
  const tableNumber = table ?? "1";

  // Fetch restaurant
  const { data: restaurant, error: restErr } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", restaurantId)
    .single();

  if (restErr || !restaurant) notFound();

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("sort_order", { ascending: true });

  // Fetch menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: true });

  return (
    <MenuClientView
      restaurant={restaurant}
      categories={categories ?? []}
      menuItems={menuItems ?? []}
      tableNumber={tableNumber}
    />
  );
}
