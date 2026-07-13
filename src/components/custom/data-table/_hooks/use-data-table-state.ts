"use client"

import { useEffect, useState } from "react"

import type { PaginationState, RowData, RowSelectionState, SortingState, Updater } from "@tanstack/react-table"

import {
  clampDataTablePaginationState,
  getInitialPaginationState,
  getInitialRowSelectionState,
  getInitialSortingState,
} from "~/src/components/custom/data-table/_table/data-table-options"
import type { DataTableOptions } from "~/src/components/custom/data-table/_types/data-table.types"

export interface DataTableInteractiveState {
  onPaginationChange: (updater: Updater<PaginationState>) => void
  onRowSelectionChange: (updater: Updater<RowSelectionState>) => void
  onSortingChange: (updater: Updater<SortingState>) => void
  tableState: {
    pagination: PaginationState
    rowSelection: RowSelectionState
    sorting: SortingState
  }
}

function paginationStatesEqual(a: PaginationState, b: PaginationState): boolean {
  return a.pageIndex === b.pageIndex && a.pageSize === b.pageSize
}

/**
 * Local React state — the TanStack Table recommended controlled pattern.
 * Pass `setPagination` / `setSorting` / `setRowSelection` straight into `useReactTable`.
 */
export function useDataTableInteractiveState<TData extends RowData>(
  options: DataTableOptions<TData> | undefined,
  rowCount: number,
): DataTableInteractiveState {
  const [pagination, setPagination] = useState<PaginationState>(() => getInitialPaginationState(options))
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => getInitialRowSelectionState(options))
  const [sorting, setSorting] = useState<SortingState>(() => getInitialSortingState(options))

  useEffect(() => {
    setPagination((previous) => {
      const next = clampDataTablePaginationState(previous, rowCount)
      return paginationStatesEqual(previous, next) ? previous : next
    })
  }, [rowCount])

  return {
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    tableState: {
      pagination,
      rowSelection,
      sorting,
    },
  }
}
