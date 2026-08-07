import {
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equals,
  filterFn_includesString,
  filterFn_inNumberRange,
  globalFilteringFeature,
  metaHelper,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
  type RowData,
  type TableOptions,
} from "@tanstack/react-table"

interface DataTableMeta {
  classNames?: {
    readonly body?: string
    readonly container?: string
    readonly header?: string
    readonly pagination?: string
    readonly row?: string
    readonly table?: string
  }
  isLoading?: boolean
}

interface DataTableColumnMeta {
  align?: "left" | "right" | "center"
}

export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnMeta: metaHelper<DataTableColumnMeta>(),
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  expandedRowModel: createExpandedRowModel(),
  filterFns: {
    equals: filterFn_equals,
    inNumberRange: filterFn_inNumberRange,
    includesString: filterFn_includesString,
  },
  filteredRowModel: createFilteredRowModel(),
  globalFilteringFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  sortedRowModel: createSortedRowModel(),
  tableMeta: metaHelper<DataTableMeta>(),
})

export type DataTableFeatures = typeof dataTableFeatures
export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData>
export type DataTableOptions<TData extends RowData> = Omit<TableOptions<DataTableFeatures, TData>, "columns" | "data" | "features">
