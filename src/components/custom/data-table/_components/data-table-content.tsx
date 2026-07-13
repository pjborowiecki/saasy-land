"use client"
// Row model reads must re-run when table state changes; React Compiler can skip that.
"use no memo"

import type { ReactNode } from "react"

import { DataTableCell } from "~/src/components/custom/data-table/_components/data-table-cell"
import { useDataTable } from "~/src/components/custom/data-table/_components/data-table-provider"
import { DataTableRow } from "~/src/components/custom/data-table/_components/data-table-row"

export function DataTableContent(): ReactNode {
  const { loading, table } = useDataTable()
  if (loading === true) {
    return undefined
  }

  const { rows } = table.getRowModel()

  return rows.map((row) => (
    <DataTableRow key={row.id} row={row}>
      {row.getVisibleCells().map((cell) => (
        <DataTableCell key={cell.id} cell={cell} row={row} />
      ))}
    </DataTableRow>
  ))
}
