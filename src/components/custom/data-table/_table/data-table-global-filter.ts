import type { FilterFn, RowData } from "@tanstack/react-table"

const EMPTY_QUERY_LENGTH = 0

function valueMatchesQuery(value: unknown, query: string): boolean {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).toLowerCase().includes(query)
  }

  return false
}

/**
 * Default global filter: match the query against any string/number/boolean field
 * on the original row (not only visible column values).
 */
export function createDataTableGlobalFilterFn<TData extends RowData>(): FilterFn<TData> {
  return (row, _columnId, filterValue) => {
    const query = typeof filterValue === "string" ? filterValue.trim().toLowerCase() : ""

    if (query.length === EMPTY_QUERY_LENGTH) {
      return true
    }

    const { original } = row

    if (typeof original !== "object" || !original) {
      return false
    }

    return Object.values(original).some((value) => valueMatchesQuery(value, query))
  }
}

export const dataTableGlobalFilterFn = createDataTableGlobalFilterFn()
