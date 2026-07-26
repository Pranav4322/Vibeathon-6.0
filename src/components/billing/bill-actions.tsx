"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle2 } from "lucide-react";
import { markOrderAsBilled } from "@/lib/actions/billing-actions";
import { toast } from "sonner";

interface BillActionsProps {
  orderId: string;
  isStaff?: boolean;
  currentStatus: string;
}

export function BillActions({ orderId, isStaff = false, currentStatus }: BillActionsProps) {
  const router = useRouter();
  const [isBilling, setIsBilling] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleMarkAsBilled = async () => {
    setIsBilling(true);
    try {
      const res = await markOrderAsBilled(orderId);
      if (res.success) {
        toast.success("Order marked as billed");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to mark as billed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsBilling(false);
    }
  };

  const isBilled = currentStatus === "billed";

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
      <Button
        variant="outline"
        className="w-full sm:w-auto flex items-center gap-2"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" />
        Print Bill
      </Button>

      {isStaff && !isBilled && (
        <Button
          className="w-full sm:w-auto flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
          onClick={handleMarkAsBilled}
          disabled={isBilling}
        >
          <CheckCircle2 className="h-4 w-4" />
          {isBilling ? "Processing..." : "Mark as Paid"}
        </Button>
      )}

      {isStaff && isBilled && (
        <Button
          className="w-full sm:w-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          disabled
        >
          <CheckCircle2 className="h-4 w-4" />
          Paid
        </Button>
      )}
    </div>
  );
}
