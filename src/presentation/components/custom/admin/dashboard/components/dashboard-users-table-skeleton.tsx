import type { JSX } from "react"

const SKELETON_ROW_COUNT = 5

export const DashboardUsersTableSkeleton = (): JSX.Element => (
  <div aria-busy className="flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
    <div className="border-b border-border px-5 py-4">
      <div className="h-4 w-40 animate-pulse rounded-sm bg-muted" />
      <div className="mt-2 h-3 w-64 animate-pulse rounded-sm bg-muted" />
    </div>
    <div className="border-b border-border px-4 py-3">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
    </div>
    <div className="divide-y divide-border">
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <div className="flex items-center gap-3 px-3 py-3" key={index}>
          <div className="size-8 shrink-0 animate-pulse rounded-md bg-muted" />
          <div className="min-w-0 flex-1">
            <div className="h-3 w-40 animate-pulse rounded-sm bg-muted" />
            <div className="mt-1.5 h-2.5 w-56 animate-pulse rounded-sm bg-muted" />
          </div>
          <div className="hidden h-5 w-16 animate-pulse rounded-md bg-muted sm:block" />
        </div>
      ))}
    </div>
    <div className="border-t border-border px-5 py-3">
      <div className="h-3 w-32 animate-pulse rounded-sm bg-muted" />
    </div>
  </div>
)
