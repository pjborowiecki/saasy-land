"use client"
// TanStack Table v9 keeps header/cell/column instances stable and hides state reads
// behind their methods (`getSize`, `getIsPinned`, …). The React Compiler memoizes on
// those stable identities, freezing derived values like column widths after a resize,
// so this renderer opts out. See the table-state guide on React Compiler subscriptions.
"use no memo"

import { createContext, use, useCallback, useMemo, type CSSProperties, type JSX } from "react"

import {
  useTable,
  type Cell,
  type Column,
  type Header,
  type PaginationState,
  type ReactTable,
  type Row,
  type RowData,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "~/src/utils"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Skeleton } from "~/src/presentation/components/shadcn/skeleton"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "~/src/presentation/components/shadcn/table"

import {
  dataTableFeatures,
  type DataTableColumnDef,
  type DataTableFeatures,
  type DataTableOptions,
} from "~/src/presentation/components/custom/data-table/features"
import { ariaSort, type SortDirection } from "~/src/presentation/components/custom/data-table/utils/data-table-aria"
import { alignClass } from "~/src/presentation/components/custom/data-table/utils/data-table-column-style"

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }
// Stable module-scope fallback: a fresh array every render would invalidate the row
// models each time.
const EMPTY_DATA: never[] = []

// Rows are keyed by their database id, so selection survives sorting and paging.
// TanStack's own default is the row index, which follows positions instead of records.
const getRowIdFromData = (row: { id: string }): string => row.id
const PAGE_DISPLAY_OFFSET = 1
const MIN_PAGE_COUNT = 1
const NO_ROWS = 0
const NOT_FOUND = -1
const SKELETON_ROW_COUNT = 5
const SPACER_COLUMN_COUNT = 1

export type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>

type DataTableColumn<TData extends RowData> = Column<DataTableFeatures, TData>
type DataTableCell<TData extends RowData> = Cell<DataTableFeatures, TData>
type DataTableHeaderCell<TData extends RowData> = Header<DataTableFeatures, TData>

const DataTableContext = createContext<unknown>(undefined)

function isDataTableInstance<TData extends RowData>(value: unknown): value is DataTableInstance<TData> {
  return typeof value === "object" && value !== null && "getRowModel" in value
}

/** The table instance for the surrounding `<DataTable>`. */
export function useDataTable<TData extends RowData>(): DataTableInstance<TData> {
  const context = use(DataTableContext)

  if (!isDataTableInstance<TData>(context)) {
    throw new Error("useDataTable must be called inside a <DataTable>")
  }

  return context
}

/**
 * Every column renders exactly its model size, which is the invariant pinned offsets
 * and `getTotalSize()` depend on. The memo is keyed on the primitive values, never on
 * the stable column instance, so a resize or pin change recomputes it.
 */
function useColumnCellStyle<TData extends RowData>(column: DataTableColumn<TData>): CSSProperties {
  const size = column.getSize()
  const pinned = column.getIsPinned()
  const startInset = column.getStart("start")
  const endInset = column.getAfter("end")

  return useMemo(() => {
    if (pinned === "start") {
      return { insetInlineStart: startInset, width: size }
    }

    if (pinned === "end") {
      return { insetInlineEnd: endInset, width: size }
    }

    return { width: size }
  }, [endInset, pinned, size, startInset])
}

/** Sticky pinned cells need their own background or scrolled content shows through. */
function pinnedCellClass(pinned: "start" | "end" | false): string | undefined {
  if (pinned === "start") {
    return "sticky z-10 border-r border-border bg-inherit"
  }

  if (pinned === "end") {
    return "sticky z-10 border-l border-border bg-inherit"
  }

  return undefined
}

/**
 * Splits row cells (or headers) in front of the end-pinned region, so the renderer can
 * place the width-less spacer cell between them. The spacer absorbs whatever container
 * width the sized columns leave, keeping the table full width while every column holds
 * its exact model size — and end-pinned columns stay against the table's edge.
 */
function splitBeforeEndRegion<T>(items: readonly T[], isEndPinned: (item: T) => boolean): [T[], T[]] {
  const index = items.findIndex((item) => isEndPinned(item))

  return index === NOT_FOUND ? [[...items], []] : [items.slice(0, index), items.slice(index)]
}

function ResizeHandle<TData extends RowData>({ header }: Readonly<{ header: DataTableHeaderCell<TData> }>): JSX.Element | undefined {
  const t = useTranslations("components.custom.data-table")

  if (!header.column.getCanResize()) {
    return undefined
  }

  const resize = header.getResizeHandler()
  const isResizing = header.column.getIsResizing()

  // The grab area stays generous while the visible line is a single pixel — a 1px
  // target would be almost impossible to hit with a mouse.
  return (
    <button
      type="button"
      aria-label={t("resizeColumn")}
      tabIndex={-1}
      className="group/resize absolute top-0 right-0 z-20 flex h-full w-2 cursor-col-resize touch-none items-stretch justify-end select-none"
      onMouseDown={resize}
      onTouchStart={resize}
    >
      <span
        aria-hidden
        className={cn(
          "w-0.5 rounded-full bg-transparent transition-colors group-hover/resize:bg-border",
          isResizing && "bg-ring group-hover/resize:bg-ring",
        )}
      />
    </button>
  )
}

function SortIcon({ sorted }: Readonly<{ sorted: SortDirection }>): JSX.Element {
  if (sorted === "asc") {
    return <ArrowUp aria-hidden className="size-3.5 shrink-0 text-ring" />
  }

  if (sorted === "desc") {
    return <ArrowDown aria-hidden className="size-3.5 shrink-0 text-ring" />
  }

  return <ChevronsUpDown aria-hidden className="size-3.5 shrink-0 text-muted-foreground/60" />
}

function HeaderCell<TData extends RowData>({ header }: Readonly<{ header: DataTableHeaderCell<TData> }>): JSX.Element {
  const table = useDataTable<TData>()
  const { column } = header
  const style = useColumnCellStyle(column)
  // A sticky cell is its own positioning context for the resize handle; an unpinned
  // header needs `relative` for the same job.
  const headClass = cn(pinnedCellClass(column.getIsPinned()) ?? "relative", "bg-background", alignClass(column.columnDef.meta?.align))
  const sorted = column.getIsSorted()

  if (header.isPlaceholder) {
    return <TableHead className={headClass} style={style} />
  }

  // Only sortable headers become buttons: wrapping every one would nest the select-all
  // checkbox inside a disabled button, which swallows its clicks.
  if (!column.getCanSort()) {
    return (
      <TableHead className={headClass} style={style}>
        <table.FlexRender header={header} />
        <ResizeHandle header={header} />
      </TableHead>
    )
  }

  return (
    <TableHead className={headClass} style={style} aria-sort={ariaSort(sorted)}>
      <button
        type="button"
        onClick={column.getToggleSortingHandler()}
        className="flex cursor-pointer items-center gap-1.5 text-left transition-colors duration-200 ease-exp hover:text-foreground"
      >
        <table.FlexRender header={header} />
        <SortIcon sorted={sorted} />
      </button>
      <ResizeHandle header={header} />
    </TableHead>
  )
}

function DataTableHead(): JSX.Element {
  const table = useDataTable()
  const classNames = table.options.meta?.classNames

  return (
    <TableHeader className={classNames?.header}>
      {table.getHeaderGroups().map((headerGroup) => {
        const [leading, endPinned] = splitBeforeEndRegion(headerGroup.headers, (header) => header.column.getIsPinned() === "end")

        return (
          <TableRow key={headerGroup.id}>
            {leading.map((header) => (
              <HeaderCell key={header.id} header={header} />
            ))}
            <TableHead aria-hidden className="bg-background p-0" />
            {endPinned.map((header) => (
              <HeaderCell key={header.id} header={header} />
            ))}
          </TableRow>
        )
      })}
    </TableHeader>
  )
}

function SkeletonCell<TData extends RowData>({ column }: Readonly<{ column: DataTableColumn<TData> }>): JSX.Element {
  const style = useColumnCellStyle(column)

  return (
    <TableCell style={style}>
      <Skeleton className="h-4 w-full" />
    </TableCell>
  )
}

function DataTableSkeletonRows(): JSX.Element {
  const table = useDataTable()
  const classNames = table.options.meta?.classNames
  const [leading, endPinned] = splitBeforeEndRegion(table.getVisibleLeafColumns(), (column) => column.getIsPinned() === "end")

  return (
    <TableBody className={classNames?.body}>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <TableRow key={index} className={classNames?.row}>
          {leading.map((column) => (
            <SkeletonCell key={column.id} column={column} />
          ))}
          <TableCell aria-hidden className="p-0" />
          {endPinned.map((column) => (
            <SkeletonCell key={column.id} column={column} />
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

function DataTableBodyCell<TData extends RowData>({ cell }: Readonly<{ cell: DataTableCell<TData> }>): JSX.Element {
  const table = useDataTable<TData>()
  const style = useColumnCellStyle(cell.column)

  return (
    <TableCell className={cn(alignClass(cell.column.columnDef.meta?.align), pinnedCellClass(cell.column.getIsPinned()))} style={style}>
      <table.FlexRender cell={cell} />
    </TableCell>
  )
}

function DataTableBodyRow<TData extends RowData>({ row }: Readonly<{ row: Row<DataTableFeatures, TData> }>): JSX.Element {
  const table = useDataTable<TData>()
  const classNames = table.options.meta?.classNames
  const [leading, endPinned] = splitBeforeEndRegion(row.getVisibleCells(), (cell) => cell.column.getIsPinned() === "end")

  return (
    // The hover tint must be opaque: pinned cells inherit the row background, and a
    // translucent one lets scrolled content show through them.
    <TableRow data-state={row.getIsSelected() ? "selected" : undefined} className={cn("bg-background hover:bg-accent", classNames?.row)}>
      {leading.map((cell) => (
        <DataTableBodyCell key={cell.id} cell={cell} />
      ))}
      <TableCell aria-hidden className="p-0" />
      {endPinned.map((cell) => (
        <DataTableBodyCell key={cell.id} cell={cell} />
      ))}
    </TableRow>
  )
}

function DataTableRows(): JSX.Element {
  const t = useTranslations("components.custom.data-table")
  const table = useDataTable()
  const classNames = table.options.meta?.classNames
  const { rows } = table.getRowModel()

  if (table.options.meta?.isLoading === true) {
    return <DataTableSkeletonRows />
  }

  if (rows.length === NO_ROWS) {
    return (
      <TableBody className={classNames?.body}>
        <TableRow>
          <TableCell
            colSpan={table.getVisibleLeafColumns().length + SPACER_COLUMN_COUNT}
            className="h-24 text-center text-muted-foreground"
          >
            {t("empty")}
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody className={classNames?.body}>
      {rows.map((row) => (
        <DataTableBodyRow key={row.id} row={row} />
      ))}
    </TableBody>
  )
}

function DataTablePagination(): JSX.Element {
  const t = useTranslations("components.custom.data-table.pagination")
  const table = useDataTable()
  const classNames = table.options.meta?.classNames

  const previousPage = useCallback(() => {
    table.previousPage()
  }, [table])

  const nextPage = useCallback(() => {
    table.nextPage()
  }, [table])

  const pageCount = Math.max(table.getPageCount(), MIN_PAGE_COUNT)
  const { pageIndex } = table.state.pagination
  const selectedCount = Object.keys(table.state.rowSelection).length

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted-foreground", classNames?.pagination)}>
      <div className="flex items-center gap-3">
        <span>{t("rowCount", { count: table.getRowCount() })}</span>
        {selectedCount > NO_ROWS ? <span>{t("selectedCount", { selected: selectedCount })}</span> : undefined}
      </div>

      <div className="flex items-center gap-2">
        <span>{t("pageIndicator", { current: pageIndex + PAGE_DISPLAY_OFFSET, total: pageCount })}</span>
        <Button variant="outline" size="sm" aria-label={t("previousPage")} isDisabled={!table.getCanPreviousPage()} onPress={previousPage}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="sm" aria-label={t("nextPage")} isDisabled={!table.getCanNextPage()} onPress={nextPage}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export interface DataTableProps<TData extends { id: string }> {
  readonly columns: DataTableColumnDef<TData>[]
  /** Defaults to an empty array, so loading and empty states need no caller-side data. */
  readonly data?: TData[] | undefined
  readonly isLoading?: boolean
  readonly options?: DataTableOptions<TData>
}

/**
 * The app's one table component: pass data, columns, and any table options to
 * override or extend the defaults. All table state is internal to the instance, and
 * renderer inputs (`meta.classNames`, `meta.isLoading`) travel on the instance itself,
 * so child components reach everything through `useDataTable()`.
 *
 * The table is always full width. Every column renders exactly its model size and
 * resizes independently; a width-less spacer cell before the end-pinned region absorbs
 * the leftover container space. When columns outgrow the container, `minWidth` keeps
 * rendered widths equal to the model and the container scrolls horizontally.
 */
export function DataTable<TData extends { id: string }>({
  columns,
  data = EMPTY_DATA,
  isLoading = false,
  options,
}: Readonly<DataTableProps<TData>>): JSX.Element {
  const table = useTable({
    columnResizeMode: "onChange",
    columns,
    data,
    enableColumnResizing: true,
    features: dataTableFeatures,
    getRowId: getRowIdFromData,
    ...options,
    initialState: { pagination: DEFAULT_PAGINATION, ...options?.initialState },
    meta: { ...options?.meta, isLoading },
  })

  const classNames = table.options.meta?.classNames
  const totalSize = table.getTotalSize()
  const tableStyle = useMemo(() => ({ minWidth: totalSize }), [totalSize])

  return (
    <DataTableContext.Provider value={table}>
      <TableContainer className={classNames?.container}>
        {/* Separate borders painted per cell: collapsed tr borders detach from sticky
            pinned cells, which would leave the select and actions columns borderless. */}
        <Table
          className={cn(
            "table-fixed border-separate border-spacing-0",
            "[&_:is(th,td)]:border-b [&_:is(th,td)]:border-border [&_tbody_tr:last-child_td]:border-b-0",
            classNames?.table,
          )}
          style={tableStyle}
        >
          <DataTableHead />
          <DataTableRows />
        </Table>
      </TableContainer>

      <DataTablePagination />
    </DataTableContext.Provider>
  )
}
