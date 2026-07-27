"use client";

import { useState } from "react";
import { updatePrepTime } from "@/lib/actions/menu-actions";
import { toast } from "sonner";
import { Clock } from "lucide-react";

interface Props {
  menuItemId: string;
  initialTime: number | null;
}

export function PrepTimeInput({ menuItemId, initialTime }: Props) {
  const [time, setTime] = useState(initialTime || 15);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (newTime: number) => {
    if (newTime === time || newTime < 0) return;
    setIsUpdating(true);
    
    const result = await updatePrepTime(menuItemId, newTime);
    if (result.success) {
      setTime(newTime);
      toast.success("Prep time updated");
    } else {
      toast.error("Failed to update prep time");
    }
    
    setIsUpdating(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Clock size={14} className="text-slate-500" />
      <input
        type="number"
        value={time}
        onChange={(e) => setTime(parseInt(e.target.value) || 0)}
        onBlur={() => handleUpdate(time)}
        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(time)}
        className="w-14 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
        disabled={isUpdating}
        min={0}
      />
      <span className="text-xs text-slate-500">min</span>
    </div>
  );
}
