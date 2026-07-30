"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QuantitySelector } from "./quantity-selector";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { MenuItemDialog } from "./menu-item-dialog";
import { useTranslation } from "@/lib/i18n/language-context";
import { useCart } from "@/lib/hooks/use-cart";
import type { MenuItem } from "@/lib/types/database";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const cartEntries = items.filter((i) => i.menuItem.id === item.id);
  const quantity = cartEntries.reduce((sum, i) => sum + i.quantity, 0);
  const isOut = item.availability_status === "out";
  const isLow = item.availability_status === "low";

  // Phase 19: Modifiers state
  const [selectedModifiers, setSelectedModifiers] = useState<{name: string, price: number}[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (quantity > 0 && isOut) {
      toast.error(`${item.name} just went out of stock! It has been removed from your cart.`, { 
        duration: 5000,
        style: { background: "#ef4444", color: "#fff", borderColor: "#b91c1c" }
      });
      // Remove all instances of this out-of-stock item
      cartEntries.forEach(entry => removeItem(entry.cartItemId));
    }
  }, [isOut, quantity, item.name, item.id, removeItem, cartEntries]);

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden",
        isOut && "opacity-60"
      )}
    >
      <div 
        className="cursor-pointer"
        onClick={() => setDialogOpen(true)}
      >
        {/* Image area */}
        <div className="relative w-full aspect-[4/3] bg-amber-50 overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-105",
              isOut && "grayscale"
            )}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {t("outOfStock")}
            </span>
          </div>
        )}

        {/* Low stock badge */}
        {isLow && !isOut && (
          <div className="absolute top-2 left-2">
            <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {t("limited")}
            </span>
          </div>
        )}

        {/* Veg / Non-veg indicator */}
        <div className="absolute top-2 right-2">
          {item.is_veg ? (
            <div className="w-5 h-5 bg-white rounded border-2 border-green-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-600" />
            </div>
          ) : (
            <div className="w-5 h-5 bg-white rounded border-2 border-red-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-red-600" />
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <div className="flex-1">
          <h3 className={cn("font-semibold text-stone-800 text-sm leading-snug", isOut && "line-through text-stone-400")}>
            {item.name}
          </h3>
          {item.description && (
            <p className="text-xs text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>
      </div> {/* Close cursor-pointer div */}

      <div className="flex flex-col gap-2 px-3 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-stone-800">
              ₹{item.price.toFixed(0)}
            </span>
            {item.prep_time_minutes && (
              <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-0.5">
                <Clock size={10} />
                <span>{item.prep_time_minutes} {t("min")}</span>
              </div>
            )}
          </div>

          <div className="w-24">
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => addItem(item, selectedModifiers, false)}
              onDecrement={() => {
                if (cartEntries.length > 0) {
                  // Decrement the last entry for this item type
                  const lastEntry = cartEntries[cartEntries.length - 1];
                  if (lastEntry.quantity === 1) {
                    removeItem(lastEntry.cartItemId);
                  } else {
                    updateQuantity(lastEntry.cartItemId, lastEntry.quantity - 1);
                  }
                }
              }}
              disabled={isOut}
            />
          </div>
        </div>
        
        {/* Phase 19: Modifiers UI */}
        {item.available_modifiers && item.available_modifiers.length > 0 && (
          <div className="mt-3 pt-3 border-t border-stone-100">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">{t("customize")}</p>
            <div className="flex flex-wrap gap-2">
              {item.available_modifiers.map((mod) => {
                const isSelected = selectedModifiers.some(m => m.name === mod.name);
                return (
                  <button
                    key={mod.name}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedModifiers(selectedModifiers.filter(m => m.name !== mod.name));
                      } else {
                        setSelectedModifiers([...selectedModifiers, mod]);
                      }
                    }}
                    className={cn(
                      "text-[10px] px-2 py-1 rounded-md border transition-colors",
                      isSelected ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"
                    )}
                  >
                    {mod.name} {mod.price > 0 && `(+₹${mod.price})`}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <MenuItemDialog 
        item={item} 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
      />
    </div>
  );
}
