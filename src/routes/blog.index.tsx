import type { JSX } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { blogPostsQuery } from "~/src/integrations/fumadocs/fumadocs.blog"
import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { isPublished, sortPostsByDateDesc } from "~/src/lib/blog"

import { PostLedger, PostRow } from "~/src/presentation/components/custom/blog/components/post-ledger"

const NO_POSTS = 0

const PostList = (): JSX.Element => {
  const locale = getCurrentLocale()
  const t = useTranslations("pages.blog")

  const posts = sortPostsByDateDesc(useSuspenseQuery(blogPostsQuery(locale)).data.filter((page) => isPublished(page.data)))

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

const BlogIndexPage = (): JSX.Element => {
  const t = useTranslations("pages.blog")

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

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.blog",
      namespaces: ["pages.blog", "pages.landing"],
      pathname: "/blog",
      queryClient: context.queryClient,
    }),
  staticData: { namespaces: ["pages.blog", "pages.landing"] },
})
