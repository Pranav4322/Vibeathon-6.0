"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Users } from "lucide-react";

export function TableAssignmentForm() {
  const [partySize, setPartySize] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const DEMO_RESTAURANT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  const handleAssignTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partySize || partySize < 1) {
      setError("Please enter a valid party size.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Find an available table
      const { data: tables, error: fetchError } = await (supabase as any)
        .from("tables")
        .select("*")
        .eq("restaurant_id", DEMO_RESTAURANT_ID)
        .eq("status", "free")
        .gte("capacity", partySize)
        .order("capacity", { ascending: true })
        .limit(1);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!tables || tables.length === 0) {
        setError("No tables available for your party size. Please wait or try a smaller group.");
        setIsLoading(false);
        return;
      }

      const assignedTable = tables[0];

      // Mark the table as occupied
      const { error: updateError } = await (supabase as any)
        .from("tables")
        .update({
          status: "occupied",
          occupied_since: new Date().toISOString(),
        })
        .eq("id", assignedTable.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Redirect to the menu for this table
      router.push(`/menu/${DEMO_RESTAURANT_ID}?table=${assignedTable.table_number}`);
    } catch (err: any) {
      setError(err.message || "An error occurred while assigning a table.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAssignTable} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="partySize" className="text-sm font-medium text-slate-300">
          How many people?
        </Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            id="partySize"
            type="number"
            min={1}
            max={20}
            placeholder="e.g. 2"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value === "" ? "" : Number(e.target.value))}
            required
            disabled={isLoading}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/30"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !partySize}
        className="h-11 w-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:from-amber-400 hover:to-orange-500 hover:shadow-amber-500/40 active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Assigning Table…
          </>
        ) : (
          "Get Table & View Menu"
        )}
      </Button>
    </form>
  );
}
