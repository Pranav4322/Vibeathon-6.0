"use server";

import { createClient } from "@/lib/supabase/server";

export async function updatePrepTime(menuItemId: string, prepTimeMinutes: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("menu_items")
    .update({ prep_time_minutes: prepTimeMinutes })
    .eq("id", menuItemId);

  if (error) {
    console.error("Failed to update prep time:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateAllPrepTimes(restaurantId: string, prepTimeMinutes: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("menu_items")
    .update({ prep_time_minutes: prepTimeMinutes })
    .eq("restaurant_id", restaurantId);

  if (error) {
    console.error("Failed to bulk update prep time:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getMenuItemIngredients(menuItemId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipe_ingredients")
    .select(`
      quantity_required,
      ingredient:ingredients (
        id,
        name,
        unit,
        allergens
      )
    `)
    .eq("menu_item_id", menuItemId);

  if (error) {
    console.error("Failed to fetch menu item ingredients:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}