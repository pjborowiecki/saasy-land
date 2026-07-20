"use client"

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { PanelLeftIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button as ButtonPrimitive, Link as LinkPrimitive, type ButtonProps, type LinkProps } from "react-aria-components"

import { cn } from "~/src/lib/utils"

import { useIsMobile } from "~/src/hooks/use-mobile"

import { Button } from "~/src/components/shadcn/button"
import { Input } from "~/src/components/shadcn/input"
import { Separator } from "~/src/components/shadcn/separator"
import { Sheet, SheetDescription, SheetHeader, SheetTitle } from "~/src/components/shadcn/sheet"
import { Skeleton } from "~/src/components/shadcn/skeleton"
import { Tooltip, TooltipTrigger } from "~/src/components/shadcn/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24
const DAYS_PER_WEEK = 7
const SIDEBAR_COOKIE_MAX_AGE = SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type StyleWithCssVars = CSSProperties & Record<`--${string}`, string>

const SIDEBAR_WRAPPER_STYLE = {
  "--sidebar-width": SIDEBAR_WIDTH,
  "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
} as StyleWithCssVars

const SIDEBAR_MOBILE_STYLE = {
  "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
} as StyleWithCssVars

interface SidebarContextProps {
  isMobile: boolean
  open: boolean
  openMobile: boolean
  setOpen: (open: boolean) => void
  setOpenMobile: (open: boolean) => void
  state: "collapsed" | "expanded"
  toggleSidebar: () => void
}

type SidebarButtonProps = (LinkProps & { href: string }) | (ButtonProps & { href?: never })

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

function useSidebar() {
  const context = use(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function SidebarProvider({
  children,
  className,
  defaultOpen = true,
  onOpenChange: setOpenProp,
  open: openProp,
  style,
  ...props
}: ComponentProps<"div"> & {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = useState(false)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen

  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        setUncontrolledOpen(openState)
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${String(openState)}; path=/; max-age=${String(SIDEBAR_COOKIE_MAX_AGE)}`
    },
    [open, setOpenProp],
  )

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((isOpenMobile) => !isOpenMobile)
      return
    }

    setOpen((isOpen) => !isOpen)
  }, [isMobile, setOpen])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    globalThis.addEventListener("keydown", handleKeyDown)
    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown)
    }
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const contextValue = useMemo<SidebarContextProps>(
    () => ({
      isMobile,
      open,
      openMobile,
      setOpen,
      setOpenMobile,
      state,
      toggleSidebar,
    }),
    [isMobile, open, openMobile, setOpen, state, toggleSidebar],
  )

  const wrapperStyle = useMemo(() => {
    if (style === undefined) {
      return SIDEBAR_WRAPPER_STYLE
    }

    return {
      ...SIDEBAR_WRAPPER_STYLE,
      ...style,
    }
  }, [style])

  return (
    <SidebarContext value={contextValue}>
      <div
        className={cn("group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar", className)}
        data-slot="sidebar-wrapper"
        style={wrapperStyle}
        {...props}
      >
        {children}
      </div>
    </SidebarContext>
  )
}

function Sidebar({
  children,
  className,
  collapsible = "offcanvas",
  side = "left",
  variant = "sidebar",
  ...props
}: ComponentProps<"div"> & {
  collapsible?: "icon" | "none" | "offcanvas"
  side?: "left" | "right"
  variant?: "floating" | "inset" | "sidebar"
}) {
  const { isMobile, openMobile, setOpenMobile, state } = useSidebar()
  const t = useTranslations("components.shadcn.sidebar")

  if (collapsible === "none") {
    return (
      <div
        className={cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className)}
        data-slot="sidebar"
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet
        className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
        isOpen={openMobile}
        onOpenChange={setOpenMobile}
        showCloseButton={false}
        side={side}
        style={SIDEBAR_MOBILE_STYLE}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <div className="flex h-full w-full flex-col">{children}</div>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-side={side}
      data-slot="sidebar"
      data-state={state}
      data-variant={variant}
    >
      <div
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
        data-slot="sidebar-gap"
      />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:-left-(--sidebar-width) data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:-right-(--sidebar-width) md:flex",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        data-side={side}
        data-slot="sidebar-container"
        {...props}
      >
        <div
          className="flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border"
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({ className, onPress, ...props }: ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()
  const t = useTranslations("components.shadcn.sidebar")

  const handlePress = useCallback<NonNullable<ComponentProps<typeof Button>["onPress"]>>(
    (event) => {
      onPress?.(event)
      toggleSidebar()
    },
    [onPress, toggleSidebar],
  )

  return (
    <Button
      className={cn(className)}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      onPress={handlePress}
      size="icon-sm"
      variant="ghost"
      {...props}
    >
      <PanelLeftIcon className="cn-rtl-flip" />
      <span className="sr-only">{t("toggle")}</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }: ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()
  const t = useTranslations("components.shadcn.sidebar")

  return (
    <button
      aria-label={t("toggle")}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      onClick={toggleSidebar}
      tabIndex={-1}
      title={t("toggle")}
      type="button"
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className,
      )}
      data-slot="sidebar-inset"
      {...props}
    />
  )
}

function SidebarInput({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input className={cn("h-8 w-full bg-background shadow-none", className)} data-sidebar="input" data-slot="sidebar-input" {...props} />
  )
}

function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-2", className)} data-sidebar="header" data-slot="sidebar-header" {...props} />
}

function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-2", className)} data-sidebar="footer" data-slot="sidebar-footer" {...props} />
}

function SidebarSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      data-sidebar="separator"
      data-slot="sidebar-separator"
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      data-sidebar="content"
      data-slot="sidebar-content"
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("relative flex w-full min-w-0 flex-col p-2", className)} data-sidebar="group" data-slot="sidebar-group" {...props} />
  )
}

function SidebarGroupLabel({
  className,
  elementType: Element = "div",
  ...props
}: HTMLAttributes<HTMLElement> & { elementType?: ElementType }) {
  return (
    <Element
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      data-sidebar="group-label"
      data-slot="sidebar-group-label"
      {...props}
    />
  )
}

function SidebarGroupAction({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      data-sidebar="group-action"
      data-slot="sidebar-group-action"
      type="button"
      {...props}
    />
  )
}

function SidebarGroupContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("w-full text-sm", className)} data-sidebar="group-content" data-slot="sidebar-group-content" {...props} />
}

function SidebarMenu({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex w-full min-w-0 flex-col gap-0", className)} data-sidebar="menu" data-slot="sidebar-menu" {...props} />
}

function SidebarMenuItem({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("group/menu-item relative", className)} data-sidebar="menu-item" data-slot="sidebar-menu-item" {...props} />
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-expanded:hover:bg-sidebar-accent aria-expanded:hover:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-8 text-sm",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
        sm: "h-7 text-xs",
      },
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
    },
  },
)

function SidebarMenuButton({
  className,
  isActive = false,
  size = "default",
  tooltip,
  variant = "default",
  ...props
}: SidebarButtonProps & {
  isActive?: boolean
  tooltip?: string | ComponentProps<typeof Tooltip>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const { isMobile, state } = useSidebar()
  const buttonClassName = cn(sidebarMenuButtonVariants({ size, variant }), className)

  const button =
    props.href === undefined ? (
      <ButtonPrimitive
        className={buttonClassName}
        data-active={isActive}
        data-sidebar="menu-button"
        data-size={size}
        data-slot="sidebar-menu-button"
        {...props}
      />
    ) : (
      <LinkPrimitive
        className={buttonClassName}
        data-active={isActive}
        data-sidebar="menu-button"
        data-size={size}
        data-slot="sidebar-menu-button"
        {...props}
      />
    )

  if (tooltip === undefined) {
    return button
  }

  if (typeof tooltip === "string") {
    return (
      <TooltipTrigger isDisabled={state !== "collapsed" || isMobile}>
        {button}
        <Tooltip placement="right">{tooltip}</Tooltip>
      </TooltipTrigger>
    )
  }

  return (
    <TooltipTrigger isDisabled={state !== "collapsed" || isMobile}>
      {button}
      <Tooltip placement="right" {...tooltip} />
    </TooltipTrigger>
  )
}

function SidebarMenuAction({
  className,
  showOnHover = false,
  ...props
}: ButtonProps & {
  showOnHover?: boolean
}) {
  return (
    <ButtonPrimitive
      className={cn(
        "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        showOnHover
          ? "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0"
          : undefined,
        className,
      )}
      data-sidebar="menu-action"
      data-slot="sidebar-menu-action"
      {...props}
    />
  )
}

function SidebarMenuBadge({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground",
        className,
      )}
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  return (
    <div
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      data-sidebar="menu-skeleton"
      data-slot="sidebar-menu-skeleton"
      {...props}
    >
      {showIcon ? <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" /> : undefined}
      <Skeleton className="h-4 max-w-[70%] flex-1" data-sidebar="menu-skeleton-text" />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden",
        className,
      )}
      data-sidebar="menu-sub"
      data-slot="sidebar-menu-sub"
      {...props}
    />
  )
}

function SidebarMenuSubItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={cn("group/menu-sub-item relative", className)}
      data-sidebar="menu-sub-item"
      data-slot="sidebar-menu-sub-item"
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  className,
  isActive = false,
  size = "md",
  ...props
}: SidebarButtonProps & {
  isActive?: boolean
  size?: "md" | "sm"
}) {
  const subButtonClassName = cn(
    "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
    className,
  )

  if (props.href === undefined) {
    return (
      <ButtonPrimitive
        className={subButtonClassName}
        data-active={isActive}
        data-sidebar="menu-sub-button"
        data-size={size}
        data-slot="sidebar-menu-sub-button"
        {...props}
      />
    )
  }

  return (
    <LinkPrimitive
      className={subButtonClassName}
      data-active={isActive}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-slot="sidebar-menu-sub-button"
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
