"use client";

import { useState } from "react";
import { use } from "react";
import { ReservationForm } from "@/components/reservations/reservation-form";
import { QueueStatus } from "@/components/reservations/queue-status";

interface ReservePageProps {
  params: Promise<{ restaurantId: string }>;
}

export default function ReservePage({ params }: ReservePageProps) {
  const { restaurantId } = use(params);
  const [activeReservation, setActiveReservation] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Vibeathon Eats</h1>
        <p className="text-slate-500">Fast, fresh, and smart dining</p>
      </div>

      {!activeReservation ? (
        <ReservationForm 
          restaurantId={restaurantId} 
          onSuccess={(reservation) => setActiveReservation(reservation)} 
        />
      ) : (
        <QueueStatus 
          initialReservation={activeReservation} 
          restaurantId={restaurantId} 
          onCancel={() => setActiveReservation(null)}
        />
      )}
    </div>
  );
}
