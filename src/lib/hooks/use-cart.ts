"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@/lib/types/database";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  tableNumber: string | null;
  restaurantId: string | null;
  specialInstructions: string;

  // Actions
  setContext: (restaurantId: string, tableNumber: string) => void;
  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  setSpecialInstructions: (text: string) => void;
  clearCart: () => void;

  // Computed
  totalItems: () => number;
  totalAmount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: null,
      restaurantId: null,
      specialInstructions: "",

      setContext: (restaurantId, tableNumber) =>
        set({ restaurantId, tableNumber }),

      addItem: (menuItem) => {
        const existing = get().items.find(
          (i) => i.menuItem.id === menuItem.id
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.menuItem.id === menuItem.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { menuItem, quantity: 1 }] });
        }
      },

      removeItem: (menuItemId) => {
        set({ items: get().items.filter((i) => i.menuItem.id !== menuItemId) });
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.menuItem.id === menuItemId ? { ...i, quantity } : i
          ),
        });
      },

      setSpecialInstructions: (text) => set({ specialInstructions: text }),

      clearCart: () =>
        set({ items: [], specialInstructions: "", tableNumber: null, restaurantId: null }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalAmount: () =>
        get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),
    }),
    {
      name: "restaurant-cart",
      // Only persist cart items and context
      partialize: (state) => ({
        items: state.items,
        tableNumber: state.tableNumber,
        restaurantId: state.restaurantId,
        specialInstructions: state.specialInstructions,
      }),
    }
  )
);
