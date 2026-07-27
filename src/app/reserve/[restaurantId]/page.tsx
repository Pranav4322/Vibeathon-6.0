"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { ReservationForm } from "@/components/reservations/reservation-form";
import { QueueStatus } from "@/components/reservations/queue-status";
import { useLiveRestaurantStats } from "@/lib/hooks/use-live-stats";
import { Clock, Users, UtensilsCrossed, ChevronRight } from "lucide-react";

interface ReservePageProps {
  params: Promise<{ restaurantId: string }>;
}

export default function ReservePage({ params }: ReservePageProps) {
  const { restaurantId } = use(params);
  const [activeReservation, setActiveReservation] = useState<any | null>(null);
  
  const { availableTables, totalTables, estimatedWaitTime, loading } = useLiveRestaurantStats(restaurantId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-12 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-lg mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
          <UtensilsCrossed className="h-10 w-10 text-slate-950" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Vibeathon Eats</h1>
        <p className="text-lg text-slate-400">Welcome! Please check our live seating status.</p>
      </div>

      <div className="w-full max-w-lg mb-8 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm flex flex-col items-center text-center">
          <Users className="h-8 w-8 text-blue-400 mb-3" />
          <span className="text-3xl font-bold text-white mb-1">
            {loading ? "-" : availableTables}
          </span>
          <span className="text-sm font-medium text-slate-400">Tables Available</span>
        </div>
        
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm flex flex-col items-center text-center">
          <Clock className="h-8 w-8 text-amber-400 mb-3" />
          <span className="text-3xl font-bold text-white mb-1">
            {loading ? "-" : estimatedWaitTime > 0 ? `~${estimatedWaitTime}m` : '0m'}
          </span>
          <span className="text-sm font-medium text-slate-400">Est. Wait Time</span>
        </div>
      </div>

      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        {!activeReservation ? (
          <div className="space-y-6">
            <ReservationForm 
              restaurantId={restaurantId} 
              onSuccess={(reservation) => setActiveReservation(reservation)} 
            />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-950 px-2 text-slate-500">Or if you are already seated</span>
              </div>
            </div>

            <Link
              href={`/menu/${restaurantId}?table=3`}
              className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-white">View Digital Menu</span>
                <span className="text-sm text-slate-400">Scan your table QR or click here</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 transition-transform group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950">
                <ChevronRight className="h-5 w-5" />
              </div>
            </Link>
          </div>
        ) : (
          <QueueStatus 
            initialReservation={activeReservation} 
            restaurantId={restaurantId} 
            onCancel={() => setActiveReservation(null)}
          />
        )}
      </div>
    </div>
  );
}
