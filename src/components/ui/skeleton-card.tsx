import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="w-full flex flex-col justify-between">
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-4/5" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[120px] w-full rounded-xl" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-28" />
      </CardFooter>
    </Card>
  )
}

export function SkeletonKPI() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-3 w-4/5" />
      </CardContent>
    </Card>
  )
}

export function SkeletonOrderCard() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardHeader>
      <CardContent className="pb-2 text-sm">
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  )
}
