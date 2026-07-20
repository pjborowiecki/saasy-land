"use client"

import type { ComponentProps, CSSProperties, HTMLAttributes, ReactNode } from "react"

import { CheckIcon, SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Autocomplete,
  Collection,
  composeRenderProps,
  Header,
  Input,
  Menu,
  MenuItem,
  MenuSection,
  SearchField,
  Separator,
  useFilter,
  type AutocompleteProps,
  type InputProps,
  type MenuItemProps,
  type MenuProps,
  type MenuSectionProps,
  type SeparatorProps,
} from "react-aria-components"

import { cn } from "~/src/lib/utils"

import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "~/src/components/shadcn/dialog"
import { InputGroup, InputGroupAddon } from "~/src/components/shadcn/input-group"

function Command({
  children,
  className,
  dir,
  filter,
  style,
  ...props
}: Omit<AutocompleteProps, "className" | "filter" | "style"> & {
  className?: string
  dir?: HTMLAttributes<HTMLDivElement>["dir"]
  filter?: AutocompleteProps["filter"]
  style?: CSSProperties
}) {
  const { contains } = useFilter({ sensitivity: "base" })

  return (
    <div
      className={cn("flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground", className)}
      data-slot="command"
      dir={dir}
      style={style}
    >
      <Autocomplete filter={filter ?? contains} {...props}>
        {children}
      </Autocomplete>
    </div>
  )
}

function CommandDialog({
  children,
  className,
  description,
  showCloseButton = false,
  title,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  children: ReactNode
  className?: string
  description?: string
  showCloseButton?: boolean
  title?: string
}) {
  const t = useTranslations("components.shadcn.command")

  return (
    <Dialog className={cn("top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0", className)} showCloseButton={showCloseButton} {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title ?? t("title")}</DialogTitle>
        <DialogDescription>{description ?? t("description")}</DialogDescription>
      </DialogHeader>
      {children}
    </Dialog>
  )
}

function CommandInput({ className, placeholder, ...props }: Readonly<InputProps>) {
  const t = useTranslations("components.shadcn.command")
  const resolvedPlaceholder = placeholder ?? t("search")

  return (
    <SearchField aria-label={resolvedPlaceholder} className="p-1 pb-0" data-slot="command-input-wrapper">
      <InputGroup className="h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!">
        <Input
          className={cn(
            "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-search-cancel-button]:hidden",
            className,
          )}
          data-slot="command-input"
          placeholder={resolvedPlaceholder}
          {...props}
        />
        <InputGroupAddon>
          <SearchIcon className="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </SearchField>
  )
}

function CommandList<T extends object>({ className, ...props }: Readonly<MenuProps<T>>) {
  return (
    <Menu
      className={cn("no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none", className)}
      data-slot="command-list"
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("py-6 text-center text-sm", className)} data-slot="command-empty" {...props} />
}

function CommandGroup<T extends object>({
  children,
  className,
  heading,
  items,
  ...props
}: MenuSectionProps<T> & {
  heading?: string
}) {
  return (
    <MenuSection
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      data-slot="command-group"
      {...props}
    >
      {heading !== undefined && heading !== "" ? <Header cmdk-group-heading="">{heading}</Header> : undefined}
      <Collection {...(items === undefined ? {} : { items })}>{children}</Collection>
    </MenuSection>
  )
}

function CommandSeparator({ className, ...props }: Readonly<SeparatorProps>) {
  return <Separator className={cn("-mx-1 h-px bg-border", className)} data-slot="command-separator" {...props} />
}

function CommandItem<T extends object>({ children, className, textValue, ...props }: Readonly<MenuItemProps<T>>) {
  const resolvedTextValue = textValue ?? (typeof children === "string" ? children : undefined)

  return (
    <MenuItem
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-focused:bg-muted data-focused:text-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-focused:*:[svg]:text-foreground data-selected:*:[svg]:text-foreground",
        className,
      )}
      data-slot="command-item"
      {...(resolvedTextValue === undefined ? {} : { textValue: resolvedTextValue })}
      {...props}
    >
      {composeRenderProps(children, (renderedChildren) => (
        <>
          {renderedChildren}
          <CheckIcon className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
        </>
      ))}
    </MenuItem>
  )
}

function CommandShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-data-focused/command-item:text-foreground group-data-selected/command-item:text-foreground",
        className,
      )}
      data-slot="command-shortcut"
      {...props}
    />
  )
}

export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut }
