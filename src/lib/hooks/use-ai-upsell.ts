import { useState, useEffect, useRef } from "react";
import { MenuItem } from "@/lib/types/database";
import { CartItem } from "./use-cart";

export interface AIUpsellRecommendation {
  item: MenuItem;
  reason: string;
}

export function useAIUpsell(
  isOpen: boolean,
  cartItems: CartItem[],
  restaurantId: string | null
) {
  const [recommendation, setRecommendation] = useState<AIUpsellRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track the cart state for which we last fetched a recommendation
  const lastFetchedCartIds = useRef<string>("");

  useEffect(() => {
    if (!isOpen || !restaurantId || cartItems.length === 0) {
      // Don't reset recommendation immediately when closed so it doesn't flicker,
      // but if cart is empty, definitely clear it.
      if (cartItems.length === 0) {
        setRecommendation(null);
        lastFetchedCartIds.current = "";
      }
      return;
    }

    const currentCartIds = cartItems
      .map((i) => i.menuItem.id)
      .sort()
      .join(",");

    // If we already fetched for this exact cart configuration, do nothing
    if (currentCartIds === lastFetchedCartIds.current) {
      return;
    }

    let isMounted = true;

    async function fetchUpsell() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/upsell", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurantId,
            cartItems: cartItems.map((i) => ({
              id: i.menuItem.id,
              name: i.menuItem.name,
              quantity: i.quantity,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch upsell");
        }

        const data = await response.json();
        
        if (isMounted) {
          setRecommendation(data.recommendation || null);
          lastFetchedCartIds.current = currentCartIds;
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch recommendation");
          console.error("AI Upsell fetch error:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchUpsell();

    return () => {
      isMounted = false;
    };
  }, [isOpen, cartItems, restaurantId]);

  return { recommendation, isLoading, error, setRecommendation };
}
