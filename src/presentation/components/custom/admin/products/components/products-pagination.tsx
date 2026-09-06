import type { JSX } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"

import { PAGINATION_FIRST_PAGE } from "~/src/presentation/components/custom/admin/constants/constants"

interface ProductsPaginationProps {
  readonly end: number
  readonly total: number
}

export const ProductsPagination = ({ end, total }: ProductsPaginationProps): JSX.Element => {
  const tCommon = useTranslations("pages.admin")

  const t = useTranslations("pages.admin.products")
  return (
    <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-3">
      <span className="text-xs font-medium text-muted-foreground">
        {t("pagination.info", {
          end,
          start: PAGINATION_FIRST_PAGE,
          total,
        })}
      </span>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="size-8 opacity-50" isDisabled aria-label={tCommon("labels.previousPage")}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="sm" className="size-8 p-0">
          {PAGINATION_FIRST_PAGE}
        </Button>
        <Button variant="ghost" size="icon" className="size-8 opacity-50" isDisabled aria-label={tCommon("labels.nextPage")}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
