"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, Inbox, Search, ShoppingBag, Users, Utensils } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const defaultIcons: Record<string, LucideIcon> = {
  orders: ShoppingBag,
  menu: Utensils,
  staff: Users,
  search: Search,
  default: Inbox,
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <div className="rounded-full bg-slate-100 p-5 mb-4">
        <Icon className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
