/** @vitest-environment jsdom */

import { useState, type JSX } from "react"

import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { DataTableColumnHeader } from "~/src/presentation/components/custom/data-table/_components/data-table-column-header"

interface Row {
  name: string
}

const columns: ColumnDef<Row>[] = [{ accessorKey: "name", enableSorting: true, header: "Name" }]
const rows: Row[] = [{ name: "Ada" }, { name: "Grace" }]
const enMessages = loadLocaleMessagesFromDir("en-US")

function formatSortState(sorting: SortingState): string {
  const [first] = sorting
  if (first === undefined) {
    return "none"
  }
  return first.desc ? "desc" : "asc"
}

function SortableHeaderHarness({ desc }: Readonly<{ desc: boolean }>): JSX.Element {
  const sorting = [{ desc, id: "name" }]

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  })

  const header = table.getHeaderGroups()[0]?.headers[0]
  if (header === undefined) {
    return <div>missing header</div>
  }

  return <DataTableColumnHeader header={header}>Name</DataTableColumnHeader>
}

function InteractiveSortHeaderHarness(): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  })

  const header = table.getHeaderGroups()[0]?.headers[0]
  if (header === undefined) {
    return <div>missing header</div>
  }

  return (
    <div>
      <DataTableColumnHeader header={header}>Name</DataTableColumnHeader>
      <span data-testid="sort-state">{formatSortState(sorting)}</span>
    </div>
  )
}

describe("data table column header", () => {
  it("shows the column options control and an ascending indicator when sorted asc", () => {
    expect.hasAssertions()

    const { container } = render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <SortableHeaderHarness desc={false} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByRole("button", { name: /column options/iu })).toBeVisible()
    expect(container.querySelector(".lucide-arrow-up")).not.toBeNull()
  })

  it("shows a descending indicator when sorted desc", () => {
    expect.hasAssertions()

    const { container } = render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <SortableHeaderHarness desc />
      </NextIntlClientProvider>,
    )

    expect(container.querySelector(".lucide-arrow-down")).not.toBeNull()
  })

  it("sorts ascending, descending, and clears from the column menu", async () => {
    expect.hasAssertions()

    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={enMessages}>
        <InteractiveSortHeaderHarness />
      </NextIntlClientProvider>,
    )

    await user.click(screen.getByRole("button", { name: /column options/iu }))
    await user.click(await screen.findByText("Sort ascending"))
    expect(screen.getByTestId("sort-state")).toHaveTextContent("asc")

    await user.click(screen.getByRole("button", { name: /column options/iu }))
    await user.click(await screen.findByText("Sort descending"))
    expect(screen.getByTestId("sort-state")).toHaveTextContent("desc")

    await user.click(screen.getByRole("button", { name: /column options/iu }))
    await user.click(await screen.findByText("Clear sort"))
    expect(screen.getByTestId("sort-state")).toHaveTextContent("none")
  })
})
