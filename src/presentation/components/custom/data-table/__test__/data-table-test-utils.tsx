import { type JSX, useMemo, useState } from "react"

import {
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  type ColumnDef,
  type ExpandedState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"
import { screen, within } from "@testing-library/react"
import type { UserEvent } from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"

import type { Messages } from "~/src/integrations/next-intl/i18n.utils"

import { DataTable, useDataTable } from "~/src/presentation/components/custom/data-table/data-table"

interface Person {
  id: string
  name: string
}

interface HierarchicalPerson extends Person {
  subRows?: HierarchicalPerson[]
}

export async function sortColumnDescending(user: UserEvent, columnName = "Name"): Promise<void> {
  const header = screen.getByRole("columnheader", { name: columnName })
  await user.click(within(header).getByRole("button", { name: "Column options" }))
  await user.click(await screen.findByText("Sort descending"))
}

export function SortableMarkupTable({
  columns,
  data,
  messages,
}: {
  columns: ColumnDef<Person>[]
  data: Person[]
  messages: Messages
}): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([])
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
    <NextIntlClientProvider locale="en-US" messages={messages}>
      <DataTable.Provider columns={columns} data={data} options={options}>
        <table>
          <DataTable.Header />
          <DataTable.Body>
            <DataTable.Content />
          </DataTable.Body>
        </table>
      </DataTable.Provider>
    </NextIntlClientProvider>
  )
}

export function HierarchicalSelectionTable({
  columns,
  data,
}: {
  columns: ColumnDef<HierarchicalPerson>[]
  data: HierarchicalPerson[]
}): JSX.Element {
  const [expanded, setExpanded] = useState<ExpandedState>(true)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({ "1": true })
  const options = useMemo(
    () => ({
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      getSubRows: (row: HierarchicalPerson) => row.subRows,
      onExpandedChange: setExpanded,
      onRowSelectionChange: setRowSelection,
      state: { expanded, rowSelection },
    }),
    [expanded, rowSelection],
  )

  return (
    <DataTable.Provider columns={columns} data={data} options={options}>
      <table>
        <DataTable.Body>
          <DataTable.Content />
        </DataTable.Body>
      </table>
    </DataTable.Provider>
  )
}

export function PlaceholderProbe(): JSX.Element {
  const { table } = useDataTable()
  const headerPlaceholders = table.getHeaderGroups().flatMap((group) => group.headers.filter((header) => header.isPlaceholder))
  const footerPlaceholders = table.getFooterGroups().flatMap((group) => group.headers.filter((header) => header.isPlaceholder))

  return (
    <div>
      <div data-testid="header-placeholders">{headerPlaceholders.length}</div>
      <div data-testid="footer-placeholders">{footerPlaceholders.length}</div>
    </div>
  )
}
