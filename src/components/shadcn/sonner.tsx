"use client"

import type { JSX } from "react"

import { useTheme } from "@wrksz/themes/client"
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { cssVars } from "~/src/lib/utils"

const TOASTER_ICONS = {
  error: <OctagonXIcon className="size-4" />,
  info: <InfoIcon className="size-4" />,
  loading: <Loader2Icon className="size-4 animate-spin" />,
  success: <CircleCheckIcon className="size-4" />,
  warning: <TriangleAlertIcon className="size-4" />,
} as const

const TOASTER_STYLE = cssVars({
  "--border-radius": "var(--radius)",
  "--normal-bg": "var(--popover)",
  "--normal-border": "var(--border)",
  "--normal-text": "var(--popover-foreground)",
})

const TOAST_OPTIONS = {
  classNames: {
    toast: "cn-toast",
  },
} as const

const Toaster = ({ ...props }: ToasterProps): JSX.Element => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner theme={theme} className="toaster group" icons={TOASTER_ICONS} style={TOASTER_STYLE} toastOptions={TOAST_OPTIONS} {...props} />
  )
}

export { Toaster }
