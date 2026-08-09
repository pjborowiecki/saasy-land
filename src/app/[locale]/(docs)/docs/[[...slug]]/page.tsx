import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense, type ComponentProps, type JSX } from "react"

import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page"
import defaultMdxComponents from "fumadocs-ui/mdx"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"
import { getMDXComponents } from "~/src/integrations/fumadocs/mdx"
import { resolveDocsRelativeHref } from "~/src/integrations/fumadocs/resolve-docs-href"
import { getRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

type MdxAnchorProps = ComponentProps<NonNullable<(typeof defaultMdxComponents)["a"]>>
type DocsPageModel = NonNullable<ReturnType<typeof source.getPage>>
type DocsPageProps = PageProps<"/[locale]/docs/[[...slug]]">

const DOCS_PAGE_FALLBACK = <div className="min-h-[50vh] w-full animate-pulse rounded-lg bg-fd-muted/30" />

function createDocsRelativeLink(page: DocsPageModel) {
  const OverrideLink = defaultMdxComponents.a

  return function DocsRelativeLink({ href, ...props }: MdxAnchorProps) {
    const resolvedHref = typeof href === "string" ? resolveDocsRelativeHref((nextHref) => source.resolveHref(nextHref, page), href) : href

    return <OverrideLink href={resolvedHref} {...props} />
  }
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getRootLocale()])

  const page = source.getPage(slug, locale)
  if (!page) {
    notFound()
  }

  return {
    description: page.data.description,
    title: page.data.title,
  }
}

// Nested under the root layout's own generateStaticParams, so Next runs this once per
// locale and the root param is readable here — no locale cross-product needed.
export async function generateStaticParams(): Promise<{ slug: string[] | undefined }[]> {
  const EMPTY_SLUGS_LENGTH = 0
  const locale = await getRootLocale()

  return source.getPages(locale).map((page) => ({
    slug: page.slugs.length > EMPTY_SLUGS_LENGTH ? page.slugs : undefined,
  }))
}

async function DocumentationPageContent({ params }: Pick<DocsPageProps, "params">): Promise<JSX.Element> {
  const [{ slug }, locale] = await Promise.all([params, getRootLocale()])

  const page = source.getPage(slug, locale)
  if (!page) {
    notFound()
  }

  const Mdx = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <Mdx components={getMDXComponents({ a: createDocsRelativeLink(page) })} />
      </DocsBody>
    </DocsPage>
  )
}

export default function DocumentationPage({ params }: DocsPageProps): JSX.Element {
  return (
    <Suspense fallback={DOCS_PAGE_FALLBACK}>
      <DocumentationPageContent params={params} />
    </Suspense>
  )
}
