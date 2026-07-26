"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Order, Reservation } from "@/lib/types/database";

interface UseNotificationsProps {
  restaurantId: string;
  orderId?: string;
  reservationId?: string;
}

export function useNotifications({ restaurantId, orderId, reservationId }: UseNotificationsProps) {
  const supabase = createClient();
  const prevOrderStatus = useRef<string | null>(null);
  const prevReservationStatus = useRef<string | null>(null);

  useEffect(() => {
    if (!restaurantId) return;

    let channel = supabase.channel(`notifications-${restaurantId}`);

    // Listen to order updates
    if (orderId) {
      channel = channel.on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newOrder = payload.new as Order;
          
          if (newOrder.status !== prevOrderStatus.current && prevOrderStatus.current !== null) {
            let message = "";
            switch (newOrder.status) {
              case "confirmed":
                message = "Your order has been confirmed by the kitchen!";
                toast(message, { style: { background: "#f59e0b", color: "#fff", borderColor: "#d97706" } });
                break;
              case "preparing":
                message = "Your order is now being prepared! 🍳";
                toast(message, { style: { background: "#ea580c", color: "#fff", borderColor: "#c2410c" } });
                break;
              case "ready":
                message = "Your order is ready to be served! 🍽️";
                toast.success(message);
                break;
              case "served":
                message = "Your order has been served. Enjoy your meal! 😊";
                toast.success(message);
                break;
            }
          }
          prevOrderStatus.current = newOrder.status;
        }
      );
    }

    // Listen to reservation updates
    if (reservationId) {
      channel = channel.on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "reservations",
          filter: `id=eq.${reservationId}`,
        },
        (payload) => {
          const newReservation = payload.new as Reservation;
          
          if (newReservation.status !== prevReservationStatus.current && prevReservationStatus.current !== null) {
            if (newReservation.status === "seated") {
              toast.success("Your table is ready! Please see the host to be seated. 🎉");
            } else if (newReservation.status === "cancelled") {
              toast.error("Your reservation was cancelled.");
            }
          }
          prevReservationStatus.current = newReservation.status;
        }
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, orderId, reservationId, supabase]);

  // Initial fetch to set refs
  useEffect(() => {
    async function init() {
      if (orderId) {
        const { data } = await supabase.from("orders").select("status").eq("id", orderId).single();
        if (data) prevOrderStatus.current = (data as any).status;
      }
      if (reservationId) {
        const { data } = await supabase.from("reservations").select("status").eq("id", reservationId).single();
        if (data) prevReservationStatus.current = (data as any).status;
      }
    }
    init();
  }, [orderId, reservationId, supabase]);
}
