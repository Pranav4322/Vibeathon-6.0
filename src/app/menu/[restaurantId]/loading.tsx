import { SkeletonCard } from "@/components/ui/skeleton-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MenuLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 pb-24">
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Skeleton className="h-10 w-24 shrink-0 rounded-full" />
          <Skeleton className="h-10 w-24 shrink-0 rounded-full" />
          <Skeleton className="h-10 w-24 shrink-0 rounded-full" />
          <Skeleton className="h-10 w-24 shrink-0 rounded-full" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}
