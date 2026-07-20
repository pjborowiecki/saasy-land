"use client"

import type { ComponentProps, ReactNode } from "react"

import { XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Dialog as SheetPrimitive,
  DialogTrigger as SheetTriggerPrimitive,
  Heading,
  ModalOverlay as ModalOverlayPrimitive,
  Modal as ModalPrimitive,
  type DialogTriggerProps as SheetTriggerPrimitiveProps,
  type ModalOverlayProps as ModalOverlayPrimitiveProps,
} from "react-aria-components"

import { cn } from "~/src/lib/utils"

import { Button } from "~/src/components/shadcn/button"

type SheetSide = "bottom" | "left" | "right" | "top"

type SheetProps = Omit<ModalOverlayPrimitiveProps, "children" | "className"> &
  Pick<ComponentProps<typeof ModalPrimitive>, "isDismissable"> & {
    children: ReactNode
    className?: string
    showCloseButton?: boolean
    side?: SheetSide
  }

function SheetTrigger({ ...props }: Readonly<SheetTriggerPrimitiveProps>) {
  return <SheetTriggerPrimitive data-slot="sheet-trigger" {...props} />
}

function SheetClose({ className, size = "default", variant = "outline", ...props }: ComponentProps<typeof Button>) {
  return <Button className={cn(className)} data-slot="sheet-close" size={size} slot="close" variant={variant} {...props} />
}

function SheetOverlay({
  children,
  className,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "children" | "className"> & {
  children: ReactNode
  className?: string
}) {
  return (
    <ModalOverlayPrimitive
      className={cn(
        "fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-entering:opacity-0 data-exiting:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      data-slot="sheet-overlay"
      isDismissable
      {...props}
    >
      {children}
    </ModalOverlayPrimitive>
  )
}

function Sheet({ children, className, isDismissable = true, showCloseButton = true, side = "right", ...props }: SheetProps) {
  const t = useTranslations("components.shadcn.sheet")

  return (
    <SheetOverlay isDismissable={isDismissable} {...props}>
      <ModalPrimitive
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-entering:opacity-0 data-exiting:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-entering:translate-y-10 data-[side=bottom]:data-exiting:translate-y-10 data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-entering:-translate-x-10 data-[side=left]:data-exiting:-translate-x-10 data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-entering:translate-x-10 data-[side=right]:data-exiting:translate-x-10 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-entering:-translate-y-10 data-[side=top]:data-exiting:-translate-y-10 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          className,
        )}
        data-side={side}
        data-slot="sheet-content"
      >
        <SheetPrimitive
          className="[display:inherit] h-full max-h-[inherit] [flex-direction:inherit] gap-[inherit] outline-none"
          data-slot="sheet"
        >
          {children}
          {showCloseButton ? (
            <SheetClose className="absolute top-3 right-3" size="icon-sm" variant="ghost">
              <XIcon />
              <span className="sr-only">{t("close")}</span>
            </SheetClose>
          ) : undefined}
        </SheetPrimitive>
      </ModalPrimitive>
    </SheetOverlay>
  )
}

const SheetContent = Sheet

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-0.5 p-4", className)} data-slot="sheet-header" {...props} />
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} data-slot="sheet-footer" {...props} />
}

function SheetTitle({ className, ...props }: Readonly<Omit<ComponentProps<typeof Heading>, "slot">>) {
  return (
    <Heading
      className={cn("cn-font-heading text-base font-medium text-foreground", className)}
      data-slot="sheet-title"
      slot="title"
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: Readonly<Omit<ComponentProps<"div">, "slot">>) {
  return <div className={cn("text-sm text-muted-foreground", className)} data-slot="sheet-description" {...props} />
}

export type { DialogProps as SheetPrimitiveProps, DialogTriggerProps as SheetTriggerPrimitiveProps } from "react-aria-components"

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetTitle, SheetTrigger }
