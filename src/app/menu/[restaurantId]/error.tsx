"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/ui/error-state"

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Menu Error Boundary caught error:", error)
  }, [error])

  return (
    <div className="container mx-auto p-4 flex h-[80vh] items-center justify-center">
      <ErrorState 
        error={error} 
        reset={reset} 
        title="Error Loading Menu"
      />
    </div>
  )
}
