"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QuantitySelector } from "./quantity-selector";
import { useCart } from "@/lib/hooks/use-cart";
import type { MenuItem } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect } from "react";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const cartEntry = items.find((i) => i.menuItem.id === item.id);
  const quantity = cartEntry?.quantity ?? 0;
  const isOut = item.availability_status === "out";
  const isLow = item.availability_status === "low";

  useEffect(() => {
    if (quantity > 0 && isOut) {
      toast.error(`${item.name} just went out of stock! It has been removed from your cart.`, { 
        duration: 5000,
        style: { background: "#ef4444", color: "#fff", borderColor: "#b91c1c" }
      });
      removeItem(item.id);
    }
  }, [isOut, quantity, item.name, item.id, removeItem]);

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden",
        isOut && "opacity-60"
      )}
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
              Out of Stock
            </span>
          </div>
        )}

        {/* Low stock badge */}
        {isLow && !isOut && (
          <div className="absolute top-2 left-2">
            <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Limited
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

        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-stone-800">
              ₹{item.price.toFixed(0)}
            </span>
            {item.prep_time_minutes && (
              <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-0.5">
                <Clock size={10} />
                <span>{item.prep_time_minutes} min</span>
              </div>
            )}
          </div>

          <div className="w-24">
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => addItem(item)}
              onDecrement={() => {
                if (quantity === 1) {
                  removeItem(item.id);
                } else {
                  updateQuantity(item.id, quantity - 1);
                }
              }}
              disabled={isOut}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
