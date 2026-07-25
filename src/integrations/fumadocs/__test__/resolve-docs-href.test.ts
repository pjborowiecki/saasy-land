import { resolveDocsRelativeHref } from "~/src/integrations/fumadocs/resolve-docs-href"

describe("docs relative href resolution", () => {
  it("returns absolute and non-relative hrefs unchanged", () => {
    expect.hasAssertions()
    const resolveHref = vi.fn<(href: string) => string>()

    expect(resolveDocsRelativeHref(resolveHref, "/docs/architecture")).toBe("/docs/architecture")
    expect(resolveDocsRelativeHref(resolveHref, "https://example.com")).toBe("https://example.com")
    expect(resolveHref).not.toHaveBeenCalled()
  })

  it("retries with .mdx when bare relative href is unresolved", () => {
    expect.hasAssertions()
    const resolveHref = vi
      .fn<(href: string) => string>()
      .mockReturnValueOnce("./directory-structure")
      .mockReturnValueOnce("/docs/architecture/directory-structure")

    expect(resolveDocsRelativeHref(resolveHref, "./directory-structure")).toBe("/docs/architecture/directory-structure")
    expect(resolveHref).toHaveBeenCalledWith("./directory-structure")
    expect(resolveHref).toHaveBeenCalledWith("./directory-structure.mdx")
  })

  it("preserves hash fragments when retrying with .mdx", () => {
    expect.hasAssertions()
    const resolveHref = vi
      .fn<(href: string) => string>()
      .mockReturnValueOnce("./directory-structure#shape")
      .mockReturnValueOnce("/docs/architecture/directory-structure#shape")

    expect(resolveDocsRelativeHref(resolveHref, "./directory-structure#shape")).toBe("/docs/architecture/directory-structure#shape")
    expect(resolveHref).toHaveBeenCalledWith("./directory-structure.mdx#shape")
  })
})
