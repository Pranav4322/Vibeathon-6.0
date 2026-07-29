"use client";

import { useRealtimeInventory } from "@/lib/hooks/use-realtime-inventory";
import type { Ingredient } from "@/lib/types/database";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

interface InventoryClientProps {
  restaurant: { id: string; name: string };
  initialIngredients: Ingredient[];
}

export function InventoryClient({ restaurant, initialIngredients }: InventoryClientProps) {
  const { ingredients } = useRealtimeInventory(initialIngredients);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory</h1>
        <p className="mt-2 text-slate-500">
          Manage raw ingredients and stock levels for {restaurant.name}.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[300px]">Ingredient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[300px]">Stock Level</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Threshold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => {
              const isLowStock = ingredient.quantity_in_stock <= ingredient.low_stock_threshold;
              // Prevent division by zero and cap at 100%
              const maxExpected = ingredient.low_stock_threshold * 3 || 1000;
              const percent = Math.min(100, Math.max(0, (ingredient.quantity_in_stock / maxExpected) * 100));

              return (
                <TableRow key={ingredient.id} className={isLowStock ? "bg-amber-50/30" : ""}>
                  <TableCell className="font-medium text-slate-900">
                    {ingredient.name}
                  </TableCell>
                  <TableCell>
                    {isLowStock ? (
                      <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50 gap-1.5 py-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 gap-1.5 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Adequate
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 w-full max-w-[200px]">
                      <Progress value={percent} className="flex-1">
                        <ProgressTrack>
                          <ProgressIndicator className={isLowStock ? "bg-amber-500" : "bg-emerald-500"} />
                        </ProgressTrack>
                      </Progress>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {ingredient.quantity_in_stock} {ingredient.unit}
                  </TableCell>
                  <TableCell className="text-right text-slate-500">
                    {ingredient.low_stock_threshold} {ingredient.unit}
                  </TableCell>
                </TableRow>
              );
            })}
            
            {ingredients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  No ingredients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
