/** @vitest-environment jsdom */

import type { JSX } from "react"

import type { ColumnDef } from "@tanstack/react-table"

import { buildDataTableColumns } from "~/src/presentation/components/custom/data-table/_table/build-data-table-columns"
import { DATA_TABLE_SELECT_COLUMN_ID } from "~/src/presentation/components/custom/data-table/_table/data-table-select-column"
import { DATA_TABLE_ACTIONS_COLUMN_ID } from "~/src/presentation/components/custom/data-table/_table/data-table-system-columns"

interface TestRow {
  id: string
}

const dataColumns: ColumnDef<TestRow>[] = [{ accessorKey: "id", header: "ID" }]
const COLUMN_COUNT_WITH_SELECTION = 2
const COLUMN_COUNT_WITH_ACTIONS = 2
const COLUMN_COUNT_WITH_BOTH_SYSTEM_COLUMNS = 3
const LAST_COLUMN_INDEX = -1

function renderTestRowActions(): JSX.Element {
  return <span>Action</span>
}

describe("data table column builder", () => {
  it("returns the original columns when system columns are not configured", () => {
    expect.hasAssertions()

    expect(buildDataTableColumns(dataColumns)).toBe(dataColumns)
  })

  it("prepends the selection column when enabled", () => {
    expect.hasAssertions()

    const columns = buildDataTableColumns(dataColumns, { enableSelectionColumn: true })

    expect(columns).toHaveLength(COLUMN_COUNT_WITH_SELECTION)
    expect(columns[0]?.id).toBe(DATA_TABLE_SELECT_COLUMN_ID)
    expect(columns[1]?.id).toBeUndefined()
  })

  it("appends the actions column when a renderer is provided", () => {
    expect.hasAssertions()

    const columns = buildDataTableColumns(dataColumns, { rowActions: renderTestRowActions })

    expect(columns).toHaveLength(COLUMN_COUNT_WITH_ACTIONS)
    expect(columns.at(LAST_COLUMN_INDEX)?.id).toBe(DATA_TABLE_ACTIONS_COLUMN_ID)
  })

  it("does not duplicate system columns when they are already present", () => {
    expect.hasAssertions()

    const columnsWithSystemIds: ColumnDef<TestRow>[] = [
      { header: "Select", id: DATA_TABLE_SELECT_COLUMN_ID },
      ...dataColumns,
      { header: "Actions", id: DATA_TABLE_ACTIONS_COLUMN_ID },
    ]

    const columns = buildDataTableColumns(columnsWithSystemIds, {
      enableSelectionColumn: true,
      rowActions: renderTestRowActions,
    })

    expect(columns).toHaveLength(COLUMN_COUNT_WITH_BOTH_SYSTEM_COLUMNS)
  })
})
