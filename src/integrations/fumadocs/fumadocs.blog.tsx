import { Children, type ReactNode, isValidElement } from "react"

import { queryOptions } from "@tanstack/react-query"
import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import browserCollections from "collections/browser"

import { blogSource } from "~/src/integrations/fumadocs/fumadocs.source"
import { getMDXComponents } from "~/src/integrations/fumadocs/mdx"
import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { readingTimeMinutes } from "~/src/lib/blog"

/**
 * Flatten one table-of-contents heading to plain text.
 *
 * Fumadocs builds the TOC with `rehypeToc`, which exports every heading as a JSX fragment rather
 * than a string — so a `typeof title === "string"` check never matches, and the titles have to be
 * walked before they can cross the server-function boundary as JSON.
 */
const tocItemTitle = (title: ReactNode): string =>
  Children.toArray(title)
    .map((child) => {
      if (typeof child === "string") {
        return child
      }
      if (typeof child === "number") {
        return String(child)
      }
      return isValidElement<{ children?: ReactNode }>(child) ? tocItemTitle(child.props.children) : ""
    })
    .join("")

const serializePost = (page: ReturnType<typeof blogSource.getPages>[number]) => {
  const { authorImage, authorName, date, description, excerpt, faq, featured, image, published, tags, updated, title, structuredData } =
    page.data
  const locale = getCurrentLocale()

  return {
    data: {
      authorImage,
      authorName,
      date,
      description,
      excerpt,
      faq,
      featured,
      image,
      published,
      readingTimeMinutes: readingTimeMinutes(structuredData, locale),
      tags,
      title,
      updated,
    },
    path: page.path,
    url: localizePathname({ locale, pathname: page.url }),
  }
}

export const getBlogPosts = createServerFn({ method: "GET" }).handler(() =>
  blogSource
    .getPages(getCurrentLocale())
    .filter((page) => page.data.published)
    .map((page) => serializePost(page)),
)

export type BlogPostSummary = Awaited<ReturnType<typeof getBlogPosts>>[number]
export const blogPostsQuery = (locale = getCurrentLocale()) =>
  queryOptions({
    queryFn: () => getBlogPosts(),
    queryKey: ["blog", locale],
    staleTime: Infinity,
  })

export const getBlogPost = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const page = blogSource.getPage(slug.split("/"), getCurrentLocale())
    if (!page || !page.data.published) {
      throw notFound()
    }
    return {
      ...serializePost(page),
      toc: page.data.toc.map((item) => ({ depth: item.depth, title: tocItemTitle(item.title), url: item.url })),
    }
  })

export const blogLoader = browserCollections.blog.createClientLoader({
  component: ({ default: Mdx }) => <Mdx components={getMDXComponents()} />,
  id: "blog",
})
