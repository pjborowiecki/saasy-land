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

type BlogSlugPageProps = Readonly<{
  params: Promise<{ locale: Locale; slug?: string[] }>
}>

export async function generateMetadata({ params }: BlogSlugPageProps): Promise<Metadata> {
  const { locale, slug } = await params

  if (isBlogIndex(slug)) {
    const t = await getTranslations({ locale, namespace: "blog" })
    return {
      title: t("metadata.title"),
      description: t("metadata.description"),
    }
  }

  const page = blogSource.getPage(slug, locale)
  if (!page) notFound()

  const summary = summaryFromFrontmatter(page.data)
  return {
    title: page.data.title,
    description: summary ?? page.data.description,
  }
}

export function generateStaticParams(): Array<{ locale: Locale; slug: string[] | undefined }> {
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
    const t = await getTranslations({ locale, namespace: "blog" })
    const posts = sortPostsByDateDesc(blogSource.getPages(locale).filter((page) => isPublished(page.data)))

    return (
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8">
        <h1 className="mb-8 font-bold text-4xl">{t("index.title")}</h1>
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
                {post.data.image ? (
                  <div className="relative aspect-[2.4/1] w-full overflow-hidden border-fd-border border-b bg-fd-muted">
                    <Image alt="" className="object-cover" fill sizes="(max-width: 48rem) 100vw, 24rem" src={post.data.image} />
                  </div>
                ) : null}
                <div className="p-6">
                  <h2 className="mb-2 font-semibold text-xl">{post.data.title}</h2>
                  {summary ? <p className="text-fd-muted-foreground">{summary}</p> : null}
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    )
  }

  const page = blogSource.getPage(slug, locale)
  if (!page) notFound()

  if (!isPublished(page.data)) notFound()

  const data = page.data
  const Mdx = data.body

  const t = await getTranslations({ locale, namespace: "blog" })

  const summary = summaryFromFrontmatter(data)

  return (
    <>
      <div className="mx-auto w-full max-w-[1400px] rounded-xl border px-4 py-12 md:px-8">
        {data.image ? (
          <div className="relative mb-6 aspect-[2.4/1] w-full overflow-hidden rounded-lg border border-fd-border bg-fd-muted">
            <Image alt="" className="object-cover" fill priority sizes="(max-width: 48rem) 100vw, 48rem" src={data.image} />
          </div>
        ) : null}
        <h1 className="mb-2 font-bold text-3xl">{data.title}</h1>
        {summary ? <p className="mb-4 text-fd-muted-foreground">{summary}</p> : null}
        {data.tags && data.tags.length > 0 ? (
          <ul className="mb-4 flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <li className="rounded-md bg-fd-secondary px-2 py-0.5 font-medium text-fd-secondary-foreground text-xs" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        <Link className="text-fd-muted-foreground hover:text-fd-foreground" href="/blog">
          {t("post.backToBlog")}
        </Link>
      </div>
      <article className="mx-auto flex w-full max-w-[1400px] flex-col px-4 py-8">
        <div className="prose dark:prose-invert min-w-0">
          <InlineTOC items={data.toc} />
          <Mdx components={getMDXComponents({ a: createRelativeLink(blogSource, page) })} />
        </div>
        <div className="mt-8 flex flex-col gap-4 text-sm">
          <div className="flex flex-wrap items-center gap-3">
            {data.authorImage ? (
              <Image alt="" className="rounded-full border border-fd-border" height={36} src={data.authorImage} width={36} />
            ) : null}
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
