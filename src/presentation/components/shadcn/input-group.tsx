"use client"

import type { ComponentProps } from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { Group, type GroupProps } from "react-aria-components"

import { cn } from "~/src/presentation/utils"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Input } from "~/src/presentation/components/shadcn/input"
import { Textarea } from "~/src/presentation/components/shadcn/textarea"

function InputGroup({ className, ...props }: Readonly<GroupProps>) {
  return (
    <Group
      className={cn(
        "group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
        className,
      )}
      data-slot="input-group"
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: {
      align: "inline-start",
    },
    variants: {
      align: {
        "block-end": "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
        "block-start": "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "inline-end": "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "inline-start": "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
      },
    },
  },
)

function InputGroupAddon({
  align = "inline-start",
  className,
  ...props
}: ComponentProps<"fieldset"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <fieldset className={cn(inputGroupAddonVariants({ align }), className)} data-align={align} data-slot="input-group-addon" {...props} />
  )
}

const inputGroupButtonVariants = cva("flex items-center gap-2 text-sm shadow-none", {
  defaultVariants: {
    size: "xs",
  },
  variants: {
    size: {
      "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      "icon-xs": "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
      sm: "",
      xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
    },
  },
})

function InputGroupButton({
  className,
  size = "xs",
  type = "button",
  variant = "ghost",
  ...props
}: Omit<ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "reset" | "submit"
  }) {
  return <Button className={cn(inputGroupButtonVariants({ size }), className)} data-size={size} type={type} variant={variant} {...props} />
}

function InputGroupText({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function InputGroupInput({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className,
      )}
      data-slot="input-group-control"
      {...props}
    />
  )
}

function InputGroupTextarea({ className, ...props }: ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className,
      )}
      data-slot="input-group-control"
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea }
