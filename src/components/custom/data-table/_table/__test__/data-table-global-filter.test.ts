/** @vitest-environment jsdom */

import { createColumnHelper, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table"
import { renderHook } from "@testing-library/react"

import { createDataTableGlobalFilterFn } from "~/src/components/custom/data-table/_table/data-table-global-filter"

interface PersonRow {
  email?: string
  name: string
}

interface MixedRow {
  active: boolean
  meta: { nested: string }
  name: string
  score: number
}

const columnHelper = createColumnHelper<PersonRow>()
const columns = [columnHelper.accessor("name", { header: "Name" }), columnHelper.accessor("email", { header: "Email" })]
const people: PersonRow[] = [
  { email: "ada@example.com", name: "Ada Lovelace" },
  { email: "grace@example.com", name: "Grace Hopper" },
]
const ADA_MATCH_COUNT = 1
const DOMAIN_MATCH_COUNT = 2
const NO_MATCH_COUNT = 0
const NON_STRING_FILTER_VALUE = 42
const CLEARED_ORIGINAL: unknown = JSON.parse("null")
const [FIRST_PERSON] = people

function noopAddMeta(): void {
  // FilterFn requires an addMeta callback; unused in these unit tests.
}

function invokeGlobalFilter(rowOriginal: unknown, filterValue: unknown): boolean {
  const filterFn = createDataTableGlobalFilterFn()
  return Boolean(Reflect.apply(filterFn, undefined, [{ original: rowOriginal }, "name", filterValue, noopAddMeta]))
}

const mixedColumnHelper = createColumnHelper<MixedRow>()
const mixedColumns = [mixedColumnHelper.accessor("name", { header: "Name" }), mixedColumnHelper.accessor("score", { header: "Score" })]
const mixedPeople: MixedRow[] = [
  { active: true, meta: { nested: "skip" }, name: "Ada", score: 42 },
  { active: false, meta: { nested: "skip" }, name: "Grace", score: 7 },
]

describe("data table global filter matching", () => {
  it("matches any string field on the original row", () => {
    expect.hasAssertions()

    const { result: adaResult } = renderHook(() =>
      useReactTable({
        columns,
        data: people,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: createDataTableGlobalFilterFn<PersonRow>(),
        state: { globalFilter: "ada" },
      }),
    )

    const { result: domainResult } = renderHook(() =>
      useReactTable({
        columns,
        data: people,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: createDataTableGlobalFilterFn<PersonRow>(),
        state: { globalFilter: "example.com" },
      }),
    )

    const { result: missResult } = renderHook(() =>
      useReactTable({
        columns,
        data: people,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: createDataTableGlobalFilterFn<PersonRow>(),
        state: { globalFilter: "linus" },
      }),
    )

    expect(adaResult.current.getFilteredRowModel().rows).toHaveLength(ADA_MATCH_COUNT)
    expect(domainResult.current.getFilteredRowModel().rows).toHaveLength(DOMAIN_MATCH_COUNT)
    expect(missResult.current.getFilteredRowModel().rows).toHaveLength(NO_MATCH_COUNT)
  })

  it("treats blank queries as a match", () => {
    expect.hasAssertions()

    const { result } = renderHook(() =>
      useReactTable({
        columns,
        data: people,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: createDataTableGlobalFilterFn<PersonRow>(),
        state: { globalFilter: "   " },
      }),
    )

    expect(result.current.getFilteredRowModel().rows).toHaveLength(people.length)
  })
})

describe("data table global filter edge cases", () => {
  it("matches numeric and boolean fields and ignores non-primitive values", () => {
    expect.hasAssertions()

    const { result: numberResult } = renderHook(() =>
      useReactTable({
        columns: mixedColumns,
        data: mixedPeople,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: createDataTableGlobalFilterFn<MixedRow>(),
        state: { globalFilter: "42" },
      }),
    )

    const { result: booleanResult } = renderHook(() =>
      useReactTable({
        columns: mixedColumns,
        data: mixedPeople,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: createDataTableGlobalFilterFn<MixedRow>(),
        state: { globalFilter: "true" },
      }),
    )

    const { result: nestedMissResult } = renderHook(() =>
      useReactTable({
        columns: mixedColumns,
        data: mixedPeople,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: createDataTableGlobalFilterFn<MixedRow>(),
        state: { globalFilter: "skip" },
      }),
    )

    expect(numberResult.current.getFilteredRowModel().rows).toHaveLength(ADA_MATCH_COUNT)
    expect(booleanResult.current.getFilteredRowModel().rows).toHaveLength(ADA_MATCH_COUNT)
    expect(nestedMissResult.current.getFilteredRowModel().rows).toHaveLength(NO_MATCH_COUNT)
  })

  it("rejects rows whose original value is not an object", () => {
    expect.hasAssertions()

    expect(invokeGlobalFilter("not-an-object", "not")).toBe(false)
    expect(invokeGlobalFilter(CLEARED_ORIGINAL, "not")).toBe(false)
  })

  it("treats non-string filter values as an empty query", () => {
    expect.hasAssertions()
    expect(FIRST_PERSON).toBeDefined()
    expect(invokeGlobalFilter(FIRST_PERSON, NON_STRING_FILTER_VALUE)).toBe(true)
  })
})
