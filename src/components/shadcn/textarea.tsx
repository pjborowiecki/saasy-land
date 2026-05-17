import type { ComponentProps, JSX } from "react"

import { cn } from "~/src/lib/utils"

function Textarea({ className, ...props }: ComponentProps<"textarea">): JSX.Element {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex min-h-[120px] w-full rounded-xl border border-input bg-transparent px-4 py-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
