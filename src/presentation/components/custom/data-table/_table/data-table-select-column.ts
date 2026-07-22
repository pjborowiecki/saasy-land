import type { CellContext, HeaderContext, Row, RowData, Table } from "@tanstack/react-table"

import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"

export const DATA_TABLE_SELECT_COLUMN_ID = "select"

export interface DataTableSelectCheckboxProps {
  "aria-label": string
  isDisabled?: boolean
  isIndeterminate?: boolean
  isSelected: boolean
  onChange: (isSelected: boolean) => void
}

/** Shared column options for TanStack row-selection checkboxes. */
export const DATA_TABLE_SELECT_COLUMN_DEF = {
  enableHiding: false,
  enablePinning: true,
  enableResizing: false,
  enableSorting: false,
  id: DATA_TABLE_SELECT_COLUMN_ID,
  maxSize: DATA_TABLE.COLUMN.SELECT_SIZE,
  meta: { align: "center" as const },
  minSize: DATA_TABLE.COLUMN.SELECT_SIZE,
  size: DATA_TABLE.COLUMN.SELECT_SIZE,
}

export function getDataTableSelectHeaderCheckboxProps<TData extends RowData>(table: Table<TData>): DataTableSelectCheckboxProps {
  // Read selection state directly so React Compiler tracks it as a render dependency.
  const { rowSelection } = table.getState()
  const selectablePageRowIds = table
    .getRowModel()
    .rows.filter((row) => row.getCanSelect())
    .map((row) => row.id)
  const selectedOnPageCount = selectablePageRowIds.filter((id) => rowSelection[id] === true).length
  const selectableOnPageCount = selectablePageRowIds.length

  return {
    "aria-label": "Select all rows",
    isIndeterminate: selectedOnPageCount > 0 && selectedOnPageCount < selectableOnPageCount,
    isSelected: selectableOnPageCount > 0 && selectedOnPageCount === selectableOnPageCount,
    onChange: (isSelected) => {
      table.toggleAllPageRowsSelected(isSelected)
    },
  }
}

export function getDataTableSelectCellCheckboxProps<TData extends RowData>(
  row: Row<TData>,
  rowSelection: Readonly<Record<string, boolean>>,
): DataTableSelectCheckboxProps {
  const props: DataTableSelectCheckboxProps = {
    "aria-label": "Select row",
    // Derive from `rowSelection` so React Compiler tracks selection as a render dependency.
    isSelected: rowSelection[row.id] === true,
    onChange: (isSelected) => {
      row.toggleSelected(isSelected)
    },
  }

  if (!row.getCanSelect()) {
    props.isDisabled = true
  }

  return props
}

export function getDataTableSelectHeaderCheckboxPropsFromContext<TData extends RowData>(
  context: HeaderContext<TData, unknown>,
): DataTableSelectCheckboxProps {
  return getDataTableSelectHeaderCheckboxProps(context.table)
}

export function getDataTableSelectCellCheckboxPropsFromContext<TData extends RowData>(
  context: CellContext<TData, unknown>,
): DataTableSelectCheckboxProps {
  const { rowSelection } = context.table.getState()
  return getDataTableSelectCellCheckboxProps(context.row, rowSelection)
}
