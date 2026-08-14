import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { type JSX, Suspense } from "react"

import { InlineTOC } from "fumadocs-ui/components/inline-toc"
import { createRelativeLink } from "fumadocs-ui/mdx"
import { getTranslations } from "next-intl/server"

import { blogSource } from "~/src/integrations/fumadocs/fumadocs.source"
import { getMDXComponents } from "~/src/integrations/fumadocs/mdx"
import type { Locale } from "~/src/integrations/next-intl/i18n.config"
import { Link } from "~/src/integrations/next-intl/i18n.navigation"
import { getRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

import { PostToc, PostTocItem } from "~/src/app/[locale]/(blog)/_components/post-toc"
import { isPublished, summaryFromFrontmatter } from "~/src/app/[locale]/(blog)/_lib/posts"

const EMPTY_TAGS_LENGTH = 0

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

const BLOG_POST_FALLBACK = (
  <div className="mx-auto min-h-[60vh] w-full max-w-[1400px] flex-1 animate-pulse rounded-xl bg-fd-muted/30 px-4 py-8" />
)

export default function BlogPostPage({ params }: BlogPostPageProps): JSX.Element {
  return (
    <Suspense fallback={BLOG_POST_FALLBACK}>
      <BlogPostContent params={params} />
    </Suspense>
  )
}

async function BlogPostContent({ params }: BlogPostPageProps): Promise<JSX.Element> {
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

  const published = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(data.date))

  return (
    <article className="relative">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <Link
          className="inline-flex items-center gap-2 font-mono text-label text-muted-foreground uppercase transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          href="/blog"
        >
          <span aria-hidden>&larr;</span>
          {t("post.backToBlog")}
        </Link>

        <h1 className="mt-8 max-w-[20ch] text-headline-peak text-balance text-foreground">{data.title}</h1>
        {hasNonEmptyString(summary) ? <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{summary}</p> : undefined}

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-border py-4 font-mono text-spec text-muted-foreground">
          <span className="flex items-center gap-2.5">
            <span aria-hidden className="size-1.25 shrink-0 rounded-xs bg-ring" />
            <span className="tabular-nums">{published}</span>
          </span>
          {hasNonEmptyString(data.authorName) ? <span>{data.authorName}</span> : undefined}
          {data.tags !== undefined && data.tags.length > EMPTY_TAGS_LENGTH ? (
            <span className="uppercase">{data.tags.join(" · ")}</span>
          ) : undefined}
        </div>

        {hasNonEmptyString(data.image) ? (
          <div className="relative mt-10 aspect-[2.4/1] w-full overflow-hidden rounded-xl border border-border bg-card">
            <Image alt="" className="object-cover" fill priority sizes="(max-width: 48rem) 100vw, 64rem" src={data.image} />
          </div>
        ) : undefined}
        <div className="mt-12 grid gap-x-16 lg:grid-cols-[minmax(0,68ch)_1fr]">
          <div className="typeset typeset-docs min-w-0">
            <div className="not-typeset mb-10 lg:hidden">
              <InlineTOC items={data.toc} />
            </div>
            <Mdx components={getMDXComponents({ a: createRelativeLink(blogSource, page) })} />
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
