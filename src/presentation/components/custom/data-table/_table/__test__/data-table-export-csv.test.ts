/** @vitest-environment jsdom */

import { createColumnHelper, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table"
import { renderHook } from "@testing-library/react"

import {
  buildDataTableCsv,
  downloadDataTableCsv,
  exportDataTableCsv,
} from "~/src/presentation/components/custom/data-table/_table/data-table-export-csv"
import { DATA_TABLE_SELECT_COLUMN_ID } from "~/src/presentation/components/custom/data-table/_table/data-table-select-column"
import { DATA_TABLE_ACTIONS_COLUMN_ID } from "~/src/presentation/components/custom/data-table/_table/data-table-system-columns"

interface Row {
  active: boolean
  email: string | undefined
  meta: { nested: string }
  name: string
  score: number
}

const columnHelper = createColumnHelper<Row>()
const BLOB_URL = "blob:csv"

const CSV_TABLE_DATA: Row[] = [
  { active: true, email: "a@example.com", meta: { nested: "x" }, name: 'Ada "Lovelace"', score: 1 },
  { active: false, email: undefined, meta: { nested: "y" }, name: "Grace, Hopper", score: 0 },
  { active: true, email: undefined, meta: { nested: "z" }, name: "Plain", score: 2 },
]

const nameEmailColumns = [
  { header: "Select", id: DATA_TABLE_SELECT_COLUMN_ID },
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("email", { header: "Email" }),
  { header: "Actions", id: DATA_TABLE_ACTIONS_COLUMN_ID },
]

const mixedValueColumns = [
  columnHelper.accessor("score", { header: () => "Score" }),
  columnHelper.accessor("active", { header: "Active" }),
  columnHelper.accessor("meta", {
    header: "Meta",
    id: "meta",
  }),
]

const nameOnlyColumns = [columnHelper.accessor("name", { header: "Name" })]

describe("data table csv export", () => {
  it("exports visible data columns and escapes values", () => {
    expect.hasAssertions()

    const { result } = renderHook(() =>
      useReactTable({
        columns: nameEmailColumns,
        data: CSV_TABLE_DATA,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
      }),
    )

    expect(buildDataTableCsv(result.current)).toBe(
      ["Name,Email", '"Ada ""Lovelace""",a@example.com', '"Grace, Hopper",', "Plain,"].join("\n"),
    )
  })

  it("stringifies object and boolean cells and falls back to column id for non-string headers", () => {
    expect.hasAssertions()

    const { result } = renderHook(() =>
      useReactTable({
        columns: mixedValueColumns,
        data: CSV_TABLE_DATA,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
      }),
    )

    expect(buildDataTableCsv(result.current)).toBe(
      ["score,Active,Meta", '1,true,"{""nested"":""x""}"', '0,false,"{""nested"":""y""}"', '2,true,"{""nested"":""z""}"'].join("\n"),
    )
  })
})

describe("data table csv download helpers", () => {
  it("downloads csv and returns the built string from exportDataTableCsv", () => {
    expect.hasAssertions()

    const createObjectURL = vi.fn<() => string>(() => BLOB_URL)
    const revokeObjectURL = vi.fn<(url: string) => void>()
    const click = vi.fn<() => void>()
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(click)

    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL,
    })

    const { result } = renderHook(() =>
      useReactTable({
        columns: nameOnlyColumns,
        data: CSV_TABLE_DATA,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
      }),
    )

    const csv = exportDataTableCsv(result.current, "people.csv")
    downloadDataTableCsv("solo", "solo.csv")

    expect(csv).toContain("Name")
    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    expect(click).toHaveBeenCalledWith()
    expect(revokeObjectURL).toHaveBeenCalledWith(BLOB_URL)

    clickSpy.mockRestore()
    vi.unstubAllGlobals()
  })
})
