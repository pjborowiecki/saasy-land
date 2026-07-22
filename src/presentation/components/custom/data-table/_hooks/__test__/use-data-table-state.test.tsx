/** @vitest-environment jsdom */

import { act, renderHook } from "@testing-library/react"

import { useDataTableInteractiveState } from "~/src/presentation/components/custom/data-table/_hooks/use-data-table-state"

const UPDATED_PAGE_INDEX = 1
const UPDATED_PAGE_SIZE = 20
const ROW_COUNT_FOR_PAGINATION = 100
const SMALL_ROW_COUNT = 15
const OUT_OF_BOUNDS_PAGE_INDEX = 4
const CLAMPED_PAGE_INDEX_AFTER_SHRINK = 1

describe("use data table local state", () => {
  it("updates pagination with TanStack setState-compatible updaters", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useDataTableInteractiveState(undefined, ROW_COUNT_FOR_PAGINATION))

    act(() => {
      result.current.onPaginationChange({ pageIndex: UPDATED_PAGE_INDEX, pageSize: UPDATED_PAGE_SIZE })
    })

    expect(result.current.tableState.pagination).toStrictEqual({
      pageIndex: UPDATED_PAGE_INDEX,
      pageSize: UPDATED_PAGE_SIZE,
    })
  })

  it("clamps pagination when the row count shrinks below the current page", () => {
    expect.hasAssertions()

    const { result, rerender } = renderHook(({ rowCount }: { rowCount: number }) => useDataTableInteractiveState(undefined, rowCount), {
      initialProps: { rowCount: ROW_COUNT_FOR_PAGINATION },
    })

    act(() => {
      result.current.onPaginationChange({ pageIndex: OUT_OF_BOUNDS_PAGE_INDEX, pageSize: 10 })
    })

    expect(result.current.tableState.pagination.pageIndex).toBe(OUT_OF_BOUNDS_PAGE_INDEX)

    rerender({ rowCount: SMALL_ROW_COUNT })

    expect(result.current.tableState.pagination.pageIndex).toBe(CLAMPED_PAGE_INDEX_AFTER_SHRINK)
  })

  it("updates sorting and row selection independently", () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useDataTableInteractiveState(undefined, ROW_COUNT_FOR_PAGINATION))

    act(() => {
      result.current.onSortingChange([{ desc: false, id: "name" }])
      result.current.onRowSelectionChange({ "1": true })
    })

    expect(result.current.tableState.sorting).toStrictEqual([{ desc: false, id: "name" }])
    expect(result.current.tableState.rowSelection).toStrictEqual({ "1": true })
  })
})
