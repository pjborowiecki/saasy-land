import { screen } from "@testing-library/react"
import { IntlProvider } from "use-intl/react"
import { afterEach, expect, it, vi } from "vite-plus/test"

import { renderWithRouter } from "~/src/platform/testing/lib/render"

import type { BlogPostSummary } from "~/src/integrations/fumadocs/fumadocs.blog"
import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { PostRow } from "~/src/presentation/components/custom/blog/components/post-ledger"

const post: BlogPostSummary = {
  data: {
    authorImage: undefined,
    authorName: "Test Author",
    date: new Date("2026-09-01T00:00:00Z"),
    description: "A post with a reading time calculated by the server.",
    excerpt: undefined,
    faq: undefined,
    featured: false,
    image: undefined,
    published: true,
    readingTimeMinutes: 14,
    tags: undefined,
    title: "Server-provided reading time",
    updated: undefined,
  },
  path: "post.mdx",
  url: "/blog/post",
}

afterEach(() => {
  vi.restoreAllMocks()
})

it.each([
  { label: "14 min de lecture", locale: "fr-FR" as const },
  { label: "Час читання: 14 хв", locale: "uk-UA" as const },
])("preserves the server reading time when browser word segmentation differs in $locale", ({ label, locale }) => {
  const browserWords = new Intl.Segmenter(locale, { granularity: "word" }).segment("one")
  const segment = vi.spyOn(Intl.Segmenter.prototype, "segment").mockReturnValue(browserWords)

  renderWithRouter(
    <IntlProvider locale={locale} messages={getTestMessages(locale)} timeZone="UTC">
      <PostRow post={post} />
    </IntlProvider>,
  )

  expect(screen.getByText(label)).toBeVisible()
  expect(segment).not.toHaveBeenCalled()
})
