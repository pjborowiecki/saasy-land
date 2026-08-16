import {
  buildPostStructuredData,
  isPublished,
  readingTimeMinutes,
  sortPostsByDateDesc,
  summaryFromFrontmatter,
} from "~/src/app/[locale]/(blog)/_lib/posts"

const GRAPH_NODES_WITHOUT_FAQ = 2
const ONE_MINUTE_OF_WORDS = 220
const TWO_MINUTES_OF_WORDS = 440
const ONE_MINUTE = 1
const TWO_MINUTES = 2
const THREE_MINUTES = 3

const words = (count: number) => ({ content: Array.from({ length: count }, () => "word").join(" ") })

const BASE_INPUT = {
  authorName: "Piotr J. Borowiecki",
  baseUrl: "https://saasyland.com",
  date: "2026-08-15",
  title: "A post",
  url: "/blog/a-post",
} as const

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
describe("reading time minutes component", () => {
  it("returns undefined when there is no extracted prose", () => {
    expect.hasAssertions()
    expect(readingTimeMinutes()).toBeUndefined()
    expect(readingTimeMinutes({})).toBeUndefined()
    expect(readingTimeMinutes({ contents: [] })).toBeUndefined()
  })

  it("returns undefined when the extracted prose has no words", () => {
    expect.hasAssertions()
    expect(readingTimeMinutes({ contents: [{ content: "   " }] })).toBeUndefined()
  })

  it("rounds one minute per 220 words, summed across every extracted block", () => {
    expect.hasAssertions()
    expect(readingTimeMinutes({ contents: [words(TWO_MINUTES_OF_WORDS)] })).toBe(TWO_MINUTES)
    expect(readingTimeMinutes({ contents: [words(ONE_MINUTE_OF_WORDS), words(ONE_MINUTE_OF_WORDS), words(ONE_MINUTE_OF_WORDS)] })).toBe(
      THREE_MINUTES,
    )
  })

  it("never reports less than one minute for a short post", () => {
    expect.hasAssertions()
    expect(readingTimeMinutes({ contents: [{ content: "Three short words" }] })).toBe(ONE_MINUTE)
  })
})
describe("build post structured data component", () => {
  it("emits a BlogPosting and a BreadcrumbList with absolute urls", () => {
    expect.hasAssertions()
    const graph = buildPostStructuredData(BASE_INPUT)["@graph"]
    expect(graph.map((node) => node["@type"])).toStrictEqual(["BlogPosting", "BreadcrumbList"])
    expect(graph[0]?.["url"]).toBe("https://saasyland.com/blog/a-post")
    expect(graph[0]?.["datePublished"]).toBe("2026-08-15T00:00:00.000Z")
  })

  it("falls back to the published date when no update date is given", () => {
    expect.hasAssertions()
    const graph = buildPostStructuredData(BASE_INPUT)["@graph"]
    expect(graph[0]?.["dateModified"]).toBe(graph[0]?.["datePublished"])
  })

  it("uses the update date when one is given", () => {
    expect.hasAssertions()
    const graph = buildPostStructuredData({ ...BASE_INPUT, updated: "2026-09-01" })["@graph"]
    expect(graph[0]?.["dateModified"]).toBe("2026-09-01T00:00:00.000Z")
  })

  it("resolves a relative image path against the base url", () => {
    expect.hasAssertions()
    const graph = buildPostStructuredData({ ...BASE_INPUT, description: "A summary", image: "/images/blog/a.webp" })["@graph"]
    expect(graph[0]?.["image"]).toBe("https://saasyland.com/images/blog/a.webp")
    expect(graph[0]?.["description"]).toBe("A summary")
  })

  it("omits description and image when the frontmatter has neither", () => {
    expect.hasAssertions()
    const graph = buildPostStructuredData(BASE_INPUT)["@graph"]
    expect(graph[0]).not.toHaveProperty("description")
    expect(graph[0]).not.toHaveProperty("image")
  })

  it("appends an FAQPage when the post declares faq entries", () => {
    expect.hasAssertions()
    const graph = buildPostStructuredData({ ...BASE_INPUT, faq: [{ answer: "Because.", question: "Why?" }] })["@graph"]
    expect(graph.map((node) => node["@type"])).toStrictEqual(["BlogPosting", "BreadcrumbList", "FAQPage"])
    expect(graph[2]?.["mainEntity"]).toStrictEqual([
      { "@type": "Question", acceptedAnswer: { "@type": "Answer", text: "Because." }, name: "Why?" },
    ])
  })

  it("skips the FAQPage when the faq list is empty", () => {
    expect.hasAssertions()
    const graph = buildPostStructuredData({ ...BASE_INPUT, faq: [] })["@graph"]
    expect(graph).toHaveLength(GRAPH_NODES_WITHOUT_FAQ)
  })
})
