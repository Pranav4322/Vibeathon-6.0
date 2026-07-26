"use server";

import { createClient } from "@/lib/supabase/server";
import { advanceOrderStatus } from "./order-actions";
import type { OrderWithDetails } from "@/lib/types/database";

export interface BillDetails {
  order: OrderWithDetails;
  subtotal: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
}

const GST_RATE_PERCENT = 5;
const CGST_RATE_PERCENT = GST_RATE_PERCENT / 2;
const SGST_RATE_PERCENT = GST_RATE_PERCENT / 2;

/**
 * Fetches the details of an order to generate a bill.
 * Calculates the subtotal, CGST, SGST, and grand total.
 */
export async function getBillDetails(orderId: string): Promise<{
  success: boolean;
  data?: BillDetails;
  error?: string;
}> {
  const supabase = await createClient();

  const { data: orderRaw, error } = await supabase
    .from("orders")
    .select(`
      *,
      table:tables(id, table_number, capacity),
      order_items(
        *,
        menu_item:menu_items(id, name, is_veg, image_url)
      )
    `)
    .eq("id", orderId)
    .single();

  if (error || !orderRaw) {
    console.error("Error fetching bill details:", error);
    return { success: false, error: "Failed to fetch order details for billing." };
  }

  const order = orderRaw as unknown as OrderWithDetails;

  // Calculate totals
  const subtotal = order.order_items.reduce(
    (acc, item) => acc + Number(item.subtotal),
    0
  );

  const cgst = (subtotal * CGST_RATE_PERCENT) / 100;
  const sgst = (subtotal * SGST_RATE_PERCENT) / 100;
  const grandTotal = subtotal + cgst + sgst;

  // Optionally update the total_amount on the order if it wasn't already set
  if (order.total_amount !== grandTotal) {
    await supabase
      .from("orders")
      .update({ total_amount: grandTotal } as never)
      .eq("id", orderId);
  }

  return {
    success: true,
    data: {
      order,
      subtotal,
      cgst,
      sgst,
      grandTotal,
    },
  };
}

/**
 * Marks an order as billed using the state machine.
 */
export async function markOrderAsBilled(orderId: string) {
  return await advanceOrderStatus(orderId);
}
