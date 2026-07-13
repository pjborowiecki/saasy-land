import type { CSSProperties } from "react"

import type { Column, RowData } from "@tanstack/react-table"

import { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"
import { DATA_TABLE_SELECT_COLUMN_ID } from "~/src/components/custom/data-table/_table/data-table-select-column"
import { DATA_TABLE_ACTIONS_COLUMN_ID } from "~/src/components/custom/data-table/_table/data-table-system-columns"

export type DataTableColumnStyleRole = "cell" | "header"

export function columnAlignClass<TData extends RowData>(column: Column<TData>): string {
  const align = column.columnDef.meta?.align

  if (align === "center") {
    return DATA_TABLE.CLASSES.ALIGN.CENTER
  }

  if (align === "right") {
    return DATA_TABLE.CLASSES.ALIGN.RIGHT
  }

  return DATA_TABLE.CLASSES.ALIGN.LEFT
}

export function columnSystemClass<TData extends RowData>(column: Column<TData>): string | undefined {
  if (column.id === DATA_TABLE_SELECT_COLUMN_ID) {
    return DATA_TABLE.CLASSES.SELECT_COLUMN
  }

  if (column.id === DATA_TABLE_ACTIONS_COLUMN_ID) {
    return DATA_TABLE.CLASSES.ACTIONS_COLUMN
  }

  return undefined
}

/** True when the column was defined with a locked width (size === minSize === maxSize). */
export function isFixedSizeColumn<TData extends RowData>(column: Column<TData>): boolean {
  const { maxSize, minSize, size } = column.columnDef
  return size !== undefined && size === minSize && size === maxSize
}

function pinnedZIndex(pinned: "left" | "right", role: DataTableColumnStyleRole): number {
  if (role === "header") {
    return pinned === "left" ? DATA_TABLE.COLUMN.PINNED_HEADER_Z_INDEX_LEFT : DATA_TABLE.COLUMN.PINNED_HEADER_Z_INDEX_RIGHT
  }

  return pinned === "left" ? DATA_TABLE.COLUMN.PINNED_Z_INDEX_LEFT : DATA_TABLE.COLUMN.PINNED_Z_INDEX_RIGHT
}

function columnWidthStyle<TData extends RowData>(column: Column<TData>): CSSProperties {
  const size = column.getSize()

  // Locked gutters (select / actions): hard-cap so `table-fixed` leftovers never stretch them.
  if (isFixedSizeColumn(column)) {
    return { boxSizing: "border-box", maxWidth: size, minWidth: size, width: size }
  }

  // Flexible content columns absorb remaining width; minWidth keeps paging stable enough.
  return { minWidth: size }
}

export function columnPinningStyle<TData extends RowData>(column: Column<TData>, role: DataTableColumnStyleRole = "cell"): CSSProperties {
  const pinned = column.getIsPinned()
  const widthStyle = columnWidthStyle(column)

  if (pinned === false) {
    return widthStyle
  }

  return {
    ...widthStyle,
    left: pinned === "left" ? `${column.getStart("left")}px` : undefined,
    position: "sticky",
    right: pinned === "right" ? `${column.getAfter("right")}px` : undefined,
    zIndex: pinnedZIndex(pinned, role),
  }
}

export function columnCellStyle<TData extends RowData>(column: Column<TData>, depth: number, isFirstCell: boolean): CSSProperties {
  const paddingLeft = isFirstCell && depth > 0 ? `${depth * DATA_TABLE.COLUMN.ROW_DEPTH_INDENT_REM}rem` : undefined

  return {
    ...columnPinningStyle(column, "cell"),
    paddingLeft,
  }
}

export function isPinnedColumn<TData extends RowData>(column: Column<TData>): boolean {
  return column.getIsPinned() !== false
}
