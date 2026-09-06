import type { ComponentProps, HTMLAttributes, ReactNode } from "react"

import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "~/src/lib/cn"

const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground",
  {
    variants: {
      variant: {
        border: "border-b border-border pb-2",
        default: "",
        separator:
          "before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
      },
    },
  },
)

const Marker = ({
  children,
  className,
  render,
  variant = "default",
  ...props
}: ComponentProps<"div"> &
  VariantProps<typeof markerVariants> & {
    render?: (props: HTMLAttributes<HTMLElement>) => ReactNode
  }) => {
  if (render !== undefined) {
    const renderProps = {
      ...props,
      children,
      className: cn(markerVariants({ className, variant })),
      "data-slot": "marker",
      "data-variant": variant,
    }

    return render(renderProps)
  }

  return (
    <div {...props} className={cn(markerVariants({ className, variant }))} data-slot="marker" data-variant={variant}>
      {children}
    </div>
  )
}

const MarkerIcon = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    aria-hidden="true"
    className={cn("size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4", className)}
    data-slot="marker-icon"
    {...props}
  />
)

const MarkerContent = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    className={cn(
      "min-w-0 wrap-break-word group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
      className,
    )}
    data-slot="marker-content"
    {...props}
  />
)

export { Marker, MarkerContent, MarkerIcon, markerVariants }
