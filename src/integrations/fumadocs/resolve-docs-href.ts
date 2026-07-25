const HASH_NOT_FOUND_INDEX = -1

/**
 * Fumadocs `resolveHref` only matches storage keys that keep the `.mdx` extension.
 * Markdown authors usually write `./page-slug` without it — retry with `.mdx` when needed.
 */
export function resolveDocsRelativeHref(resolveHref: (href: string) => string, href: string): string {
  if (!href.startsWith("./") && !href.startsWith("../")) {
    return href
  }

  const resolved = resolveHref(href)
  if (resolved !== href) {
    return resolved
  }

  const hashIndex = href.indexOf("#")
  const pathPart = hashIndex === HASH_NOT_FOUND_INDEX ? href : href.slice(0, hashIndex)
  const hashPart = hashIndex === HASH_NOT_FOUND_INDEX ? "" : href.slice(hashIndex)

  if (pathPart.endsWith(".mdx") || pathPart.endsWith(".md")) {
    return href
  }

  return resolveHref(`${pathPart}.mdx${hashPart}`)
}
