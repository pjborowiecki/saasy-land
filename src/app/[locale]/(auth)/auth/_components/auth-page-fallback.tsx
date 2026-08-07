import type { JSX } from "react"

export function AuthPageFallback(): JSX.Element {
  return (
    <div className="flex w-full max-w-105 flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-80 animate-pulse rounded-2xl border border-border/40 bg-muted/30" />
    </div>
  )
}
