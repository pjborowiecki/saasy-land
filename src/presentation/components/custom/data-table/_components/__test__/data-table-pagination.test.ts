import {
  applyPageSizeSelection,
  parsePageSizeSelection,
} from "~/src/presentation/components/custom/data-table/_components/data-table-pagination"

const MISSING_SELECTION = undefined
const PAGE_SIZE_TWENTY_FIVE = 25
const PAGE_SIZE_FIFTY = 50

describe("parse page size selection", () => {
  it("ignores missing select values", () => {
    expect.hasAssertions()
    expect(parsePageSizeSelection(MISSING_SELECTION)).toBeUndefined()
  })

  it("ignores empty string", () => {
    expect.hasAssertions()
    expect(parsePageSizeSelection("")).toBeUndefined()
  })

  it("parses string and number sizes", () => {
    expect.hasAssertions()
    expect(parsePageSizeSelection(String(PAGE_SIZE_TWENTY_FIVE))).toBe(PAGE_SIZE_TWENTY_FIVE)
    expect(parsePageSizeSelection(PAGE_SIZE_FIFTY)).toBe(PAGE_SIZE_FIFTY)
  })
})

describe("page size selection side effects", () => {
  it("calls setPageSize for valid sizes", () => {
    expect.hasAssertions()
    const setPageSize = vi.fn<Parameters<typeof applyPageSizeSelection>[1]>()

    applyPageSizeSelection(String(PAGE_SIZE_TWENTY_FIVE), setPageSize)

    expect(setPageSize).toHaveBeenCalledWith(PAGE_SIZE_TWENTY_FIVE)
  })

  it("skips setPageSize for cleared values", () => {
    expect.hasAssertions()
    const setPageSize = vi.fn<Parameters<typeof applyPageSizeSelection>[1]>()

    applyPageSizeSelection("", setPageSize)

    expect(setPageSize).not.toHaveBeenCalled()
  })
})
