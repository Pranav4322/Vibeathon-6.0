"use client";

import { useState, useEffect } from "react";
import { useStaffPin } from "@/lib/hooks/use-staff-pin";
import { Staff } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { ChefHat, Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";

export function PinLockOverlay({ children }: { children: React.ReactNode }) {
  const { isLocked, unlockDevice } = useStaffPin();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [pin, setPin] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function fetchStaff() {
      // Fetch staff for the demo restaurant
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .eq("restaurant_id", "a1b2c3d4-e5f6-7890-abcd-ef1234567890");
      if (data) setStaffList(data as Staff[]);
    }
    fetchStaff();
  }, [supabase]);

  // Handle pin submit automatically when length is 4
  useEffect(() => {
    if (pin.length === 4 && selectedStaff) {
      if (selectedStaff.pin_code === pin || (!selectedStaff.pin_code && pin === '1234')) {
        unlockDevice(selectedStaff);
        setPin("");
        toast.success(`Welcome back, ${selectedStaff.name}`);
      } else {
        toast.error("Incorrect PIN");
        setPin("");
      }
    }
  }, [pin, selectedStaff, unlockDevice]);

  if (!isLocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-500">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Staff Login</h2>
          <p className="text-slate-400">Select your profile and enter your PIN</p>
        </div>

        {!selectedStaff ? (
          <div className="grid grid-cols-2 gap-4">
            {staffList.length > 0 ? staffList.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStaff(s)}
                className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10 hover:border-amber-500/50"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                  <ChefHat className="h-6 w-6" />
                </div>
                <span className="font-medium text-white">{s.name}</span>
                <span className="text-xs text-slate-400 capitalize">{s.role}</span>
              </button>
            )) : (
              <div className="col-span-2 text-center text-slate-500 py-4">No staff members found. Run seed.sql to populate.</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="mb-6 flex flex-col items-center">
              <span className="text-lg font-medium text-white">Logging in as {selectedStaff.name}</span>
              <button 
                onClick={() => { setSelectedStaff(null); setPin(""); }}
                className="text-sm text-amber-500 hover:underline mt-1"
              >
                Switch User
              </button>
            </div>

            <div className="mb-8 flex items-center justify-center gap-4">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all ${pin.length > i ? 'border-amber-500 bg-amber-500/20 text-amber-500' : 'border-slate-700 bg-slate-800 text-transparent'}`}
                >
                  {pin.length > i ? '•' : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => pin.length < 4 && setPin(pin + num)}
                  className="flex h-16 items-center justify-center rounded-xl bg-slate-800 text-2xl font-semibold text-white transition-colors hover:bg-slate-700 active:bg-amber-500 active:text-slate-900"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setPin("")}
                className="flex h-16 items-center justify-center rounded-xl bg-slate-800/50 text-sm font-semibold text-slate-400 transition-colors hover:bg-slate-800"
              >
                Clear
              </button>
              <button
                onClick={() => pin.length < 4 && setPin(pin + "0")}
                className="flex h-16 items-center justify-center rounded-xl bg-slate-800 text-2xl font-semibold text-white transition-colors hover:bg-slate-700 active:bg-amber-500 active:text-slate-900"
              >
                0
              </button>
              <button
                disabled={true}
                className="flex h-16 items-center justify-center rounded-xl bg-slate-800/50 text-slate-500 transition-colors"
              >
                <KeyRound className="h-6 w-6 opacity-50" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
