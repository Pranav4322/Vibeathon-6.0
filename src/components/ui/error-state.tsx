"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
}

export function ErrorState({
  error,
  reset,
  title = "Something went wrong!",
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50/50 p-8 text-center animate-in fade-in-50 dark:border-red-900/50 dark:bg-red-950/20">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
          <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-red-900 dark:text-red-400">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm font-normal leading-6 text-red-800/80 dark:text-red-500/80">
          {error.message || "An unexpected error occurred while loading this section."}
        </p>
        <div className="mt-6">
          <Button variant="outline" onClick={() => reset()} className="border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/50">
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}
