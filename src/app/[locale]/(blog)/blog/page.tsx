import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { blogSource } from "~/src/integrations/fumadocs/fumadocs.source"
import { getRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

import { PostLedger, PostRow } from "~/src/app/[locale]/(blog)/_components/post-ledger"
import { isPublished, sortPostsByDateDesc } from "~/src/app/[locale]/(blog)/_lib/posts"

const NO_POSTS = 0

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.blog")

  return {
    description: t("metadata.description"),
    title: t("metadata.title"),
  }
}

async function PostList(): Promise<JSX.Element> {
  const [locale, t] = await Promise.all([getRootLocale(), getTranslations("pages.blog")])

  const posts = sortPostsByDateDesc(blogSource.getPages(locale).filter((page) => isPublished(page.data)))

  if (posts.length === NO_POSTS) {
    return <p className="border-y border-border py-10 text-body text-muted-foreground">{t("index.empty")}</p>
  }

  return (
    <PostLedger>
      {posts.map((post) => (
        <PostRow key={post.url} post={post} />
      ))}
    </PostLedger>
  )
}

export default async function BlogIndexPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.blog")

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <h1 className="max-w-[16ch] text-headline-peak text-balance text-foreground">{t("index.title")}</h1>
        <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("index.description")}</p>

        <div className="mt-14 md:mt-20">
          <PostList />
        </div>
      </div>
    </section>
  )
}
