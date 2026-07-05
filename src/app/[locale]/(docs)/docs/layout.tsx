import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { hasLocale } from "next-intl"

import { CONSTANTS } from "~/src/constants"

import { DocsProvider } from "~/src/providers/docs-provider"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"

import { DocsLayoutClient } from "~/src/components/custom/docs-layout-client"
import { GithubInfo } from "~/src/components/custom/github-info"

const DOCS_LINKS = [
  {
    children: <GithubInfo owner={CONSTANTS.APP_GITHUB_OWNER} repo={CONSTANTS.APP_GITHUB_REPO} />,
    type: "custom" as const,
  },
]

export default async function DocumentationLayout({ children, params }: Readonly<LayoutProps<"/[locale]/docs">>): Promise<ReactNode> {
  const { locale } = await params

  if (!hasLocale(CONSTANTS.I18N.LOCALES, locale)) {
    notFound()
  }

  return (
    <DocsProvider locale={locale}>
      <DocsLayoutClient links={DOCS_LINKS} locale={locale} tree={source.getPageTree(locale)}>
        {children}
      </DocsLayoutClient>
    </DocsProvider>
  )
}
