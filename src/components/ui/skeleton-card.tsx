"use client";

import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-6 shadow-sm animate-pulse",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-10 w-10 rounded-full bg-slate-200" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-7 w-20 rounded bg-slate-200" />
        <div className="h-3 w-32 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export function SkeletonMenuCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white overflow-hidden shadow-sm animate-pulse",
        className
      )}
    >
      {/* Image placeholder */}
      <div className="h-40 w-full bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-slate-200" />
          <div className="h-3 w-12 rounded bg-slate-100" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-5 w-14 rounded bg-slate-200" />
          <div className="h-3 w-16 rounded bg-slate-100" />
        </div>
        <div className="h-9 w-full rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}

export function SkeletonOrderCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-4 shadow-sm animate-pulse",
        className
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="h-4 w-20 rounded bg-slate-200" />
        <div className="h-3 w-16 rounded bg-slate-100" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-slate-100" />
        <div className="h-3 w-16 rounded bg-slate-100" />
      </div>
      <div className="mt-4">
        <div className="h-8 w-full rounded bg-slate-100" />
      </div>
    </div>
  );
}

export function SkeletonTableCircle({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "h-16 w-16 rounded-full bg-slate-200 animate-pulse",
        className
      )}
    />
  );
}

export function SkeletonRow({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg animate-pulse",
        className
      )}
    >
      <div className="h-10 w-10 rounded-full bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-3 w-1/3 rounded bg-slate-100" />
      </div>
      <div className="h-6 w-20 rounded bg-slate-100" />
    </div>
  );
}
