import { ariaSort } from "~/src/presentation/components/custom/data-table/utils/data-table-aria"
import { alignClass } from "~/src/presentation/components/custom/data-table/utils/data-table-column-style"
import { toggleAllPageRowsSelected, toggleRowSelected } from "~/src/presentation/components/custom/data-table/utils/data-table-selection"

describe("aria sort", () => {
  it("maps ascending", () => {
    expect.hasAssertions()
    expect(ariaSort("asc")).toBe("ascending")
  })

  it("maps descending", () => {
    expect.hasAssertions()
    expect(ariaSort("desc")).toBe("descending")
  })

  it("maps an unsorted column to none", () => {
    expect.hasAssertions()
    expect(ariaSort(false)).toBe("none")
  })
})

describe("align class", () => {
  it("aligns right", () => {
    expect.hasAssertions()
    expect(alignClass("right")).toBe("text-right")
  })

  it("aligns center", () => {
    expect.hasAssertions()
    expect(alignClass("center")).toBe("text-center has-[[role=checkbox]]:px-0")
  })

  it("leaves left and unset columns to the table default", () => {
    expect.hasAssertions()
    expect(alignClass("left")).toBeUndefined()
    expect(alignClass()).toBeUndefined()
  })
})

describe("selection handlers", () => {
  it("returns one stable handler per row that toggles live state", () => {
    expect.hasAssertions()

    const toggled: boolean[] = []
    const row = {
      toggleSelected: (selected: boolean) => {
        toggled.push(selected)
      },
    }

    const handler = toggleRowSelected(row)
    handler(true)
    handler(false)

    expect(toggleRowSelected(row)).toBe(handler)
    expect(toggled).toStrictEqual([true, false])
  })

  it("returns one stable handler per table for select-all", () => {
    expect.hasAssertions()

    const toggled: boolean[] = []
    const table = {
      toggleAllPageRowsSelected: (selected: boolean) => {
        toggled.push(selected)
      },
    }

    const handler = toggleAllPageRowsSelected(table)
    handler(true)

    expect(toggleAllPageRowsSelected(table)).toBe(handler)
    expect(toggled).toStrictEqual([true])
  })
})
