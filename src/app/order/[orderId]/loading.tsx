import { Skeleton } from "@/components/ui/skeleton"

export default function OrderLoading() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl space-y-8">
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
      
      <div className="rounded-xl border p-6 space-y-8 shadow-sm">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        
        <div className="space-y-4 pt-4 border-t">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  )
}
