import type { ComponentProps, JSX } from "react"

import { cn } from "~/src/lib/utils"

function Skeleton({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return <div data-slot="skeleton" className={cn("animate-pulse rounded-lg bg-muted", className)} {...props} />
}

export { Skeleton }
