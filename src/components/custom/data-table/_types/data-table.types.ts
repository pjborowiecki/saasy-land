import type { ReactNode } from "react"

import type {
  CellContext,
  ColumnDef,
  PaginationState,
  RowData,
  RowSelectionState,
  SortingState,
  Table,
  TableOptions,
} from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "center" | "left" | "right"
    filterVariant?: "range" | "select" | "text"
    getFilterRowValue?: (row: TData) => TValue
  }

  interface TableMeta<TData extends RowData> {
    updateData?: <K extends keyof TData & string>(columnId: K, rowIndex: number, value: TData[K]) => void
  }
}

/** Renderer for the built-in row actions column cell. */
export type DataTableRowActionsRenderer<TData extends RowData> = (context: CellContext<TData, unknown>) => ReactNode

export const DATA_TABLE_ROW_DENSITIES = ["compact", "default", "comfortable"] as const

/** Vertical padding density for table rows / headers. */
export type DataTableRowDensity = (typeof DATA_TABLE_ROW_DENSITIES)[number]

/**
 * Optional overrides for the built-in toolbar search.
 * Defaults (placeholder, aria-label, globalFilter wiring) live inside DataTable.
 */
export interface DataTableToolbarSearchOptions {
  /** Defaults to the built-in i18n search placeholder. */
  "aria-label"?: string
  /** Called after the table updates its internal global filter. */
  onValueChange?: (value: string) => void
  /** Defaults to the built-in i18n search placeholder. */
  placeholder?: string
  /** Controlled override. Prefer leaving unset so the table owns search state. */
  value?: string
}

export interface DataTableExportCsvOptions {
  filename?: string
  label?: string
  /** Override the default file download. Receives the generated CSV string. */
  onExport?: (csv: string) => void
}

/**
 * Built-in Fetch / Refetch control.
 *
 * - Never fetched, or filters/conditions changed since last fetch → **Fetch**
 * - Fetched and conditions unchanged → **Refetch**
 */
export interface DataTableToolbarFetchOptions {
  /** Override the "Fetch" label. */
  fetchLabel?: string
  /** True after at least one successful load. */
  hasFetched?: boolean
  /**
   * True when filters / query conditions changed since the last fetch.
   * Forces the Fetch label (new query) even when `hasFetched` is true.
   */
  isDirty?: boolean
  /** Disable the control while a request is in flight. */
  isFetching?: boolean
  /** Called when the user clicks Fetch / Refetch. */
  onFetch: () => void | Promise<void>
  /** Override the "Refetch" label. */
  refetchLabel?: string
}

/**
 * Toolbar config. Pass an object to show the toolbar; omit or set `false` to hide.
 *
 * Layout: `[filtersToggle] [fetch] [search] …… [settings] [exportCsv] [secondary] [primary]`
 * When the filter toggle is on, `filters` render in a second row under the toolbar.
 */
export interface DataTableToolbarOptions {
  /**
   * Built-in Export CSV control (right side). Defaults to `true` when the toolbar
   * is shown; pass `false` to hide.
   */
  exportCsv?: boolean | DataTableExportCsvOptions
  /** Built-in Fetch / Refetch control. Omit to hide. */
  fetch?: DataTableToolbarFetchOptions
  /**
   * Filter controls shown in the collapsible filters bar (toggled by the filter
   * icon button). Prefer chip / select controls that can wrap across lines.
   */
  filters?: ReactNode
  /**
   * Start with the filters bar open. Defaults to `false`.
   * Only applies when `filters` is provided.
   */
  filtersOpen?: boolean
  /** Called when the user toggles the filters bar. */
  onFiltersOpenChange?: (open: boolean) => void
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
  /**
   * Built-in search field (center). Defaults to `true` when the toolbar is shown;
   * pass `false` to hide, or an object to override placeholder / aria-label / etc.
   */
  search?: boolean | DataTableToolbarSearchOptions
  /**
   * Built-in settings control (cog). Defaults to `true` when the toolbar is shown;
   * pass `false` to hide.
   */
  settings?: boolean
}

/**
 * DataTable feature options (UI / columns). These are stripped before options
 * are passed to TanStack Table.
 */
export interface DataTableFeatures<TData extends RowData> {
  emptyMessage?: ReactNode
  /** Row selection checkboxes. Defaults to `true`; pass `false` to hide. */
  enableSelectionColumn?: boolean
  loading?: boolean
  /** Called when the user changes row density from table settings. */
  onRowDensityChange?: (density: DataTableRowDensity) => void
  paginationPageSizeOptions?: readonly number[]
  rowActions?: DataTableRowActionsRenderer<TData>
  /** Initial (or controlled) row density. Defaults to `"default"`. */
  rowDensity?: DataTableRowDensity
  showFooter?: boolean
  showPagination?: boolean
  /** Toolbar above the table. `false` / omitted = hidden. */
  toolbar?: DataTableToolbarOptions | false
}

/** TanStack Table options owned by the consumer (columns/data come from DataTable props). */
export type DataTableTanStackOptions<TData extends RowData> = Partial<Omit<TableOptions<TData>, "columns" | "data">>

/** Combined options: TanStack table config + DataTable features. */
export type DataTableOptions<TData extends RowData> = DataTableFeatures<TData> & DataTableTanStackOptions<TData>

export interface DataTableClassNames {
  body?: string
  cell?: string
  emptyState?: string
  footer?: string
  head?: string
  header?: string
  loading?: string
  pagination?: string
  root?: string
  row?: string
  table?: string
  toolbar?: string
}

export interface DataTableProviderProps<TData extends RowData> {
  children?: ReactNode
  classNames?: DataTableClassNames
  columns: ColumnDef<TData>[]
  data: TData[]
  options?: DataTableOptions<TData>
}

export type DataTableProps<TData extends RowData> = Omit<DataTableProviderProps<TData>, "children">

export interface DataTableContextValue {
  classNames?: DataTableClassNames
  emptyMessage?: ReactNode
  globalFilter: string
  loading?: boolean
  pagination: PaginationState
  paginationPageSizeOptions?: readonly number[]
  rowDensity: DataTableRowDensity
  rowSelection: RowSelectionState
  setRowDensity: (density: DataTableRowDensity) => void
  showFooter: boolean
  showPagination: boolean
  sorting: SortingState
  table: Table<RowData>
  toolbar?: DataTableToolbarOptions | false
}
