"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/ui/error-state"

export default function OrderError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Order Tracking Error Boundary caught error:", error)
  }, [error])

  return (
    <div className="container mx-auto flex h-[80vh] items-center justify-center p-4">
      <ErrorState 
        error={error} 
        reset={reset} 
        title="Error Loading Order"
      />
    </div>
  )
}
