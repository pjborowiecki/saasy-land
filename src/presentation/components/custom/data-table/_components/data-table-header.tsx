"use client"
"use no memo"

import type { ComponentProps, JSX } from "react"

import { cn } from "~/src/utils"

import { TableHeader } from "~/src/presentation/components/shadcn/table"

import { DataTableHead } from "~/src/presentation/components/custom/data-table/_components/data-table-head"
import { useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DataTableRow } from "~/src/presentation/components/custom/data-table/_components/data-table-row"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"

export function DataTableHeader({ className, ...props }: ComponentProps<typeof TableHeader>): JSX.Element {
  const { classNames, table } = useDataTable()

  return (
    <TableHeader
      className={cn("[&_tr]:border-0", DATA_TABLE.CLASSES.LAYOUT.HEADER, classNames?.header, className)}
      data-testid={DATA_TABLE.TEST_IDS.HEADER}
      {...props}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <DataTableRow key={headerGroup.id} className="border-0 hover:bg-transparent data-[state=selected]:bg-transparent">
          {headerGroup.headers.map((header) => (
            <DataTableHead key={header.id} header={header} />
          ))}
        </DataTableRow>
      ))}
    </TableHeader>
  )
}
