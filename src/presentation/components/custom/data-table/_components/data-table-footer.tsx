"use client"

import type { ComponentProps, ReactNode } from "react"

import { cn } from "~/src/presentation/utils"

import { TableFooter } from "~/src/presentation/components/shadcn/table"

import { DataTableFooterCell } from "~/src/presentation/components/custom/data-table/_components/data-table-footer-cell"
import { useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DataTableRow } from "~/src/presentation/components/custom/data-table/_components/data-table-row"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"

export function DataTableFooter({ className, ...props }: ComponentProps<typeof TableFooter>): ReactNode {
  const { classNames, showFooter, table } = useDataTable()
  if (!showFooter) {
    return undefined
  }

  return (
    <TableFooter className={cn(classNames?.footer, className)} data-testid={DATA_TABLE.TEST_IDS.FOOTER} {...props}>
      {table.getFooterGroups().map((footerGroup) => (
        <DataTableRow key={footerGroup.id}>
          {footerGroup.headers.map((header) => (
            <DataTableFooterCell key={header.id} header={header} />
          ))}
        </DataTableRow>
      ))}
    </TableFooter>
  )
}
