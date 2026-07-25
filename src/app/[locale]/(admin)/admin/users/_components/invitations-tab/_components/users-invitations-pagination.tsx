import type { JSX } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"

import { PAGINATION_FIRST_PAGE, PAGINATION_PAGES } from "~/src/app/[locale]/(admin)/admin/_lib/constants"

export async function UsersInvitationsPagination(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.users")
  return (
    <div className="flex items-center justify-between border-t border-border/40 bg-secondary/10 px-4 py-3">
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
