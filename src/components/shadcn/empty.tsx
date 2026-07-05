import type { ComponentProps, JSX } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/src/lib/utils"

function Empty({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg border-dashed p-6 text-center text-balance",
        className,
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return <div data-slot="empty-header" className={cn("flex max-w-sm flex-col items-center gap-2", className)} {...props} />
}

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

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>): JSX.Element {
  return <div data-slot="empty-icon" data-variant={variant} className={cn(emptyMediaVariants({ className, variant }))} {...props} />
}

function EmptyTitle({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return <div data-slot="empty-title" className={cn("text-sm font-medium", className)} {...props} />
}

function EmptyDescription({ className, ...props }: ComponentProps<"p">): JSX.Element {
  return (
    <div
      data-slot="empty-description"
      className={cn("text-xs/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary", className)}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="empty-content"
      className={cn("flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-xs text-balance", className)}
      {...props}
    />
  )
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle }
