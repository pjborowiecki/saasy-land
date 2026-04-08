import type { ComponentProps, JSX } from "react"

import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { cn } from "~/src/lib/utils"

import { Button } from "~/src/components/shadcn/button"

async function Pagination({ className, ariaLabel, ...props }: ComponentProps<"nav"> & { ariaLabel?: string }): Promise<JSX.Element> {
  const t = await getTranslations("shadcnComponents.pagination")

  return (
    <nav
      aria-label={ariaLabel ?? t("navLabel")}
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: ComponentProps<"ul">): JSX.Element {
  return <ul data-slot="pagination-content" className={cn("flex items-center gap-0.5", className)} {...props} />
}

function PaginationItem({ ...props }: ComponentProps<"li">): JSX.Element {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ComponentProps<typeof Button>, "size"> &
  ComponentProps<"a">

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps): JSX.Element {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(className)}
      nativeButton={false}
      render={<a aria-current={isActive ? "page" : undefined} data-slot="pagination-link" data-active={isActive} {...props} />}
    />
  )
}

async function PaginationPrevious({
  className,
  text,
  ariaLabel,
  ...props
}: ComponentProps<typeof PaginationLink> & { text?: string; ariaLabel?: string }): Promise<JSX.Element> {
  const t = await getTranslations("shadcnComponents.pagination")

  return (
    <PaginationLink aria-label={ariaLabel ?? t("goToPreviousPage")} size="default" className={cn("pl-1.5!", className)} {...props}>
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text ?? t("previousPage")}</span>
    </PaginationLink>
  )
}

async function PaginationNext({
  className,
  text,
  ariaLabel,
  ...props
}: ComponentProps<typeof PaginationLink> & { text?: string; ariaLabel?: string }): Promise<JSX.Element> {
  const t = await getTranslations("shadcnComponents.pagination")

  return (
    <PaginationLink aria-label={ariaLabel ?? t("goToNextPage")} size="default" className={cn("pr-1.5!", className)} {...props}>
      <span className="hidden sm:block">{text ?? t("nextPage")}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  )
}

async function PaginationEllipsis({ className, srLabel, ...props }: ComponentProps<"span"> & { srLabel?: string }): Promise<JSX.Element> {
  const t = await getTranslations("shadcnComponents.pagination")

  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">{srLabel ?? t("morePages")}</span>
    </span>
  )
}

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious }
