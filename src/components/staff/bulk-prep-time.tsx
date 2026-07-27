"use client";

import { useState } from "react";
import { updateAllPrepTimes } from "@/lib/actions/menu-actions";
import { toast } from "sonner";
import { Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  restaurantId: string;
}

export function BulkPrepTimeInput({ restaurantId }: Props) {
  const [time, setTime] = useState(15);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = async () => {
    if (time < 0) return;
    setIsUpdating(true);
    
    const result = await updateAllPrepTimes(restaurantId, time);
    if (result.success) {
      toast.success("Base wait time applied to all items");
      setIsOpen(false);
    } else {
      toast.error("Failed to update base wait time");
    }
    
    setIsUpdating(false);
  };

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
      >
        <Clock size={14} className="mr-2" />
        Set Base Wait Time
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-white/10">
      <Clock size={14} className="text-amber-500 ml-2" />
      <input
        type="number"
        value={time}
        onChange={(e) => setTime(parseInt(e.target.value) || 0)}
        className="w-16 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:border-amber-500"
        disabled={isUpdating}
        min={0}
      />
      <span className="text-xs text-slate-400 mr-2">min</span>
      <Button 
        size="sm" 
        onClick={handleUpdate} 
        disabled={isUpdating}
        className="h-7 px-2 bg-amber-500 hover:bg-amber-400 text-slate-900"
      >
        <Check size={14} />
      </Button>
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={() => setIsOpen(false)} 
        disabled={isUpdating}
        className="h-7 px-2 text-slate-400 hover:text-white"
      >
        Cancel
      </Button>
    </div>
  );
}
