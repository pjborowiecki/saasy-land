"use client"

import type { ComponentProps } from "react"

import { Loader2Icon } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "~/src/lib/utils"

function Spinner({ "aria-label": ariaLabel, className, ...props }: Readonly<ComponentProps<"svg"> & { "aria-label"?: string }>) {
  const t = useTranslations("components.shadcn.spinner")

  return (
    <output aria-label={ariaLabel ?? t("loading")} className="contents">
      <Loader2Icon aria-hidden data-slot="spinner" className={cn("size-4 animate-spin", className)} {...props} />
    </output>
  )
}

export { Spinner }
