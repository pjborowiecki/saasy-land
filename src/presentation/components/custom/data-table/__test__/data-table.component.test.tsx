import type { JSX, ReactNode } from "react"
/** @vitest-environment jsdom */

import { createColumnHelper } from "@tanstack/react-table"
import { render, renderHook, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { IntlProvider } from "use-intl/react"
import { describe, expect, it } from "vite-plus/test"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { Checkbox } from "~/src/presentation/components/shadcn/checkbox"

import { DataTable, useDataTable } from "~/src/presentation/components/custom/data-table/data-table"
import type { DataTableColumnDef, DataTableFeatures, DataTableOptions } from "~/src/presentation/components/custom/data-table/features"
import { toggleAllPageRowsSelected, toggleRowSelected } from "~/src/presentation/components/custom/data-table/utils/data-table-selection"

interface Person {
  id: string
  name: string
}

const ROWS: Person[] = [
  { id: "1", name: "Ada" },
  { id: "2", name: "Grace" },
  { id: "3", name: "Alan" },
]

const columnHelper = createColumnHelper<DataTableFeatures, Person>()

const COLUMNS: DataTableColumnDef<Person>[] = columnHelper.columns([
  columnHelper.display({
    cell: ({ row }) => <Checkbox aria-label="Select row" isSelected={row.getIsSelected()} onChange={toggleRowSelected(row)} />,
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows"
        isIndeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
        isSelected={table.getIsAllPageRowsSelected()}
        onChange={toggleAllPageRowsSelected(table)}
      />
    ),
    id: "select",
  }),
  columnHelper.accessor("name", { header: "Name", id: "name" }),
])

const ID_PAD = 2
const NO_ROWS: Person[] = []
const SKELETON_ROW_COUNT = 5
const PAGE_SIZE = 10
const PAGED_ROW_COUNT = 12
const PAGED_ROWS: Person[] = Array.from({ length: PAGED_ROW_COUNT }, (_, index) => ({
  id: String(index),
  name: `Person ${String(index).padStart(ID_PAD, "0")}`,
}))

const GROUP_CHILD_COLUMNS = columnHelper.columns([columnHelper.accessor("name", { header: "Name", id: "name" })])

// A grouped column beside an ungrouped one leaves a placeholder cell in the group row.
const GROUPED_COLUMNS: DataTableColumnDef<Person>[] = columnHelper.columns([
  columnHelper.display({ cell: () => <span>row</span>, header: "Id", id: "id" }),
  columnHelper.group({ columns: GROUP_CHILD_COLUMNS, header: "Details", id: "details" }),
])

const SLOT_OPTIONS: DataTableOptions<Person> = {
  meta: {
    classNames: {
      body: "slot-body",
      container: "slot-container",
      header: "slot-header",
      pagination: "slot-pagination",
      row: "slot-row",
      table: "slot-table",
    },
  },
}

const EXPECTED_ROW_COUNT = 3
const SELECTED_AFTER_ONE_CLICK = 1
const FIRST_ROW_CHECKBOX = 0
const HEADER_ROW_COUNT = 1

const renderTable = (data: Person[] = ROWS): void => {
  const messages = getTestMessages("en-US")

  const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <IntlProvider locale="en-US" messages={messages}>
      {children}
    </IntlProvider>
  )

  render(<DataTable columns={COLUMNS} data={data} />, { wrapper: Wrapper })
}

describe("data table component", () => {
  it("renders a row per record plus the header row", () => {
    expect.hasAssertions()
    renderTable()

    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument()
    expect(screen.getAllByRole("row")).toHaveLength(EXPECTED_ROW_COUNT + HEADER_ROW_COUNT)
    expect(screen.getByText("Grace")).toBeInTheDocument()
  })

  it("shows the empty state when there are no rows", () => {
    expect.hasAssertions()
    renderTable(NO_ROWS)

    expect(screen.getByText("No results.")).toBeInTheDocument()
  })

  it("reflects selection on the row checkbox itself, and deselects again", async () => {
    expect.hasAssertions()
    const user = userEvent.setup()
    renderTable()

    const rowCheckbox = (): HTMLElement => screen.getAllByRole("checkbox", { name: "Select row" })[FIRST_ROW_CHECKBOX]!

    expect(rowCheckbox()).not.toBeChecked()

    await user.click(rowCheckbox())
    // The count alone would pass even with a checkbox stuck reporting unselected, which
    // Is what let a stale-memo bug through before.
    expect(rowCheckbox()).toBeChecked()
    expect(screen.getByText(`${SELECTED_AFTER_ONE_CLICK} selected`)).toBeInTheDocument()

    await user.click(rowCheckbox())
    expect(rowCheckbox()).not.toBeChecked()
    expect(screen.queryByText(`${SELECTED_AFTER_ONE_CLICK} selected`)).not.toBeInTheDocument()
  })

  it("puts the header checkbox in a mixed state when only some rows are selected", async () => {
    expect.hasAssertions()
    const user = userEvent.setup()
    renderTable()

    const selectAll = screen.getByRole("checkbox", { name: "Select all rows" })
    expect(selectAll).not.toBePartiallyChecked()

    await user.click(screen.getAllByRole("checkbox", { name: "Select row" })[FIRST_ROW_CHECKBOX]!)
    expect(selectAll).toBePartiallyChecked()
    expect(selectAll).not.toBeChecked()
  })

  it("selects and clears every row from the header checkbox", async () => {
    expect.hasAssertions()
    const user = userEvent.setup()
    renderTable()

    const selectAll = screen.getByRole("checkbox", { name: "Select all rows" })

    await user.click(selectAll)
    expect(screen.getByText(`${EXPECTED_ROW_COUNT} selected`)).toBeInTheDocument()
    for (const checkbox of screen.getAllByRole("checkbox", { name: "Select row" })) {
      expect(checkbox).toBeChecked()
    }

    await user.click(selectAll)
    expect(screen.queryByText(`${EXPECTED_ROW_COUNT} selected`)).not.toBeInTheDocument()
    for (const checkbox of screen.getAllByRole("checkbox", { name: "Select row" })) {
      expect(checkbox).not.toBeChecked()
    }
  })

  it("sorts by a column header", async () => {
    expect.hasAssertions()
    const user = userEvent.setup()
    renderTable()

    await user.click(screen.getByRole("button", { name: /Name/u }))

    const [, firstBodyRow] = screen.getAllByRole("row")
    expect(within(firstBodyRow!).getByText("Ada")).toBeInTheDocument()
  })

  it("toggles a column through ascending, descending, and back", async () => {
    expect.hasAssertions()
    const user = userEvent.setup()
    renderTable()

    const header = screen.getByRole("button", { name: /Name/u })
    const firstBodyRow = (): HTMLElement => screen.getAllByRole("row")[HEADER_ROW_COUNT]!

    await user.click(header)
    expect(within(firstBodyRow()).getByText("Ada")).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: /Name/u })).toHaveAttribute("aria-sort", "ascending")

    await user.click(header)
    expect(within(firstBodyRow()).getByText("Grace")).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: /Name/u })).toHaveAttribute("aria-sort", "descending")
  })

  it("pages forward and back once the rows exceed a page", async () => {
    expect.hasAssertions()
    const user = userEvent.setup()
    renderTable(PAGED_ROWS)

    expect(screen.getAllByRole("row")).toHaveLength(PAGE_SIZE + HEADER_ROW_COUNT)
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Next page" }))
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument()
    expect(screen.getAllByRole("row")).toHaveLength(PAGED_ROW_COUNT - PAGE_SIZE + HEADER_ROW_COUNT)

    await user.click(screen.getByRole("button", { name: "Previous page" }))
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument()
  })
})

describe("data table structure", () => {
  it("renders placeholder cells for columns outside a header group", () => {
    expect.hasAssertions()

    const messages = getTestMessages("en-US")

    const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
      <IntlProvider locale="en-US" messages={messages}>
        {children}
      </IntlProvider>
    )

    render(<DataTable columns={GROUPED_COLUMNS} data={ROWS} />, { wrapper: Wrapper })

    expect(screen.getByText("Details")).toBeInTheDocument()
    expect(screen.getAllByRole("row")).toHaveLength(ROWS.length + HEADER_ROW_COUNT + HEADER_ROW_COUNT)
  })

  it("shows skeleton rows instead of the empty state while data is in flight", () => {
    expect.hasAssertions()

    const messages = getTestMessages("en-US")

    const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
      <IntlProvider locale="en-US" messages={messages}>
        {children}
      </IntlProvider>
    )

    render(<DataTable columns={COLUMNS} isLoading />, { wrapper: Wrapper })

    expect(screen.queryByText("No results.")).not.toBeInTheDocument()
    expect(screen.getAllByRole("row")).toHaveLength(SKELETON_ROW_COUNT + HEADER_ROW_COUNT)
    expect(screen.queryByText("No results.")).not.toBeInTheDocument()
  })

  it("applies meta classNames overrides to the container, table, and header slots", () => {
    expect.hasAssertions()

    const messages = getTestMessages("en-US")

    const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
      <IntlProvider locale="en-US" messages={messages}>
        {children}
      </IntlProvider>
    )

    const { container } = render(<DataTable columns={COLUMNS} data={ROWS} options={SLOT_OPTIONS} />, { wrapper: Wrapper })

    expect(container.querySelector('[data-slot="table-container"]')).toHaveClass("slot-container")
    expect(container.querySelector("table")).toHaveClass("slot-table")
    expect(container.querySelector("thead")).toHaveClass("slot-header")
  })

  it("applies meta classNames overrides to the body, row, and pagination slots", () => {
    expect.hasAssertions()

    const messages = getTestMessages("en-US")

    const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
      <IntlProvider locale="en-US" messages={messages}>
        {children}
      </IntlProvider>
    )

    const { container } = render(<DataTable columns={COLUMNS} data={ROWS} options={SLOT_OPTIONS} />, { wrapper: Wrapper })

    expect(container.querySelector("tbody")).toHaveClass("slot-body")
    expect(container.querySelector("tbody tr")).toHaveClass("slot-row")
    expect(container.querySelector(".slot-pagination")).toBeInTheDocument()
  })

  it("refuses to hand out a table instance outside a DataTable", () => {
    expect.hasAssertions()

    expect(() => renderHook(() => useDataTable())).toThrow(/inside a <DataTable>/u)
  })
})
