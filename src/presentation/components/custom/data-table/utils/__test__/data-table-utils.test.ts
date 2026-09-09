import { describe, expect, it } from "vite-plus/test"

import { ariaSort } from "~/src/presentation/components/custom/data-table/utils/data-table-aria"
import { alignClass } from "~/src/presentation/components/custom/data-table/utils/data-table-column-style"

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
