"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface WaitTimeAlertData {
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

interface WaitTimeAlertsProps {
  alerts: WaitTimeAlertData[];
  averageServiceMinutes: number;
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function ProgressBar({
  elapsed,
  average,
  severity,
}: {
  elapsed: number;
  average: number;
  severity: "warning" | "critical";
}) {
  // Clamp the progress to max 100%
  const progress = Math.min((elapsed / (average * 2)) * 100, 100);

  return (
    <div className="mt-3 w-full">
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            severity === "critical"
              ? "bg-gradient-to-r from-red-400 to-red-600"
              : "bg-gradient-to-r from-amber-400 to-amber-600"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-400">
        <span>0 min</span>
        <span className="text-slate-500 font-medium">
          avg {average} min
        </span>
        <span>{average * 2} min</span>
      </div>
    </div>
  );
}

export function WaitTimeAlerts({
  alerts,
  averageServiceMinutes,
}: WaitTimeAlertsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-full bg-emerald-100 p-2">
            <Clock className="h-4 w-4 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Wait Time Status
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-emerald-50 p-4 mb-3">
            <Clock className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-emerald-700">
            All tables are within normal wait times
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Average service time: {averageServiceMinutes} min
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-5 pb-4 border-b bg-gradient-to-r from-red-50/80 to-amber-50/80">
        <div
          className={cn(
            "rounded-full p-2",
            alerts.some((a) => a.severity === "critical")
              ? "bg-red-100"
              : "bg-amber-100"
          )}
        >
          <AlertTriangle
            className={cn(
              "h-4 w-4",
              alerts.some((a) => a.severity === "critical")
                ? "text-red-600"
                : "text-amber-600"
            )}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Long Wait Alerts
          </h2>
          <p className="text-xs text-slate-500">
            {alerts.length} table{alerts.length !== 1 ? "s" : ""} exceeding avg
            service time ({averageServiceMinutes} min)
          </p>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="divide-y divide-slate-100">
        {alerts.map((alert, index) => (
          <div
            key={alert.orderId}
            className={cn(
              "p-5 transition-all duration-500",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              alert.severity === "critical"
                ? "hover:bg-red-50/50"
                : "hover:bg-amber-50/50"
            )}
            style={{
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                {/* Severity Indicator */}
                <div
                  className={cn(
                    "mt-0.5 shrink-0 flex h-9 w-9 items-center justify-center rounded-full",
                    alert.severity === "critical"
                      ? "bg-red-100 animate-pulse"
                      : "bg-amber-100"
                  )}
                >
                  <span className="text-sm font-bold">
                    {alert.severity === "critical" ? "🔴" : "🟡"}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">
                      Table {alert.tableNumber}
                    </span>
                    <span className="text-slate-400">—</span>
                    <span
                      className={cn(
                        "text-sm font-bold tabular-nums",
                        alert.severity === "critical"
                          ? "text-red-600"
                          : "text-amber-600"
                      )}
                    >
                      {alert.elapsedMinutes} min
                    </span>
                    <span className="text-xs text-slate-400">
                      (avg: {alert.averageMinutes} min)
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Order {alert.orderShortId} • Status:{" "}
                    <span className="font-medium text-slate-700">
                      {formatStatus(alert.status)}
                    </span>
                  </p>

                  {/* Progress Bar */}
                  <ProgressBar
                    elapsed={alert.elapsedMinutes}
                    average={alert.averageMinutes}
                    severity={alert.severity}
                  />

                  {/* Percent over badge */}
                  <div className="mt-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        alert.severity === "critical"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      )}
                    >
                      +{alert.percentOver}% over average
                    </span>
                  </div>
                </div>
              </div>

              {/* View Order Button */}
              <Link href={`/dashboard/orders`}>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "shrink-0 gap-1.5 text-xs",
                    alert.severity === "critical"
                      ? "border-red-200 text-red-700 hover:bg-red-50"
                      : "border-amber-200 text-amber-700 hover:bg-amber-50"
                  )}
                >
                  <ExternalLink className="h-3 w-3" />
                  View Order
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
