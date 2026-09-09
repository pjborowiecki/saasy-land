import { I18N, type SupportedLocale } from "~/src/integrations/use-intl/i18n.config"

export const summaryFromFrontmatter = (data: { excerpt?: string | undefined; description?: string | undefined }): string | undefined =>
  data.excerpt ?? data.description

export const isPublished = (data: { published?: boolean }): boolean => data.published !== false

export const sortPostsByDateDesc = <TValue extends { data: { date: string | Date } }>(pages: TValue[]): TValue[] =>
  pages.toSorted((first, second) => new Date(second.data.date).getTime() - new Date(first.data.date).getTime())

const WORDS_PER_MINUTE = 220
const SHORTEST_READ_MINUTES = 1

type ExtractedProse = Readonly<{ contents?: readonly { content: string }[] | undefined }>

export const readingTimeMinutes = (structuredData?: ExtractedProse, locale: SupportedLocale = I18N.DEFAULT_LOCALE): number | undefined => {
  const contents = structuredData?.contents
  if (contents === undefined || contents.length === 0) {
    return undefined
  }

  const segmenter = new Intl.Segmenter(locale, { granularity: "word" })
  const words = contents.reduce(
    (total, entry) => total + [...segmenter.segment(entry.content)].filter((segment) => segment.isWordLike === true).length,
    0,
  )
  if (words === 0) {
    return undefined
  }

  return Math.max(SHORTEST_READ_MINUTES, Math.round(words / WORDS_PER_MINUTE))
}

type PostStructuredDataInput = Readonly<{
  authorName: string
  baseUrl: string
  date: string | Date
  description?: string | undefined
  faq?: readonly { answer: string; question: string }[] | undefined
  image?: string | undefined
  title: string
  updated?: string | Date | undefined
  url: string
}>

type StructuredDataNode = Record<string, unknown>

export type PostStructuredData = Readonly<{
  "@context": string
  "@graph": StructuredDataNode[]
}>

const toIsoDate = (value: string | Date): string => new Date(value).toISOString()

const absoluteUrl = (baseUrl: string, path: string): string => new URL(path, baseUrl).toString()

export const buildPostStructuredData = (input: PostStructuredDataInput): PostStructuredData => {
  const canonical = absoluteUrl(input.baseUrl, input.url)
  const published = toIsoDate(input.date)

  const article: StructuredDataNode = {
    "@type": "BlogPosting",
    author: { "@type": "Person", name: input.authorName },
    dateModified: input.updated === undefined ? published : toIsoDate(input.updated),
    datePublished: published,
    headline: input.title,
    mainEntityOfPage: { "@id": canonical, "@type": "WebPage" },
    publisher: { "@type": "Organization", name: "SaaSyLand", url: input.baseUrl },
    url: canonical,
  }

  if (input.description !== undefined) {
    article["description"] = input.description
  }

  if (input.image !== undefined) {
    article["image"] = absoluteUrl(input.baseUrl, input.image)
  }

  const graph: Record<string, unknown>[] = [
    article,
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", item: absoluteUrl(input.baseUrl, "/"), name: "Home", position: 1 },
        { "@type": "ListItem", item: absoluteUrl(input.baseUrl, "/blog"), name: "Blog", position: 2 },
        { "@type": "ListItem", item: canonical, name: input.title, position: 3 },
      ],
    },
  ]

  if (input.faq !== undefined && input.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: input.faq.map((entry) => ({
        "@type": "Question",
        acceptedAnswer: { "@type": "Answer", text: entry.answer },
        name: entry.question,
      })),
    })
  }

  return { "@context": "https://schema.org", "@graph": graph }
}

export const buildPostStructuredDataHtml = (input: PostStructuredDataInput): { __html: string } => ({
  __html: JSON.stringify(buildPostStructuredData(input)).replaceAll("<", String.raw`\u003c`),
})
