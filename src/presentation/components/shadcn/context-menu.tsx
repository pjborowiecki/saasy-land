"use client"

import {
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react"

import { cva } from "class-variance-authority"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import {
  composeRenderProps,
  Header as HeaderPrimitive,
  MenuItem as MenuItemPrimitive,
  Menu as MenuPrimitive,
  MenuSection as MenuSectionPrimitive,
  MenuTrigger as MenuTriggerPrimitive,
  PopoverContext,
  Popover as PopoverPrimitive,
  Separator as SeparatorPrimitive,
  SubmenuTrigger as SubmenuTriggerPrimitive,
  type MenuItemProps as MenuItemPrimitiveProps,
  type MenuProps,
  type MenuSectionProps as MenuSectionPrimitiveProps,
  type MenuTriggerProps,
  type PopoverProps,
  type SeparatorProps,
} from "react-aria-components"
import { createPortal } from "react-dom"

import { cn } from "~/src/presentation/utils"

const CONTEXT_MENU_OFFSET = 4
const CONTEXT_MENU_CROSS_OFFSET = 0
const CONTEXT_MENU_SUB_OFFSET = 0
const CONTEXT_MENU_SUB_CROSS_OFFSET = -3

interface ContextMenuPosition {
  x: number
  y: number
}

function ContextMenuPopoverProvider({
  children,
  triggerRef,
}: Readonly<{
  children: ReactNode
  triggerRef: RefObject<HTMLDivElement | null>
}>) {
  const ctx = use(PopoverContext)

  const value = useMemo(() => {
    if (typeof ctx !== "object" || !ctx) {
      return { triggerRef }
    }

    return {
      ...ctx,
      triggerRef,
    }
  }, [ctx, triggerRef])

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
}

function ContextMenu({
  "data-slot": dataSlot = "context-menu-content",
  children,
  className,
  crossOffset = CONTEXT_MENU_CROSS_OFFSET,
  offset = CONTEXT_MENU_OFFSET,
  placement = "bottom start",
  ...props
}: Omit<MenuProps<object>, "children" | "className"> &
  Pick<PopoverProps, "crossOffset" | "offset" | "placement"> & {
    "data-slot"?: string
    children?: ReactNode
    className?: string
  }) {
  return (
    <PopoverPrimitive
      className={cn(
        "z-50 w-(--trigger-width) min-w-36 origin-(--trigger-anchor-point) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:overflow-hidden data-exiting:fade-out-0 data-exiting:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 **:data-[slot$=-item]:data-focused:bg-foreground/10",
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
}

function ContextMenuTrigger({
  children,
  className,
  onOpenChange,
  ...props
}: Omit<MenuTriggerProps, "defaultOpen" | "isOpen" | "trigger"> & {
  className?: string
}) {
  const [position, setPosition] = useState<ContextMenuPosition | undefined>()
  const positionRef = useRef<HTMLDivElement | null>(null)

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setPosition(undefined)
        onOpenChange?.(false)
      }
    },
    [onOpenChange],
  )

  const handleContextMenu = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      const wasOpen = position !== undefined
      setPosition({
        x: event.clientX,
        y: event.clientY,
      })
      if (!wasOpen) {
        onOpenChange?.(true)
      }
    },
    [onOpenChange, position],
  )

  const anchorStyle = useMemo((): CSSProperties | undefined => {
    if (position === undefined) {
      return
    }

    return {
      left: position.x,
      position: "fixed",
      top: position.y,
    }
  }, [position])

  return (
    <MenuTriggerPrimitive data-slot="context-menu" isOpen={position !== undefined} onOpenChange={handleOpenChange} {...props}>
      {position === undefined || anchorStyle === undefined
        ? undefined
        : createPortal(<div data-slot="context-menu-anchor" ref={positionRef} style={anchorStyle} />, document.body)}
      <div className={cn("contents select-none", className)} data-slot="context-menu-trigger" onContextMenu={handleContextMenu}>
        <ContextMenuPopoverProvider triggerRef={positionRef}>{children}</ContextMenuPopoverProvider>
      </div>
    </MenuTriggerPrimitive>
  )
}

function ContextMenuGroup({ ...props }: Omit<MenuSectionPrimitiveProps<object>, "children"> & { children?: ReactNode }) {
  return <MenuSectionPrimitive data-slot="context-menu-group" {...props} />
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof HeaderPrimitive> & {
  inset?: boolean
}) {
  return (
    <HeaderPrimitive
      className={cn("px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7", className)}
      data-inset={inset}
      data-slot="context-menu-label"
      {...props}
    />
  )
}

const contextMenuItemVariants = cva(
  "group/context-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      selectionMode: {
        multiple:
          "gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm focus:bg-accent focus:text-accent-foreground data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4",
        none: "gap-1.5 rounded-md px-1.5 py-1 text-sm focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive",
        single:
          "gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm focus:bg-accent focus:text-accent-foreground data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4",
      },
    },
  },
)

function ContextMenuItem({
  children,
  className,
  inset,
  textValue,
  variant = "default",
  ...props
}: MenuItemPrimitiveProps & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  const resolvedTextValue = textValue ?? (typeof children === "string" ? children : undefined)

  return (
    <MenuItemPrimitive
      className={composeRenderProps(className, (itemClassName, { selectionMode }) =>
        cn(contextMenuItemVariants({ selectionMode }), itemClassName),
      )}
      data-inset={inset}
      data-slot="context-menu-item"
      data-variant={variant}
      {...(resolvedTextValue === undefined ? {} : { textValue: resolvedTextValue })}
      {...props}
    >
      {composeRenderProps(children, (renderedChildren, { isSelected, selectionMode }) => (
        <>
          {selectionMode === "none" ? undefined : (
            <span
              className="pointer-events-none absolute right-2"
              data-slot={selectionMode === "single" ? "context-menu-radio-item-indicator" : "context-menu-checkbox-item-indicator"}
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

function ContextMenuSub({ ...props }: ComponentProps<typeof SubmenuTriggerPrimitive>) {
  return <SubmenuTriggerPrimitive data-slot="context-menu-sub" {...props} />
}

function ContextMenuSubTrigger({
  children,
  className,
  inset,
  textValue,
  ...props
}: MenuItemPrimitiveProps & {
  inset?: boolean
}) {
  const resolvedTextValue = textValue ?? (typeof children === "string" ? children : undefined)

  return (
    <MenuItemPrimitive
      className={cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-inset={inset}
      data-slot="context-menu-sub-trigger"
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

function ContextMenuSubContent({
  className,
  crossOffset = CONTEXT_MENU_SUB_CROSS_OFFSET,
  offset = CONTEXT_MENU_SUB_OFFSET,
  placement = "end top",
  ...props
}: ComponentProps<typeof ContextMenu>) {
  return (
    <ContextMenu
      className={cn("w-auto min-w-32 rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg duration-100", className)}
      crossOffset={crossOffset}
      data-slot="context-menu-sub-content"
      offset={offset}
      placement={placement}
      {...props}
    />
  )
}

function ContextMenuSeparator({ className, ...props }: Readonly<SeparatorProps>) {
  return <SeparatorPrimitive className={cn("-mx-1 my-1 h-px bg-border", className)} data-slot="context-menu-separator" {...props} />
}

function ContextMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground",
        className,
      )}
      data-slot="context-menu-shortcut"
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
