import { isBlogIndex, isPublished, sortPostsByDateDesc, summaryFromFrontmatter } from "~/src/lib/_utils/blog"
import { cn } from "~/src/lib/_utils/ui"
import * as utils from "~/src/lib/utils"

describe("lib/utils re-exports", () => {
  it("re-exports blog helpers from lib/utils", () => {
    expect.hasAssertions()
    expect(utils.isBlogIndex()).toBe(true)
    expect(utils.isPublished({})).toBe(true)
  })

  it("re-exports blog helpers", () => {
    expect.hasAssertions()
    expect(isBlogIndex()).toBe(true)
    expect(isPublished({})).toBe(true)
    expect(summaryFromFrontmatter({ description: "desc" })).toBe("desc")
    expect(sortPostsByDateDesc([{ data: { date: "2024-01-01" } }, { data: { date: "2025-01-01" } }])[0]?.data.date).toBe("2025-01-01")
  })

  it("re-exports ui helpers", () => {
    expect.hasAssertions()
    expect(cn("a", "b")).toBe("a b")
  })
})
