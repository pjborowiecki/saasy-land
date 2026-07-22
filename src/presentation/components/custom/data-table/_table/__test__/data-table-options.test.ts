import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"
import {
  clampDataTablePaginationState,
  getDataTableRowId,
  mergeDataTableOptions,
  resolveDataTablePageSizeOptions,
  splitDataTableOptions,
} from "~/src/presentation/components/custom/data-table/_table/data-table-options"

const CUSTOM_PAGE_SIZE_FIVE = 5
const CUSTOM_PAGE_SIZE_TWENTY_FIVE = 25
const ROW_INDEX_FALLBACK = 3
const NUMERIC_ROW_ID = 42
const CUSTOM_PAGE_SIZE_OPTIONS = [CUSTOM_PAGE_SIZE_FIVE, CUSTOM_PAGE_SIZE_TWENTY_FIVE] as const
const { PAGINATION } = DATA_TABLE
const THIRTY_ROW_COUNT = 30
const OUT_OF_BOUNDS_PAGE_INDEX = 4

describe("data table options", () => {
  it("splits UI features from TanStack table options", () => {
    expect.hasAssertions()

    const { features, tableOptions } = splitDataTableOptions({
      emptyMessage: "None",
      enableRowSelection: false,
      enableSelectionColumn: true,
      showPagination: false,
      toolbar: { search: { placeholder: "Find" } },
    })

    expect(features).toStrictEqual({
      emptyMessage: "None",
      enableSelectionColumn: true,
      showPagination: false,
      toolbar: { search: { placeholder: "Find" } },
    })
    expect(tableOptions).toStrictEqual({ enableRowSelection: false })
    expect(mergeDataTableOptions({ emptyMessage: "None", enableRowSelection: false }).enableRowSelection).toBe(false)
  })

  it("disables autoResetPageIndex by default for controlled pagination", () => {
    expect.hasAssertions()

    expect(mergeDataTableOptions().autoResetPageIndex).toBe(false)
  })

  it("wires pagination and sorting row models", () => {
    expect.hasAssertions()

    const merged = mergeDataTableOptions()

    expect(merged.getCoreRowModel).toBeTypeOf("function")
    expect(merged.getPaginationRowModel).toBeTypeOf("function")
    expect(merged.getSortedRowModel).toBeTypeOf("function")
  })

  it("returns default page size options when none are provided", () => {
    expect.hasAssertions()

    expect(resolveDataTablePageSizeOptions()).toStrictEqual(PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS)
    expect(resolveDataTablePageSizeOptions([])).toStrictEqual(PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS)
  })

  it("returns custom page size options when provided", () => {
    expect.hasAssertions()

    expect(resolveDataTablePageSizeOptions(CUSTOM_PAGE_SIZE_OPTIONS)).toStrictEqual(CUSTOM_PAGE_SIZE_OPTIONS)
  })

  it("falls back to the row index when a row has no id", () => {
    expect.hasAssertions()

    expect(getDataTableRowId({ name: "No id" }, ROW_INDEX_FALLBACK)).toBe(String(ROW_INDEX_FALLBACK))
  })

  it("uses numeric ids when present on the row", () => {
    expect.hasAssertions()

    expect(getDataTableRowId({ id: NUMERIC_ROW_ID, name: "Numeric id" }, ROW_INDEX_FALLBACK)).toBe(String(NUMERIC_ROW_ID))
  })

  it("uses string ids when present on the row", () => {
    expect.hasAssertions()

    expect(getDataTableRowId({ id: "row-1", name: "String id" }, ROW_INDEX_FALLBACK)).toBe("row-1")
  })

  it("falls back to the row index when id is not a string or number", () => {
    expect.hasAssertions()

    expect(getDataTableRowId({ id: true, name: "Invalid id" }, ROW_INDEX_FALLBACK)).toBe(String(ROW_INDEX_FALLBACK))
  })

  it("clamps out-of-bounds page indexes when row count shrinks", () => {
    expect.hasAssertions()

    const [pageSize] = PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS

    expect(clampDataTablePaginationState({ pageIndex: OUT_OF_BOUNDS_PAGE_INDEX, pageSize }, THIRTY_ROW_COUNT)).toStrictEqual({
      pageIndex: 2,
      pageSize,
    })
  })

  it("resets to the first page when there are no rows", () => {
    expect.hasAssertions()

    const [pageSize] = PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS

    expect(clampDataTablePaginationState({ pageIndex: OUT_OF_BOUNDS_PAGE_INDEX, pageSize }, 0)).toStrictEqual({
      pageIndex: 0,
      pageSize,
    })
  })

  it("clamps negative page indexes up to zero", () => {
    expect.hasAssertions()

    const [pageSize] = PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS
    const negativePageIndex = -1

    expect(clampDataTablePaginationState({ pageIndex: negativePageIndex, pageSize }, THIRTY_ROW_COUNT)).toStrictEqual({
      pageIndex: 0,
      pageSize,
    })
  })
})
