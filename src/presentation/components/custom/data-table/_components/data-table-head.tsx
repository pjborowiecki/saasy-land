"use client"
// Header cells (e.g. select-all) must re-read table state when rowSelection / sorting changes.
"use no memo"

import type { JSX, ReactNode } from "react"

import { flexRender, type Header, type RowData } from "@tanstack/react-table"

import { cn } from "~/src/presentation/utils"

import { TableHead } from "~/src/presentation/components/shadcn/table"

import { DataTableColumnHeader } from "~/src/presentation/components/custom/data-table/_components/data-table-column-header"
import { useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"
import {
  columnAlignClass,
  columnPinningStyle,
  columnSystemClass,
  isPinnedColumn,
} from "~/src/presentation/components/custom/data-table/_table/data-table-column-style"

export interface DataTableHeadProps<TData extends RowData, TValue = unknown> {
  header: Header<TData, TValue>
}

export function DataTableHead<TData extends RowData, TValue = unknown>({
  header,
}: Readonly<DataTableHeadProps<TData, TValue>>): JSX.Element {
  const { classNames } = useDataTable()

  const systemClass = columnSystemClass(header.column)
  const isSystemColumn = systemClass !== undefined
  const sorted = header.column.getIsSorted()
  const sortedValue = sorted === false ? undefined : sorted

  return (
    <TableHead
      className={cn(
        DATA_TABLE.CLASSES.LAYOUT.HEAD,
        DATA_TABLE.CLASSES.LAYOUT.HEAD_CONTENT,
        classNames?.head,
        isSystemColumn ? undefined : columnAlignClass(header.column),
        systemClass,
        isPinnedColumn(header.column) && DATA_TABLE.CLASSES.PINNED_HEADER,
      )}
      colSpan={header.colSpan}
      data-sorted={sortedValue}
      data-system-column={isSystemColumn ? "" : undefined}
      style={columnPinningStyle(header.column, "header")}
    >
      <DataTableHeadContent header={header} isSystemColumn={isSystemColumn} />
    </TableHead>
  )
}

function DataTableHeadContent<TData extends RowData, TValue>({
  header,
  isSystemColumn,
}: Readonly<{
  header: Header<TData, TValue>
  isSystemColumn: boolean
}>): ReactNode {
  if (header.isPlaceholder) {
    return undefined
  }

  const content = flexRender(header.column.columnDef.header, header.getContext())

  if (isSystemColumn) {
    return content
  }

  return <DataTableColumnHeader header={header}>{content}</DataTableColumnHeader>
}
