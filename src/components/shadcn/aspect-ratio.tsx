import type { ComponentProps, CSSProperties, JSX } from "react"

import { cn } from "~/src/lib/utils"

function AspectRatio({ ratio, className, ...props }: ComponentProps<"div"> & { ratio: number }): JSX.Element {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          "--ratio": ratio,
        } as CSSProperties
      }
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
    />
  )
}

export { AspectRatio }
