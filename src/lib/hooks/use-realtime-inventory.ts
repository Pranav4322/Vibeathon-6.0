import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Ingredient } from "@/lib/types/database";
import { toast } from "sonner";

export function useRealtimeInventory(initialIngredients: Ingredient[]) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("inventory-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ingredients" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Ingredient;
            setIngredients((prev) =>
              prev.map((i) => (i.id === updated.id ? updated : i))
            );
            
            // Check for low stock on update and alert
            if (updated.quantity_in_stock <= updated.low_stock_threshold) {
               const oldIngredient = ingredients.find(i => i.id === updated.id);
               // Only alert if it newly crossed the threshold
               if (oldIngredient && oldIngredient.quantity_in_stock > oldIngredient.low_stock_threshold) {
                  toast.warning(`Low stock alert: ${updated.name}`, {
                    description: `Only ${updated.quantity_in_stock}${updated.unit} left.`,
                  });
               }
            }
          } else if (payload.eventType === "INSERT") {
            setIngredients((prev) => [...prev, payload.new as Ingredient]);
          } else if (payload.eventType === "DELETE") {
            setIngredients((prev) =>
              prev.filter((i) => i.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, ingredients]);

  return { ingredients };
}
