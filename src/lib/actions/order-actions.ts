"use server";

import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types/database";
import { sendPushNotificationToOrder } from "./push-actions";
import { generateUpsellForOrder } from "@/lib/ai/upsell-generator";

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
    .update(updatePayload as never)
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
        await supabase
          .from("tables")
          .update({ status: "free", occupied_since: null } as never)
          .eq("id", fullOrder.table_id);
      }
    }
  }

  // Trigger push notifications
  try {
    if (nextStatus === "confirmed") {
      await sendPushNotificationToOrder(orderId, {
        title: "Order Confirmed!",
        body: "We've told the kitchen to make it extra delicious.",
        url: `/order/${orderId}`
      });
    } else if (nextStatus === "preparing") {
      await sendPushNotificationToOrder(orderId, {
        title: "Chef is on it 🍳",
        body: "Your food is being prepared right now.",
        url: `/order/${orderId}`
      });
    } else if (nextStatus === "ready") {
      await sendPushNotificationToOrder(orderId, {
        title: "Food is Ready! 🛎️",
        body: "Your order is ready to be served.",
        url: `/order/${orderId}`
      });
    } else if (nextStatus === "served") {
      // Generate AI Upsell when served
      const upsellMsg = await generateUpsellForOrder(orderId);
      if (upsellMsg) {
        await sendPushNotificationToOrder(orderId, {
          title: "Enjoying your meal? 🍰",
          body: upsellMsg,
          url: `/order/${orderId}`
        });
      } else {
        await sendPushNotificationToOrder(orderId, {
          title: "Food is Served! 🍽️",
          body: "Enjoy your meal!",
          url: `/order/${orderId}`
        });
      }
    }
  } catch (error) {
    console.error("Failed to send push notification on status change:", error);
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

  const { error } = await supabase
    .from("menu_items")
    .update({ availability_status: status } as never)
    .eq("id", menuItemId);

  if (error) {
    return { success: false, error: "Failed to update availability." };
  }

  return { success: true };
}

/**
 * Updates the chef override minutes for an order's estimated wait time.
 */
export async function updateChefOverride(
  orderId: string,
  minutes: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ chef_override_minutes: minutes } as never)
    .eq("id", orderId);

  if (error) {
    return { success: false, error: "Failed to update chef override." };
  }

  return { success: true };
}

/**
 * Fires a held order item (changes is_held to false).
 */
export async function fireOrderItem(
  orderItemId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("order_items")
    .update({ is_held: false } as never)
    .eq("id", orderItemId);

  if (error) {
    return { success: false, error: "Failed to fire item." };
  }

  return { success: true };
}
