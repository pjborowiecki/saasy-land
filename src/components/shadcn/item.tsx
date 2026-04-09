import type { ComponentProps, JSX } from "react"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/src/lib/utils"

import { Separator } from "~/src/components/shadcn/separator"

function ItemGroup({ className, ...props }: ComponentProps<"ul">): JSX.Element {
  return (
    <ul
      data-slot="item-group"
      className={cn("group/item-group flex w-full list-none flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2", className)}
      {...props}
    />
  )
}

function ItemSeparator({ className, ...props }: ComponentProps<typeof Separator>): JSX.Element {
  return (
    <li aria-hidden className="list-none">
      <Separator data-slot="item-separator" orientation="horizontal" className={cn("my-2", className)} {...props} />
    </li>
  )
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-lg border text-xs outline-none transition-colors duration-100 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-muted/50",
      },
      size: {
        default: "gap-2.5 px-3 py-2.5",
        sm: "gap-2.5 px-3 py-2.5",
        xs: "gap-2 in-data-[slot=dropdown-menu-content]:p-0 px-2.5 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"li"> & VariantProps<typeof itemVariants>): JSX.Element {
  return useRender({
    defaultTagName: "li",
    props: mergeProps<"li">(
      {
        className: cn(itemVariants({ variant, size, className })),
      },
      props,
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-lg group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>): JSX.Element {
  return <div data-slot="item-media" data-variant={variant} className={cn(itemMediaVariants({ variant, className }))} {...props} />
}

function ItemContent({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="item-content"
      className={cn("flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none", className)}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="item-title"
      className={cn("line-clamp-1 flex w-fit items-center gap-2 font-medium text-xs underline-offset-4", className)}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: ComponentProps<"p">): JSX.Element {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-left font-normal text-muted-foreground text-xs/relaxed group-data-[size=xs]/item:text-xs/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return <div data-slot="item-actions" className={cn("flex items-center gap-2", className)} {...props} />
}

function ItemHeader({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return <div data-slot="item-header" className={cn("flex basis-full items-center justify-between gap-2", className)} {...props} />
}

function ItemFooter({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return <div data-slot="item-footer" className={cn("flex basis-full items-center justify-between gap-2", className)} {...props} />
}

export { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle }
