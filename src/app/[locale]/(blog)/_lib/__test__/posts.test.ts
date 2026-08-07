import { isBlogIndex, isPublished, sortPostsByDateDesc, summaryFromFrontmatter } from "~/src/app/[locale]/(blog)/_lib/posts"

describe("is blog index component", () => {
  it("returns true for undefined slug", () => {
    expect.hasAssertions()
    expect(isBlogIndex()).toBe(true)
  })

  it("returns true for empty slug array", () => {
    expect.hasAssertions()
    expect(isBlogIndex([])).toBe(true)
  })

  it("returns false when slug has segments", () => {
    expect.hasAssertions()
    expect(isBlogIndex(["hello-world"])).toBe(false)
  })
})
describe("summary from frontmatter component", () => {
  it("prefers excerpt over description", () => {
    expect.hasAssertions()
    expect(summaryFromFrontmatter({ description: "desc", excerpt: "excerpt" })).toBe("excerpt")
  })

  it("falls back to description when excerpt is missing", () => {
    expect.hasAssertions()
    expect(summaryFromFrontmatter({ description: "desc" })).toBe("desc")
  })

  it("returns undefined when neither field exists", () => {
    expect.hasAssertions()
    expect(summaryFromFrontmatter({})).toBeUndefined()
  })
})
describe("is published component", () => {
  it("treats missing published flag as published", () => {
    expect.hasAssertions()
    expect(isPublished({})).toBe(true)
  })

  it("returns false when published is explicitly false", () => {
    expect.hasAssertions()
    expect(isPublished({ published: false })).toBe(false)
  })
})
describe("sort posts by date desc component", () => {
  it("sorts posts by date descending without mutating input", () => {
    expect.hasAssertions()
    const posts = [{ data: { date: "2024-01-01" } }, { data: { date: "2025-06-01" } }, { data: { date: "2023-12-01" } }]
    const sorted = sortPostsByDateDesc(posts)
    expect(sorted.map((post) => post.data.date)).toStrictEqual(["2025-06-01", "2024-01-01", "2023-12-01"])
    expect(posts.map((post) => post.data.date)).toStrictEqual(["2024-01-01", "2025-06-01", "2023-12-01"])
  })
})
