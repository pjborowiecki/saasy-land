"use client"

import type { ComponentProps, JSX } from "react"

import { cn } from "~/src/lib/utils"

function Label({ className, ...props }: ComponentProps<"label">): JSX.Element {
  return (
    // NOSONAR - native label element required for form accessibility
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-xs leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
