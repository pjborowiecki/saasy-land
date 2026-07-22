"use client"

import type { ComponentProps, ReactNode } from "react"

import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"
import {
  Button as ButtonPrimitive,
  composeRenderProps,
  Header as HeaderPrimitive,
  ListBoxItem as ListBoxItemPrimitive,
  ListBox as ListBoxPrimitive,
  ListBoxSection as ListBoxSectionPrimitive,
  Popover as PopoverPrimitive,
  SearchField,
  Select as SelectPrimitive,
  SelectValue as SelectValuePrimitive,
  Separator as SeparatorPrimitive,
  type ButtonProps,
  type HeaderProps,
  type ListBoxItemProps,
  type ListBoxProps,
  type ListBoxSectionProps,
  type PopoverProps,
  type SearchFieldProps,
  type SelectProps,
  type SelectValueProps,
  type SeparatorProps,
} from "react-aria-components"

import { cn } from "~/src/presentation/utils"

import { InputGroup, InputGroupAddon, InputGroupInput } from "~/src/presentation/components/shadcn/input-group"

const MULTI_SELECTED_ITEMS_THRESHOLD = 1
const SELECT_POPOVER_CROSS_OFFSET = 0
const SELECT_POPOVER_OFFSET = 4

function Select<T extends object, M extends "single" | "multiple" = "single">({ className, ...props }: Readonly<SelectProps<T, M>>) {
  return <SelectPrimitive className={cn("w-fit", className)} data-slot="select" {...props} />
}

function SelectGroup<T extends object>({ className, ...props }: Readonly<ListBoxSectionProps<T>>) {
  return <ListBoxSectionPrimitive className={cn("scroll-my-1 p-1", className)} data-slot="select-group" {...props} />
}

function SelectValue<T extends object>({ children, className, ...props }: Readonly<SelectValueProps<T>>) {
  return (
    <SelectValuePrimitive
      className={cn("flex flex-1 text-left data-placeholder:text-muted-foreground", className)}
      data-slot="select-value"
      {...props}
    >
      {typeof children === "function"
        ? children
        : ({ defaultChildren, selectedItems, selectedText }) =>
            selectedItems.length > MULTI_SELECTED_ITEMS_THRESHOLD ? selectedText : defaultChildren}
    </SelectValuePrimitive>
  )
}

function SelectTrigger({
  children,
  className,
  size = "default",
  ...props
}: Omit<ButtonProps, "children"> & {
  children?: ReactNode
  size?: "default" | "sm"
}) {
  return (
    <ButtonPrimitive
      className={cn(
        "flex w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-size={size}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
    </ButtonPrimitive>
  )
}

function SelectPopover({
  children,
  className,
  crossOffset = SELECT_POPOVER_CROSS_OFFSET,
  offset = SELECT_POPOVER_OFFSET,
  placement = "bottom start",
  ...props
}: Omit<PopoverProps, "children" | "className"> & {
  children?: ReactNode
  className?: string
}) {
  return (
    <PopoverPrimitive
      className={cn(
        "relative isolate z-50 w-(--trigger-width) min-w-36 origin-(--trigger-anchor-point) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 **:data-[slot$=-item]:data-focused:bg-foreground/10",
        className,
      )}
      crossOffset={crossOffset}
      data-slot="select-content"
      offset={offset}
      placement={placement}
      {...props}
    >
      {children}
    </PopoverPrimitive>
  )
}

function SelectContent({
  children,
  className,
  crossOffset = SELECT_POPOVER_CROSS_OFFSET,
  offset = SELECT_POPOVER_OFFSET,
  placement = "bottom",
  ...props
}: Omit<PopoverProps, "children" | "className"> & {
  children?: ReactNode
  className?: string
}) {
  return (
    <SelectPopover
      crossOffset={crossOffset}
      offset={offset}
      placement={placement}
      {...(className === undefined ? {} : { className })}
      {...props}
    >
      <SelectList>{children}</SelectList>
    </SelectPopover>
  )
}

function SelectList<T extends object>({ className, ...props }: Readonly<ListBoxProps<T>>) {
  return (
    <ListBoxPrimitive
      className={cn("group/select-list max-h-[inherit] overflow-x-hidden overflow-y-auto p-0 outline-hidden", className)}
      data-slot="select-list"
      {...props}
    />
  )
}

function SelectInput({ className, ...props }: Readonly<SearchFieldProps>) {
  return (
    <SearchField className={cn("p-1 pb-0", className)} data-slot="select-input-wrapper" {...props}>
      <InputGroup>
        <InputGroupInput className="[&::-webkit-search-cancel-button]:hidden" data-slot="select-input" />
        <InputGroupAddon>
          <SearchIcon className="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </SearchField>
  )
}

function SelectLabel({ className, ...props }: Readonly<HeaderProps>) {
  return <HeaderPrimitive className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)} data-slot="select-label" {...props} />
}

function SelectItem<T extends object>({ children, className, ...props }: Readonly<ListBoxItemProps<T>>) {
  const textValueProps = typeof children === "string" ? { textValue: children } : {}

  return (
    <ListBoxItemPrimitive
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-focused:bg-accent data-focused:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      data-slot="select-item"
      {...textValueProps}
      {...props}
    >
      {composeRenderProps(children, (renderedChildren, { isSelected }) => (
        <>
          <span className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">{renderedChildren}</span>
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
            {isSelected ? <CheckIcon className="pointer-events-none" /> : undefined}
          </span>
        </>
      ))}
    </ListBoxItemPrimitive>
  )
}

function SelectSeparator({ className, ...props }: Readonly<SeparatorProps>) {
  return (
    <SeparatorPrimitive
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      data-slot="select-separator"
      {...props}
    />
  )
}

function SelectEmpty({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/select-list:flex",
        className,
      )}
      data-slot="select-empty"
      {...props}
    />
  )
}

export type { SelectProps as SelectPrimitiveProps, SelectValueProps } from "react-aria-components"

export {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectInput,
  SelectItem,
  SelectLabel,
  SelectList,
  SelectPopover,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
