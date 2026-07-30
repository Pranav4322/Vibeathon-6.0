"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getMenuItemIngredients } from "@/lib/actions/menu-actions";
import type { MenuItem } from "@/lib/types/database";
import { AlertTriangle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/i18n/language-context";

interface MenuItemDialogProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MenuItemDialog({ item, isOpen, onClose }: MenuItemDialogProps) {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen && item) {
      setLoading(true);
      getMenuItemIngredients(item.id).then((res) => {
        if (res.success && res.data) {
          setIngredients(res.data);
        }
        setLoading(false);
      });
    } else {
      setIngredients([]);
    }
  }, [isOpen, item]);

  if (!item) return null;

  // Extract all unique allergens
  const allAllergens = Array.from(
    new Set(
      ingredients.flatMap((ing) => ing.ingredient?.allergens || [])
    )
  ).filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-[95%] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white rounded-2xl">
        <div className="relative w-full aspect-[4/3] bg-amber-50 rounded-t-2xl overflow-hidden">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
              <span className="text-6xl">🍽️</span>
            </div>
          )}
          
          <div className="absolute top-3 right-3 flex gap-2">
            {item.is_veg ? (
              <div className="w-6 h-6 bg-white rounded border-2 border-green-600 flex items-center justify-center shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
              </div>
            ) : (
              <div className="w-6 h-6 bg-white rounded border-2 border-red-600 flex items-center justify-center shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
              </div>
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-stone-800">
              {item.name}
            </DialogTitle>
            <DialogDescription className="text-stone-500">
              {item.description || "A delicious choice for your meal."}
            </DialogDescription>
          </DialogHeader>

          {/* Allergens Warning */}
          {allAllergens.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800 mb-1">{t("containsAllergens")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {allAllergens.map((allergen) => (
                    <Badge key={allergen} variant="outline" className="bg-red-100 border-red-200 text-red-700 hover:bg-red-200">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ingredients List */}
          <div className="border-t border-stone-100 pt-4">
            <div className="flex items-center gap-2 mb-3 text-stone-700">
              <Info className="w-4 h-4 text-amber-500" />
              <h4 className="font-semibold text-sm uppercase tracking-wider">{t("whatsInside")}</h4>
            </div>

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-lg bg-stone-100" />
                <Skeleton className="h-10 w-full rounded-lg bg-stone-100" />
              </div>
            ) : ingredients.length > 0 ? (
              <ul className="space-y-2">
                {ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between items-center text-sm py-2 px-3 bg-stone-50 rounded-lg">
                    <span className="font-medium text-stone-800">{ing.ingredient?.name}</span>
                    <span className="text-stone-500">
                      {ing.quantity_required} {ing.ingredient?.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-400 italic">{t("ingredientNotAvailable")}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
