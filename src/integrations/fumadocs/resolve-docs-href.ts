import { I18N } from "~/src/integrations/use-intl/i18n.config"

const LOCALIZED_MDX_EXTENSION = new RegExp(`(?:\\.(?:${I18N.SUPPORTED_LOCALES.join("|")}))?\\.mdx?$`, "u")

/** Resolve MDX links against their source file, including directory index pages. */
export const resolveDocsRelativeHref = ({
  href,
  pathname,
  sourcePath,
}: {
  href: string
  pathname: string
  sourcePath?: string | undefined
}): string => {
  if (!href.startsWith("./") && !href.startsWith("../")) {
    return href
  }
  const basePath = sourcePath === undefined ? pathname : `/docs/${sourcePath}`
  const url = new URL(href, `https://docs.invalid${basePath}`)
  url.pathname = url.pathname.replace(LOCALIZED_MDX_EXTENSION, "").replace(/\/index$/u, "")
  return `${url.pathname}${url.search}${url.hash}`
}
