"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Grid2X2,
  MenuSquare,
  Package,
  Users,
  UserSquare2,
  BadgeDollarSign,
  TrendingUp,
  Bot,
  LogOut,
  Receipt,
  Lock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useStaffPin } from "@/lib/hooks/use-staff-pin";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: ClipboardList },
  { name: "Menu", href: "/dashboard/menu", icon: MenuSquare },
  { name: "Reservations", href: "/dashboard/reservations", icon: Users },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Billing", href: "/dashboard/billing", icon: Receipt },
  { name: "Feedback", href: "/dashboard/feedback", icon: Star },
  { name: "AI Assistant", href: "/dashboard/ai", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { currentStaff, lockDevice } = useStaffPin();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-slate-950 text-slate-50">
      <div className="flex h-14 items-center border-b border-slate-800 px-4">
        <span className="text-lg font-bold text-amber-500 flex items-center gap-2">
          🍽️ Smart Restaurant
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-800">
        {navItems.map((item) => {
          // Exact match for home, starts with for subpages
          const isActive = item.href === "/dashboard" 
            ? pathname === "/dashboard" 
            : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-amber-500/10 text-amber-500"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="mb-4 flex items-center gap-3 px-3">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 uppercase">
            {currentStaff?.name?.[0] || user?.email?.[0] || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">
              {currentStaff?.name || user?.email?.split("@")[0] || "Staff Member"}
            </span>
            <span className="text-xs text-slate-500 capitalize">{currentStaff?.role || "Staff"}</span>
          </div>
        </div>
        
        <button
          onClick={lockDevice}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-amber-500 hover:bg-slate-800 transition-colors mb-1"
        >
          <Lock className="h-4 w-4" />
          Lock Device
        </button>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
