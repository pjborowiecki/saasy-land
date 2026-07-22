"use client"
"use no memo"

import type { ComponentProps, JSX } from "react"

import { cn } from "~/src/utils"

import { TableBody } from "~/src/presentation/components/shadcn/table"

import { useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"

export type DataTableBodyProps = ComponentProps<typeof TableBody>

export function DataTableBody({ className, ...props }: Readonly<DataTableBodyProps>): JSX.Element {
  const { classNames } = useDataTable()

  return (
    <TableBody
      className={cn(DATA_TABLE.CLASSES.LAYOUT.BODY, classNames?.body, className)}
      data-testid={DATA_TABLE.TEST_IDS.BODY}
      {...props}
    />
  )
}
