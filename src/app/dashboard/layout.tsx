import { Sidebar } from "@/components/dashboard/sidebar";
import { PinLockOverlay } from "@/components/dashboard/pin-lock-overlay";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PinLockOverlay>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </PinLockOverlay>
  );
}
