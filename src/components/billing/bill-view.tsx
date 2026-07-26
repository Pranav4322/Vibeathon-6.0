"use client";

import { format } from "date-fns";
import type { BillDetails } from "@/lib/actions/billing-actions";

export function BillView({ details }: { details: BillDetails }) {
  const { order, subtotal, cgst, sgst, grandTotal } = details;

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border bg-white p-6 shadow-sm print:m-0 print:max-w-none print:border-none print:shadow-none text-slate-900">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight">THE SPICE GARDEN</h2>
        <p className="text-sm text-slate-500">123 Food Street, Mumbai</p>
        <p className="text-sm text-slate-500">GSTIN: 27XXXXX1234X1Z5</p>
      </div>

      <div className="mb-6 flex justify-between border-b border-dashed pb-4 text-sm">
        <div>
          <p>
            <span className="font-medium">Bill:</span> #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p>
            <span className="font-medium">Date:</span> {format(new Date(order.placed_at), "dd MMM yyyy, h:mm a")}
          </p>
        </div>
        <div className="text-right">
          <p>
            <span className="font-medium">Table:</span> {order.table?.table_number || "Takeaway"}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dashed pb-2 text-left">
              <th className="font-medium">Item</th>
              <th className="font-medium text-right">Qty</th>
              <th className="font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashed">
            {order.order_items.map((item) => (
              <tr key={item.id} className="py-2">
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        item.menu_item.is_veg ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {item.menu_item.name}
                  </div>
                </td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">₹{item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t border-dashed pt-4 text-sm">
        <div className="flex justify-between py-1">
          <span className="text-slate-600">Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-600">CGST (2.5%)</span>
          <span>₹{cgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-dashed pb-4">
          <span className="text-slate-600">SGST (2.5%)</span>
          <span>₹{sgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-4 text-lg font-bold">
          <span>GRAND TOTAL</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 text-center text-sm italic text-slate-500">
        Thank you for dining with us!
      </div>
    </div>
  );
}
