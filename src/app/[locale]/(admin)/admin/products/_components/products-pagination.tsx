import type { JSX } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"

import { PAGINATION_FIRST_PAGE } from "~/src/app/[locale]/(admin)/admin/_lib/constants"
import { paginationHighlight } from "~/src/app/[locale]/(admin)/admin/_lib/pagination-highlight"

interface ProductsPaginationProps {
  readonly end: number
  readonly total: number
}

export async function ProductsPagination({ end, total }: ProductsPaginationProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.products")
  return (
    <div className="flex items-center justify-between border-t border-border/40 bg-secondary/10 px-4 py-3">
      <span className="text-xs font-medium text-muted-foreground">
        {t.rich("pagination.info", {
          end,
          highlight: paginationHighlight,
          start: PAGINATION_FIRST_PAGE,
          total,
        })}
      </span>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="size-8 opacity-50" isDisabled aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="sm" className="size-8 p-0">
          {PAGINATION_FIRST_PAGE}
        </Button>
        <Button variant="ghost" size="icon" className="size-8 opacity-50" isDisabled aria-label="Next page">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
