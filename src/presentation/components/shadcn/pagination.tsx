import type { ComponentProps } from "react"

import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { cn } from "~/src/lib/cn"

import { LinkButton } from "~/src/presentation/components/shadcn/button"

const Pagination = ({
  ariaLabel,
  className,
  ...props
}: ComponentProps<"nav"> & {
  ariaLabel?: string
}) => {
  const t = useTranslations("components.shadcn.pagination")

  return (
    <nav
      aria-label={ariaLabel ?? t("navLabel")}
      className={cn("mx-auto flex w-full justify-center", className)}
      data-slot="pagination"
      {...props}
    />
  )
}

const PaginationContent = ({ className, ...props }: ComponentProps<"ul">) => (
  <ul className={cn("flex items-center gap-0.5", className)} data-slot="pagination-content" {...props} />
)

const PaginationItem = ({ ...props }: ComponentProps<"li">) => <li data-slot="pagination-item" {...props} />

interface PaginationLinkProps extends Omit<ComponentProps<typeof LinkButton>, "variant"> {
  isActive?: boolean
}

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <LinkButton
    aria-current={isActive === true ? "page" : undefined}
    className={cn(className)}
    data-active={isActive}
    data-slot="pagination-link"
    size={size}
    variant={isActive === true ? "outline" : "ghost"}
    {...props}
  />
)

const PaginationPrevious = ({
  ariaLabel,
  className,
  text,
  ...props
}: ComponentProps<typeof PaginationLink> & {
  ariaLabel?: string
  text?: string
}) => {
  const t = useTranslations("components.shadcn.pagination")

  return (
    <PaginationLink aria-label={ariaLabel ?? t("goToPreviousPage")} className={cn("pl-1.5!", className)} size="default" {...props}>
      <ChevronLeftIcon className="cn-rtl-flip" data-icon="inline-start" />
      <span className="hidden sm:block">{text ?? t("previousPage")}</span>
    </PaginationLink>
  )
}

const PaginationNext = ({
  ariaLabel,
  className,
  text,
  ...props
}: ComponentProps<typeof PaginationLink> & {
  ariaLabel?: string
  text?: string
}) => {
  const t = useTranslations("components.shadcn.pagination")

  return (
    <PaginationLink aria-label={ariaLabel ?? t("goToNextPage")} className={cn("pr-1.5!", className)} size="default" {...props}>
      <span className="hidden sm:block">{text ?? t("nextPage")}</span>
      <ChevronRightIcon className="cn-rtl-flip" data-icon="inline-end" />
    </PaginationLink>
  )
}

const PaginationEllipsis = ({
  className,
  srLabel,
  ...props
}: ComponentProps<"span"> & {
  srLabel?: string
}) => {
  const t = useTranslations("components.shadcn.pagination")

  return (
    <span
      aria-hidden
      className={cn("flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4", className)}
      data-slot="pagination-ellipsis"
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">{srLabel ?? t("morePages")}</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  type PaginationLinkProps,
}
