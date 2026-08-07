/** The selection surface a row exposes to its checkbox. */
interface SelectableRow {
  toggleSelected: (selected: boolean) => void
}

/** The selection surface a table exposes to its select-all checkbox. */
interface SelectableTable {
  toggleAllPageRowsSelected: (selected: boolean) => void
}

const rowHandlers = new WeakMap<SelectableRow, (selected: boolean) => void>()
const tableHandlers = new WeakMap<SelectableTable, (selected: boolean) => void>()

/**
 * Stable per-instance selection callbacks.
 *
 * Row and table instances are stable in TanStack Table v9, but their methods are
 * `this`-bound prototype APIs that cannot be passed as props by reference, and inline
 * arrows would be recreated on every render. Caching one adapter per instance gives
 * checkbox renderers a referentially stable callback that always acts on live state.
 */
export function toggleRowSelected(row: SelectableRow): (selected: boolean) => void {
  let handler = rowHandlers.get(row)

  if (handler === undefined) {
    handler = (selected) => {
      row.toggleSelected(selected)
    }
    rowHandlers.set(row, handler)
  }

  return handler
}

/** See {@link toggleRowSelected}; the same contract for the header's select-all. */
export function toggleAllPageRowsSelected(table: SelectableTable): (selected: boolean) => void {
  let handler = tableHandlers.get(table)

  if (handler === undefined) {
    handler = (selected) => {
      table.toggleAllPageRowsSelected(selected)
    }
    tableHandlers.set(table, handler)
  }

  return handler
}
