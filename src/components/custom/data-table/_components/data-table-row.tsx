"use client"
"use no memo"

import type { ComponentProps, JSX } from "react"

import type { Row, RowData } from "@tanstack/react-table"

import { cn } from "~/src/lib/utils"

import { TableRow } from "~/src/components/shadcn/table"

import { useDataTable } from "~/src/components/custom/data-table/_components/data-table-provider"

export interface DataTableRowProps<TData extends RowData> extends ComponentProps<typeof TableRow> {
  row?: Row<TData>
}

export function DataTableRow<TData extends RowData>({ className, row, ...props }: Readonly<DataTableRowProps<TData>>): JSX.Element {
  const { classNames } = useDataTable()

  return (
    <TableRow
      // Distinct from header `bg-muted` so a selected first row doesn’t fuse with the header band.
      className={cn("data-[state=selected]:bg-secondary/40", classNames?.row, className)}
      data-state={row?.getIsSelected() === true ? "selected" : undefined}
      {...props}
    />
  )
}
