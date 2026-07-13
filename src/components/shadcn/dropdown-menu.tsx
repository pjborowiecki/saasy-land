"use client"

import { createContext, use, type ComponentProps, type JSX } from "react"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "~/src/lib/utils"

type DropdownMenuSize = "default" | "sm"

const DropdownMenuSizeContext = createContext<DropdownMenuSize>("default")

function useDropdownMenuSize(size?: DropdownMenuSize): DropdownMenuSize {
  const contextSize = use(DropdownMenuSizeContext)
  return size ?? contextSize
}

const dropdownMenuItemSizeClassName =
  "data-[size=default]:px-3 data-[size=default]:py-2.5 data-[size=default]:text-sm data-[size=sm]:px-2 data-[size=sm]:py-2 data-[size=sm]:text-xs"

function DropdownMenu({ ...props }: Readonly<MenuPrimitive.Root.Props>): JSX.Element {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: Readonly<MenuPrimitive.Portal.Props>): JSX.Element {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: Readonly<MenuPrimitive.Trigger.Props>): JSX.Element {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  size = "default",
  className,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    size?: DropdownMenuSize
  }): JSX.Element {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          data-size={size}
          className={cn(
            "z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          <DropdownMenuSizeContext value={size}>{children}</DropdownMenuSizeContext>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: Readonly<MenuPrimitive.Group.Props>): JSX.Element {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  size: sizeProp,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
  size?: DropdownMenuSize
}): JSX.Element {
  const size = useDropdownMenuSize(sizeProp)

  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      data-size={size}
      className={cn(
        "text-muted-foreground data-inset:pl-7 data-[size=default]:px-3 data-[size=default]:py-2.5 data-[size=default]:text-sm data-[size=sm]:px-2 data-[size=sm]:py-2 data-[size=sm]:text-xs",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  size: sizeProp,
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  size?: DropdownMenuSize
  variant?: "default" | "destructive"
}): JSX.Element {
  const size = useDropdownMenuSize(sizeProp)

  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-size={size}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-lg outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        dropdownMenuItemSizeClassName,
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: Readonly<MenuPrimitive.SubmenuRoot.Props>): JSX.Element {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  size: sizeProp,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
  size?: DropdownMenuSize
}): JSX.Element {
  const size = useDropdownMenuSize(sizeProp)

  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      data-size={size}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-lg outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        dropdownMenuItemSizeClassName,
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: ComponentProps<typeof DropdownMenuContent>): JSX.Element {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "w-auto min-w-[96px] rounded-lg bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className,
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  size: sizeProp,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
  size?: DropdownMenuSize
}): JSX.Element {
  const size = useDropdownMenuSize(sizeProp)

  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      data-size={size}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-lg outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-[size=default]:py-2.5 data-[size=default]:pr-8 data-[size=default]:pl-3 data-[size=default]:text-sm data-[size=sm]:py-2 data-[size=sm]:pr-8 data-[size=sm]:pl-2 data-[size=sm]:text-xs data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: Readonly<MenuPrimitive.RadioGroup.Props>): JSX.Element {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  size: sizeProp,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
  size?: DropdownMenuSize
}): JSX.Element {
  const size = useDropdownMenuSize(sizeProp)

  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      data-size={size}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-lg outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-[size=default]:py-2.5 data-[size=default]:pr-8 data-[size=default]:pl-3 data-[size=default]:text-sm data-[size=sm]:py-2 data-[size=sm]:pr-8 data-[size=sm]:pl-2 data-[size=sm]:text-xs data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({ className, ...props }: Readonly<MenuPrimitive.Separator.Props>): JSX.Element {
  return <MenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("-mx-1 h-px bg-border", className)} {...props} />
}

function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">): JSX.Element {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className,
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
