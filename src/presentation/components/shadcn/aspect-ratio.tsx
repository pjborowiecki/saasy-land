import type { CSSProperties, ComponentProps } from "react"

import { cn } from "~/src/lib/cn"

const aspectRatioStyle = (ratio: number): CSSProperties => ({ aspectRatio: ratio })

const AspectRatio = ({ ratio, className, ...props }: ComponentProps<"div"> & { ratio: number }) => (
  <div data-slot="aspect-ratio" style={aspectRatioStyle(ratio)} className={cn("relative", className)} {...props} />
)

export { AspectRatio }
