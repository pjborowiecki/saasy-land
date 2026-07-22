"use client"

import type { ReactNode } from "react"

import { useTranslations } from "next-intl"

import { cn } from "~/src/presentation/utils"

import { TableCell } from "~/src/presentation/components/shadcn/table"

import { useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DataTableRow } from "~/src/presentation/components/custom/data-table/_components/data-table-row"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"

export function DataTableLoadingState(): ReactNode {
  const t = useTranslations()
  const { classNames, loading, table } = useDataTable()
  if (loading !== true) {
    return undefined
  }

  const columnCount = table.getAllLeafColumns().length

  return (
    <DataTableRow>
      <TableCell
        className={cn(DATA_TABLE.CLASSES.LOADING, classNames?.loading)}
        colSpan={columnCount}
        data-testid={DATA_TABLE.TEST_IDS.LOADING_STATE}
      >
        {t("components.custom.data-table.loading")}
      </TableCell>
    </DataTableRow>
  )
}
