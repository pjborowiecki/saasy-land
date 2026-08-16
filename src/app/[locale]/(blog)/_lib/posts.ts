export function summaryFromFrontmatter(data: { excerpt?: string | undefined; description?: string | undefined }): string | undefined {
  return data.excerpt ?? data.description
}

export function isPublished(data: { published?: boolean }): boolean {
  return data.published !== false
}

export function sortPostsByDateDesc<T extends { data: { date: string | Date } }>(pages: T[]): T[] {
  return [...pages].toSorted((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
}

const EMPTY_LIST_LENGTH = 0

const WORDS_PER_MINUTE = 220
const SHORTEST_READ_MINUTES = 1

type ExtractedProse = Readonly<{ contents?: readonly { content: string }[] | undefined }>

export function readingTimeMinutes(structuredData?: ExtractedProse): number | undefined {
  const contents = structuredData?.contents
  if (contents === undefined || contents.length === EMPTY_LIST_LENGTH) {
    return undefined
  }

  const words = contents.reduce((total, entry) => total + entry.content.split(/\s+/u).filter(Boolean).length, 0)
  if (words === EMPTY_LIST_LENGTH) {
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

function toIsoDate(value: string | Date): string {
  return new Date(value).toISOString()
}

function absoluteUrl(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).toString()
}

export function buildPostStructuredData(input: PostStructuredDataInput): PostStructuredData {
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

  if (input.faq !== undefined && input.faq.length > EMPTY_LIST_LENGTH) {
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

export function buildPostStructuredDataHtml(input: PostStructuredDataInput): { __html: string } {
  return { __html: JSON.stringify(buildPostStructuredData(input)) }
}
