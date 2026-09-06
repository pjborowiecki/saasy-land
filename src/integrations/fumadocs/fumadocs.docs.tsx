import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import browserCollections from "collections/browser"
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"
import { MdxSourcePath, getMDXComponents } from "~/src/integrations/fumadocs/mdx"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

export const getDocsTree = createServerFn({ method: "GET" }).handler(async () => ({
  tree: await source.serializePageTree(source.getPageTree(getCurrentLocale())),
}))

const getDocsPage = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const page = source.getPage(slug ? slug.split("/") : [], getCurrentLocale())
    if (!page) {
      throw notFound()
    }
    return { description: page.data.description ?? "", path: page.path, pathname: page.url, title: page.data.title }
  })

export const docsLoader = browserCollections.docs.createClientLoader<{ path: string }>({
  component: ({ default: Mdx, frontmatter, toc }, { path }) => (
    <DocsPage toc={toc} full={frontmatter.full}>
      <DocsTitle>{frontmatter.title}</DocsTitle>
      <DocsDescription>{frontmatter.description}</DocsDescription>
      <DocsBody>
        <MdxSourcePath value={path}>
          <Mdx components={getMDXComponents()} />
        </MdxSourcePath>
      </DocsBody>
    </DocsPage>
  ),
  id: "docs",
})

export const loadDocsPage = async (slug = "") => {
  const page = await getDocsPage({ data: slug })
  await docsLoader.preload(page.path)
  return page
}
