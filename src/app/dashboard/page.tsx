import { KPICard } from "@/components/dashboard/kpi-card";
import { ClipboardList, Grid2X2, BadgeDollarSign, Clock } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-500">Overview of your restaurant operations today.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Orders"
          value="12"
          icon={ClipboardList}
          trend={{ value: "14%", isPositive: true }}
        />
        <KPICard
          title="Tables In Use"
          value="6/10"
          icon={Grid2X2}
        />
        <KPICard
          title="Revenue Today"
          value="₹24,500"
          icon={BadgeDollarSign}
          trend={{ value: "8%", isPositive: true }}
        />
        <KPICard
          title="Avg Wait Time"
          value="18 min"
          icon={Clock}
          trend={{ value: "2 min", isPositive: false }}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Orders Placeholder */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Orders</h2>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">Recent orders will appear here</p>
          </div>
        </div>

        {/* Table Map Placeholder */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Table Status</h2>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">Live table map will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
