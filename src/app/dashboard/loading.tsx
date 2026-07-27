import { SkeletonKPI, SkeletonOrderCard } from "@/components/ui/skeleton-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-[150px]" />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonKPI />
        <SkeletonKPI />
        <SkeletonKPI />
        <SkeletonKPI />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <Skeleton className="h-5 w-[150px] mb-4" />
            <div className="space-y-4">
              <SkeletonOrderCard />
              <SkeletonOrderCard />
            </div>
          </div>
        </div>
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow p-6">
          <Skeleton className="h-5 w-[100px] mb-4" />
          <Skeleton className="h-[300px] w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
