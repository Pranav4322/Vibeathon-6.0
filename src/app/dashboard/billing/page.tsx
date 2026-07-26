import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Receipt, Search } from "lucide-react";
import type { OrderWithDetails } from "@/lib/types/database";

export default async function BillingDashboardPage() {
  const supabase = await createClient();

  // Fetch orders that are ready to be billed (served) and recently billed orders
  const { data: ordersRaw, error } = await supabase
    .from("orders")
    .select(`
      *,
      table:tables(id, table_number, capacity),
      order_items(
        *,
        menu_item:menu_items(id, name, is_veg, image_url)
      )
    `)
    .in("status", ["served", "billed"])
    .order("served_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Failed to fetch billing orders", error);
  }

  const orders = (ordersRaw as unknown as OrderWithDetails[]) || [];

  const servedOrders = orders.filter((o) => o.status === "served");
  const billedOrders = orders.filter((o) => o.status === "billed");

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Billing & Payments
          </h1>
          <p className="mt-2 text-slate-600">
            Manage bills for served tables and view payment history.
          </p>
        </div>
      </div>

      {/* Served Orders needing billing */}
      <div className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          Awaiting Payment ({servedOrders.length})
        </h2>
        
        {servedOrders.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
            <p className="text-slate-500">No tables waiting for the bill.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {servedOrders.map((order) => (
              <div key={order.id} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      Table {order.table?.table_number || "Takeaway"}
                    </p>
                    <p className="text-sm text-slate-500">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Receipt className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="mb-6 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-medium text-slate-900">{order.order_items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount (est):</span>
                    <span className="font-medium text-slate-900">₹{order.total_amount?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Served At:</span>
                    <span className="text-slate-500">
                      {order.served_at ? format(new Date(order.served_at), "h:mm a") : "-"}
                    </span>
                  </div>
                </div>
                
                <Link href={`/dashboard/billing/${order.id}`}>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Generate Bill
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Billed */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          Recently Paid
        </h2>
        
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Table</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Paid At</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {billedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    {order.table?.table_number || "Takeaway"}
                  </td>
                  <td className="px-6 py-4">
                    ₹{order.total_amount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4">
                    {order.billed_at ? format(new Date(order.billed_at), "dd MMM, h:mm a") : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/billing/${order.id}`}>
                      <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                        View Receipt
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              
              {billedOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No recent payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
