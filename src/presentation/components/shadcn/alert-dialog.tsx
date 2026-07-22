"use client"

import type { ComponentProps, ReactNode } from "react"

import {
  Dialog as AlertDialogPrimitive,
  DialogTrigger as AlertDialogTriggerPrimitive,
  Heading,
  ModalOverlay as ModalOverlayPrimitive,
  Modal as ModalPrimitive,
  type DialogTriggerProps as AlertDialogTriggerPrimitiveProps,
  type ModalOverlayProps as ModalOverlayPrimitiveProps,
} from "react-aria-components"

import { cn } from "~/src/presentation/utils"

import { Button } from "~/src/presentation/components/shadcn/button"

function AlertDialogTrigger({ ...props }: Readonly<AlertDialogTriggerPrimitiveProps>) {
  return <AlertDialogTriggerPrimitive data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogOverlay({
  className,
  children,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> & {
  className?: string
  children: ReactNode
}) {
  return (
    <ModalOverlayPrimitive
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 data-entering:animate-in data-entering:fade-in-0 data-exiting:animate-out data-exiting:fade-out-0 supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    >
      {children}
    </ModalOverlayPrimitive>
  )
}

function AlertDialog({
  className,
  size = "default",
  children,
  ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> &
  Pick<ComponentProps<typeof ModalPrimitive>, "isDismissable"> & {
    className?: string
    size?: "default" | "sm"
    children: ReactNode
  }) {
  return (
    <AlertDialogOverlay {...props}>
      <ModalPrimitive
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95 data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm",
          className,
        )}
      >
        <AlertDialogPrimitive data-slot="alert-dialog" role="alertdialog" className="[display:inherit] gap-[inherit] outline-none">
          {children}
        </AlertDialogPrimitive>
      </ModalPrimitive>
    </AlertDialogOverlay>
  )
}

function AlertDialogContent(props: ComponentProps<typeof AlertDialog>) {
  return <AlertDialog {...props} />
}

function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogMedia({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({ className, ...props }: Readonly<Omit<ComponentProps<typeof Heading>, "slot">>) {
  return (
    <Heading
      slot="title"
      data-slot="alert-dialog-title"
      className={cn(
        "cn-font-heading text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({ className, ...props }: Readonly<Omit<ComponentProps<"div">, "slot">>) {
  return (
    <div
      data-slot="alert-dialog-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogAction({ className, ...props }: ComponentProps<typeof Button>) {
  return <Button slot="close" data-slot="alert-dialog-action" className={cn(className)} {...props} />
}

function AlertDialogCancel({ className, variant = "outline", size = "default", ...props }: ComponentProps<typeof Button>) {
  return <Button slot="close" data-slot="alert-dialog-cancel" className={cn(className)} variant={variant} size={size} {...props} />
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
}
