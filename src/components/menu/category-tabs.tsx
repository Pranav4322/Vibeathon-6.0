"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types/database";

interface CategoryTabsProps {
  categories: Category[];
  selected: string | null; // null means "All"
  onSelect: (id: string | null) => void;
}

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none">
        {/* "All" pill */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
            selected === null
              ? "bg-amber-500 text-white shadow-md shadow-amber-200"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
          )}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              selected === cat.id
                ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
