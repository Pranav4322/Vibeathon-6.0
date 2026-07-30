"use client";

import { useState, useEffect, useMemo } from "react";
import { ShoppingBag, Utensils, MapPin } from "lucide-react";
import { CategoryTabs } from "@/components/menu/category-tabs";
import { MenuCard } from "@/components/menu/menu-card";
import { CartSheet } from "@/components/menu/cart-sheet";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/lib/hooks/use-cart";
import type { Restaurant, Category, MenuItem } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/language-context";
import { LanguageSwitcher } from "@/components/menu/language-switcher";

interface MenuClientViewProps {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
  tableNumber: string;
}

export function MenuClientView({
  restaurant,
  categories,
  menuItems,
  tableNumber,
}: MenuClientViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems, setContext } = useCart();
  const { t } = useTranslation();

  // Set cart context once on mount
  useEffect(() => {
    setContext(restaurant.id, tableNumber);
  }, [restaurant.id, tableNumber, setContext]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return menuItems;
    return menuItems.filter((m) => m.category_id === selectedCategory);
  }, [menuItems, selectedCategory]);

  const cartCount = totalItems();

  return (
    <div className="min-h-dvh bg-[#faf8f5] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <Utensils size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-stone-800 leading-tight">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-1 text-xs text-stone-500">
                <MapPin size={10} />
                <span>{t("table")} {tableNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300",
              cartCount > 0
                ? "bg-amber-500 text-white shadow-lg shadow-amber-200 hover:bg-amber-600"
                : "bg-stone-100 text-stone-400 cursor-default"
            )}
            disabled={cartCount === 0}
          >
            <ShoppingBag size={16} />
            {cartCount > 0 && (
              <span className="font-bold">{cartCount}</span>
            )}
            {cartCount === 0 && <span>{t("cart")}</span>}

            {/* Pulse ring */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-ping opacity-75" />
            )}
          </button>
          </div>
        </div>
      </header>

      {/* Category tabs */}
      <CategoryTabs
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Menu grid */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-5">
        {filteredItems.length === 0 ? (
          <EmptyState
            title={t("noItemsTitle")}
            description={t("noItemsDesc")}
            icon={<span className="text-4xl">🍽️</span>}
            className="py-12 border-none"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Sticky cart bar (shows when items in cart) */}
      {cartCount > 0 && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-amber-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setCartOpen(true)}
              className="w-full flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3.5 px-5 rounded-2xl shadow-xl shadow-amber-200/60 transition-all duration-200 active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
                <span>{t("viewCart")}</span>
              </div>
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Cart sheet */}
      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        tableNumber={tableNumber}
        restaurantId={restaurant.id}
      />
    </div>
  );
}
