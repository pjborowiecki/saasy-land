"use client"
"use no memo"

import type { ReactNode } from "react"

import { cn } from "~/src/utils"

import { TableCell } from "~/src/presentation/components/shadcn/table"

import { useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DataTableRow } from "~/src/presentation/components/custom/data-table/_components/data-table-row"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"
import {
  columnAlignClass,
  columnPinningStyle,
  columnSystemClass,
  isPinnedColumn,
} from "~/src/presentation/components/custom/data-table/_table/data-table-column-style"

export function DataTablePendingRows(): ReactNode {
  const { classNames, loading, pendingRows, table } = useDataTable()

  if (loading === true || pendingRows === undefined || pendingRows <= 0) {
    return undefined
  }

  const columns = table.getVisibleLeafColumns()

  return Array.from({ length: pendingRows }, (_, rowIndex) => (
    <DataTableRow key={`pending-${rowIndex}`}>
      {columns.map((column) => {
        const systemClass = columnSystemClass(column)
        const isSystemColumn = systemClass !== undefined

        return (
          <TableCell
            key={column.id}
            className={cn(
              classNames?.cell,
              isSystemColumn ? undefined : columnAlignClass(column),
              DATA_TABLE.CLASSES.COLUMN_DIVIDER,
              systemClass,
              isPinnedColumn(column) && DATA_TABLE.CLASSES.PINNED_COLUMN,
            )}
            data-system-column={isSystemColumn ? "" : undefined}
            style={columnPinningStyle(column)}
          >
            {isSystemColumn ? undefined : (
              <div className="flex min-h-9 items-center">
                <div className="h-3.5 w-full max-w-48 animate-pulse rounded-md bg-muted/50" />
              </div>
            )}
          </TableCell>
        )
      })}
    </DataTableRow>
  ))
}
