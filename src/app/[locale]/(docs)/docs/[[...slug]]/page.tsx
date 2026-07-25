import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense, type ComponentProps, type JSX } from "react"

import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page"
import defaultMdxComponents from "fumadocs-ui/mdx"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"
import { getMDXComponents } from "~/src/integrations/fumadocs/mdx"
import { resolveDocsRelativeHref } from "~/src/integrations/fumadocs/resolve-docs-href"
import type { Locale } from "~/src/integrations/next-intl/i18n.config"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

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
  const { locale, slug } = await params

  const page = source.getPage(slug, locale)
  if (!page) {
    notFound()
  }

  return {
    description: page.data.description,
    title: page.data.title,
  }
}

export function generateStaticParams(): { locale: Locale; slug: string[] | undefined }[] {
  const EMPTY_SLUGS_LENGTH = 0

  return routing.locales.flatMap((locale) =>
    source.getPages(locale).map((page) => ({
      locale,
      slug: page.slugs.length > EMPTY_SLUGS_LENGTH ? page.slugs : undefined,
    })),
  )
}

async function DocumentationPageContent({ params }: DocsPageProps): Promise<JSX.Element> {
  const { locale, slug } = await params

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

export default function DocumentationPage(props: DocsPageProps): JSX.Element {
  return (
    <Suspense fallback={DOCS_PAGE_FALLBACK}>
      <DocumentationPageContent {...props} />
    </Suspense>
  )
}
