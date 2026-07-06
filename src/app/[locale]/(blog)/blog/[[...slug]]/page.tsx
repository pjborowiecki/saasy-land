import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { InlineTOC } from "fumadocs-ui/components/inline-toc"
import { createRelativeLink } from "fumadocs-ui/mdx"
import { getTranslations } from "next-intl/server"

import type { Locale } from "~/src/constants/types"

import { blogSource } from "~/src/integrations/fumadocs/fumadocs.source"
import { getMDXComponents } from "~/src/integrations/fumadocs/mdx"
import { Link } from "~/src/integrations/next-intl/i18n.navigation"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

import { isBlogIndex, isPublished, sortPostsByDateDesc, summaryFromFrontmatter } from "~/src/lib/utils"

const EMPTY_TAGS_LENGTH = 0

type BlogSlugPageProps = Readonly<{
  params: Promise<{ locale: Locale; slug?: string[] }>
}>

function hasNonEmptyString(value: string | undefined): value is string {
  return value !== undefined && value.length > EMPTY_TAGS_LENGTH
}

export async function generateMetadata({ params }: BlogSlugPageProps): Promise<Metadata> {
  const { locale, slug } = await params

  if (isBlogIndex(slug)) {
    const t = await getTranslations({ locale, namespace: "pages.blog" })
    return {
      description: t("metadata.description"),
      title: t("metadata.title"),
    }
  }

  const page = blogSource.getPage(slug, locale)
  if (!page) {
    notFound()
  }

  const summary = summaryFromFrontmatter(page.data)
  return {
    description: summary ?? page.data.description,
    title: page.data.title,
  }
}

export function generateStaticParams(): { locale: Locale; slug: string[] | undefined }[] {
  const indexRoutes = routing.locales.map((locale) => ({ locale, slug: undefined }))
  const postRoutes = routing.locales.flatMap((locale) =>
    blogSource
      .getPages(locale)
      .filter((page) => isPublished(page.data))
      .map((page) => ({ locale, slug: page.slugs })),
  )
  return [...indexRoutes, ...postRoutes]
}

export default async function BlogPage({ params }: BlogSlugPageProps): Promise<JSX.Element> {
  const { locale, slug } = await params

  if (isBlogIndex(slug)) {
    const t = await getTranslations({ locale, namespace: "pages.blog" })
    const posts = sortPostsByDateDesc(blogSource.getPages(locale).filter((page) => isPublished(page.data)))

    return (
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold">{t("index.title")}</h1>
        <p className="mb-8 text-fd-muted-foreground">{t("index.description")}</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const summary = summaryFromFrontmatter(post.data)
            return (
              <Link
                key={post.url}
                className="block overflow-hidden rounded-lg border border-fd-border bg-fd-secondary shadow-md transition-colors hover:border-fd-primary/40"
                href={post.url}
              >
                {hasNonEmptyString(post.data.image) ? (
                  <div className="relative aspect-[2.4/1] w-full overflow-hidden border-b border-fd-border bg-fd-muted">
                    <Image alt="" className="object-cover" fill sizes="(max-width: 48rem) 100vw, 24rem" src={post.data.image} />
                  </div>
                ) : undefined}
                <div className="p-6">
                  <h2 className="mb-2 text-xl font-semibold">{post.data.title}</h2>
                  {hasNonEmptyString(summary) ? <p className="text-fd-muted-foreground">{summary}</p> : undefined}
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    )
  }

  const page = blogSource.getPage(slug, locale)
  if (!page) {
    notFound()
  }

  if (!isPublished(page.data)) {
    notFound()
  }

  const { data } = page
  const Mdx = data.body

  const t = await getTranslations({ locale, namespace: "pages.blog" })

  const summary = summaryFromFrontmatter(data)

  return (
    <>
      <div className="mx-auto w-full max-w-[1400px] rounded-xl border px-4 py-12 md:px-8">
        {hasNonEmptyString(data.image) ? (
          <div className="relative mb-6 aspect-[2.4/1] w-full overflow-hidden rounded-lg border border-fd-border bg-fd-muted">
            <Image alt="" className="object-cover" fill priority sizes="(max-width: 48rem) 100vw, 48rem" src={data.image} />
          </div>
        ) : undefined}
        <h1 className="mb-2 text-3xl font-bold">{data.title}</h1>
        {hasNonEmptyString(summary) ? <p className="mb-4 text-fd-muted-foreground">{summary}</p> : undefined}
        {data.tags !== undefined && data.tags.length > EMPTY_TAGS_LENGTH ? (
          <ul className="mb-4 flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <li className="rounded-md bg-fd-secondary px-2 py-0.5 text-xs font-medium text-fd-secondary-foreground" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        ) : undefined}
        <Link className="text-fd-muted-foreground hover:text-fd-foreground" href="/blog">
          {t("post.backToBlog")}
        </Link>
      </div>
      <article className="mx-auto flex w-full max-w-[1400px] flex-col px-4 py-8">
        <div className="prose min-w-0 dark:prose-invert">
          <InlineTOC items={data.toc} />
          <Mdx components={getMDXComponents({ a: createRelativeLink(blogSource, page) })} />
        </div>
        <div className="mt-8 flex flex-col gap-4 text-sm">
          <div className="flex flex-wrap items-center gap-3">
            {hasNonEmptyString(data.authorImage) ? (
              <Image alt="" className="rounded-full border border-fd-border" height={36} src={data.authorImage} width={36} />
            ) : undefined}
            <div>
              <p className="mb-1 text-fd-muted-foreground">{t("post.writtenBy")}</p>
              <p className="font-medium">{data.authorName}</p>
            </div>
          </div>
          <div>
            <p className="mb-1 text-fd-muted-foreground">{t("post.dateLabel")}</p>
            <p className="font-medium">{new Date(data.date).toLocaleDateString(locale)}</p>
          </div>
        </div>
      </article>
    </>
  )
}
