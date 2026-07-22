"use client"

import type { ComponentProps } from "react"

import {
  DialogTrigger,
  Heading,
  Popover as PopoverPrimitive,
  type DialogTriggerProps,
  type PopoverProps as PopoverPrimitiveProps,
} from "react-aria-components"

import { cn } from "~/src/presentation/utils"

const POPOVER_OFFSET = 4
const POPOVER_CROSS_OFFSET = 0

function PopoverTrigger({ children, ...props }: Readonly<DialogTriggerProps>) {
  return (
    <DialogTrigger data-slot="popover-trigger" {...props}>
      {children}
    </DialogTrigger>
  )
}

function Popover({
  className,
  crossOffset = POPOVER_CROSS_OFFSET,
  offset = POPOVER_OFFSET,
  placement = "bottom",
  ...props
}: Omit<PopoverPrimitiveProps, "className"> & {
  className?: string
}) {
  return (
    <PopoverPrimitive
      className={cn(
        "z-50 flex w-72 origin-(--trigger-anchor-point) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
        className,
      )}
      crossOffset={crossOffset}
      data-slot="popover-content"
      offset={offset}
      placement={placement}
      {...props}
    />
  )
}

function PopoverHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-0.5 text-sm", className)} data-slot="popover-header" {...props} />
}

function PopoverTitle({ className, ...props }: ComponentProps<typeof Heading>) {
  return <Heading className={cn("font-medium", className)} data-slot="popover-title" {...props} />
}

function PopoverDescription({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("text-muted-foreground", className)} data-slot="popover-description" {...props} />
}

export { Popover, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger }
