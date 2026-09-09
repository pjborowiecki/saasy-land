import { QueryClient } from "@tanstack/react-query"
import { afterEach, describe, expect, it, vi } from "vite-plus/test"

import { blogPostsQuery } from "~/src/integrations/fumadocs/fumadocs.blog"

const getPages = vi.hoisted(() =>
  vi.fn((locale: string) => [
    {
      data: { published: true, structuredData: { contents: [] }, title: locale },
      path: "example.mdx",
      url: "/blog/example",
    },
  ]),
)

vi.mock("~/src/integrations/fumadocs/fumadocs.source", () => ({ blogSource: { getPages } }))
vi.mock("~/src/integrations/fumadocs/mdx", () => ({ getMDXComponents: () => ({}) }))
vi.mock("collections/browser", () => ({ default: { blog: { createClientLoader: () => ({}) } } }))

afterEach(() => vi.clearAllMocks())

describe("blog query cache", () => {
  it("fetches the keyed locale and keeps translated results separate", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const english = await queryClient.query(blogPostsQuery("en-US"))
    const polish = await queryClient.query(blogPostsQuery("pl-PL"))

    expect(getPages).toHaveBeenNthCalledWith(1, "en-US")
    expect(getPages).toHaveBeenNthCalledWith(2, "pl-PL")
    expect(english).toMatchObject([{ data: { title: "en-US" }, url: "/blog/example" }])
    expect(polish).toMatchObject([{ data: { title: "pl-PL" }, url: "/pl-PL/blog/example" }])
    await expect(queryClient.query(blogPostsQuery("en-US"))).resolves.toEqual(english)
    await expect(queryClient.query(blogPostsQuery("pl-PL"))).resolves.toEqual(polish)
    expect(getPages).toHaveBeenCalledTimes(2)
  })
})
