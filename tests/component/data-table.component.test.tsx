/** @vitest-environment jsdom */

import { type JSX, useCallback, useMemo, useState } from "react"

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type CellContext,
  type ColumnDef,
  type HeaderContext,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"
import {
  DATA_TABLE_SELECT_COLUMN_DEF,
  getDataTableSelectCellCheckboxPropsFromContext,
  getDataTableSelectHeaderCheckboxPropsFromContext,
  type DataTableSelectCheckboxProps,
} from "~/src/components/custom/data-table/_table/data-table-select-column"
import { DataTable, useDataTable } from "~/src/components/custom/data-table/data-table"

import {
  HierarchicalSelectionTable,
  PlaceholderProbe,
  SortableMarkupTable,
  sortColumnDescending,
} from "~/tests/helpers/data-table-test-utils"

const enMessages = loadLocaleMessagesFromDir("en-US")
const plMessages = loadLocaleMessagesFromDir("pl-PL")
const { TEST_IDS } = DATA_TABLE

interface Person {
  id: string
  name: string
}

interface HierarchicalPerson extends Person {
  subRows?: HierarchicalPerson[]
}

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
]

const data: Person[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
]

const singleRowData: Person[] = [data[0]!]

const emptyData: Person[] = []

const ONE_BASED_INDEX_OFFSET = DATA_TABLE.PAGINATION.PAGE_INDEX_DISPLAY_OFFSET
const PAGINATED_ROW_COUNT = 15
const [DEFAULT_PAGE_SIZE, ALTERNATE_PAGE_SIZE] = DATA_TABLE.PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS
const alternatePageSizeOptions = [DEFAULT_PAGE_SIZE, ALTERNATE_PAGE_SIZE] as const

const paginatedData: Person[] = Array.from({ length: PAGINATED_ROW_COUNT }, (_, index) => ({
  id: String(index + ONE_BASED_INDEX_OFFSET),
  name: `Person ${index + ONE_BASED_INDEX_OFFSET}`,
}))

const hierarchicalData: HierarchicalPerson[] = [
  {
    id: "1",
    name: "Alice",
    subRows: [{ id: "1-1", name: "Child" }],
  },
]

const styledColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    enableSorting: true,
    header: "Name",
    meta: { align: "center" },
  },
  {
    accessorKey: "id",
    header: "ID",
    meta: { align: "right" },
  },
]

const footerColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    footer: () => "2 users",
    header: "Name",
    meta: { align: "center" },
  },
  {
    accessorKey: "id",
    footer: "—",
    header: "ID",
    meta: { align: "right" },
  },
]

const groupedColumns: ColumnDef<Person>[] = [
  {
    columns: [
      {
        columns: [{ accessorKey: "name", footer: "Name total", header: "Name" }],
        footer: "Nested total",
        header: "Nested",
      },
    ],
    footer: "Group total",
    header: "Group",
  },
  { accessorKey: "id", footer: "ID total", header: "ID" },
]

const pinningOptions = {
  getCoreRowModel: getCoreRowModel(),
  initialState: {
    columnPinning: { left: ["name"], right: ["id"] },
  },
}

const coreRowModelOptions = { getCoreRowModel: getCoreRowModel() }
const emptyMessageOptions = { emptyMessage: "No results." } as const
const loadingOptions = { loading: true } as const
const footerPinningOptions = { ...pinningOptions, showFooter: true } as const
const footerCoreOptions = { ...coreRowModelOptions, showFooter: true } as const
const groupedFooterOptions = footerCoreOptions

const wrongColumns: ColumnDef<Person>[] = [{ accessorKey: "missing", header: "Missing" }]
const wrongData: Person[] = [{ id: "9", name: "Wrong" }]
const overrideOptions = {
  columns: wrongColumns,
  data: wrongData,
  getCoreRowModel: getCoreRowModel(),
}

const sortableDefaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    enableSorting: true,
    header: "Name",
  },
]

const selectionColumns: ColumnDef<Person>[] = [
  {
    ...DATA_TABLE_SELECT_COLUMN_DEF,
    cell: SelectionTestCell,
    header: SelectionTestHeader,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
]

function handleSelectionCheckboxChange(onCheckedChange: (checked: boolean) => void, event: React.ChangeEvent<HTMLInputElement>): void {
  onCheckedChange(event.currentTarget.checked)
}

function SelectionTestCheckbox(props: DataTableSelectCheckboxProps): JSX.Element {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleSelectionCheckboxChange(props.onCheckedChange, event)
    },
    [props.onCheckedChange],
  )

  return (
    <input aria-label={props["aria-label"]} checked={props.checked} disabled={props.disabled} onChange={handleChange} type="checkbox" />
  )
}

function SelectionTestHeader(context: HeaderContext<Person, unknown>): JSX.Element {
  return <SelectionTestCheckbox {...getDataTableSelectHeaderCheckboxPropsFromContext(context)} />
}

function SelectionTestCell(context: CellContext<Person, unknown>): JSX.Element {
  return <SelectionTestCheckbox {...getDataTableSelectCellCheckboxPropsFromContext(context)} />
}

function PaginatedTable({ pageSizeOptions }: { pageSizeOptions?: readonly number[] }): JSX.Element {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE })
  const options = useMemo(() => {
    const baseOptions = {
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      state: { pagination },
    }

    if (pageSizeOptions === undefined) {
      return baseOptions
    }

    return { ...baseOptions, paginationPageSizeOptions: pageSizeOptions }
  }, [pageSizeOptions, pagination])

  return (
    <NextIntlClientProvider locale="en-US" messages={enMessages}>
      <DataTable columns={columns} data={paginatedData} options={options} />
    </NextIntlClientProvider>
  )
}

function RowSelectionEnabled(): JSX.Element {
  const { table } = useDataTable()
  return <div data-testid="row-selection-enabled">{String(table.options.enableRowSelection)}</div>
}

const disableRowSelectionOptions = { enableRowSelection: false } as const

function RowCount(): JSX.Element {
  const { table } = useDataTable()
  return <div data-testid="row-count">{table.getRowModel().rows.length}</div>
}

function FirstRowName(): JSX.Element {
  const { table } = useDataTable()
  const [firstRow] = table.getRowModel().rows
  return <div data-testid="first-row-name">{firstRow ? String(firstRow.getValue("name")) : ""}</div>
}

function CompoundConsumer(): JSX.Element {
  const { table } = DataTable.useTable()
  return <div data-testid="compound-row-count">{table.getRowModel().rows.length}</div>
}

function OrphanConsumer(): JSX.Element {
  useDataTable()
  return <div />
}

function SortableTable({ rows }: { rows: Person[] }): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: "name" }])
  const options = useMemo(
    () => ({
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      state: { sorting },
    }),
    [sorting],
  )

  return (
    <DataTable.Provider columns={columns} data={rows} options={options}>
      <FirstRowName />
    </DataTable.Provider>
  )
}

function renderDefaultDataTable(): ReturnType<typeof render> {
  return render(
    <NextIntlClientProvider locale="en-US" messages={enMessages}>
      <DataTable columns={columns} data={data} />
    </NextIntlClientProvider>,
  )
}

describe("data table provider", () => {
  it("provides the TanStack table instance to descendants", () => {
    expect.hasAssertions()

    render(
      <DataTable.Provider columns={columns} data={data} options={coreRowModelOptions}>
        <RowCount />
      </DataTable.Provider>,
    )

    expect(screen.getByTestId("row-count")).toHaveTextContent("2")
  })

  it("applies sensible defaults when options are omitted", () => {
    expect.hasAssertions()

    render(
      <DataTable.Provider columns={columns} data={data}>
        <RowCount />
      </DataTable.Provider>,
    )

    expect(screen.getByTestId("row-count")).toHaveTextContent("2")
  })

  it("allows overriding default row selection", () => {
    expect.hasAssertions()

    const { rerender } = render(
      <DataTable.Provider columns={columns} data={data}>
        <RowSelectionEnabled />
      </DataTable.Provider>,
    )

    expect(screen.getByTestId("row-selection-enabled")).toHaveTextContent("true")

    rerender(
      <DataTable.Provider columns={columns} data={data} options={disableRowSelectionOptions}>
        <RowSelectionEnabled />
      </DataTable.Provider>,
    )

    expect(screen.getByTestId("row-selection-enabled")).toHaveTextContent("false")
  })

  it("forwards options to TanStack (sorting)", () => {
    expect.hasAssertions()

    render(<SortableTable rows={data} />)

    expect(screen.getByTestId("first-row-name")).toHaveTextContent("Bob")
  })

  it("reacts to data prop changes", () => {
    expect.hasAssertions()

    const { rerender } = render(
      <DataTable.Provider columns={columns} data={data}>
        <RowCount />
      </DataTable.Provider>,
    )

    expect(screen.getByTestId("row-count")).toHaveTextContent("2")

    rerender(
      <DataTable.Provider columns={columns} data={singleRowData}>
        <RowCount />
      </DataTable.Provider>,
    )

    expect(screen.getByTestId("row-count")).toHaveTextContent("1")
  })

  it("keeps columns and data props authoritative over options", () => {
    expect.hasAssertions()

    render(
      <DataTable.Provider columns={columns} data={data} options={overrideOptions}>
        <RowCount />
      </DataTable.Provider>,
    )

    expect(screen.getByTestId("row-count")).toHaveTextContent("2")
  })

  it("exposes useTable on the compound export", () => {
    expect.hasAssertions()

    render(
      <DataTable.Provider columns={columns} data={data}>
        <CompoundConsumer />
      </DataTable.Provider>,
    )

    expect(screen.getByTestId("compound-row-count")).toHaveTextContent("2")
  })

  it("works via DataTable.Provider directly", () => {
    expect.hasAssertions()

    render(
      <DataTable.Provider columns={columns} data={data}>
        <RowCount />
      </DataTable.Provider>,
    )

    expect(screen.getByTestId("row-count")).toHaveTextContent("2")
  })

  it("throws when useDataTable is used outside DataTable", () => {
    expect.hasAssertions()

    const consoleError = vi.spyOn(console, "error").mockReturnValue()

    expect(() => render(<OrphanConsumer />)).toThrow("useDataTable must be used within a DataTable.")

    consoleError.mockRestore()
  })
})

describe("data table markup", () => {
  it("renders the default layout structure", () => {
    expect.hasAssertions()

    renderDefaultDataTable()

    expect(screen.getByTestId(TEST_IDS.CONTAINER)).toBeInTheDocument()
    expect(screen.getByTestId(TEST_IDS.TABLE)).toBeInTheDocument()
    expect(screen.getByTestId(TEST_IDS.HEADER)).toBeInTheDocument()
    expect(screen.getByTestId(TEST_IDS.BODY)).toBeInTheDocument()
    expect(screen.getByTestId(TEST_IDS.PAGINATION)).toBeInTheDocument()
  })

  it("renders the default layout content", () => {
    expect.hasAssertions()

    renderDefaultDataTable()

    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "Alice" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "Bob" })).toBeInTheDocument()
    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 1 of 1")
  })

  it("renders header and body markup", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable.Provider columns={columns} data={data}>
          <table>
            <DataTable.Header />
            <DataTable.Body>
              <DataTable.Content />
            </DataTable.Body>
          </table>
        </DataTable.Provider>
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.HEADER)).toBeInTheDocument()
    expect(screen.getByTestId(TEST_IDS.BODY)).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "Alice" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "Bob" })).toBeInTheDocument()
  })

  it("renders empty state when data is empty", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={emptyData} options={emptyMessageOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.EMPTY_STATE)).toHaveTextContent("No results.")
  })

  it("renders loading state when loading", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={loadingOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.LOADING_STATE)).toBeInTheDocument()
    expect(screen.queryByTestId(TEST_IDS.EMPTY_STATE)).not.toBeInTheDocument()
  })

  it("renders footer cells with alignment and pinning", () => {
    expect.hasAssertions()

    render(
      <DataTable.Provider columns={footerColumns} data={data} options={footerPinningOptions}>
        <table>
          <DataTable.Footer />
        </table>
      </DataTable.Provider>,
    )

    expect(screen.getByRole("rowgroup")).toHaveTextContent("2 users")
    expect(screen.getByRole("rowgroup")).toHaveTextContent("—")
    expect(screen.getByTestId(TEST_IDS.FOOTER)).toBeInTheDocument()
    expect(screen.getByText("2 users")).toHaveClass("text-center")
    expect(screen.getByText("—")).toHaveClass("text-right")
  })

  it("renders footer cells without pinning", () => {
    expect.hasAssertions()

    render(
      <DataTable.Provider columns={footerColumns} data={data} options={footerCoreOptions}>
        <table>
          <DataTable.Footer />
        </table>
      </DataTable.Provider>,
    )

    expect(screen.getByText("2 users")).toHaveStyle({ minWidth: "150px" })
  })
})

describe("data table pagination", () => {
  it("renders pagination controls and navigates between pages", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(<PaginatedTable />)

    expect(screen.getByTestId(TEST_IDS.PAGINATION_ROW_COUNT)).toHaveTextContent("15 rows")
    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 1 of 2")

    await user.click(screen.getByTestId(TEST_IDS.PAGINATION_NEXT))

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 2 of 2")
    expect(screen.getByTestId(TEST_IDS.PAGINATION_PREVIOUS)).toBeEnabled()

    await user.click(screen.getByTestId(TEST_IDS.PAGINATION_PREVIOUS))

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 1 of 2")
  })

  it("navigates between pages with built-in pagination state", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={paginatedData} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 1 of 2")

    await user.click(screen.getByTestId(TEST_IDS.PAGINATION_NEXT))

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 2 of 2")
  })

  it("changes page size from pagination controls", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(<PaginatedTable pageSizeOptions={alternatePageSizeOptions} />)

    await user.click(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_SIZE))
    await user.click(await screen.findByRole("option", { name: String(ALTERNATE_PAGE_SIZE) }))

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 1 of 1")
  })

  it("uses locale-aware plural rules for row count in English", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={singleRowData} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.PAGINATION_ROW_COUNT)).toHaveTextContent("1 row")
  })

  it("uses locale-aware plural rules for row count in Polish", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="pl-PL" messages={plMessages}>
        <DataTable columns={columns} data={data} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.PAGINATION_ROW_COUNT)).toHaveTextContent("2 wiersze")
  })
})

describe("data table columns", () => {
  it("applies column alignment and pinning in header", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable.Provider columns={styledColumns} data={data} options={pinningOptions}>
          <table>
            <DataTable.Header />
          </table>
        </DataTable.Provider>
      </NextIntlClientProvider>,
    )

    const nameHeader = screen.getByRole("columnheader", { name: "Name" })
    const idHeader = screen.getByRole("columnheader", { name: "ID" })

    expect(nameHeader).toHaveClass("text-center", "bg-muted")
    expect(idHeader).toHaveClass("text-right", "bg-muted")
    expect(nameHeader).toHaveStyle({ position: "sticky" })
    expect(idHeader).toHaveStyle({ position: "sticky" })
  })

  it("applies column alignment and pinning in body cells", () => {
    expect.hasAssertions()

    render(
      <DataTable.Provider columns={styledColumns} data={data} options={pinningOptions}>
        <table>
          <DataTable.Body>
            <DataTable.Content />
          </DataTable.Body>
        </table>
      </DataTable.Provider>,
    )

    expect(screen.getByRole("cell", { name: "Alice" })).toHaveClass("text-center", "bg-card")
    expect(screen.getByRole("cell", { name: "1" })).toHaveClass("text-right", "bg-card")
  })

  it("toggles sorting when a sortable header is clicked", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(<SortableMarkupTable columns={styledColumns} data={data} messages={enMessages} />)

    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Alice")

    await sortColumnDescending(user)

    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Bob")
  })

  it("sorts rows with built-in sorting state", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={sortableDefaultColumns} data={data} />
      </NextIntlClientProvider>,
    )

    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Alice")

    await sortColumnDescending(user)

    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Bob")
  })

  it("reports grouped header and footer placeholder counts", () => {
    expect.hasAssertions()

    render(
      <DataTable.Provider columns={groupedColumns} data={data} options={coreRowModelOptions}>
        <PlaceholderProbe />
      </DataTable.Provider>,
    )

    expect(Number(screen.getByTestId("header-placeholders").textContent)).toBeGreaterThan(0)
    expect(Number(screen.getByTestId("footer-placeholders").textContent)).toBeGreaterThan(0)
  })

  it("renders grouped header and footer labels", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable.Provider columns={groupedColumns} data={data} options={groupedFooterOptions}>
          <table>
            <DataTable.Header />
            <DataTable.Footer />
          </table>
        </DataTable.Provider>
      </NextIntlClientProvider>,
    )

    expect(screen.getByRole("columnheader", { name: "Group" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument()
    expect(screen.getByText("Group total")).toBeInTheDocument()
    expect(screen.getByText("Name total")).toBeInTheDocument()
    expect(screen.getByText("ID total")).toBeInTheDocument()
  })
})

describe("data table selection", () => {
  it("selects rows with built-in row selection state", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={selectionColumns} data={data} />
      </NextIntlClientProvider>,
    )

    const [aliceCheckbox] = screen.getAllByRole("checkbox", { name: "Select row" })

    expect(aliceCheckbox).not.toBeChecked()

    await user.click(aliceCheckbox!)

    expect(aliceCheckbox).toBeChecked()
  })

  it("marks selected rows and indents nested sub-rows", () => {
    expect.hasAssertions()

    render(<HierarchicalSelectionTable columns={columns} data={hierarchicalData} />)

    const [parentRow, childRow] = screen.getAllByRole("row")

    expect(parentRow).toHaveAttribute("data-state", "selected")
    expect(childRow).not.toHaveAttribute("data-state")

    const childCell = screen.getByRole("cell", { name: "Child" })
    expect(childCell).toHaveStyle({ paddingLeft: "2rem" })
  })
})

describe("data table sorting", () => {
  it("sorts columns with local TanStack state", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={sortableDefaultColumns} data={paginatedData} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 1 of 2")

    await user.click(screen.getByTestId(TEST_IDS.PAGINATION_NEXT))

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 2 of 2")

    await sortColumnDescending(user)

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 1 of 2")
  })
})
