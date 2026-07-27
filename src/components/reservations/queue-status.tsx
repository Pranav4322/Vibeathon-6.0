"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cancelReservation } from "@/lib/actions/reservation-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/lib/hooks/use-notifications";

interface QueueStatusProps {
  initialReservation: any;
  restaurantId: string;
  onCancel: () => void;
}

export function QueueStatus({ initialReservation, restaurantId, onCancel }: QueueStatusProps) {
  const [reservation, setReservation] = useState(initialReservation);
  const [partiesAhead, setPartiesAhead] = useState(0);
  const [loadingCancel, setLoadingCancel] = useState(false);
  useNotifications({ restaurantId, reservationId: reservation.id });
  
  useEffect(() => {
    const supabase = createClient();
    
    // Function to calculate how many parties are ahead
    const fetchPosition = async () => {
      // Find all waiting reservations created before this one
      const { count, error } = await supabase
        .from("reservations")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId)
        .eq("status", "waiting")
        .lt("created_at", reservation.created_at);
        
      if (!error && count !== null) {
        setPartiesAhead(count);
      }
      
      // Also check if our own status changed
      const { data } = await supabase
        .from("reservations")
        .select("status")
        .eq("id", reservation.id)
        .single();
        
      if (data && (data as any).status !== reservation.status) {
        setReservation({ ...reservation, status: (data as any).status });
      }
    };

    fetchPosition();

    // Subscribe to any changes on the reservations table for this restaurant
    const channel = supabase
      .channel("queue-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reservations",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
          // When any reservation changes, recalculate our position
          fetchPosition();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reservation.id, reservation.created_at, reservation.status, restaurantId]);

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel your reservation?")) {
      setLoadingCancel(true);
      await cancelReservation(reservation.id, restaurantId);
      setLoadingCancel(false);
      onCancel();
    }
  };

  const estimatedMinutes = 10 + (partiesAhead * 5);
  
  if (reservation.status === 'seated') {
    return (
      <Card className="w-full max-w-md mx-auto shadow-2xl backdrop-blur-md bg-green-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-center text-green-400 text-2xl">Table Ready! 🎉</CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <p className="text-green-200 text-lg">Please head to the host stand. Your table is ready for you.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl backdrop-blur-md bg-slate-900/80 border-white/10 text-slate-50">
      <CardHeader className="text-center pb-2">
        <Badge variant="outline" className="w-fit mx-auto mb-2 bg-amber-500/10 text-amber-500 border-amber-500/20">
          In Queue
        </Badge>
        <CardTitle className="text-2xl font-bold text-white">You're on the list!</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5 shadow-inner">
            <p className="text-sm text-slate-400 font-medium mb-1">Position</p>
            <p className="text-4xl font-bold text-white">#{partiesAhead + 1}</p>
            <p className="text-xs text-slate-500 mt-1">{partiesAhead} parties ahead</p>
          </div>
          
          <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 shadow-inner">
            <p className="text-sm text-amber-500/70 font-medium mb-1">Est. Wait</p>
            <p className="text-4xl font-bold text-amber-500">~{estimatedMinutes}</p>
            <p className="text-xs text-amber-500/70 mt-1">minutes</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Progress</span>
            <span className="font-medium text-white">{partiesAhead === 0 ? "Next!" : "Waiting..."}</span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-amber-500 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              style={{ 
                width: partiesAhead === 0 ? "100%" : `${Math.max(10, 100 - (partiesAhead * 15))}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          onClick={handleCancel}
          disabled={loadingCancel}
        >
          {loadingCancel ? "Cancelling..." : "Cancel Reservation"}
        </Button>
      </CardFooter>
    </Card>
  );
}
