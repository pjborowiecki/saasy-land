import type { ComponentProps, JSX } from "react"

import { cn, cssVars } from "~/src/lib/utils"

function AspectRatio({ ratio, className, ...props }: ComponentProps<"div"> & { ratio: number }): JSX.Element {
  return (
    <div data-slot="aspect-ratio" style={cssVars({ "--ratio": ratio })} className={cn("relative aspect-(--ratio)", className)} {...props} />
  )
}

export { AspectRatio }
