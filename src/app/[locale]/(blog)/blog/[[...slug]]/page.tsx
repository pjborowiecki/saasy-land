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

import { PostLedger, PostRow } from "~/src/app/[locale]/(blog)/_components/post-ledger"
import { PostToc, PostTocItem } from "~/src/app/[locale]/(blog)/_components/post-toc"
import { isBlogIndex, isPublished, sortPostsByDateDesc, summaryFromFrontmatter } from "~/src/app/[locale]/(blog)/_lib/posts"

const EMPTY_TAGS_LENGTH = 0

type BlogSlugPageProps = Readonly<{
  params: Promise<{ locale: Locale; slug?: string[] }>
}>

function hasNonEmptyString(value: string | undefined): value is string {
  return value !== undefined && value.length > EMPTY_TAGS_LENGTH
}

export async function generateMetadata({ params }: BlogSlugPageProps): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getRootLocale()])

  if (isBlogIndex(slug)) {
    const t = await getTranslations("pages.blog")
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

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const locale = await getRootLocale()

  return [
    { slug: [] },
    ...blogSource
      .getPages(locale)
      .filter((page) => isPublished(page.data))
      .map((page) => ({ slug: page.slugs })),
  ]
}

const BLOG_PAGE_FALLBACK = (
  <div className="mx-auto min-h-[60vh] w-full max-w-[1400px] flex-1 animate-pulse rounded-xl bg-fd-muted/30 px-4 py-8" />
)

export default function BlogPage({ params }: BlogSlugPageProps): JSX.Element {
  return (
    <Suspense fallback={BLOG_PAGE_FALLBACK}>
      <BlogPageContent params={params} />
    </Suspense>
  )
}

async function BlogPageContent({ params }: BlogSlugPageProps): Promise<JSX.Element> {
  const [{ slug }, locale] = await Promise.all([params, getRootLocale()])

  if (isBlogIndex(slug)) {
    const t = await getTranslations("pages.blog")
    const posts = sortPostsByDateDesc(blogSource.getPages(locale).filter((page) => isPublished(page.data)))

    const formatDate = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" })

    return (
      <section className="relative">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <h1 className="max-w-[16ch] text-headline-peak text-balance text-foreground">{t("index.title")}</h1>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("index.description")}</p>

          <div className="mt-14 md:mt-20">
            {posts.length === 0 ? (
              <p className="border-y border-border py-10 text-body text-muted-foreground">{t("index.empty")}</p>
            ) : (
              <PostLedger>
                {posts.map((post) => (
                  <PostRow
                    date={formatDate.format(new Date(post.data.date))}
                    key={post.url}
                    summary={summaryFromFrontmatter(post.data)}
                    tags={
                      post.data.tags !== undefined && post.data.tags.length > EMPTY_TAGS_LENGTH ? post.data.tags.join(" · ") : undefined
                    }
                    title={post.data.title}
                    url={post.url}
                  />
                ))}
              </PostLedger>
            )}
          </div>
        </div>
      </section>
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

        {/* The byline is a spec line, in the same idiom the landing page uses for measured facts:
            monospace, tabular, one accent square. It is metadata, not decoration. */}
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
        {/* Prose stays at 68ch — the craft floor's 65-75ch measure — and the column that leaves
            over carries the contents rail rather than nothing. */}
        <div className="mt-12 grid gap-x-16 lg:grid-cols-[minmax(0,68ch)_1fr]">
          <div className="typeset typeset-docs min-w-0">
            {/* The accordion is the small-screen fallback only: below `lg` there is no room for a
                rail, and a reader on a phone still wants the outline. */}
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
