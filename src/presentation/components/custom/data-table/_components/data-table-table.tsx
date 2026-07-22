"use client"
"use no memo"

import type { ComponentProps, JSX } from "react"

import type { Column, RowData } from "@tanstack/react-table"

import { cn } from "~/src/presentation/utils"

import { Table } from "~/src/presentation/components/shadcn/table"

import { useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"
import { isFixedSizeColumn } from "~/src/presentation/components/custom/data-table/_table/data-table-column-style"

export type DataTableTableProps = ComponentProps<typeof Table>

function DataTableCol<TData extends RowData>({ column }: Readonly<{ column: Column<TData> }>): JSX.Element {
  const size = column.getSize()

  // Fixed gutters lock width via the HTML `width` attribute (avoids inline style objects).
  if (isFixedSizeColumn(column)) {
    return <col width={size} />
  }

  return <col />
}

export function DataTableTable({ className, children, ...props }: Readonly<DataTableTableProps>): JSX.Element {
  const { classNames, rowDensity, table } = useDataTable()
  const leafColumns = table.getVisibleLeafColumns()

  return (
    <Table
      className={cn(DATA_TABLE.CLASSES.LAYOUT.TABLE, DATA_TABLE.CLASSES.DENSITY[rowDensity], classNames?.table, className)}
      containerClassName={DATA_TABLE.CLASSES.LAYOUT.TABLE_CONTAINER}
      data-density={rowDensity}
      data-testid={DATA_TABLE.TEST_IDS.TABLE}
      {...props}
    >
      <colgroup>
        {leafColumns.map((column) => (
          <DataTableCol key={column.id} column={column} />
        ))}
      </colgroup>
      {children}
    </Table>
  )
}
