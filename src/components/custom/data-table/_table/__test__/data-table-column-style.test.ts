/** @vitest-environment jsdom */

import { createElement } from "react"

import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { renderHook } from "@testing-library/react"

import { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"
import { columnPinningStyle, columnSystemClass } from "~/src/components/custom/data-table/_table/data-table-column-style"
import { DATA_TABLE_SELECT_COLUMN_ID } from "~/src/components/custom/data-table/_table/data-table-select-column"
import {
  createDataTableActionsColumn,
  createDataTableSelectColumn,
  DATA_TABLE_ACTIONS_COLUMN_ID,
} from "~/src/components/custom/data-table/_table/data-table-system-columns"

interface Row {
  id: string
  name: string
}

const SELECT_TABLE_DATA: Row[] = [{ id: "1", name: "Ada" }]
const ACTIONS_TABLE_DATA: Row[] = [{ id: "1", name: "Ada" }]

describe("data table column style", () => {
  it("sizes the select column as a compact pinned gutter", () => {
    expect.hasAssertions()

    const { result } = renderHook(() =>
      useReactTable({
        columns: [createDataTableSelectColumn<Row>(), { accessorKey: "name", header: "Name" }],
        data: SELECT_TABLE_DATA,
        enableColumnPinning: true,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
          columnPinning: { left: [DATA_TABLE_SELECT_COLUMN_ID] },
        },
      }),
    )

    const selectColumn = result.current.getColumn(DATA_TABLE_SELECT_COLUMN_ID)

    expect(selectColumn).toBeDefined()
    expect(selectColumn?.getSize()).toBe(DATA_TABLE.COLUMN.SELECT_SIZE)
    expect(selectColumn?.getIsPinned()).toBe("left")
    expect(columnSystemClass(selectColumn!)).toBe(DATA_TABLE.CLASSES.SELECT_COLUMN)
    expect(columnPinningStyle(selectColumn!, "header")).toMatchObject({
      left: "0px",
      maxWidth: DATA_TABLE.COLUMN.SELECT_SIZE,
      minWidth: DATA_TABLE.COLUMN.SELECT_SIZE,
      position: "sticky",
      width: DATA_TABLE.COLUMN.SELECT_SIZE,
    })
  })

  it("keeps content columns fluid beside the select gutter", () => {
    expect.hasAssertions()

    const { result } = renderHook(() =>
      useReactTable({
        columns: [createDataTableSelectColumn<Row>(), { accessorKey: "name", header: "Name" }],
        data: SELECT_TABLE_DATA,
        enableColumnPinning: true,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
          columnPinning: { left: [DATA_TABLE_SELECT_COLUMN_ID] },
        },
      }),
    )

    const nameColumn = result.current.getColumn("name")

    expect(nameColumn).toBeDefined()
    expect(columnPinningStyle(nameColumn!)).toMatchObject({
      minWidth: nameColumn!.getSize(),
    })
    expect(columnPinningStyle(nameColumn!)).not.toHaveProperty("width")
    expect(columnPinningStyle(nameColumn!)).not.toHaveProperty("maxWidth")
  })

  it("sizes and styles the actions column for a compact pinned gutter", () => {
    expect.hasAssertions()

    const { result } = renderHook(() =>
      useReactTable({
        columns: [{ accessorKey: "name", header: "Name" }, createDataTableActionsColumn<Row>(() => createElement("span", {}, "actions"))],
        data: ACTIONS_TABLE_DATA,
        enableColumnPinning: true,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
          columnPinning: { right: [DATA_TABLE_ACTIONS_COLUMN_ID] },
        },
      }),
    )

    const actionsColumn = result.current.getColumn(DATA_TABLE_ACTIONS_COLUMN_ID)

    expect(actionsColumn).toBeDefined()
    expect(actionsColumn?.getSize()).toBe(DATA_TABLE.COLUMN.ACTIONS_SIZE)
    expect(actionsColumn?.getIsPinned()).toBe("right")
    expect(columnSystemClass(actionsColumn!)).toBe(DATA_TABLE.CLASSES.ACTIONS_COLUMN)
    expect(columnPinningStyle(actionsColumn!, "header")).toMatchObject({
      maxWidth: DATA_TABLE.COLUMN.ACTIONS_SIZE,
      minWidth: DATA_TABLE.COLUMN.ACTIONS_SIZE,
      position: "sticky",
      right: "0px",
      width: DATA_TABLE.COLUMN.ACTIONS_SIZE,
    })
  })
})
