"use client"

import { type ComponentProps, type JSX, useMemo } from "react"

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"

import { cn } from "~/src/lib/utils"

import { Button } from "~/src/components/shadcn/button"

function AlertDialog({ ...props }: Readonly<AlertDialogPrimitive.Root.Props>): JSX.Element {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({ ...props }: Readonly<AlertDialogPrimitive.Trigger.Props>): JSX.Element {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogPortal({ ...props }: Readonly<AlertDialogPrimitive.Portal.Props>): JSX.Element {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

function AlertDialogOverlay({ className, ...props }: Readonly<AlertDialogPrimitive.Backdrop.Props>): JSX.Element {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  size?: "default" | "sm"
}): JSX.Element {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }: ComponentProps<"div">): JSX.Element {
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

function AlertDialogFooter({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogMedia({ className, ...props }: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mb-2 inline-flex size-10 items-center justify-center rounded-lg bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Title>): JSX.Element {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "text-sm font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Description>): JSX.Element {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "text-xs/relaxed text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogAction({ className, ...props }: ComponentProps<typeof Button>): JSX.Element {
  return <Button data-slot="alert-dialog-action" className={cn(className)} {...props} />
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props & Pick<ComponentProps<typeof Button>, "variant" | "size">): JSX.Element {
  const cancelButtonRender = useMemo(() => <Button variant={variant} size={size} />, [size, variant])

  return <AlertDialogPrimitive.Close data-slot="alert-dialog-cancel" className={cn(className)} render={cancelButtonRender} {...props} />
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
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
