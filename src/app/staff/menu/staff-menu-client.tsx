"use client";

import { useState, useMemo } from "react";
import { Utensils, Search, ArrowLeft, Circle } from "lucide-react";
import Link from "next/link";
import { AvailabilityToggle } from "@/components/staff/availability-toggle";
import { useRealtimeMenu } from "@/lib/hooks/use-realtime-menu";
import type { Restaurant, Category, MenuItem, AvailabilityStatus } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface Props {
  restaurant: Pick<Restaurant, "id" | "name">;
  categories: Category[];
  menuItems: MenuItem[];
}

export function StaffMenuClient({ restaurant, categories, menuItems: initialItems }: Props) {
  const menuItems = useRealtimeMenu(restaurant.id, initialItems);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<AvailabilityStatus | null>(null);

  const filtered = useMemo(() => {
    let items = menuItems;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(q));
    }
    if (filterCategory) {
      items = items.filter((i) => i.category_id === filterCategory);
    }
    if (filterStatus) {
      items = items.filter((i) => i.availability_status === filterStatus);
    }
    return items;
  }, [menuItems, search, filterCategory, filterStatus]);

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  // Summary counts
  const available = menuItems.filter((i) => i.availability_status === "available").length;
  const low = menuItems.filter((i) => i.availability_status === "low").length;
  const out = menuItems.filter((i) => i.availability_status === "out").length;

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/staff/orders"
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={16} className="text-slate-400" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Utensils size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">Menu Management</h1>
              <p className="text-xs text-slate-400">{restaurant.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setFilterStatus(filterStatus === "available" ? null : "available")}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-200",
              filterStatus === "available"
                ? "bg-emerald-500/10 border-emerald-500/30 ring-2 ring-emerald-500/20"
                : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Circle size={8} className="text-emerald-500 fill-emerald-500" />
              <span className="text-xs text-slate-400 font-medium">Available</span>
            </div>
            <span className="text-2xl font-bold text-emerald-400">{available}</span>
          </button>
          <button
            onClick={() => setFilterStatus(filterStatus === "low" ? null : "low")}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-200",
              filterStatus === "low"
                ? "bg-amber-500/10 border-amber-500/30 ring-2 ring-amber-500/20"
                : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Circle size={8} className="text-amber-500 fill-amber-500" />
              <span className="text-xs text-slate-400 font-medium">Low Stock</span>
            </div>
            <span className="text-2xl font-bold text-amber-400">{low}</span>
          </button>
          <button
            onClick={() => setFilterStatus(filterStatus === "out" ? null : "out")}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-200",
              filterStatus === "out"
                ? "bg-red-500/10 border-red-500/30 ring-2 ring-red-500/20"
                : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Circle size={8} className="text-red-500 fill-red-500" />
              <span className="text-xs text-slate-400 font-medium">Out of Stock</span>
            </div>
            <span className="text-2xl font-bold text-red-400">{out}</span>
          </button>
        </div>

        {/* Search & Category filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterCategory(null)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                !filterCategory
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(filterCategory === cat.id ? null : cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                  filterCategory === cat.id
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu items table */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/5 overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_120px_100px_80px_140px] gap-4 px-5 py-3 bg-white/[0.02] border-b border-white/5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Item</span>
            <span>Category</span>
            <span>Price</span>
            <span>Type</span>
            <span className="text-right">Status</span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <span className="text-4xl mb-3">🍽️</span>
              <p className="text-sm font-medium">No items match your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "grid grid-cols-1 sm:grid-cols-[1fr_120px_100px_80px_140px] gap-2 sm:gap-4 px-5 py-4 items-center transition-colors hover:bg-white/[0.02]",
                    item.availability_status === "out" && "opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className={cn(
                        "font-semibold text-white text-sm",
                        item.availability_status === "out" && "line-through text-slate-500"
                      )}>
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {categoryMap.get(item.category_id) ?? "—"}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    ₹{Number(item.price).toFixed(0)}
                  </span>
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-sm border-2 flex items-center justify-center",
                        item.is_veg ? "border-green-500" : "border-red-500"
                      )}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          item.is_veg ? "bg-green-500" : "bg-red-500"
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex justify-start sm:justify-end">
                    <AvailabilityToggle
                      menuItemId={item.id}
                      currentStatus={item.availability_status}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
