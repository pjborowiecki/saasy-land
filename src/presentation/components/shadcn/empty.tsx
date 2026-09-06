import type { ComponentProps } from "react"

import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "~/src/lib/cn"

const Empty = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance",
      className,
    )}
    data-slot="empty"
    {...props}
  />
)

const EmptyHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("flex max-w-sm flex-col items-center gap-2", className)} data-slot="empty-header" {...props} />
)

const emptyMediaVariants = cva("mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4",
    },
  },
})

const EmptyMedia = ({ className, variant = "default", ...props }: ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) => (
  <div className={cn(emptyMediaVariants({ className, variant }))} data-slot="empty-icon" data-variant={variant} {...props} />
)

const EmptyTitle = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("cn-font-heading text-sm font-medium tracking-tight", className)} data-slot="empty-title" {...props} />
)

const EmptyDescription = ({ className, ...props }: ComponentProps<"p">) => (
  <div
    className={cn("text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary", className)}
    data-slot="empty-description"
    {...props}
  />
)

const EmptyContent = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance", className)}
    data-slot="empty-content"
    {...props}
  />
)

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle }
