/** @vitest-environment jsdom */

import { type JSX, useCallback, useMemo, useState } from "react"

import { type CellContext, type ColumnDef, type HeaderContext } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { DropdownMenuItem } from "~/src/components/shadcn/dropdown-menu"

import { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"
import {
  DATA_TABLE_SELECT_COLUMN_DEF,
  getDataTableSelectCellCheckboxPropsFromContext,
  getDataTableSelectHeaderCheckboxPropsFromContext,
  type DataTableSelectCheckboxProps,
} from "~/src/components/custom/data-table/_table/data-table-select-column"
import { DataTable, DataTableRowActionsButton } from "~/src/components/custom/data-table/data-table"

const enMessages = loadLocaleMessagesFromDir("en-US")
const { TEST_IDS } = DATA_TABLE
const PAGINATED_ROW_COUNT = 15
const ONE_BASED_INDEX_OFFSET = DATA_TABLE.PAGINATION.PAGE_INDEX_DISPLAY_OFFSET
const CUSTOM_PAGINATION_CLASS = "custom-pagination"
const PAGE_TWO_INDEX = 1

interface Person {
  id: string
  name: string
}

const columns: ColumnDef<Person>[] = [{ accessorKey: "name", header: "Name" }]

const data: Person[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
]

const searchableData: Person[] = [
  { id: "1", name: "Ada Lovelace" },
  { id: "2", name: "Grace Hopper" },
]

const paginatedData: Person[] = Array.from({ length: PAGINATED_ROW_COUNT }, (_, index) => ({
  id: String(index + ONE_BASED_INDEX_OFFSET),
  name: `Person ${index + ONE_BASED_INDEX_OFFSET}`,
}))

const paginationClassNames = { pagination: CUSTOM_PAGINATION_CLASS }
const [DEFAULT_PAGE_SIZE] = DATA_TABLE.PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS
const PAGE_SIZE_FORTY_OPTION_INDEX = 3
const PAGE_SIZE_FORTY = DATA_TABLE.PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS[PAGE_SIZE_FORTY_OPTION_INDEX]
const THIRTY_ROW_COUNT = 30

const hiddenPaginationOptions = { showPagination: false } as const
const emptyToolbarOptions = { toolbar: {} } as const
const settingsDisabledToolbarOptions = { toolbar: { settings: false } } as const
const exportCsvDisabledToolbarOptions = { toolbar: { exportCsv: false } } as const

function renderCustomRowActions(_context: CellContext<Person, unknown>): JSX.Element {
  return <button type="button">Custom action</button>
}

function renderDefaultRowActions(_context: CellContext<Person, unknown>): JSX.Element {
  return (
    <DataTableRowActionsButton>
      <DropdownMenuItem>Edit person</DropdownMenuItem>
    </DataTableRowActionsButton>
  )
}

const defaultRowActionsOptions = { rowActions: renderDefaultRowActions }
const customRowActionsOptions = { rowActions: renderCustomRowActions }

const selectiveRowOptions = {
  enableRowSelection: (row: { original: Person }) => row.original.id === "1",
} as const

function handleSelectionCheckboxChange(onChange: (isSelected: boolean) => void, event: React.ChangeEvent<HTMLInputElement>): void {
  onChange(event.currentTarget.checked)
}

function SelectionTestCheckbox(props: DataTableSelectCheckboxProps): JSX.Element {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleSelectionCheckboxChange(props.onChange, event)
    },
    [props.onChange],
  )

  return (
    <input
      aria-label={props["aria-label"]}
      checked={props.isSelected}
      disabled={props.isDisabled === true}
      onChange={handleChange}
      type="checkbox"
    />
  )
}

function SelectionTestHeader(context: HeaderContext<Person, unknown>): JSX.Element {
  return <SelectionTestCheckbox {...getDataTableSelectHeaderCheckboxPropsFromContext(context)} />
}

function SelectionTestCell(context: CellContext<Person, unknown>): JSX.Element {
  return <SelectionTestCheckbox {...getDataTableSelectCellCheckboxPropsFromContext(context)} />
}

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

const thirtyRows: Person[] = Array.from({ length: THIRTY_ROW_COUNT }, (_, index) => ({
  id: String(index + ONE_BASED_INDEX_OFFSET),
  name: `Person ${index + ONE_BASED_INDEX_OFFSET}`,
}))

function ActionsPinProbe(): JSX.Element {
  const { table } = DataTable.useTable()
  const actionsColumn = table.getAllLeafColumns().find((column) => column.id === "actions")

  return <span data-testid="actions-pin">{String(actionsColumn?.getIsPinned())}</span>
}

const toolbarFilterButton = <button type="button">Role filter</button>
const toolbarPrimaryActionButton = <button type="button">Add</button>
const defaultToolbarOptions = {
  toolbar: {
    filters: toolbarFilterButton,
    primaryAction: toolbarPrimaryActionButton,
  },
}

describe("data table pagination extras", () => {
  it("renders nothing when pagination is hidden", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable.Provider columns={columns} data={data} options={hiddenPaginationOptions}>
          <DataTable.Pagination />
        </DataTable.Provider>
      </NextIntlClientProvider>,
    )

    expect(screen.queryByTestId(TEST_IDS.PAGINATION)).not.toBeInTheDocument()
  })

  it("applies pagination class names from provider context", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable.Provider classNames={paginationClassNames} columns={columns} data={paginatedData}>
          <DataTable.Pagination />
        </DataTable.Provider>
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.PAGINATION)).toHaveClass(CUSTOM_PAGINATION_CLASS)
  })

  it("paginates forward with local TanStack state", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={paginatedData} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 1 of 2")
    expect(screen.getByRole("cell", { name: "Person 1" })).toBeInTheDocument()

    await user.click(screen.getByTestId(TEST_IDS.PAGINATION_NEXT))

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 2 of 2")
    expect(screen.getByRole("cell", { name: "Person 11" })).toBeInTheDocument()
  })

  it("paginates back with local TanStack state", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={paginatedData} />
      </NextIntlClientProvider>,
    )

    await user.click(screen.getByTestId(TEST_IDS.PAGINATION_NEXT))
    await user.click(screen.getByTestId(TEST_IDS.PAGINATION_PREVIOUS))

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 1 of 2")
    expect(screen.getByRole("cell", { name: "Person 1" })).toBeInTheDocument()
  })

  it("updates rows per page through local state", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={thirtyRows} />
      </NextIntlClientProvider>,
    )

    await user.click(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_SIZE))
    await user.click(await screen.findByRole("option", { name: String(PAGE_SIZE_FORTY) }))

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 1 of 1")
    expect(screen.getByRole("cell", { name: "Person 30" })).toBeInTheDocument()
  })

  it("accepts direct pagination state updates from the table", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    function PaginationProbe(): JSX.Element {
      const { table } = DataTable.useTable()
      const handleGoToPageTwo = useCallback(() => {
        table.options.onPaginationChange?.({ pageIndex: PAGE_TWO_INDEX, pageSize: DEFAULT_PAGE_SIZE })
      }, [table])

      return (
        <button onClick={handleGoToPageTwo} type="button">
          Go page 2
        </button>
      )
    }

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable.Provider columns={columns} data={paginatedData}>
          <PaginationProbe />
          <DataTable.Pagination />
        </DataTable.Provider>
      </NextIntlClientProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Go page 2" }))

    expect(screen.getByTestId(TEST_IDS.PAGINATION_PAGE_INDICATOR)).toHaveTextContent("Page 2 of 2")
  })
})

describe("data table selection extras", () => {
  it("selects all rows from the header checkbox", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={selectionColumns} data={data} />
      </NextIntlClientProvider>,
    )

    const selectAllCheckbox = screen.getByRole("checkbox", { name: "Select all rows" })
    const rowCheckboxes = screen.getAllByRole("checkbox", { name: "Select row" })

    await user.click(selectAllCheckbox)

    for (const checkbox of rowCheckboxes) {
      expect(checkbox).toBeChecked()
    }
  })

  it("disables selection for rows that cannot be selected", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={selectionColumns} data={data} options={selectiveRowOptions} />
      </NextIntlClientProvider>,
    )

    const [, bobCheckbox] = screen.getAllByRole("checkbox", { name: "Select row" })

    expect(bobCheckbox).toBeDisabled()
  })

  it("selects rows with the built-in system selection column", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} />
      </NextIntlClientProvider>,
    )

    const [aliceCheckbox] = screen.getAllByRole("checkbox", { name: "Select row" })

    expect(aliceCheckbox).not.toBeChecked()

    await user.click(aliceCheckbox!)

    expect(aliceCheckbox).toBeChecked()
  })

  it("shows the selected row count after selecting all", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} />
      </NextIntlClientProvider>,
    )

    const rowCount = screen.getByTestId(TEST_IDS.PAGINATION_ROW_COUNT)

    expect(rowCount).toHaveTextContent("2 rows")
    expect(rowCount).not.toHaveTextContent("selected")

    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }))

    expect(rowCount).toHaveTextContent("2 rows")
    expect(rowCount).toHaveTextContent("2 selected")
  })

  it("clears the selected row count after deselecting all", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} />
      </NextIntlClientProvider>,
    )

    const rowCount = screen.getByTestId(TEST_IDS.PAGINATION_ROW_COUNT)

    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }))
    await user.click(screen.getByRole("checkbox", { name: "Select all rows" }))

    expect(rowCount).toHaveTextContent("2 rows")
    expect(rowCount).not.toHaveTextContent("selected")
  })
})

describe("data table system columns", () => {
  it("renders the default row actions button", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={defaultRowActionsOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.getAllByRole("button", { name: "Row actions" })).toHaveLength(data.length)
  })

  it("opens the row actions menu on click", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={defaultRowActionsOptions} />
      </NextIntlClientProvider>,
    )

    const [trigger] = screen.getAllByRole("button", { name: "Row actions" })
    await user.click(trigger!)

    await expect(screen.findByRole("menuitem", { name: "Edit person" })).resolves.toBeInTheDocument()
  })

  it("renders a custom row actions renderer", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={customRowActionsOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.getAllByRole("button", { name: "Custom action" })).toHaveLength(data.length)
  })

  it("pins the actions column to the right when rowActions is provided", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable.Provider columns={columns} data={data} options={defaultRowActionsOptions}>
          <ActionsPinProbe />
        </DataTable.Provider>
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId("actions-pin")).toHaveTextContent("right")
  })
})

describe("data table toolbar chrome", () => {
  it("renders search, settings, export, and primary action by default", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={defaultToolbarOptions} />
      </NextIntlClientProvider>,
    )

    const search = screen.getByTestId("data-table-toolbar-search")

    expect(screen.getByTestId("data-table-toolbar")).toBeInTheDocument()
    expect(screen.getByTestId("data-table-toolbar-filters-toggle")).toBeInTheDocument()
    expect(search).toHaveAttribute("placeholder", "Search…")
    expect(search).toHaveAttribute("aria-label", "Search…")
    expect(screen.getByRole("button", { name: "Table settings" })).toBeInTheDocument()
  })

  it("renders export csv and primary action controls", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={defaultToolbarOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId("data-table-toolbar-export-csv")).toHaveTextContent("Export CSV")
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument()
    expect(screen.queryByTestId("data-table-toolbar-filters")).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Role filter" })).not.toBeInTheDocument()
  })

  it("toggles filter slot visibility", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={defaultToolbarOptions} />
      </NextIntlClientProvider>,
    )

    await user.click(screen.getByTestId("data-table-toolbar-filters-toggle"))

    expect(screen.getByTestId("data-table-toolbar-filters")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Role filter" })).toBeInTheDocument()

    await user.click(screen.getByTestId("data-table-toolbar-filters-toggle"))

    expect(screen.queryByTestId("data-table-toolbar-filters")).not.toBeInTheDocument()
  })
})

describe("data table toolbar fetch and settings", () => {
  it("shows Fetch then Refetch based on fetch state and dirty filters", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()
    const onFetch = vi.fn<() => void>()
    const fetchCallCount = 1

    function FetchToolbarHarness(): JSX.Element {
      const [hasFetched, setHasFetched] = useState(false)
      const [isDirty, setIsDirty] = useState(false)

      const handleFetch = useCallback(() => {
        onFetch()
        setHasFetched(true)
        setIsDirty(false)
      }, [])

      const handleDirtify = useCallback(() => {
        setIsDirty(true)
      }, [])

      const options = useMemo(
        () => ({
          toolbar: {
            fetch: {
              hasFetched,
              isDirty,
              onFetch: handleFetch,
            },
            primaryAction: (
              <button type="button" onClick={handleDirtify}>
                Dirtify
              </button>
            ),
          },
        }),
        [handleDirtify, handleFetch, hasFetched, isDirty],
      )

      return <DataTable columns={columns} data={data} options={options} />
    }

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <FetchToolbarHarness />
      </NextIntlClientProvider>,
    )

    const fetchButton = screen.getByTestId("data-table-toolbar-fetch")

    expect(fetchButton).toHaveTextContent("Fetch")

    await user.click(fetchButton)

    expect(onFetch).toHaveBeenCalledTimes(fetchCallCount)
    expect(fetchButton).toHaveTextContent("Refetch")

    await user.click(screen.getByRole("button", { name: "Dirtify" }))

    expect(fetchButton).toHaveTextContent("Fetch")
  })

  it("changes row density from table settings", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={emptyToolbarOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.TABLE)).toHaveAttribute("data-density", "default")

    await user.click(screen.getByRole("button", { name: "Table settings" }))
    await user.click(screen.getByRole("radio", { name: "Compact" }))

    expect(screen.getByTestId(TEST_IDS.TABLE)).toHaveAttribute("data-density", "compact")
  })

  it("hides table settings when options.toolbar.settings is false", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={settingsDisabledToolbarOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.queryByRole("button", { name: "Table settings" })).not.toBeInTheDocument()
  })

  it("filters rows with the built-in search global filter", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={searchableData} options={emptyToolbarOptions} />
      </NextIntlClientProvider>,
    )

    await user.type(screen.getByTestId("data-table-toolbar-search"), "grace")

    expect(screen.getByText("Grace Hopper")).toBeInTheDocument()
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument()
  })

  it("hides Export CSV when options.toolbar.exportCsv is false", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={exportCsvDisabledToolbarOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId("data-table-toolbar")).toBeInTheDocument()
    expect(screen.queryByTestId("data-table-toolbar-export-csv")).not.toBeInTheDocument()
  })

  it("hides the toolbar when options.toolbar is omitted", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} />
      </NextIntlClientProvider>,
    )

    expect(screen.queryByTestId("data-table-toolbar")).not.toBeInTheDocument()
  })
})
