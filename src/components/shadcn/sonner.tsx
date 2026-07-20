"use client"

import { useTheme } from "@wrksz/themes/client"
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { CONSTANTS } from "~/src/constants"

const TOASTER_ICONS = {
  error: <OctagonXIcon className="size-4" />,
  info: <InfoIcon className="size-4" />,
  loading: <Loader2Icon className="size-4 animate-spin" />,
  success: <CircleCheckIcon className="size-4" />,
  warning: <TriangleAlertIcon className="size-4" />,
} as const

const TOAST_OPTIONS = {
  classNames: {
    toast: "border-border bg-popover text-popover-foreground",
  },
} as const

function Toaster(props: Readonly<ToasterProps>) {
  const { theme = CONSTANTS.THEME.DEFAULT_THEME } = useTheme()

  return (
    <Sonner
      className="toaster group [--border-radius:var(--radius)] [--normal-bg:var(--popover)] [--normal-border:var(--border)] [--normal-text:var(--popover-foreground)]"
      icons={TOASTER_ICONS}
      theme={theme}
      toastOptions={TOAST_OPTIONS}
      {...props}
    />
  )
}

export { Toaster }
