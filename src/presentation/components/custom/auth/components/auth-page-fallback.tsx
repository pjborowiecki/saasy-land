import type { JSX } from "react"

import { cn } from "~/src/lib/cn"

/**
 * The Suspense placeholder holds the exact shape of the column it replaces, so nothing
 * shifts when the page arrives.
 */
const SkeletonBar = ({ className }: Readonly<{ className: string }>): JSX.Element => (
  <span className={cn("block animate-pulse rounded-sm bg-muted motion-reduce:animate-none", className)} />
)

export const AuthPageFallback = (): JSX.Element => (
  <div aria-hidden className="flex w-full max-w-105 flex-col">
    <SkeletonBar className="h-12 w-2/3" />
    <SkeletonBar className="mt-4 h-4 w-full" />

    <div className="mt-10 flex flex-col gap-6">
      <SkeletonBar className="h-11 w-full" />
      <SkeletonBar className="h-11 w-full" />
      <SkeletonBar className="h-11 w-full" />
      <SkeletonBar className="h-12 w-full" />
    </div>
  </div>
)
