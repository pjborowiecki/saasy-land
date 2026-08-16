import type { ComponentProps, JSX } from "react"

import { cn } from "~/src/utils"

import { APP_NAME } from "~/src/presentation/branding"

export function Wordmark({ className, ...props }: Readonly<ComponentProps<"span">>): JSX.Element {
  return (
    <span className={cn("flex items-center gap-2.5 text-foreground", className)} {...props}>
      <svg aria-hidden className="size-5.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 0H15V9H24V18A6 6 0 0 1 18 24H6A6 6 0 0 1 0 18V6A6 6 0 0 1 6 0Z" />
      </svg>
      <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">{APP_NAME}</span>
    </span>
  )
}
