"use client"

import type { ComponentProps, ReactNode } from "react"

import { XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Dialog as DialogPrimitive,
  DialogTrigger as DialogTriggerPrimitive,
  Heading,
  ModalOverlay as ModalOverlayPrimitive,
  Modal as ModalPrimitive,
  type DialogTriggerProps as DialogTriggerPrimitiveProps,
  type ModalOverlayProps as ModalOverlayPrimitiveProps,
} from "react-aria-components"

import { cn } from "~/src/presentation/utils"

import { Button } from "~/src/presentation/components/shadcn/button"

function DialogTrigger({ ...props }: Readonly<DialogTriggerPrimitiveProps>) {
  return <DialogTriggerPrimitive data-slot="dialog-trigger" {...props} />
}

function DialogClose({ className, size = "default", variant = "outline", ...props }: ComponentProps<typeof Button>) {
  return <Button className={cn(className)} data-slot="dialog-close" size={size} slot="close" variant={variant} {...props} />
}

function DialogOverlay({
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
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 data-entering:animate-in data-entering:fade-in-0 data-exiting:animate-out data-exiting:fade-out-0 supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      data-slot="dialog-overlay"
      {...props}
    >
      {children}
    </ModalOverlayPrimitive>
  )
}

function Dialog({
  children,
  className,
  isDismissable = true,
  showCloseButton = true,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "children" | "className"> &
  Pick<ComponentProps<typeof ModalPrimitive>, "isDismissable"> & {
    children: ReactNode
    className?: string
    showCloseButton?: boolean
  }) {
  const t = useTranslations("components.shadcn.dialog")

  return (
    <DialogOverlay isDismissable={isDismissable} {...props}>
      <ModalPrimitive
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95 sm:max-w-sm",
          className,
        )}
        data-slot="dialog-content"
      >
        <DialogPrimitive className="[display:inherit] gap-[inherit] outline-none" data-slot="dialog">
          {children}
          {showCloseButton ? (
            <DialogClose className="absolute top-2 right-2" size="icon-sm" variant="ghost">
              <XIcon />
              <span className="sr-only">{t("close")}</span>
            </DialogClose>
          ) : undefined}
        </DialogPrimitive>
      </ModalPrimitive>
    </DialogOverlay>
  )
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} data-slot="dialog-header" {...props} />
}

function DialogFooter({
  children,
  className,
  showCloseButton = false,
  ...props
}: ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  const t = useTranslations("components.shadcn.dialog")

  return (
    <div
      className={cn("-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end", className)}
      data-slot="dialog-footer"
      {...props}
    >
      {children}
      {showCloseButton ? <DialogClose variant="outline">{t("close")}</DialogClose> : undefined}
    </div>
  )
}

function DialogTitle({ className, ...props }: Readonly<Omit<ComponentProps<typeof Heading>, "slot">>) {
  return (
    <Heading
      className={cn("cn-font-heading text-base leading-none font-medium", className)}
      data-slot="dialog-title"
      slot="title"
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: Readonly<Omit<ComponentProps<"div">, "slot">>) {
  return (
    <div
      className={cn("text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className)}
      data-slot="dialog-description"
      {...props}
    />
  )
}

export type { DialogProps as DialogPrimitiveProps, DialogTriggerProps as DialogTriggerPrimitiveProps } from "react-aria-components"

export { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger }
