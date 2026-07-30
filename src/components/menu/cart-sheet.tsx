"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useAIUpsell } from "@/lib/hooks/use-ai-upsell";
import { AIUpsellCard } from "./ai-upsell-card";
import type { CourseCategory } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/language-context";

interface CartSheetProps {
  open: boolean;
  onClose: () => void;
  tableNumber: string;
  restaurantId: string;
}

export function CartSheet({ open, onClose, tableNumber, restaurantId }: CartSheetProps) {
  const { items, addItem, updateQuantity, removeItem, totalAmount, totalItems, clearCart, specialInstructions, setSpecialInstructions, updateCourseOverride, toggleHold } = useCart();
  const { recommendation, isLoading: isUpsellLoading, setRecommendation } = useAIUpsell(open, items, restaurantId);
  const [isPlacing, startPlacing] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservation");
  const { t } = useTranslation();

  async function placeOrder() {
    setError(null);
    startPlacing(async () => {
      try {
        const supabase = createRawClient();

        // Check if pre-order (no table needed)
        let tableId = null;
        if (!reservationId) {
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
          tableId = tableData.id;
        }

        const totalAmt = items.reduce(
          (sum, i) => {
            const modifierPrice = i.modifiers?.reduce((mSum, m) => mSum + Number(m.price), 0) || 0;
            return sum + (i.menuItem.price + modifierPrice) * i.quantity;
          },
          0
        );

        // Check for active order ONLY if we have a table (i.e. not a pre-order)
        let activeOrders = null;
        if (tableId) {
          const { data } = await supabase
            .from("orders")
            .select("id, total_amount, special_instructions")
            .eq("restaurant_id", restaurantId)
            .eq("table_id", tableId)
            .neq("status", "billed")
            .limit(1);
          activeOrders = data;
        }

        let orderId = "";

        if (activeOrders && activeOrders.length > 0) {
          // Append to existing order
          orderId = activeOrders[0].id;
          const newTotal = Number(activeOrders[0].total_amount) + totalAmt;
          const currentInstructions = activeOrders[0].special_instructions || "";
          const newInstructions = specialInstructions 
            ? (currentInstructions ? `${currentInstructions} | ${specialInstructions}` : specialInstructions) 
            : currentInstructions;
          
          await supabase
            .from("orders")
            .update({ 
              total_amount: newTotal, 
              special_instructions: newInstructions || null,
              status: "placed",
              placed_at: new Date().toISOString()
            })
            .eq("id", orderId);
            
        } else {
          // Insert new order
          const { data: order, error: orderErr } = await supabase
            .from("orders")
            .insert({
              restaurant_id: restaurantId,
              table_id: tableId,
              status: "placed",
              special_instructions: specialInstructions || null,
              total_amount: totalAmt,
              reservation_id: reservationId || null,
              is_pre_order: !!reservationId,
            })
            .select("id")
            .single();

          if (orderErr || !order) {
            setError("Failed to place order. Please try again.");
            return;
          }
          orderId = order.id;
        }

        // Insert order items
        const orderItems = items.map((i) => {
          const modPrice = i.modifiers?.reduce((sum, m) => sum + Number(m.price), 0) || 0;
          return {
            order_id: orderId,
            menu_item_id: i.menuItem.id,
            quantity: i.quantity,
            unit_price: i.menuItem.price,
            subtotal: (i.menuItem.price + modPrice) * i.quantity,
            course_override: i.courseOverride || null,
            modifiers: i.modifiers || [],
            is_held: i.isHeld || false,
          };
        });

        const { error: itemsErr } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsErr) {
          setError("Order placed, but couldn't add items. Contact staff.");
          return;
        }

        if (tableId) {
          // Mark table as occupied
          await supabase
            .from("tables")
            .update({ status: "occupied", occupied_since: new Date().toISOString() })
            .eq("id", tableId);
        }

        clearCart();
        onClose();
        router.push(`/order/${orderId}`);
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
                {t("title", "cart")}
              </SheetTitle>
              <p className="text-xs text-stone-500">
                {reservationId ? "Pre-order" : `${t("tableNum", "cart")} ${tableNumber}`} · {totalItems()} item{totalItems() !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Items */}
        <ScrollArea className="flex-1 px-5">
          <div className="py-4 space-y-3">
            {items.map((item) => {
              const modPrice = item.modifiers?.reduce((sum, m) => sum + Number(m.price), 0) || 0;
              const itemTotal = (item.menuItem.price + modPrice) * item.quantity;
              
              return (
                <div
                  key={item.cartItemId}
                  className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-800 truncate">
                      {item.menuItem.name}
                    </p>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <p className="text-[10px] text-stone-500 my-0.5">
                        {item.modifiers.map(m => m.name).join(", ")} {modPrice > 0 && `(+₹${modPrice})`}
                      </p>
                    )}
                    <p className="text-xs text-stone-500 mt-0.5">
                      ₹{(item.menuItem.price + modPrice).toFixed(0)} × {item.quantity} ={" "}
                      <span className="font-semibold text-stone-700">
                        ₹{itemTotal.toFixed(0)}
                      </span>
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <select
                        value={item.courseOverride || item.menuItem.course_category}
                        onChange={(e) => updateCourseOverride(item.cartItemId, e.target.value as CourseCategory)}
                        className="text-[10px] uppercase font-bold text-slate-500 bg-stone-100 border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                      >
                        <option value="starter">Bring as Starter</option>
                        <option value="main">Bring as Main</option>
                        <option value="dessert">Bring as Dessert</option>
                        <option value="beverage">Bring as Beverage</option>
                      </select>
                      
                      <button 
                        onClick={() => toggleHold(item.cartItemId)}
                        className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded transition-colors",
                          item.isHeld ? "bg-orange-100 text-orange-700 border border-orange-200" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                        )}
                      >
                        {item.isHeld ? '✋ HELD' : 'Hold'}
                      </button>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-stone-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition-colors ml-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* AI Upsell Card */}
            {(recommendation || isUpsellLoading) && (
              <AIUpsellCard
                recommendation={recommendation}
                isLoading={isUpsellLoading}
                onAdd={(item) => {
                  addItem(item);
                  setRecommendation(null);
                }}
                onDismiss={() => setRecommendation(null)}
              />
            )}

            {/* Special instructions */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Special Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder={t("instructionsPlaceholder", "cart")}
                rows={2}
                className="w-full mt-2 px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none transition-all"
              />
            </div>
          </div>
        </ScrollArea>

        {/* Bill summary + CTA */}
        <SheetFooter className="flex-col px-5 pt-3 pb-6 border-t border-stone-100 gap-3">
          <div className="w-full space-y-1.5 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>{t("subtotal", "cart")}</span>
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
                {t("checkout", "cart")} · ₹{grandTotal.toFixed(2)}
                <ChevronRight size={16} className="ml-1" />
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
