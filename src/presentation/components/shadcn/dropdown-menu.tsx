import type { ComponentProps, ReactNode } from "react"

import { cva } from "class-variance-authority"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import {
  Header as HeaderPrimitive,
  MenuItem as MenuItemPrimitive,
  type MenuItemProps as MenuItemPrimitiveProps,
  Menu as MenuPrimitive,
  type MenuProps,
  MenuSection as MenuSectionPrimitive,
  type MenuSectionProps as MenuSectionPrimitiveProps,
  MenuTrigger as MenuTriggerPrimitive,
  type MenuTriggerProps,
  Popover as PopoverPrimitive,
  type PopoverProps,
  Separator as SeparatorPrimitive,
  type SeparatorProps,
  SubmenuTrigger as SubmenuTriggerPrimitive,
  composeRenderProps,
} from "react-aria-components"

import { cn } from "~/src/lib/cn"

const DROPDOWN_MENU_OFFSET = 4
const DROPDOWN_MENU_CROSS_OFFSET = 0
const DROPDOWN_MENU_SUB_OFFSET = 0
const DROPDOWN_MENU_SUB_CROSS_OFFSET = -3

const DropdownMenuTrigger = ({ ...props }: Readonly<MenuTriggerProps>) => (
  <MenuTriggerPrimitive data-slot="dropdown-menu-trigger" {...props} />
)

const DropdownMenu = ({
  "data-slot": dataSlot = "dropdown-menu-content",
  children,
  className,
  crossOffset = DROPDOWN_MENU_CROSS_OFFSET,
  offset = DROPDOWN_MENU_OFFSET,
  placement = "bottom start",
  ...props
}: Omit<MenuProps<object>, "children" | "className"> &
  Pick<PopoverProps, "crossOffset" | "offset" | "placement"> & {
    "data-slot"?: string
    children?: ReactNode
    className?: string
  }) => (
  <PopoverPrimitive
    className={cn(
      "z-50 w-(--trigger-width) min-w-32 origin-(--trigger-anchor-point) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:overflow-hidden data-exiting:fade-out-0 data-exiting:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 **:data-[slot$=-item]:data-focused:bg-foreground/10",
      className,
    )}
    crossOffset={crossOffset}
    data-slot={dataSlot}
    offset={offset}
    placement={placement}
  >
    <MenuPrimitive className="max-h-[inherit] overflow-x-hidden overflow-y-auto outline-hidden" {...props}>
      {children}
    </MenuPrimitive>
  </PopoverPrimitive>
)

const DropdownMenuGroup = ({ ...props }: Omit<MenuSectionPrimitiveProps<object>, "children"> & { children?: ReactNode }) => (
  <MenuSectionPrimitive data-slot="dropdown-menu-group" {...props} />
)

const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: ComponentProps<typeof HeaderPrimitive> & {
  inset?: boolean
}) => (
  <HeaderPrimitive
    className={cn("px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7", className)}
    data-inset={inset}
    data-slot="dropdown-menu-label"
    {...props}
  />
)

const dropdownMenuItemVariants = cva(
  "group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      selectionMode: {
        multiple:
          "gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4",
        none: "gap-1.5 rounded-md px-1.5 py-1 text-sm focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        single:
          "gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4",
      },
    },
  },
)

const DropdownMenuItem = ({
  children,
  className,
  inset,
  textValue,
  variant = "default",
  ...props
}: MenuItemPrimitiveProps & {
  inset?: boolean
  variant?: "default" | "destructive"
}) => {
  const resolvedTextValue = textValue ?? (typeof children === "string" ? children : undefined)

  return (
    <MenuItemPrimitive
      className={composeRenderProps(className, (itemClassName, { selectionMode }) =>
        cn(dropdownMenuItemVariants({ selectionMode }), itemClassName),
      )}
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      {...(resolvedTextValue === undefined ? {} : { textValue: resolvedTextValue })}
      {...props}
    >
      {composeRenderProps(children, (renderedChildren, { isSelected, selectionMode }) => (
        <>
          {selectionMode === "none" ? undefined : (
            <span
              className="pointer-events-none absolute right-2 flex items-center justify-center"
              data-slot={selectionMode === "single" ? "dropdown-menu-radio-item-indicator" : "dropdown-menu-checkbox-item-indicator"}
            >
              {isSelected ? <CheckIcon /> : undefined}
            </span>
          )}
          {renderedChildren}
        </>
      ))}
    </MenuItemPrimitive>
  )
}

const DropdownMenuSub = ({ ...props }: ComponentProps<typeof SubmenuTriggerPrimitive>) => (
  <SubmenuTriggerPrimitive data-slot="dropdown-menu-sub" {...props} />
)

const DropdownMenuSubTrigger = ({
  children,
  className,
  inset,
  textValue,
  ...props
}: MenuItemPrimitiveProps & {
  inset?: boolean
}) => {
  const resolvedTextValue = textValue ?? (typeof children === "string" ? children : undefined)

  return (
    <MenuItemPrimitive
      className={cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      {...(resolvedTextValue === undefined ? {} : { textValue: resolvedTextValue })}
      {...props}
    >
      {composeRenderProps(children, (renderedChildren) => (
        <>
          {renderedChildren}
          <ChevronRightIcon className="cn-rtl-flip ml-auto" />
        </>
      ))}
    </MenuItemPrimitive>
  )
}

const DropdownMenuSubContent = ({
  className,
  crossOffset = DROPDOWN_MENU_SUB_CROSS_OFFSET,
  offset = DROPDOWN_MENU_SUB_OFFSET,
  placement = "end top",
  ...props
}: ComponentProps<typeof DropdownMenu>) => (
  <DropdownMenu
    className={cn(
      "w-auto min-w-[96px] rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100",
      className,
    )}
    crossOffset={crossOffset}
    data-slot="dropdown-menu-sub-content"
    offset={offset}
    placement={placement}
    {...props}
  />
)

const DropdownMenuSeparator = ({ className, ...props }: Readonly<SeparatorProps>) => (
  <SeparatorPrimitive className={cn("-mx-1 my-1 h-px bg-border", className)} data-slot="dropdown-menu-separator" {...props} />
)

const DropdownMenuShortcut = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    className={cn("ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground", className)}
    data-slot="dropdown-menu-shortcut"
    {...props}
  />
)

export {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
