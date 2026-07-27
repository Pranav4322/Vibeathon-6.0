import { Skeleton } from "@/components/ui/skeleton"

export default function BillLoading() {
  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-8 space-y-6">
      <Skeleton className="h-10 w-[250px] mx-auto mb-8" />
      <div className="rounded-xl border shadow-sm p-6 space-y-6">
        <div className="flex justify-between border-b pb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-6 w-24 ml-auto" />
            <Skeleton className="h-4 w-32 ml-auto" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        
        <div className="border-t pt-4 flex justify-end space-y-2 flex-col items-end">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-64" />
        </div>
      </div>
    </div>
  )
}
