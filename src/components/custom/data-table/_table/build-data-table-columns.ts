import type { ColumnDef, RowData } from "@tanstack/react-table"

import { DATA_TABLE_SELECT_COLUMN_ID } from "~/src/components/custom/data-table/_table/data-table-select-column"
import {
  createDataTableActionsColumn,
  createDataTableSelectColumn,
  DATA_TABLE_ACTIONS_COLUMN_ID,
} from "~/src/components/custom/data-table/_table/data-table-system-columns"
import type { DataTableRowActionsRenderer } from "~/src/components/custom/data-table/_types/data-table.types"

function hasColumnId<TData extends RowData>(columns: ColumnDef<TData>[], columnId: string): boolean {
  return columns.some((column) => column.id === columnId)
}

export interface BuildDataTableColumnsOptions<TData extends RowData> {
  enableSelectionColumn?: boolean
  rowActions?: DataTableRowActionsRenderer<TData>
}

export function buildDataTableColumns<TData extends RowData>(
  columns: ColumnDef<TData>[],
  options?: BuildDataTableColumnsOptions<TData>,
): ColumnDef<TData>[] {
  if (options === undefined) {
    return columns
  }

  let resolvedColumns = columns

  if (options.enableSelectionColumn === true && !hasColumnId(resolvedColumns, DATA_TABLE_SELECT_COLUMN_ID)) {
    resolvedColumns = [createDataTableSelectColumn<TData>(), ...resolvedColumns]
  }

  if (options.rowActions !== undefined && !hasColumnId(resolvedColumns, DATA_TABLE_ACTIONS_COLUMN_ID)) {
    resolvedColumns = [...resolvedColumns, createDataTableActionsColumn<TData>(options.rowActions)]
  }

  return resolvedColumns
}
