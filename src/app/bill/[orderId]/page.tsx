import { notFound } from "next/navigation";
import { getBillDetails } from "@/lib/actions/billing-actions";
import { BillView } from "@/components/billing/bill-view";
import { BillActions } from "@/components/billing/bill-actions";
import { BillSplitter } from "@/components/billing/bill-splitter";

export default async function CustomerBillPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;

  const { success, data, error } = await getBillDetails(orderId);

  if (!success || !data) {
    console.error("Failed to load bill:", error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex items-center justify-center print:bg-white print:p-0">
      <div className="w-full max-w-2xl">
        <BillView details={data} />
        <BillSplitter details={data} />
        <BillActions orderId={orderId} currentStatus={data.order.status} isStaff={false} />
      </div>
    </div>
  );
}
