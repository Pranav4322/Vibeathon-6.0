import { Sparkles, Plus, X } from "lucide-react";
import { AIUpsellRecommendation } from "@/lib/hooks/use-ai-upsell";
import { Button } from "@/components/ui/button";

interface AIUpsellCardProps {
  recommendation: AIUpsellRecommendation | null;
  isLoading: boolean;
  onAdd: (item: AIUpsellRecommendation["item"]) => void;
  onDismiss: () => void;
}

export function AIUpsellCard({
  recommendation,
  isLoading,
  onAdd,
  onDismiss,
}: AIUpsellCardProps) {
  if (isLoading) {
    return (
      <div className="relative overflow-hidden p-4 rounded-xl border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 mt-4 mb-2 animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <div className="h-4 bg-amber-200/50 rounded w-1/3"></div>
        </div>
        <div className="h-3 bg-amber-200/40 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-amber-200/40 rounded w-1/2"></div>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  const { item, reason } = recommendation;

  return (
    <div className="relative group overflow-hidden p-4 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 mt-4 mb-2 shadow-sm transition-all hover:shadow-md hover:border-amber-300">
      {/* Decorative gradient orb */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-10 blur-2xl"></div>

      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Perfect Pairing</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-stone-400 hover:text-stone-600 transition-colors p-1"
          aria-label="Dismiss recommendation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-stone-600 mb-3 italic">"{reason}"</p>

      <div className="flex items-center justify-between gap-3 bg-white/60 p-2.5 rounded-lg border border-white/80">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-800 text-sm truncate">
            {item.name}
          </p>
          <p className="text-amber-600 font-bold text-xs mt-0.5">
            ₹{item.price.toFixed(0)}
          </p>
        </div>
        
        <Button
          size="sm"
          onClick={() => onAdd(item)}
          className="bg-amber-100 hover:bg-amber-200 text-amber-700 hover:text-amber-800 shadow-none border-0 h-8 px-3 rounded-full font-medium"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}
