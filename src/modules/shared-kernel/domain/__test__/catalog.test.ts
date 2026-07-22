import { nonEmptyTuple } from "~/src/modules/shared-kernel/domain/catalog"

describe("catalog helpers", () => {
  it("returns a non-empty tuple for populated catalogs", () => {
    expect.hasAssertions()
    expect(nonEmptyTuple(["USD", "EUR"] as const)).toStrictEqual(["USD", "EUR"])
  })

  it("rejects empty catalogs", () => {
    expect.hasAssertions()
    expect(() => nonEmptyTuple([])).toThrow("Catalog must not be empty")
  })
})
