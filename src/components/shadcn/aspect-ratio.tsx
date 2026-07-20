import type { ComponentProps, CSSProperties } from "react"

import { cn } from "~/src/lib/utils"

function aspectRatioStyle(ratio: number): CSSProperties {
  return { aspectRatio: ratio }
}

function AspectRatio({ ratio, className, ...props }: ComponentProps<"div"> & { ratio: number }) {
  return <div data-slot="aspect-ratio" style={aspectRatioStyle(ratio)} className={cn("relative", className)} {...props} />
}

export { AspectRatio }
