import { notFound } from "next/navigation";
import { getBillDetails } from "@/lib/actions/billing-actions";
import { BillView } from "@/components/billing/bill-view";
import { BillActions } from "@/components/billing/bill-actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function StaffBillPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const { success, data, error } = await getBillDetails(orderId);

  if (!success || !data) {
    console.error("Failed to load bill:", error);
    notFound();
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8 print:p-0 print:bg-white">
      <div className="mb-8 print:hidden">
        <Link 
          href="/dashboard/billing"
          className="flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 mb-4 w-fit"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Billing
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Order Bill
        </h1>
        <p className="mt-2 text-slate-600">
          Review and process payment for order #{orderId.slice(0, 8).toUpperCase()}.
        </p>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <BillView details={data} />
        <BillActions orderId={orderId} currentStatus={data.order.status} isStaff={true} />
      </div>
    </div>
  );
}
