import { notFound } from "next/navigation";
import { Utensils, Clock, CheckCircle2, ChefHat, Bell, Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { OrderTrackingClient } from "./order-tracking-client";
import type { Metadata } from "next";
import type { Order, OrderItem, Table } from "@/lib/types/database";

interface Props {
  params: Promise<{ orderId: string }>;
}

export const metadata: Metadata = {
  title: "Order Tracking — Smart Restaurant",
  description: "Track your order status in real time.",
};

const STATUS_STEPS = [
  { key: "placed",    label: "Placed",     icon: Receipt,     color: "text-blue-500",   bg: "bg-blue-50"   },
  { key: "confirmed", label: "Confirmed",  icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-50" },
  { key: "preparing", label: "Preparing",  icon: ChefHat,     color: "text-orange-500", bg: "bg-orange-50" },
  { key: "ready",     label: "Ready",      icon: Bell,        color: "text-amber-500",  bg: "bg-amber-50"  },
  { key: "served",    label: "Served",     icon: Utensils,    color: "text-green-500",  bg: "bg-green-50"  },
  { key: "billed",    label: "Billed",     icon: Receipt,     color: "text-stone-500",  bg: "bg-stone-50"  },
] as const;

interface OrderItemWithMenuItem extends OrderItem {
  menu_items: { name: string; is_veg: boolean; course_category: string; prep_time_minutes: number | null } | null;
}

interface OrderWithRelations extends Order {
  tables: Pick<Table, "table_number"> | null;
  order_items: OrderItemWithMenuItem[];
}

export default async function OrderPage({ params }: Props) {
  const supabase = await createClient();
  const { orderId } = await params;

  // Fetch order with joins — cast to our explicit type to avoid Supabase never inference
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !data) notFound();
  const order = data as Order;

  // Fetch table info
  const { data: tableRaw } = await supabase
    .from("tables")
    .select("*")
    .eq("id", order.table_id)
    .single();
  const tableData = tableRaw as Table | null;

  // Fetch order items
  const { data: itemsRaw } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  const baseItems = (itemsRaw ?? []) as OrderItem[];

  // Fetch menu item names for each order item
  const menuItemIds = baseItems.map((i) => i.menu_item_id);
  const { data: menuItemsRaw } = menuItemIds.length > 0
    ? await supabase.from("menu_items").select("id, name, is_veg, course_category, prep_time_minutes").in("id", menuItemIds)
    : { data: [] as Array<{ id: string; name: string; is_veg: boolean; course_category: string; prep_time_minutes: number | null }> };
  const menuItemsMap = new Map((menuItemsRaw ?? []).map((m) => [m.id, m]));

  const orderItems: OrderItemWithMenuItem[] = baseItems.map((oi) => ({
    ...oi,
    menu_items: menuItemsMap.get(oi.menu_item_id) ?? null,
  }));
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <OrderTrackingClient
      initialOrder={order}
      tableData={tableData}
      orderItems={orderItems}
    />
  );
}
