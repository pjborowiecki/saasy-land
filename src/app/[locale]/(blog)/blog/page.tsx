import type { Metadata } from "next"
import { type JSX, Suspense } from "react"

import { getTranslations } from "next-intl/server"

import { blogSource } from "~/src/integrations/fumadocs/fumadocs.source"
import { getRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

import { PostLedger, PostRow } from "~/src/app/[locale]/(blog)/_components/post-ledger"
import { isPublished, sortPostsByDateDesc, summaryFromFrontmatter } from "~/src/app/[locale]/(blog)/_lib/posts"

const EMPTY_TAGS_LENGTH = 0

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.blog")

  return {
    description: t("metadata.description"),
    title: t("metadata.title"),
  }
}

const BLOG_INDEX_FALLBACK = (
  <div className="mx-auto min-h-[60vh] w-full max-w-[1400px] flex-1 animate-pulse rounded-xl bg-fd-muted/30 px-4 py-8" />
)

export default function BlogIndexPage(): JSX.Element {
  return (
    <Suspense fallback={BLOG_INDEX_FALLBACK}>
      <BlogIndexContent />
    </Suspense>
  )
}

async function BlogIndexContent(): Promise<JSX.Element> {
  const locale = await getRootLocale()
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
                  tags={post.data.tags !== undefined && post.data.tags.length > EMPTY_TAGS_LENGTH ? post.data.tags.join(" · ") : undefined}
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
