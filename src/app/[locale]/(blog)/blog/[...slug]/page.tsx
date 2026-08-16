import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { InlineTOC } from "fumadocs-ui/components/inline-toc"
import { createRelativeLink } from "fumadocs-ui/mdx"
import { getFormatter, getTranslations } from "next-intl/server"

import { env } from "~/src/platform/env"

import { blogSource } from "~/src/integrations/fumadocs/fumadocs.source"
import { getMDXComponents } from "~/src/integrations/fumadocs/mdx"
import type { Locale } from "~/src/integrations/next-intl/i18n.config"
import { Link } from "~/src/integrations/next-intl/i18n.navigation"
import { getRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

import { PostShare } from "~/src/app/[locale]/(blog)/_components/post-share"
import { PostToc, PostTocItem } from "~/src/app/[locale]/(blog)/_components/post-toc"
import { buildPostStructuredDataHtml, isPublished, readingTimeMinutes, summaryFromFrontmatter } from "~/src/app/[locale]/(blog)/_lib/posts"
import { ROUTES } from "~/src/routes"

const EMPTY_TAGS_LENGTH = 0

export const instant = false

type BlogPostPageProps = Readonly<{
  params: Promise<{ locale: Locale; slug: string[] }>
}>

function hasNonEmptyString(value: string | undefined): value is string {
  return value !== undefined && value.length > EMPTY_TAGS_LENGTH
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getRootLocale()])

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

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const locale = await getRootLocale()

  return blogSource
    .getPages(locale)
    .filter((page) => isPublished(page.data))
    .map((page) => ({ slug: page.slugs }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps): Promise<JSX.Element> {
  const [{ slug }, locale] = await Promise.all([params, getRootLocale()])

  const page = blogSource.getPage(slug, locale)
  if (!page) {
    notFound()
  }

  if (!isPublished(page.data)) {
    notFound()
  }

  const { data } = page
  const Mdx = data.body

  const t = await getTranslations("pages.blog")

  const summary = summaryFromFrontmatter(data)

  const format = await getFormatter()
  const published = format.dateTime(new Date(data.date), { day: "numeric", month: "long", year: "numeric" })

  const minutes = readingTimeMinutes(data.structuredData)
  const canonical = new URL(page.url, env.NEXT_PUBLIC_APP_URL).toString()

  const metaTail = [
    hasNonEmptyString(data.authorName) ? data.authorName : undefined,
    minutes === undefined ? undefined : t("post.readingTime", { minutes }),
    data.tags !== undefined && data.tags.length > EMPTY_TAGS_LENGTH ? data.tags.join(", ") : undefined,
  ].filter((item) => hasNonEmptyString(item))

  const structuredDataHtml = buildPostStructuredDataHtml({
    authorName: data.authorName,
    baseUrl: env.NEXT_PUBLIC_APP_URL,
    date: data.date,
    description: summary,
    faq: data.faq,
    image: data.image,
    title: data.title,
    updated: data.updated,
    url: page.url,
  })

  return (
    <article className="relative">
      <script dangerouslySetInnerHTML={structuredDataHtml} type="application/ld+json" />
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <Link
          className="inline-flex items-center gap-2 font-mono text-label text-muted-foreground uppercase transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          href={ROUTES.BLOG}
        >
          <span aria-hidden>&larr;</span>
          {t("post.backToBlog")}
        </Link>

        <h1 className="mt-8 max-w-[24ch] text-display-gate text-balance text-foreground">{data.title}</h1>
        {summary && <p className="mt-6 max-w-[46ch] text-statement text-pretty text-muted-foreground">{summary}</p>}

        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-border py-4 font-mono text-body-sm text-muted-foreground">
          <span className="flex items-center gap-2.5">
            <span aria-hidden className="size-1.25 shrink-0 rounded-xs bg-ring" />
            <time className="tabular-nums" dateTime={new Date(data.date).toISOString()}>
              {published}
            </time>
          </span>
          {metaTail.map((item) => (
            <span className="flex items-center gap-3" key={item}>
              <span aria-hidden className="text-border">
                &middot;
              </span>
              {item}
            </span>
          ))}
        </div>

        {data.image && (
          <div className="relative mt-10 aspect-[2.4/1] w-full overflow-hidden rounded-xl border border-border bg-card">
            <Image alt="" className="object-cover" fill priority sizes="(max-width: 48rem) 100vw, 64rem" src={data.image} />
          </div>
        )}
        <div className="mt-14 grid gap-x-16 lg:grid-cols-[minmax(0,72ch)_1fr]">
          <div className="min-w-0">
            <div className="mb-10 lg:hidden">
              <InlineTOC items={data.toc} />
            </div>
            <div className="typeset typeset-article">
              <Mdx components={getMDXComponents({ a: createRelativeLink(blogSource, page) })} />
            </div>
            <div className="mt-16 border-t border-border pt-8">
              <PostShare title={data.title} url={canonical} />
            </div>
          </div>

          <PostToc label={t("post.contents")}>
            {data.toc.map((item) => (
              <PostTocItem depth={item.depth} href={item.url} key={item.url}>
                {item.title}
              </PostTocItem>
            ))}
          </PostToc>
        </div>
      </div>
    </article>
  )
}
