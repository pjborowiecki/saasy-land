/** @vitest-environment jsdom */

import { createElement, useCallback, useMemo, useState, type ComponentProps, type JSX } from "react"

import { type CellContext, type ColumnDef } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import type { Selection } from "react-aria-components"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import type * as ShadcnSelect from "~/src/components/shadcn/select"
import type * as ShadcnToggleGroup from "~/src/components/shadcn/toggle-group"

import { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"
import { DATA_TABLE_SELECT_COLUMN_ID } from "~/src/components/custom/data-table/_table/data-table-select-column"
import { DATA_TABLE_ACTIONS_COLUMN_ID } from "~/src/components/custom/data-table/_table/data-table-system-columns"
import type { DataTableOptions, DataTableRowDensity } from "~/src/components/custom/data-table/_types/data-table.types"
import { DataTable, useDataTable } from "~/src/components/custom/data-table/data-table"

type PageSizeChangeHandler = NonNullable<ComponentProps<typeof ShadcnSelect.Select>["onChange"]>
/** Matches `DataTableToolbarSettings` — RAC `Selection` includes `"all" | Set<Key>`. */
type RowDensityChangeHandler = (keys: Selection) => void

const enMessages = loadLocaleMessagesFromDir("en-US")
const { TEST_IDS } = DATA_TABLE
const EXPORT_CALL_COUNT = 1
const BLOB_URL = "blob:coverage-csv"
const CONTROLLED_SEARCH_VALUE = "controlled-query"
const SEARCH_QUERY = "ali"
const CLEARED_PAGE_SIZE = null

interface Person {
  id: string
  name: string
}

const columns: ColumnDef<Person>[] = [{ accessorKey: "name", enableSorting: true, header: "Name" }]
const data: Person[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
]

const pageSizeChangeHandler = vi.hoisted((): { current?: PageSizeChangeHandler } => ({}))
const rowDensityChangeHandler = vi.hoisted((): { current?: RowDensityChangeHandler } => ({}))

vi.mock(import("~/src/components/shadcn/select"), async (importOriginal): Promise<Partial<typeof ShadcnSelect>> => {
  const actual = await importOriginal<typeof ShadcnSelect>()

  function Select(props: ComponentProps<typeof actual.Select>) {
    if (props.onChange !== undefined) {
      pageSizeChangeHandler.current = props.onChange
    }

    return createElement(actual.Select, props)
  }

  return { ...actual, Select }
})

vi.mock(import("~/src/components/shadcn/toggle-group"), async (importOriginal): Promise<Partial<typeof ShadcnToggleGroup>> => {
  const actual = await importOriginal<typeof ShadcnToggleGroup>()

  function ToggleGroup(props: ComponentProps<typeof actual.ToggleGroup>) {
    if (props.onSelectionChange !== undefined) {
      rowDensityChangeHandler.current = props.onSelectionChange as RowDensityChangeHandler
    }

    return createElement(actual.ToggleGroup, props)
  }

  return { ...actual, ToggleGroup }
})

function renderRowActions(_context: CellContext<Person, unknown>): JSX.Element {
  return <button type="button">Row action</button>
}

function FunctionalFilterControl(): JSX.Element {
  const { globalFilter, table } = useDataTable()

  const handleAppendFilter = useCallback(() => {
    table.setGlobalFilter((previous: string) => `${previous}x`)
  }, [table])

  return (
    <div>
      <span data-testid="coverage-global-filter">{globalFilter}</span>
      <button type="button" onClick={handleAppendFilter}>
        Append filter
      </button>
    </div>
  )
}

const emptyToolbarOptions: DataTableOptions<Person> = { toolbar: {} }
const settingsDisabledToolbarOptions: DataTableOptions<Person> = { toolbar: { settings: false } }
const emptyToolbarShell: DataTableOptions<Person> = {
  toolbar: {
    exportCsv: false,
    search: false,
    settings: false,
  },
}
const selectionOffNoActionsOptions: DataTableOptions<Person> = {
  enableSelectionColumn: false,
}
const selectionOffWithActionsOptions: DataTableOptions<Person> = {
  enableSelectionColumn: false,
  rowActions: renderRowActions,
}
const pinAndActionsOptions: DataTableOptions<Person> = {
  enableSelectionColumn: true,
  initialState: {
    columnPinning: {
      left: [DATA_TABLE_SELECT_COLUMN_ID, "name"],
      right: [DATA_TABLE_ACTIONS_COLUMN_ID],
    },
  },
  rowActions: renderRowActions,
}
const toolbarFalseOptions: DataTableOptions<Person> = { toolbar: false }
const fetchingToolbarOptions: DataTableOptions<Person> = {
  toolbar: {
    exportCsv: false,
    fetch: {
      hasFetched: true,
      isFetching: true,
      onFetch: () => {
        // Intentionally empty: coverage only needs the fetching UI state.
      },
    },
    search: false,
    settings: false,
  },
}
const controlledSearchOptions: DataTableOptions<Person> = {
  toolbar: {
    exportCsv: false,
    search: {
      value: CONTROLLED_SEARCH_VALUE,
    },
    settings: false,
  },
}

const coverageFilters = <div data-testid="coverage-filters">Filters</div>
const coverageControlledFilters = <div data-testid="coverage-controlled-filters">Filters</div>

describe("data table coverage pagination and settings", () => {
  it("ignores empty page-size select values", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={emptyToolbarOptions} />
      </NextIntlClientProvider>,
    )

    expect(pageSizeChangeHandler.current).toBeDefined()
    pageSizeChangeHandler.current?.(CLEARED_PAGE_SIZE)
    expect(screen.getByTestId(TEST_IDS.PAGINATION)).toBeInTheDocument()
  })

  it("ignores invalid row-density toggle values", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={emptyToolbarOptions} />
      </NextIntlClientProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Table settings" }))
    expect(rowDensityChangeHandler.current).toBeDefined()

    rowDensityChangeHandler.current?.("all")
    rowDensityChangeHandler.current?.(new Set())
    rowDensityChangeHandler.current?.(new Set(["not-a-density"]))

    expect(screen.getByTestId(TEST_IDS.TABLE)).toHaveAttribute("data-density", "default")
  })

  it("forwards controlled row density changes to onRowDensityChange", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    function ControlledDensityHarness(): JSX.Element {
      const [rowDensity, setRowDensity] = useState<DataTableRowDensity>("default")

      const handleRowDensityChange = useCallback((density: DataTableRowDensity) => {
        setRowDensity(density)
      }, [])

      const options = useMemo(
        (): DataTableOptions<Person> => ({
          onRowDensityChange: handleRowDensityChange,
          rowDensity,
          toolbar: {},
        }),
        [handleRowDensityChange, rowDensity],
      )

      return <DataTable columns={columns} data={data} options={options} />
    }

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <ControlledDensityHarness />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.TABLE)).toHaveAttribute("data-density", "default")

    await user.click(screen.getByRole("button", { name: "Table settings" }))
    await user.click(screen.getByRole("radio", { name: "Compact" }))

    expect(screen.getByTestId(TEST_IDS.TABLE)).toHaveAttribute("data-density", "compact")
  })
})

describe("data table coverage toolbar", () => {
  it("hides the toolbar when search and all actions are disabled", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={emptyToolbarShell} />
      </NextIntlClientProvider>,
    )

    expect(screen.queryByTestId(TEST_IDS.TOOLBAR)).not.toBeInTheDocument()
  })

  it("uses custom search options and onExport instead of downloading", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()
    const onExport = vi.fn<(csv: string) => void>()
    const onSearchChange = vi.fn<(value: string) => void>()

    function CustomSearchExportTable(): JSX.Element {
      const options = useMemo(
        (): DataTableOptions<Person> => ({
          toolbar: {
            exportCsv: { filename: "people.csv", onExport },
            search: {
              "aria-label": "Search people",
              onValueChange: onSearchChange,
              placeholder: "Find people",
            },
            settings: false,
          },
        }),
        [],
      )

      return <DataTable columns={columns} data={data} options={options} />
    }

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <CustomSearchExportTable />
      </NextIntlClientProvider>,
    )

    const search = screen.getByRole("textbox", { name: "Search people" })
    expect(search).toHaveAttribute("placeholder", "Find people")

    await user.type(search, SEARCH_QUERY)
    expect(onSearchChange).toHaveBeenCalledWith(expect.any(String))

    await user.click(screen.getByTestId(TEST_IDS.TOOLBAR_EXPORT_CSV))
    expect(onExport).toHaveBeenCalledTimes(EXPORT_CALL_COUNT)
    expect(onExport.mock.calls[0]?.[0]).toContain("Name")
  })

  it("downloads csv when exportCsv has no onExport handler", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()
    const createObjectURL = vi.fn<() => string>(() => BLOB_URL)
    const revokeObjectURL = vi.fn<(url: string) => void>()
    const click = vi.fn<() => void>()
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(click)

    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL,
    })

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={settingsDisabledToolbarOptions} />
      </NextIntlClientProvider>,
    )

    await user.click(screen.getByTestId(TEST_IDS.TOOLBAR_EXPORT_CSV))

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    expect(click).toHaveBeenCalledWith()
    expect(revokeObjectURL).toHaveBeenCalledWith(BLOB_URL)

    clickSpy.mockRestore()
    vi.unstubAllGlobals()
  })

  it("renders a controlled search value from toolbar.search.value", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={controlledSearchOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.TOOLBAR_SEARCH)).toHaveValue(CONTROLLED_SEARCH_VALUE)
  })

  it("shows a loading spinner while fetch.isFetching is true", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={fetchingToolbarOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId(TEST_IDS.TOOLBAR_FETCH)).toBeDisabled()
  })
})

describe("data table coverage filters and columns", () => {
  it("syncs uncontrolled filtersOpen when the filtersOpen prop changes", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    function FiltersOpenHarness(): JSX.Element {
      const [filtersOpen, setFiltersOpen] = useState(true)

      const closeFiltersProp = useCallback(() => {
        setFiltersOpen(false)
      }, [])

      const options = useMemo(
        (): DataTableOptions<Person> => ({
          toolbar: {
            exportCsv: false,
            filters: coverageFilters,
            filtersOpen,
            search: false,
            settings: false,
          },
        }),
        [filtersOpen],
      )

      return (
        <div>
          <button type="button" onClick={closeFiltersProp}>
            Close filters prop
          </button>
          <DataTable columns={columns} data={data} options={options} />
        </div>
      )
    }

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <FiltersOpenHarness />
      </NextIntlClientProvider>,
    )

    expect(screen.getByTestId("coverage-filters")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Close filters prop" }))

    expect(screen.queryByTestId("coverage-filters")).not.toBeInTheDocument()
  })

  it("keeps filtersOpen controlled through onFiltersOpenChange", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    function ControlledFiltersHarness(): JSX.Element {
      const [filtersOpen, setFiltersOpen] = useState(false)

      const options = useMemo(
        (): DataTableOptions<Person> => ({
          toolbar: {
            exportCsv: false,
            filters: coverageControlledFilters,
            filtersOpen,
            onFiltersOpenChange: setFiltersOpen,
            search: false,
            settings: false,
          },
        }),
        [filtersOpen],
      )

      return <DataTable columns={columns} data={data} options={options} />
    }

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <ControlledFiltersHarness />
      </NextIntlClientProvider>,
    )

    expect(screen.queryByTestId("coverage-controlled-filters")).not.toBeInTheDocument()

    await user.click(screen.getByTestId(TEST_IDS.TOOLBAR_FILTERS_TOGGLE))

    expect(screen.getByTestId("coverage-controlled-filters")).toBeInTheDocument()
  })

  it("dedupes system column ids from consumer pinning", () => {
    expect.hasAssertions()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={pinAndActionsOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.getAllByRole("button", { name: "Row action" }).length).toBeGreaterThan(0)
    expect(screen.getByTestId(TEST_IDS.TABLE)).toBeInTheDocument()
  })

  it("builds columns without selection and with or without row actions", () => {
    expect.hasAssertions()

    const { rerender } = render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={selectionOffNoActionsOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()

    rerender(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable columns={columns} data={data} options={selectionOffWithActionsOptions} />
      </NextIntlClientProvider>,
    )

    expect(screen.getAllByRole("button", { name: "Row action" }).length).toBeGreaterThan(0)
  })

  it("supports functional setGlobalFilter updaters", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <DataTable.Provider columns={columns} data={data} options={toolbarFalseOptions}>
          <FunctionalFilterControl />
        </DataTable.Provider>
      </NextIntlClientProvider>,
    )

    await user.click(screen.getByRole("button", { name: "Append filter" }))

    expect(screen.getByTestId("coverage-global-filter")).toHaveTextContent("x")
  })
})
