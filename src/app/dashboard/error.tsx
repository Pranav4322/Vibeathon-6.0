"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/ui/error-state"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard Error Boundary caught error:", error)
  }, [error])

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <ErrorState 
        error={error} 
        reset={reset} 
        title="Dashboard Error"
      />
    </div>
  )
}
