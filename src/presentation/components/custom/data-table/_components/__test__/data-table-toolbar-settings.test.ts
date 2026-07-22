import { nextRowDensityFromSelection } from "~/src/presentation/components/custom/data-table/_components/data-table-toolbar-settings"

describe("next row density from selection", () => {
  it("ignores the all selection sentinel", () => {
    expect.hasAssertions()
    expect(nextRowDensityFromSelection("all")).toBeUndefined()
  })

  it("ignores empty and unknown keys", () => {
    expect.hasAssertions()
    expect(nextRowDensityFromSelection(new Set())).toBeUndefined()
    expect(nextRowDensityFromSelection(new Set(["not-a-density"]))).toBeUndefined()
  })

  it("returns a valid density", () => {
    expect.hasAssertions()
    expect(nextRowDensityFromSelection(new Set(["compact"]))).toBe("compact")
  })
})
