import type { ComponentProps, JSX } from "react"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { cn } from "~/src/lib/utils"

async function Breadcrumb({ className, ariaLabel, ...props }: ComponentProps<"nav"> & { ariaLabel?: string }): Promise<JSX.Element> {
  const t = await getTranslations("shadcnComponents.breadcrumb")

  return <nav aria-label={ariaLabel ?? t("navLabel")} data-slot="breadcrumb" className={cn(className)} {...props} />
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">): JSX.Element {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn("wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-xs", className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">): JSX.Element {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1", className)} {...props} />
}

function BreadcrumbLink({ className, render, ...props }: useRender.ComponentProps<"a">): JSX.Element {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn("transition-colors hover:text-foreground", className),
      },
      props,
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  })
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">): JSX.Element {
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn("font-normal text-foreground", className)} {...props} />
}

function BreadcrumbSeparator({ children, className, ...props }: ComponentProps<"li">): JSX.Element {
  return (
    <li data-slot="breadcrumb-separator" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...props}>
      {children ?? <ChevronRightIcon />}
    </li>
  )
}

async function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">): Promise<JSX.Element> {
  const t = await getTranslations("shadcnComponents.breadcrumb")

  return (
    <span data-slot="breadcrumb-ellipsis" className={cn("flex size-5 items-center justify-center [&>svg]:size-4", className)} {...props}>
      <MoreHorizontalIcon aria-hidden="true" focusable="false" />
      <span className="sr-only">{t("more")}</span>
    </span>
  )
}

export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator }
