import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
} from "@tanstack/react-table"

import { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"
import type {
  DataTableFeatures,
  DataTableOptions,
  DataTableTanStackOptions,
} from "~/src/components/custom/data-table/_types/data-table.types"

export interface SplitDataTableOptionsResult<TData extends RowData> {
  features: DataTableFeatures<TData>
  tableOptions: DataTableTanStackOptions<TData>
}

const DATA_TABLE_FEATURE_KEYS = [
  "emptyMessage",
  "enableSelectionColumn",
  "loading",
  "onRowDensityChange",
  "paginationPageSizeOptions",
  "rowActions",
  "rowDensity",
  "showFooter",
  "showPagination",
  "toolbar",
] as const satisfies readonly (keyof DataTableFeatures<RowData>)[]

/** Peel DataTable UI features off before options reach TanStack Table. */
export function splitDataTableOptions<TData extends RowData>(options?: DataTableOptions<TData>): SplitDataTableOptionsResult<TData> {
  if (options === undefined) {
    return { features: {}, tableOptions: {} }
  }

  const features: DataTableFeatures<TData> = {}
  const tableOptions: DataTableTanStackOptions<TData> = { ...options }

  for (const key of DATA_TABLE_FEATURE_KEYS) {
    if (key in options && options[key] !== undefined) {
      // Feature keys are peeled from the TanStack options bag.
      Object.assign(features, { [key]: options[key] })
      Reflect.deleteProperty(tableOptions, key)
    }
  }

  return { features, tableOptions }
}

export function resolveDataTablePageSizeOptions(paginationPageSizeOptions?: readonly number[]): readonly number[] {
  if (paginationPageSizeOptions === undefined || paginationPageSizeOptions.length === 0) {
    return DATA_TABLE.PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS
  }

  return paginationPageSizeOptions
}

export function getInitialPaginationState<TData extends RowData>(options?: DataTableOptions<TData>): PaginationState {
  return {
    pageIndex: options?.initialState?.pagination?.pageIndex ?? 0,
    pageSize: options?.initialState?.pagination?.pageSize ?? DATA_TABLE.PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS[0],
  }
}

export function getInitialRowSelectionState<TData extends RowData>(options?: DataTableOptions<TData>): RowSelectionState {
  return options?.initialState?.rowSelection ?? {}
}

export function getInitialSortingState<TData extends RowData>(options?: DataTableOptions<TData>): SortingState {
  return options?.initialState?.sorting ?? []
}

export function getDataTableRowId(row: RowData, index: number): string {
  if (typeof row === "object" && row !== null && "id" in row) {
    const id = Reflect.get(row, "id")
    if (typeof id === "string" || typeof id === "number") {
      return String(id)
    }
  }

  return String(index)
}

/**
 * Clamp pageIndex when rowCount shrinks (e.g. filter removes rows).
 * TanStack autoResetPageIndex covers most cases; this is a safety net for controlled state.
 */
export function clampDataTablePaginationState(pagination: PaginationState, rowCount: number): PaginationState {
  const minPageIndex = 0
  const minPageCount = 1

  if (rowCount <= 0) {
    return { pageIndex: minPageIndex, pageSize: pagination.pageSize }
  }

  const pageCount = Math.max(minPageCount, Math.ceil(rowCount / pagination.pageSize))
  const maxPageIndex = pageCount - minPageCount

  if (pagination.pageIndex > maxPageIndex) {
    return { ...pagination, pageIndex: maxPageIndex }
  }

  if (pagination.pageIndex < minPageIndex) {
    return { ...pagination, pageIndex: minPageIndex }
  }

  return pagination
}

export function mergeDataTableOptions<TData extends RowData>(
  options?: DataTableOptions<TData>,
): Omit<TableOptions<TData>, "columns" | "data"> {
  const { tableOptions } = splitDataTableOptions(options)

  return {
    enableMultiRowSelection: true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: getDataTableRowId,
    getSortedRowModel: getSortedRowModel(),
    ...tableOptions,
    // Controlled pagination owns pageIndex — auto-reset fights setPagination and desyncs UI.
    autoResetPageIndex: tableOptions.autoResetPageIndex ?? false,
    initialState: {
      pagination: {
        pageSize: DATA_TABLE.PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS[0],
      },
      ...tableOptions.initialState,
    },
  }
}
