import type { JSX } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "~/src/presentation/components/shadcn/button"

import { PAGINATION_FIRST_PAGE, PAGINATION_PAGES } from "~/src/app/[locale]/(admin)/admin/_lib/constants"

export function UsersInvitationsPagination(): JSX.Element {
  const t = useTranslations("pages.admin.users")
  return (
    <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-3">
      <span className="text-xs font-medium text-muted-foreground">
        {t("invitations.pagination.info", {
          end: 5,
          start: 1,
          total: 12,
        })}
      </span>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="size-8 opacity-50" isDisabled aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Button>
        {PAGINATION_PAGES.map((page) => (
          <Button
            key={page}
            variant={page === PAGINATION_FIRST_PAGE ? "outline" : "ghost"}
            size="sm"
            className={`size-8 p-0 ${page === PAGINATION_FIRST_PAGE ? "" : "text-muted-foreground hover:text-foreground"}`}
          >
            {page}
          </Button>
        ))}
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" aria-label="Next page">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
