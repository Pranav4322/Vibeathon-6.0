"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cancelReservation } from "@/lib/actions/reservation-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QueueStatusProps {
  initialReservation: any;
  restaurantId: string;
  onCancel: () => void;
}

export function QueueStatus({ initialReservation, restaurantId, onCancel }: QueueStatusProps) {
  const [reservation, setReservation] = useState(initialReservation);
  const [partiesAhead, setPartiesAhead] = useState(0);
  const [loadingCancel, setLoadingCancel] = useState(false);
  
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
      <Card className="w-full max-w-md mx-auto shadow-lg bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-center text-green-700">Table Ready! 🎉</CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <p className="text-green-800">Please head to the host stand. Your table is ready for you.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-amber-100">
      <CardHeader className="text-center pb-2">
        <Badge variant="outline" className="w-fit mx-auto mb-2 bg-amber-50 text-amber-700 border-amber-200">
          In Queue
        </Badge>
        <CardTitle className="text-2xl font-bold">You're on the list!</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 font-medium mb-1">Position</p>
            <p className="text-4xl font-bold text-slate-900">#{partiesAhead + 1}</p>
            <p className="text-xs text-slate-400 mt-1">{partiesAhead} parties ahead</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <p className="text-sm text-amber-700/70 font-medium mb-1">Est. Wait</p>
            <p className="text-4xl font-bold text-amber-600">~{estimatedMinutes}</p>
            <p className="text-xs text-amber-600/70 mt-1">minutes</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Progress</span>
            <span className="font-medium">{partiesAhead === 0 ? "Next!" : "Waiting..."}</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-1000 ease-in-out"
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
          className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleCancel}
          disabled={loadingCancel}
        >
          {loadingCancel ? "Cancelling..." : "Cancel Reservation"}
        </Button>
      </CardFooter>
    </Card>
  );
}
