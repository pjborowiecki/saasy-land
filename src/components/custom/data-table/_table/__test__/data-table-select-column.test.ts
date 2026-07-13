/** @vitest-environment jsdom */

import { useState } from "react"

import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { act, renderHook } from "@testing-library/react"

import {
  getDataTableSelectCellCheckboxProps,
  getDataTableSelectHeaderCheckboxProps,
} from "~/src/components/custom/data-table/_table/data-table-select-column"

interface TestRow {
  id: string
}

const columns = [{ accessorKey: "id", header: "ID" }]
const tableData: TestRow[] = [{ id: "1" }, { id: "2" }]
const SECOND_ROW_INDEX = 1

function useDefaultSelectionTable() {
  const [rowSelection, setRowSelection] = useState({})

  return useReactTable({
    columns,
    data: tableData,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  })
}

function useSelectiveSelectionTable() {
  const [rowSelection, setRowSelection] = useState({})

  return useReactTable({
    columns,
    data: tableData,
    enableRowSelection: (row) => row.original.id === "1",
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  })
}

describe("data table select column", () => {
  it("toggles all page rows from the header checkbox", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useDefaultSelectionTable())
    const toggleAllPageRowsSelected = vi.spyOn(result.current, "toggleAllPageRowsSelected")
    const props = getDataTableSelectHeaderCheckboxProps(result.current)

    act(() => {
      props.onCheckedChange(true)
    })

    expect(toggleAllPageRowsSelected).toHaveBeenCalledWith(true)
  })

  it("marks the cell checkbox disabled when the row cannot be selected", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useSelectiveSelectionTable())
    const secondRow = result.current.getRowModel().rows.at(SECOND_ROW_INDEX)

    expect(secondRow).toBeDefined()
    expect(getDataTableSelectCellCheckboxProps(secondRow!).disabled).toBe(true)
  })
})
