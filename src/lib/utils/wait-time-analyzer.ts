import { createClient } from "@/lib/supabase/server";

export interface WaitTimeAlert {
  orderId: string;
  orderShortId: string;
  tableNumber: string;
  tableId: string;
  status: string;
  elapsedMinutes: number;
  averageMinutes: number;
  percentOver: number;
  severity: "warning" | "critical";
  placedAt: string;
}

export interface WaitTimeAnalysis {
  alerts: WaitTimeAlert[];
  averageServiceMinutes: number;
}

/**
 * Analyzes active orders and flags tables where elapsed time exceeds
 * the recent average by more than 25%.
 *
 * - Computes average order duration from recent billed orders (last 3 days).
 * - Compares each active (non-billed) order's elapsed time against that average.
 * - Returns alerts sorted by severity (critical first, then by elapsed time desc).
 */
export async function analyzeWaitTimes(): Promise<WaitTimeAnalysis> {
  const supabase = await createClient();

  // 1. Calculate average completion time from recently billed orders (last 3 days)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const { data: billedOrdersRaw } = await supabase
    .from("orders")
    .select("placed_at, billed_at")
    .eq("status", "billed")
    .gte("billed_at", threeDaysAgo.toISOString());

  const billedOrders = (billedOrdersRaw as { placed_at: string; billed_at: string }[] | null)
    ?.filter((o) => o.placed_at && o.billed_at);

  // Compute average service time in minutes
  let averageServiceMinutes = 35; // default fallback

  if (billedOrders && billedOrders.length >= 3) {
    const durations = billedOrders.map((order) => {
      const placed = new Date(order.placed_at!).getTime();
      const billed = new Date(order.billed_at!).getTime();
      return (billed - placed) / (1000 * 60); // minutes
    });
    // Filter out outliers (orders that took > 3 hours are likely data errors)
    const validDurations = durations.filter((d) => d > 0 && d < 180);
    if (validDurations.length > 0) {
      averageServiceMinutes =
        validDurations.reduce((sum, d) => sum + d, 0) / validDurations.length;
    }
  }

  // 2. Get all active orders (not billed, not served)
  const { data: activeOrdersRaw } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      placed_at,
      table_id,
      tables(table_number)
    `
    )
    .not("status", "in", '("billed","served")');

  const activeOrders = (activeOrdersRaw as any[] | null)?.filter(
    (o) => o.placed_at
  );

  const now = Date.now();
  const threshold = averageServiceMinutes * 1.25; // 25% over average
  const alerts: WaitTimeAlert[] = [];

  if (activeOrders) {
    for (const order of activeOrders as any[]) {
      const placedAt = new Date(order.placed_at).getTime();
      const elapsedMinutes = Math.round((now - placedAt) / (1000 * 60));

      if (elapsedMinutes > threshold) {
        const percentOver = Math.round(
          ((elapsedMinutes - averageServiceMinutes) / averageServiceMinutes) *
            100
        );
        const shortId = order.id.substring(0, 8).toUpperCase();

        alerts.push({
          orderId: order.id,
          orderShortId: `#ORD-${shortId}`,
          tableNumber: order.tables?.table_number || "Unknown",
          tableId: order.table_id,
          status: order.status,
          elapsedMinutes,
          averageMinutes: Math.round(averageServiceMinutes),
          percentOver,
          severity: percentOver >= 40 ? "critical" : "warning",
          placedAt: order.placed_at,
        });
      }
    }
  }

  // Sort: critical first, then by elapsed time descending
  alerts.sort((a, b) => {
    if (a.severity !== b.severity) {
      return a.severity === "critical" ? -1 : 1;
    }
    return b.elapsedMinutes - a.elapsedMinutes;
  });

  return {
    alerts,
    averageServiceMinutes: Math.round(averageServiceMinutes),
  };
}
