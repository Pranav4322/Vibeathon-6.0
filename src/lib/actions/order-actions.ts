"use server";

import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types/database";

/**
 * Valid state machine transitions for orders.
 * Each key maps to the next allowed state.
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus | null> = {
  placed: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "served",
  served: "billed",
  billed: null, // terminal state
};

/** Timestamp column for each status */
const STATUS_TIMESTAMP: Record<OrderStatus, string> = {
  placed: "placed_at",
  confirmed: "confirmed_at",
  preparing: "preparing_at",
  ready: "ready_at",
  served: "served_at",
  billed: "billed_at",
};

export interface TransitionResult {
  success: boolean;
  error?: string;
  newStatus?: OrderStatus;
}

/**
 * Advances an order to its next status in the state machine.
 * Validates the transition is allowed before applying.
 */
export async function advanceOrderStatus(
  orderId: string
): Promise<TransitionResult> {
  const supabase = await createClient();

  // Fetch current order
  const { data: orderRaw, error: fetchErr } = await supabase
    .from("orders")
    .select("id, status, restaurant_id")
    .eq("id", orderId)
    .single();

  const order = orderRaw as { id: string; status: string; restaurant_id: string } | null;

  if (fetchErr || !order) {
    return { success: false, error: "Order not found." };
  }

  const currentStatus = order.status as OrderStatus;
  const nextStatus = VALID_TRANSITIONS[currentStatus];

  if (!nextStatus) {
    return {
      success: false,
      error: `Order is already in terminal state: ${currentStatus}`,
    };
  }

  // Build the update payload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePayload: any = {
    status: nextStatus,
    [STATUS_TIMESTAMP[nextStatus]]: new Date().toISOString(),
  };

  const { error: updateErr } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("id", orderId);

  if (updateErr) {
    return { success: false, error: "Failed to update order status." };
  }

  // If the order is now "billed", mark the table as free
  if (nextStatus === "billed") {
    // Fetch table_id from the order
    const { data: fullOrderRaw } = await supabase
      .from("orders")
      .select("table_id")
      .eq("id", orderId)
      .single();

    const fullOrder = fullOrderRaw as { table_id: string } | null;

    if (fullOrder) {
      // Check if there are any other non-billed orders on this table
      const { data: otherOrders } = await supabase
        .from("orders")
        .select("id")
        .eq("table_id", fullOrder.table_id)
        .neq("status", "billed")
        .neq("id", orderId)
        .limit(1);

      // If no other active orders, free the table
      if (!otherOrders || otherOrders.length === 0) {
        // @ts-expect-error Supabase types are not fully generated yet
        await supabase
          .from("tables")
          .update({ status: "free", occupied_since: null })
          .eq("id", fullOrder.table_id);
      }
    }
  }

  return { success: true, newStatus: nextStatus };
}

/**
 * Updates the availability status of a menu item.
 * Used by staff to mark items as available, low stock, or out of stock.
 */
export async function updateMenuAvailability(
  menuItemId: string,
  status: "available" | "low" | "out"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // @ts-expect-error Supabase types are not fully generated yet
  const { error } = await supabase
    .from("menu_items")
    .update({ availability_status: status })
    .eq("id", menuItemId);

  if (error) {
    return { success: false, error: "Failed to update availability." };
  }

  return { success: true };
}
