"use client"
"use no memo"

import type { ComponentProps, JSX } from "react"

import type { Column, RowData } from "@tanstack/react-table"

import { cn } from "~/src/utils"

import { Table } from "~/src/presentation/components/shadcn/table"

import { useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"

export type DataTableTableProps = ComponentProps<typeof Table>

function DataTableCol<TData extends RowData>({ column }: Readonly<{ column: Column<TData> }>): JSX.Element {
  // `table-fixed` uses `<col width>` as the primary width signal for every leaf column.
  return <col width={column.getSize()} />
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
