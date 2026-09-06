import type { ComponentProps } from "react"

import { cn } from "~/src/lib/cn"

const Skeleton = ({ className, ...props }: ComponentProps<"div">) => (
  <div data-slot="skeleton" className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
)

export { Skeleton }
