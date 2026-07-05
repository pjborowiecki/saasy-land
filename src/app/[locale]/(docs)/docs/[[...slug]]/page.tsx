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

export default async function DocumentationPage({ params }: PageProps<"/[locale]/docs/[[...slug]]">): Promise<JSX.Element> {
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
        <Mdx components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
    </DocsPage>
  )
}
