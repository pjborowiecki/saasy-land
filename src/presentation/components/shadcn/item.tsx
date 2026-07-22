"use client"

import type { ComponentProps, HTMLAttributes } from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { Link as LinkPrimitive, type LinkProps } from "react-aria-components"

import { cn } from "~/src/presentation/utils"

import { Separator } from "~/src/presentation/components/shadcn/separator"

function ItemGroup({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn("group/item-group flex w-full list-none flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2", className)}
      data-slot="item-group"
      {...props}
    />
  )
}

function ItemSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return <Separator className={cn("my-2", className)} data-slot="item-separator" orientation="horizontal" {...props} />
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "gap-2.5 px-3 py-2.5",
        sm: "gap-2.5 px-3 py-2.5",
        xs: "gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0",
      },
      variant: {
        default: "border-transparent",
        muted: "border-transparent bg-muted/50",
        outline: "border-border",
      },
    },
  },
)

function Item({
  className,
  size = "default",
  variant = "default",
  ...props
}: Omit<LinkProps, "children"> & HTMLAttributes<HTMLElement> & VariantProps<typeof itemVariants>) {
  const Element = "href" in props ? LinkPrimitive : "div"

  return (
    <Element
      className={cn(itemVariants({ className, size, variant }))}
      data-size={size}
      data-slot="item"
      data-variant={variant}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
      },
    },
  },
)

function ItemMedia({ className, variant = "default", ...props }: ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return <div className={cn(itemMediaVariants({ className, variant }))} data-slot="item-media" data-variant={variant} {...props} />
}

function ItemContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none", className)}
      data-slot="item-content"
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4", className)}
      data-slot="item-title"
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "line-clamp-2 text-left text-sm leading-normal font-normal text-muted-foreground group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className,
      )}
      data-slot="item-description"
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-2", className)} data-slot="item-actions" {...props} />
}

function ItemHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex basis-full items-center justify-between gap-2", className)} data-slot="item-header" {...props} />
}

function ItemFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex basis-full items-center justify-between gap-2", className)} data-slot="item-footer" {...props} />
}

export { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle }
