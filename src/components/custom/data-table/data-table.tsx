"use client"

import type { JSX, ReactNode } from "react"

import type { RowData } from "@tanstack/react-table"

import { cn } from "~/src/lib/utils"

import { DataTableBody } from "~/src/components/custom/data-table/_components/data-table-body"
import { DataTableContainer } from "~/src/components/custom/data-table/_components/data-table-container"
import { DataTableContent } from "~/src/components/custom/data-table/_components/data-table-content"
import { DataTableEmptyState } from "~/src/components/custom/data-table/_components/data-table-empty-state"
import { DataTableFooter } from "~/src/components/custom/data-table/_components/data-table-footer"
import { DataTableHeader } from "~/src/components/custom/data-table/_components/data-table-header"
import { DataTableLoadingState } from "~/src/components/custom/data-table/_components/data-table-loading-state"
import { DataTablePagination } from "~/src/components/custom/data-table/_components/data-table-pagination"
import { DataTableProvider, useDataTable } from "~/src/components/custom/data-table/_components/data-table-provider"
import { DataTableTable } from "~/src/components/custom/data-table/_components/data-table-table"
import { DataTableToolbar } from "~/src/components/custom/data-table/_components/data-table-toolbar"
import { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"
import type { DataTableProps } from "~/src/components/custom/data-table/_types/data-table.types"

function DataTableRoot({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  const { classNames } = useDataTable()

  return (
    <div className={cn(DATA_TABLE.CLASSES.LAYOUT.ROOT, classNames?.root)} data-slot="data-table">
      {children}
    </div>
  )
}

function DataTable<TData extends RowData>(props: Readonly<DataTableProps<TData>>): JSX.Element {
  return (
    <DataTableProvider {...props}>
      <DataTableRoot>
        <DataTableToolbar />
        <DataTableContainer>
          <DataTableTable>
            <DataTableHeader />
            <DataTableBody>
              <DataTableContent />
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

DataTable.Body = DataTableBody
DataTable.Container = DataTableContainer
DataTable.Content = DataTableContent
DataTable.EmptyState = DataTableEmptyState
DataTable.Footer = DataTableFooter
DataTable.Header = DataTableHeader
DataTable.Loading = DataTableLoadingState
DataTable.Pagination = DataTablePagination
DataTable.Provider = DataTableProvider
DataTable.Table = DataTableTable
DataTable.Toolbar = DataTableToolbar
DataTable.useTable = useDataTable

export { DataTable }

export { useDataTable } from "~/src/components/custom/data-table/_components/data-table-provider"

export { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"

export {
  DATA_TABLE_SELECT_COLUMN_DEF,
  DATA_TABLE_SELECT_COLUMN_ID,
  getDataTableSelectCellCheckboxProps,
  getDataTableSelectCellCheckboxPropsFromContext,
  getDataTableSelectHeaderCheckboxProps,
  getDataTableSelectHeaderCheckboxPropsFromContext,
} from "~/src/components/custom/data-table/_table/data-table-select-column"
export type { DataTableSelectCheckboxProps } from "~/src/components/custom/data-table/_table/data-table-select-column"

export { buildDataTableColumns } from "~/src/components/custom/data-table/_table/build-data-table-columns"
export {
  createDataTableActionsColumn,
  createDataTableSelectColumn,
  DATA_TABLE_ACTIONS_COLUMN_ID,
  DataTableRowActionsButton,
} from "~/src/components/custom/data-table/_table/data-table-system-columns"
export type { DataTableRowActionsButtonProps } from "~/src/components/custom/data-table/_table/data-table-system-columns"

export type { DataTableBodyProps } from "~/src/components/custom/data-table/_components/data-table-body"
export type { DataTableContainerProps } from "~/src/components/custom/data-table/_components/data-table-container"
export type { DataTableEmptyStateProps } from "~/src/components/custom/data-table/_components/data-table-empty-state"
export type { DataTableTableProps } from "~/src/components/custom/data-table/_components/data-table-table"
export { DATA_TABLE_ROW_DENSITIES } from "~/src/components/custom/data-table/_types/data-table.types"
export type {
  DataTableClassNames,
  DataTableContextValue,
  DataTableExportCsvOptions,
  DataTableFeatures,
  DataTableOptions,
  DataTableProps,
  DataTableProviderProps,
  DataTableRowActionsRenderer,
  DataTableRowDensity,
  DataTableTanStackOptions,
  DataTableToolbarFetchOptions,
  DataTableToolbarOptions,
  DataTableToolbarSearchOptions,
} from "~/src/components/custom/data-table/_types/data-table.types"
export type { DataTableTestId } from "~/src/components/custom/data-table/_constants/data-table.constants"
export type { DataTablePaginationProps } from "~/src/components/custom/data-table/_components/data-table-pagination"
export type { DataTableToolbarProps } from "~/src/components/custom/data-table/_components/data-table-toolbar"
