import type { RowData, Table } from "@tanstack/react-table"

import { DATA_TABLE_SELECT_COLUMN_ID } from "~/src/presentation/components/custom/data-table/_table/data-table-select-column"
import { DATA_TABLE_ACTIONS_COLUMN_ID } from "~/src/presentation/components/custom/data-table/_table/data-table-system-columns"

const CSV_ESCAPE_PATTERN = /[",\n\r]/u
const SYSTEM_COLUMN_IDS = new Set([DATA_TABLE_SELECT_COLUMN_ID, DATA_TABLE_ACTIONS_COLUMN_ID])

function escapeCsvValue(value: string): string {
  if (!CSV_ESCAPE_PATTERN.test(value)) {
    return value
  }

  return `"${value.replaceAll('"', '""')}"`
}

function cellToCsvValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return escapeCsvValue(String(value))
  }

  if (typeof value !== "object" || !value) {
    return ""
  }

  return escapeCsvValue(JSON.stringify(value))
}

/** Build a CSV string from the table's filtered, visible data columns. */
export function buildDataTableCsv<TData extends RowData>(table: Table<TData>): string {
  const columns = table.getVisibleLeafColumns().filter((column) => !SYSTEM_COLUMN_IDS.has(column.id))
  const header = columns.map((column) => {
    const headerValue = column.columnDef.header
    if (typeof headerValue === "string") {
      return escapeCsvValue(headerValue)
    }
    return escapeCsvValue(column.id)
  })

  const rows = table.getFilteredRowModel().rows.map((row) => columns.map((column) => cellToCsvValue(row.getValue(column.id))).join(","))

  return [header.join(","), ...rows].join("\n")
}

export function downloadDataTableCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportDataTableCsv<TData extends RowData>(table: Table<TData>, filename = "export.csv"): string {
  const csv = buildDataTableCsv(table)
  downloadDataTableCsv(csv, filename)
  return csv
}
