import type { ComponentProps } from "react"

import { cn } from "~/src/utils"

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
}

export { Skeleton }
