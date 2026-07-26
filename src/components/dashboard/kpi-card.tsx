import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function KPICard({ title, value, icon: Icon, trend, className }: KPICardProps) {
  return (
    <div className={cn("rounded-xl border bg-white p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="rounded-full bg-slate-100 p-2.5">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {trend && (
          <div className="mt-1 flex items-center gap-1 text-sm">
            <span
              className={cn(
                "font-medium",
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend.isPositive ? "+" : "-"}{trend.value}
            </span>
            <span className="text-slate-500">from last week</span>
          </div>
        )}
      </div>
    </div>
  );
}
