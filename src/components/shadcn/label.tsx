"use client"

import type { ComponentProps, JSX } from "react"

import { cn } from "~/src/lib/utils"

function Label({ className, ...props }: ComponentProps<"label">): JSX.Element {
  return (
    <label // NOSONAR
      data-slot="label"
      className={cn(
        "flex select-none items-center gap-2 text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
