import { expect, it } from "vite-plus/test"

import { resolveDocsRelativeHref } from "~/src/integrations/fumadocs/resolve-docs-href"

it.each([
  ["/docs/architecture", "/docs/architecture"],
  ["https://example.com", "https://example.com"],
  ["#shape", "#shape"],
  ["./directory-structure", "/docs/architecture/directory-structure"],
  ["./directory-structure#shape", "/docs/architecture/directory-structure#shape"],
  ["./directory-structure.en-US.mdx?mode=full#shape", "/docs/architecture/directory-structure?mode=full#shape"],
  ["../getting-started/index.pl-PL.mdx", "/docs/getting-started"],
])("resolves %s from a directory index", (href, expected) => {
  expect(resolveDocsRelativeHref({ href, pathname: "/docs/architecture", sourcePath: "architecture/index.en-US.mdx" })).toBe(expected)
})

it("resolves sibling blog links without a documentation source path", () => {
  expect(resolveDocsRelativeHref({ href: "./another-post", pathname: "/blog/first-post" })).toBe("/blog/another-post")
})
