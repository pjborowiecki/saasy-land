"use client"
"use no memo"

import type { JSX } from "react"

import { flexRender, type Cell, type Row, type RowData } from "@tanstack/react-table"

import { cn } from "~/src/lib/utils"

import { TableCell } from "~/src/components/shadcn/table"

import { useDataTable } from "~/src/components/custom/data-table/_components/data-table-provider"
import { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"
import {
  columnAlignClass,
  columnCellStyle,
  columnSystemClass,
  isPinnedColumn,
} from "~/src/components/custom/data-table/_table/data-table-column-style"
import { DATA_TABLE_SELECT_COLUMN_ID } from "~/src/components/custom/data-table/_table/data-table-select-column"

export interface DataTableCellProps<TData extends RowData, TValue = unknown> {
  cell: Cell<TData, TValue>
  row: Row<TData>
}

function isDepthIndentCell<TData extends RowData, TValue>(cell: Cell<TData, TValue>, row: Row<TData>): boolean {
  const firstContentCell = row.getVisibleCells().find((visibleCell) => visibleCell.column.id !== DATA_TABLE_SELECT_COLUMN_ID)
  return firstContentCell?.id === cell.id
}

export function DataTableCell<TData extends RowData, TValue = unknown>({
  cell,
  row,
}: Readonly<DataTableCellProps<TData, TValue>>): JSX.Element {
  const { classNames } = useDataTable()

  const systemClass = columnSystemClass(cell.column)
  const isSystemColumn = systemClass !== undefined

  return (
    <TableCell
      className={cn(
        classNames?.cell,
        isSystemColumn ? undefined : columnAlignClass(cell.column),
        DATA_TABLE.CLASSES.COLUMN_DIVIDER,
        systemClass,
        isPinnedColumn(cell.column) && DATA_TABLE.CLASSES.PINNED_COLUMN,
      )}
      data-system-column={isSystemColumn ? "" : undefined}
      style={columnCellStyle(cell.column, row.depth, isDepthIndentCell(cell, row))}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  )
}
