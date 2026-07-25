"use client"
// TanStack Table mutates options via setOptions each render. React Compiler
// memoization freezes those options so controlled state never reaches the table.
"use no memo"

import { createContext, type JSX, use, useCallback, useMemo, useState } from "react"

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Table,
  type Updater,
} from "@tanstack/react-table"

import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"
import { buildDataTableColumns } from "~/src/presentation/components/custom/data-table/_table/build-data-table-columns"
import { createDataTableGlobalFilterFn } from "~/src/presentation/components/custom/data-table/_table/data-table-global-filter"
import { getDataTableRowId, splitDataTableOptions } from "~/src/presentation/components/custom/data-table/_table/data-table-options"
import { DATA_TABLE_SELECT_COLUMN_ID } from "~/src/presentation/components/custom/data-table/_table/data-table-select-column"
import { DATA_TABLE_ACTIONS_COLUMN_ID } from "~/src/presentation/components/custom/data-table/_table/data-table-system-columns"
import type {
  DataTableContextValue,
  DataTableFeatures,
  DataTableProviderProps,
  DataTableRowDensity,
  DataTableTanStackOptions,
} from "~/src/presentation/components/custom/data-table/_types/data-table.types"

const EMPTY_SEARCH = ""
const DEFAULT_ROW_DENSITY = DATA_TABLE.ROW_DENSITY.DEFAULT

function resolveToolbarFetchPendingRows(
  toolbar: DataTableFeatures<RowData>["toolbar"],
  fetchPending: boolean,
  pendingRows: number | undefined,
): number | undefined {
  const controlledFetchPending = toolbar !== false && toolbar !== undefined && toolbar.fetch?.isFetching === true
  const fetchInFlight = controlledFetchPending || fetchPending
  const fetchPendingRowCount =
    toolbar === false || toolbar === undefined ? undefined : (toolbar.fetch?.pendingRows ?? DATA_TABLE.FETCH_PENDING_ROWS)

  if (fetchInFlight && fetchPendingRowCount !== undefined && fetchPendingRowCount > 0) {
    return fetchPendingRowCount
  }

  return pendingRows
}

const DataTableContext = createContext<DataTableContextValue | undefined>(undefined)

export function useDataTable(): DataTableContextValue {
  const context = use(DataTableContext)
  if (context === undefined) {
    throw new Error("useDataTable must be used within a DataTable.")
  }
  return context
}

function resolveGlobalFilterValue(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback
}

function resolvePinnedColumnIds(options: {
  consumerPinnedLeft: string[]
  consumerPinnedRight: string[]
  enableSelectionColumn: boolean
  hasRowActions: boolean
}): { left: string[]; right: string[] } {
  const defaultPinnedLeft = options.enableSelectionColumn ? [DATA_TABLE_SELECT_COLUMN_ID] : []
  const pinnedLeft = [
    ...defaultPinnedLeft,
    ...options.consumerPinnedLeft.filter((id) => {
      if (id === DATA_TABLE_SELECT_COLUMN_ID) {
        return false
      }
      return true
    }),
  ]

  const defaultPinnedRight = options.hasRowActions ? [DATA_TABLE_ACTIONS_COLUMN_ID] : []
  const pinnedRight = [
    ...options.consumerPinnedRight.filter((id) => {
      if (id === DATA_TABLE_ACTIONS_COLUMN_ID) {
        return false
      }
      return true
    }),
    ...defaultPinnedRight,
  ]

  return { left: pinnedLeft, right: pinnedRight }
}

function assignOptionalContextField<K extends keyof DataTableContextValue>(
  target: DataTableContextValue,
  key: K,
  value: DataTableContextValue[K] | undefined,
): void {
  if (value !== undefined) {
    target[key] = value
  }
}

function useDataTableReactTable<TData extends RowData>(options: {
  columns: DataTableProviderProps<TData>["columns"]
  data: TData[]
  enableSelectionColumn: boolean
  features: DataTableFeatures<TData>
  globalFilter: string
  pagination: PaginationState
  rowActions: DataTableFeatures<TData>["rowActions"]
  rowSelection: RowSelectionState
  setGlobalFilter: (updater: Updater<string>) => void
  setPagination: (updater: Updater<PaginationState>) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  setSorting: (updater: Updater<SortingState>) => void
  sorting: SortingState
  tableOptions: DataTableTanStackOptions<TData>
}): Table<TData> {
  const {
    columns,
    data,
    enableSelectionColumn,
    globalFilter,
    pagination,
    rowActions,
    rowSelection,
    setGlobalFilter,
    setPagination,
    setRowSelection,
    setSorting,
    sorting,
    tableOptions,
  } = options

  const resolvedColumns = useMemo(() => {
    if (!enableSelectionColumn && rowActions === undefined) {
      return buildDataTableColumns(columns)
    }

    if (rowActions === undefined) {
      return buildDataTableColumns(columns, { enableSelectionColumn: true })
    }

    if (!enableSelectionColumn) {
      return buildDataTableColumns(columns, { rowActions })
    }

    return buildDataTableColumns(columns, { enableSelectionColumn: true, rowActions })
  }, [columns, enableSelectionColumn, rowActions])

  const coreRowModel = useMemo(() => getCoreRowModel(), [])
  const filteredRowModel = useMemo(() => getFilteredRowModel(), [])
  const paginationRowModel = useMemo(() => getPaginationRowModel(), [])
  const sortedRowModel = useMemo(() => getSortedRowModel(), [])
  const globalFilterFn = useMemo(() => createDataTableGlobalFilterFn<TData>(), [])

  const resetPageIndex = () => {
    setPagination((current) => (current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }))
  }

  // autoResetPageIndex is off so controlled pageIndex is not fought by TanStack.
  // Reset to page 0 ourselves when sort/filter changes (same UX as TanStack default).
  const handleSortingChange =
    tableOptions.onSortingChange ??
    ((updater) => {
      setSorting(updater)
      resetPageIndex()
    })

  const handleGlobalFilterChange =
    tableOptions.onGlobalFilterChange ??
    ((updater: string | ((previous: string) => string)) => {
      setGlobalFilter((previous) => {
        const next = typeof updater === "function" ? updater(previous) : updater
        return next
      })
      resetPageIndex()
    })

  const { left: pinnedLeft, right: pinnedRight } = resolvePinnedColumnIds({
    consumerPinnedLeft: tableOptions.initialState?.columnPinning?.left ?? [],
    consumerPinnedRight: tableOptions.initialState?.columnPinning?.right ?? [],
    enableSelectionColumn,
    hasRowActions: rowActions !== undefined,
  })

  return useReactTable({
    autoResetPageIndex: false,
    enableColumnPinning: true,
    enableMultiRowSelection: true,
    enableRowSelection: true,
    getCoreRowModel: coreRowModel,
    getFilteredRowModel: filteredRowModel,
    getPaginationRowModel: paginationRowModel,
    getRowId: getDataTableRowId,
    getSortedRowModel: sortedRowModel,
    globalFilterFn,
    ...tableOptions,
    columns: resolvedColumns,
    data,
    initialState: {
      ...tableOptions.initialState,
      columnPinning: {
        ...tableOptions.initialState?.columnPinning,
        left: pinnedLeft,
        right: pinnedRight,
      },
    },
    onGlobalFilterChange: handleGlobalFilterChange,
    onPaginationChange: tableOptions.onPaginationChange ?? setPagination,
    onRowSelectionChange: tableOptions.onRowSelectionChange ?? setRowSelection,
    onSortingChange: handleSortingChange,
    state: {
      ...tableOptions.state,
      globalFilter: resolveGlobalFilterValue(tableOptions.state?.globalFilter, globalFilter),
      pagination: tableOptions.state?.pagination ?? pagination,
      rowSelection: tableOptions.state?.rowSelection ?? rowSelection,
      sorting: tableOptions.state?.sorting ?? sorting,
    },
  })
}

export function DataTableProvider<TData extends RowData>(props: Readonly<DataTableProviderProps<TData>>): JSX.Element {
  const { children, classNames, columns, data, options } = props
  const { features, tableOptions } = splitDataTableOptions(options)

  const {
    emptyMessage,
    enableSelectionColumn = true,
    loading,
    pendingRows,
    onRowDensityChange,
    paginationPageSizeOptions,
    rowActions,
    rowDensity: rowDensityOption,
    showFooter = false,
    showPagination = true,
    toolbar,
  } = features

  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: tableOptions.initialState?.pagination?.pageIndex ?? 0,
    pageSize: tableOptions.initialState?.pagination?.pageSize ?? DATA_TABLE.PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS[0],
  }))
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => tableOptions.initialState?.rowSelection ?? {})
  const [sorting, setSorting] = useState<SortingState>(() => tableOptions.initialState?.sorting ?? [])
  const [globalFilter, setGlobalFilter] = useState<string>(() =>
    resolveGlobalFilterValue(tableOptions.initialState?.globalFilter, EMPTY_SEARCH),
  )
  const [uncontrolledRowDensity, setUncontrolledRowDensity] = useState<DataTableRowDensity>(() => rowDensityOption ?? DEFAULT_ROW_DENSITY)
  const [fetchPending, setFetchPending] = useState(false)

  const isRowDensityControlled = rowDensityOption !== undefined && onRowDensityChange !== undefined
  const rowDensity = isRowDensityControlled ? rowDensityOption : uncontrolledRowDensity

  const resolvedPendingRows = resolveToolbarFetchPendingRows(toolbar, fetchPending, pendingRows)

  const setRowDensity = useCallback(
    (density: DataTableRowDensity) => {
      if (isRowDensityControlled) {
        onRowDensityChange?.(density)
        return
      }
      setUncontrolledRowDensity(density)
      onRowDensityChange?.(density)
    },
    [isRowDensityControlled, onRowDensityChange],
  )

  const table = useDataTableReactTable({
    columns,
    data,
    enableSelectionColumn,
    features,
    globalFilter,
    pagination,
    rowActions,
    rowSelection,
    setGlobalFilter,
    setPagination,
    setRowSelection,
    setSorting,
    sorting,
    tableOptions,
  })

  const tableState = table.getState()
  const resolvedGlobalFilter = resolveGlobalFilterValue(tableState.globalFilter, globalFilter)

  const contextValue = useMemo((): DataTableContextValue => {
    const value: DataTableContextValue = {
      fetchPending,
      globalFilter: resolvedGlobalFilter,
      pagination: tableState.pagination,
      rowDensity,
      rowSelection: tableState.rowSelection,
      setFetchPending,
      setRowDensity,
      showFooter,
      showPagination,
      sorting: tableState.sorting,
      // @ts-expect-error Table<TData> is not assignable to Table<RowData> under exactOptionalPropertyTypes
      table,
    }

    assignOptionalContextField(value, "classNames", classNames)
    assignOptionalContextField(value, "emptyMessage", emptyMessage)
    assignOptionalContextField(value, "loading", loading)
    assignOptionalContextField(value, "pendingRows", resolvedPendingRows)
    assignOptionalContextField(value, "paginationPageSizeOptions", paginationPageSizeOptions)
    assignOptionalContextField(value, "toolbar", toolbar)

    return value
  }, [
    classNames,
    emptyMessage,
    fetchPending,
    loading,
    paginationPageSizeOptions,
    resolvedGlobalFilter,
    resolvedPendingRows,
    rowDensity,
    setRowDensity,
    showFooter,
    showPagination,
    table,
    tableState.pagination,
    tableState.rowSelection,
    tableState.sorting,
    toolbar,
  ])

  return <DataTableContext value={contextValue}>{children}</DataTableContext>
}
