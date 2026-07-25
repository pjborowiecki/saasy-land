"use client"

import type { JSX, ReactNode } from "react"

import type { RowData } from "@tanstack/react-table"

import { cn } from "~/src/utils"

import { DataTableBody } from "~/src/presentation/components/custom/data-table/_components/data-table-body"
import { DataTableContainer } from "~/src/presentation/components/custom/data-table/_components/data-table-container"
import { DataTableContent } from "~/src/presentation/components/custom/data-table/_components/data-table-content"
import { DataTableEmptyState } from "~/src/presentation/components/custom/data-table/_components/data-table-empty-state"
import { DataTableFooter } from "~/src/presentation/components/custom/data-table/_components/data-table-footer"
import { DataTableHeader } from "~/src/presentation/components/custom/data-table/_components/data-table-header"
import { DataTableLoadingState } from "~/src/presentation/components/custom/data-table/_components/data-table-loading-state"
import { DataTablePagination } from "~/src/presentation/components/custom/data-table/_components/data-table-pagination"
import { DataTablePendingRows } from "~/src/presentation/components/custom/data-table/_components/data-table-pending-rows"
import { DataTableProvider, useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DataTableTable } from "~/src/presentation/components/custom/data-table/_components/data-table-table"
import { DataTableToolbar } from "~/src/presentation/components/custom/data-table/_components/data-table-toolbar"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"
import { DataTableRowActionsButton } from "~/src/presentation/components/custom/data-table/_table/data-table-system-columns"
import type { DataTableProps } from "~/src/presentation/components/custom/data-table/_types/data-table.types"

function DataTableRoot({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  const { classNames } = useDataTable()

  return (
    <div className={cn(DATA_TABLE.CLASSES.LAYOUT.ROOT, classNames?.root)} data-slot="data-table">
      {children}
    </div>
  )
}

function DataTableComponent<TData extends RowData>(props: Readonly<DataTableProps<TData>>): JSX.Element {
  return (
    <DataTableProvider {...props}>
      <DataTableRoot>
        <DataTableToolbar />
        <DataTableContainer>
          <DataTableTable>
            <DataTableHeader />
            <DataTableBody>
              <DataTableContent />
              <DataTablePendingRows />
              <DataTableEmptyState />
              <DataTableLoadingState />
            </DataTableBody>
            <DataTableFooter />
          </DataTableTable>
        </DataTableContainer>
        <DataTablePagination />
      </DataTableRoot>
    </DataTableProvider>
  )
}

export const DataTable = Object.assign(DataTableComponent, {
  RowActionsButton: DataTableRowActionsButton,
})

export type {
  DataTableOptions,
  DataTableProps,
  DataTableRowActionsRenderer,
} from "~/src/presentation/components/custom/data-table/_types/data-table.types"
