"use client"
"use no memo"

import { useCallback, type ComponentProps, type JSX } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "~/src/lib/utils"

import { Button } from "~/src/components/shadcn/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"

import { useDataTable } from "~/src/components/custom/data-table/_components/data-table-provider"
import { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"

export interface DataTablePaginationProps extends ComponentProps<"div"> {
  pageSizeOptions?: readonly number[]
}

export function DataTablePagination({ className, pageSizeOptions, ...props }: Readonly<DataTablePaginationProps>): JSX.Element | undefined {
  const t = useTranslations()

  const { classNames, paginationPageSizeOptions, showPagination, table } = useDataTable()

  const resolvedPageSizeOptions = pageSizeOptions ?? paginationPageSizeOptions ?? DATA_TABLE.PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS

  const { pageIndex, pageSize } = table.getState().pagination
  // Subscribe to selection so the footer updates when rows are selected / cleared.
  void table.getState().rowSelection
  const rowCount = table.getFilteredRowModel().rows.length
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const currentPage = pageIndex + DATA_TABLE.PAGINATION.PAGE_INDEX_DISPLAY_OFFSET
  const pageCount = Math.max(DATA_TABLE.PAGINATION.PAGE_INDEX_DISPLAY_OFFSET, table.getPageCount())
  const pageSizeLabel = t("components.custom.data-table.pagination.rowsPerPage")

  const handlePageSizeChange = useCallback(
    (value: string | null) => {
      if (typeof value !== "string") {
        return
      }
      table.setPageSize(Number(value))
    },
    [table],
  )

  const goToPreviousPage = useCallback(() => {
    table.previousPage()
  }, [table])

  const goToNextPage = useCallback(() => {
    table.nextPage()
  }, [table])

  if (!showPagination) {
    return undefined
  }

  return (
    <div
      {...props}
      className={cn("flex items-center justify-between gap-4", DATA_TABLE.CLASSES.LAYOUT.PAGINATION, classNames?.pagination, className)}
      data-testid={DATA_TABLE.TEST_IDS.PAGINATION}
    >
      <div className="text-xs text-muted-foreground" data-testid={DATA_TABLE.TEST_IDS.PAGINATION_ROW_COUNT}>
        {t("components.custom.data-table.pagination.rowCount", { count: rowCount })}
        {selectedCount > 0 ? (
          <>
            <span aria-hidden="true"> · </span>
            {t("components.custom.data-table.pagination.selectedCount", { selected: selectedCount })}
          </>
        ) : undefined}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{pageSizeLabel}</span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger
              aria-label={pageSizeLabel}
              className="h-8 min-w-16 gap-1.5 rounded-lg px-2.5 text-xs"
              data-testid={DATA_TABLE.TEST_IDS.PAGINATION_PAGE_SIZE}
              size="sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {resolvedPageSizeOptions.map((size) => (
                <SelectItem key={size} className="text-xs" value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs font-medium" data-testid={DATA_TABLE.TEST_IDS.PAGINATION_PAGE_INDICATOR}>
          {t("components.custom.data-table.pagination.pageIndicator", { current: currentPage, total: pageCount })}
        </div>

        <div className="flex items-center gap-1">
          <Button
            aria-label={t("components.shadcn.pagination.goToPreviousPage")}
            className="size-8"
            data-testid={DATA_TABLE.TEST_IDS.PAGINATION_PREVIOUS}
            disabled={!table.getCanPreviousPage()}
            onClick={goToPreviousPage}
            size="icon"
            variant="outline"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            aria-label={t("components.shadcn.pagination.goToNextPage")}
            className="size-8"
            data-testid={DATA_TABLE.TEST_IDS.PAGINATION_NEXT}
            disabled={!table.getCanNextPage()}
            onClick={goToNextPage}
            size="icon"
            variant="outline"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
