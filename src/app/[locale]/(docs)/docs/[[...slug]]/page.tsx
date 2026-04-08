import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page"
import { createRelativeLink } from "fumadocs-ui/mdx"

import type { Locale } from "~/src/constants/types"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"
import { getMDXComponents } from "~/src/integrations/fumadocs/mdx"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

export async function generateMetadata({ params }: PageProps<"/[locale]/docs/[[...slug]]">): Promise<Metadata> {
  const { locale, slug } = await params

  const page = source.getPage(slug, locale)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export function generateStaticParams(): Array<{ locale: Locale; slug: string[] | undefined }> {
  return routing.locales.flatMap((locale) =>
    source.getPages(locale).map((page) => ({
      locale,
      slug: page.slugs.length > 0 ? page.slugs : undefined,
    })),
  )
}

export default async function DocumentationPage({ params }: PageProps<"/[locale]/docs/[[...slug]]">): Promise<JSX.Element> {
  const { locale, slug } = await params

  const page = source.getPage(slug, locale)
  if (!page) notFound()

  const Mdx = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <Mdx components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
    </DocsPage>
  )
}
