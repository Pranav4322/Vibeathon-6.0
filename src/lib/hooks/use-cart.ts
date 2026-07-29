"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem, CourseCategory } from "@/lib/types/database";

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  courseOverride?: CourseCategory;
  modifiers: { name: string; price: number }[];
  isHeld: boolean;
}

interface CartStore {
  items: CartItem[];
  tableNumber: string | null;
  restaurantId: string | null;
  specialInstructions: string;

  // Actions
  setContext: (restaurantId: string, tableNumber: string) => void;
  addItem: (menuItem: MenuItem, modifiers?: { name: string; price: number }[], isHeld?: boolean) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateCourseOverride: (cartItemId: string, course: CourseCategory) => void;
  toggleHold: (cartItemId: string) => void;
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

      addItem: (menuItem, modifiers = [], isHeld = false) => {
        const existing = get().items.find(
          (i) => i.menuItem.id === menuItem.id &&
                 i.isHeld === isHeld &&
                 JSON.stringify(i.modifiers) === JSON.stringify(modifiers)
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.cartItemId === existing.cartItemId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          // Use a simple random id if crypto is not available in all contexts (e.g., older browsers/server rendering)
          const cartItemId = typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : Date.now().toString(36) + Math.random().toString(36).substring(2);
            
          set({ items: [...get().items, { cartItemId, menuItem, quantity: 1, modifiers, isHeld }] });
        }
      },

      removeItem: (cartItemId) => {
        set({ items: get().items.filter((i) => i.cartItemId !== cartItemId) });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        });
      },

      updateCourseOverride: (cartItemId, course) => {
        set({
          items: get().items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, courseOverride: course } : i
          ),
        });
      },

      toggleHold: (cartItemId) => {
        set({
          items: get().items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, isHeld: !i.isHeld } : i
          ),
        });
      },

      setSpecialInstructions: (text) => set({ specialInstructions: text }),

      clearCart: () =>
        set({ items: [], specialInstructions: "", tableNumber: null, restaurantId: null }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalAmount: () =>
        get().items.reduce((sum, i) => {
          const modifierPrice = i.modifiers.reduce((mSum, m) => mSum + Number(m.price), 0);
          return sum + (i.menuItem.price + modifierPrice) * i.quantity;
        }, 0),
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
