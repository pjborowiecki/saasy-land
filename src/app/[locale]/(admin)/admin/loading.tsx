import type { JSX } from "react"

export default function AdminLoading(): JSX.Element {
  return (
    <div className="flex w-full flex-col space-y-8">
      <div className="space-y-2">
        <div className="h-7 w-48 animate-pulse rounded-md bg-muted/40" />
        <div className="h-4 w-72 animate-pulse rounded-md bg-muted/30" />
      </div>
      <div className="h-64 animate-pulse rounded-lg border border-border/60 bg-muted/30" />
    </div>
  )
}
