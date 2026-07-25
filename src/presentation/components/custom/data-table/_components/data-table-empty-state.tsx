"use client"

import type { ComponentProps, ReactNode } from "react"

import { useTranslations } from "next-intl"

import { cn } from "~/src/utils"

import { TableCell } from "~/src/presentation/components/shadcn/table"

import { useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DataTableRow } from "~/src/presentation/components/custom/data-table/_components/data-table-row"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"

export interface DataTableEmptyStateProps extends Omit<ComponentProps<typeof TableCell>, "children"> {
  children?: ReactNode
}

export function DataTableEmptyState({ children, className, colSpan, ...props }: Readonly<DataTableEmptyStateProps>): ReactNode {
  const t = useTranslations()
  const { classNames, emptyMessage, loading, pendingRows, table } = useDataTable()
  const totalRowCount = table.getFilteredRowModel().rows.length
  const columnCount = table.getAllLeafColumns().length
  const content = children ?? emptyMessage ?? t("components.custom.data-table.empty")

  if (loading === true || (pendingRows !== undefined && pendingRows > 0) || totalRowCount > 0) {
    return undefined
  }

  return (
    <DataTableRow>
      <TableCell
        className={cn(DATA_TABLE.CLASSES.EMPTY_CELL, className, classNames?.emptyState)}
        colSpan={colSpan ?? columnCount}
        data-testid={DATA_TABLE.TEST_IDS.EMPTY_STATE}
        {...props}
      >
        {content}
      </TableCell>
    </DataTableRow>
  )
}
