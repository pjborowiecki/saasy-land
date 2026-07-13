import type { CellContext, HeaderContext, Row, RowData, Table } from "@tanstack/react-table"

import { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"

export const DATA_TABLE_SELECT_COLUMN_ID = "select"

export interface DataTableSelectCheckboxProps {
  "aria-label": string
  checked: boolean
  disabled?: boolean
  indeterminate?: boolean
  onCheckedChange: (checked: boolean) => void
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
  return {
    "aria-label": "Select all rows",
    checked: table.getIsAllPageRowsSelected(),
    indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
    onCheckedChange: (checked) => {
      table.toggleAllPageRowsSelected(checked)
    },
  }
}

export function getDataTableSelectCellCheckboxProps<TData extends RowData>(row: Row<TData>): DataTableSelectCheckboxProps {
  const props: DataTableSelectCheckboxProps = {
    "aria-label": "Select row",
    checked: row.getIsSelected(),
    onCheckedChange: (checked) => {
      row.toggleSelected(checked)
    },
  }

  if (!row.getCanSelect()) {
    props.disabled = true
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
  return getDataTableSelectCellCheckboxProps(context.row)
}
