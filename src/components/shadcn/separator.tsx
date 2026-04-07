"use client"

import type { JSX } from "react"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "~/src/lib/utils"

function Separator({ className, orientation = "horizontal", ...props }: Readonly<SeparatorPrimitive.Props>): JSX.Element {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
