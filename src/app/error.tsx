"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/ui/error-state"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Root Error Boundary caught error:", error)
  }, [error])

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <ErrorState 
        error={error} 
        reset={reset} 
        title="Application Error"
      />
    </div>
  )
}
