"use client"

import type { JSX } from "react"

import { flexRender, type Header, type RowData } from "@tanstack/react-table"

import { cn } from "~/src/utils"

import { TableCell } from "~/src/presentation/components/shadcn/table"

import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"
import {
  columnAlignClass,
  columnPinningStyle,
  columnSystemClass,
  isPinnedColumn,
} from "~/src/presentation/components/custom/data-table/_table/data-table-column-style"

export interface DataTableFooterCellProps<TData extends RowData, TValue = unknown> {
  header: Header<TData, TValue>
}

export function DataTableFooterCell<TData extends RowData, TValue = unknown>({
  header,
}: Readonly<DataTableFooterCellProps<TData, TValue>>): JSX.Element {
  return (
    <TableCell
      className={cn(
        columnAlignClass(header.column),
        columnSystemClass(header.column),
        isPinnedColumn(header.column) && DATA_TABLE.CLASSES.PINNED_COLUMN,
      )}
      colSpan={header.colSpan}
      style={columnPinningStyle(header.column)}
    >
      {!header.isPlaceholder && flexRender(header.column.columnDef.footer, header.getContext())}
    </TableCell>
  )
}
