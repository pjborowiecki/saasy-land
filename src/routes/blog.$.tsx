import type { JSX } from "react"

import { Link, createFileRoute } from "@tanstack/react-router"
import { InlineTOC } from "fumadocs-ui/components/inline-toc"
import { useFormatter, useTranslations } from "use-intl/react"

import { blogLoader, getBlogPost } from "~/src/integrations/fumadocs/fumadocs.blog"
import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { buildPostStructuredDataHtml, summaryFromFrontmatter } from "~/src/lib/blog"

import { PostCta } from "~/src/presentation/components/custom/blog/components/post-cta"
import { PostShare } from "~/src/presentation/components/custom/blog/components/post-share"
import { PostToc, PostTocItem } from "~/src/presentation/components/custom/blog/components/post-toc"

import { APP_URL } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

const EMPTY_TAGS_LENGTH = 0

const hasNonEmptyString = (value: string | undefined): value is string => typeof value === "string" && value.trim().length > 0

const BlogPostPage = (): JSX.Element => {
  const page = Route.useLoaderData().post
  const { data } = page
  const content = blogLoader.useContent(page.path)

  const t = useTranslations("pages.blog")

  const summary = summaryFromFrontmatter(data)

  const format = useFormatter()
  const published = format.dateTime(new Date(data.date), { day: "numeric", month: "long", year: "numeric" })

  const minutes = data.readingTimeMinutes
  const canonical = new URL(page.url, APP_URL).toString()

  const metaTail = [
    hasNonEmptyString(data.authorName) ? data.authorName : undefined,
    minutes === undefined ? undefined : t("post.readingTime", { minutes }),
    data.tags !== undefined && data.tags.length > EMPTY_TAGS_LENGTH ? data.tags.join(", ") : undefined,
  ].filter((item) => hasNonEmptyString(item))

  const structuredDataHtml = buildPostStructuredDataHtml({
    authorName: data.authorName,
    baseUrl: APP_URL,
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
          to={ROUTES.BLOG}
        >
          <span aria-hidden>&larr;</span>
          {t("post.backToBlog")}
        </Link>

        <h1 className="mt-8 max-w-[24ch] text-display-gate text-balance text-foreground">{data.title}</h1>
        {summary !== undefined && summary.length > 0 && (
          <p className="mt-6 max-w-[46ch] text-statement text-pretty text-muted-foreground">{summary}</p>
        )}

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

        {data.image !== undefined && data.image.length > 0 && (
          <div className="relative mt-10 aspect-[2.4/1] w-full overflow-hidden rounded-xl border border-border bg-card">
            <img
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 48rem) 100vw, 64rem"
              src={data.image}
            />
          </div>
        )}
        <div className="mt-14 grid gap-x-16 lg:grid-cols-[minmax(0,72ch)_1fr]">
          <div className="min-w-0">
            <div className="mb-10 lg:hidden">
              <InlineTOC items={page.toc} />
            </div>
            <div className="typeset typeset-article">{content}</div>
            <PostCta />
            <div className="mt-16 border-t border-border pt-8">
              <PostShare title={data.title} url={canonical} />
            </div>
          </div>

          <PostToc label={t("post.contents")}>
            {page.toc.map((item) => (
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

export const Route = createFileRoute("/blog/$")({
  component: BlogPostPage,
  head: routeHead,
  loader: async ({ context, params }) => {
    await loadRouteMessages({
      metadataNamespace: undefined,
      namespaces: ["pages.blog", "pages.landing"],
      pathname: "/blog",
      queryClient: context.queryClient,
    })
    const post = await getBlogPost({ data: params._splat ?? "" })
    await blogLoader.preload(post.path)
    return {
      metadata: {
        description: summaryFromFrontmatter(post.data) ?? "",
        locale: getCurrentLocale(),
        pathname: post.url,
        title: post.data.title,
      },
      post,
    }
  },
  staticData: { namespaces: ["pages.blog", "pages.landing"] },
})
