"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, ChevronRight, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/lib/hooks/use-cart";
import { createRawClient } from "@/lib/supabase/raw-client";

interface CartSheetProps {
  open: boolean;
  onClose: () => void;
  tableNumber: string;
  restaurantId: string;
}

export function CartSheet({ open, onClose, tableNumber, restaurantId }: CartSheetProps) {
  const { items, updateQuantity, removeItem, totalAmount, totalItems, clearCart, specialInstructions, setSpecialInstructions } = useCart();
  const [isPlacing, startPlacing] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function placeOrder() {
    setError(null);
    startPlacing(async () => {
      try {
        const supabase = createRawClient();

        // Get the table ID for the given restaurant + table_number
        const { data: tableData, error: tableErr } = await supabase
          .from("tables")
          .select("id")
          .eq("restaurant_id", restaurantId)
          .eq("table_number", tableNumber)
          .single();

        if (tableErr || !tableData) {
          setError("Couldn't find your table. Please check the QR code and try again.");
          return;
        }

        const totalAmt = items.reduce(
          (sum, i) => sum + i.menuItem.price * i.quantity,
          0
        );

        // Insert order
        const { data: order, error: orderErr } = await supabase
          .from("orders")
          .insert({
            restaurant_id: restaurantId,
            table_id: tableData.id,
            status: "placed",
            special_instructions: specialInstructions || null,
            total_amount: totalAmt,
          })
          .select("id")
          .single();

        if (orderErr || !order) {
          setError("Failed to place order. Please try again.");
          return;
        }

        // Insert order items
        const orderItems = items.map((i) => ({
          order_id: order.id,
          menu_item_id: i.menuItem.id,
          quantity: i.quantity,
          unit_price: i.menuItem.price,
          subtotal: i.menuItem.price * i.quantity,
        }));

        const { error: itemsErr } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsErr) {
          setError("Order placed, but couldn't add items. Contact staff.");
          return;
        }

        // Mark table as occupied
        await supabase
          .from("tables")
          .update({ status: "occupied", occupied_since: new Date().toISOString() })
          .eq("id", tableData.id);

        clearCart();
        onClose();
        router.push(`/order/${order.id}`);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  const total = totalAmount();
  const tax = total * 0.05;
  const grandTotal = total + tax;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[90dvh] flex flex-col rounded-t-3xl p-0 bg-white border-t border-amber-100"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <ShoppingBag size={18} className="text-amber-600" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold text-stone-800">
                Your Order
              </SheetTitle>
              <p className="text-xs text-stone-500">Table {tableNumber} · {totalItems()} item{totalItems() !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </SheetHeader>

        {/* Items */}
        <ScrollArea className="flex-1 px-5">
          <div className="py-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.menuItem.id}
                className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">
                    {item.menuItem.name}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    ₹{item.menuItem.price.toFixed(0)} × {item.quantity} ={" "}
                    <span className="font-semibold text-stone-700">
                      ₹{(item.menuItem.price * item.quantity).toFixed(0)}
                    </span>
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-stone-700">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => removeItem(item.menuItem.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition-colors ml-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}

            {/* Special instructions */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Special Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any allergies, preferences, or requests..."
                rows={2}
                className="w-full mt-2 px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none transition-all"
              />
            </div>
          </div>
        </ScrollArea>

        {/* Bill summary + CTA */}
        <SheetFooter className="flex-col px-5 pt-3 pb-6 border-t border-stone-100 gap-3">
          {/* Bill breakdown */}
          <div className="w-full space-y-1.5 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>GST (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-800 pt-1 border-t border-stone-100">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg w-full text-center">
              {error}
            </p>
          )}

          <Button
            onClick={placeOrder}
            disabled={items.length === 0 || isPlacing}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-200 transition-all duration-200 disabled:opacity-60"
          >
            {isPlacing ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Placing Order...
              </>
            ) : (
              <>
                Place Order · ₹{grandTotal.toFixed(2)}
                <ChevronRight size={16} className="ml-1" />
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
