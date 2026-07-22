"use client"

import type { ComponentProps } from "react"

import { useTranslations } from "next-intl"
import {
  Breadcrumb as BreadcrumbPrimitive,
  Breadcrumbs as BreadcrumbsPrimitive,
  composeRenderProps,
  Link as LinkPrimitive,
  type BreadcrumbProps,
  type BreadcrumbsProps,
  type LinkProps,
} from "react-aria-components"

import { cn } from "~/src/presentation/utils"

const BREADCRUMB_CHEVRON_ICON_SRC = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
)}`

const BREADCRUMB_MORE_ICON_SRC = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
)}`

function Breadcrumb({ className, ariaLabel, ...props }: ComponentProps<"nav"> & { ariaLabel?: string }) {
  const t = useTranslations("components.shadcn.breadcrumb")

  return <nav aria-label={ariaLabel ?? t("navLabel")} data-slot="breadcrumb" className={cn(className)} {...props} />
}

function BreadcrumbList<T extends object>({ className, ...props }: Readonly<BreadcrumbsProps<T>>) {
  return (
    <BreadcrumbsPrimitive
      data-slot="breadcrumb-list"
      className={cn("flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, children, separatorClassName, ...props }: BreadcrumbProps & { separatorClassName?: string }) {
  return (
    <BreadcrumbPrimitive data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1", className)} {...props}>
      {composeRenderProps(children, (child, { isCurrent }) => (
        <>
          {child}
          {!isCurrent && (
            <img
              alt=""
              data-slot="breadcrumb-separator"
              className={cn("cn-rtl-flip size-3.5", separatorClassName)}
              src={BREADCRUMB_CHEVRON_ICON_SRC}
            />
          )}
        </>
      ))}
    </BreadcrumbPrimitive>
  )
}

function BreadcrumbLink({ className, render, ...props }: Readonly<LinkProps>) {
  return (
    <LinkPrimitive
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
      {...(render === undefined ? {} : { render })}
    />
  )
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn("font-normal text-foreground", className)} {...props} />
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  const t = useTranslations("components.shadcn.breadcrumb")

  return (
    <span data-slot="breadcrumb-ellipsis" className={cn("flex size-5 items-center justify-center", className)} {...props}>
      <img alt={t("more")} className="size-4" src={BREADCRUMB_MORE_ICON_SRC} />
    </span>
  )
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbEllipsis }
