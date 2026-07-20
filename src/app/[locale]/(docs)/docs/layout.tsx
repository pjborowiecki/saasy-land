import { notFound } from "next/navigation"
import { Suspense, type ReactNode } from "react"

import { hasLocale } from "next-intl"

import { CONSTANTS } from "~/src/constants"

import { DocsProvider } from "~/src/providers/docs-provider"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"

import { GithubInfo } from "~/src/components/custom/github-info"

import { DocsLayoutClient } from "~/src/app/[locale]/(docs)/docs/_components/docs-layout-client"

const DOCS_LINKS = [
  {
    children: <GithubInfo owner={CONSTANTS.APP_GITHUB_OWNER} repo={CONSTANTS.APP_GITHUB_REPO} />,
    type: "custom" as const,
  },
]

const DOCS_LAYOUT_FALLBACK = <div className="min-h-svh w-full animate-pulse bg-fd-background" />

export default async function DocumentationLayout({ children, params }: Readonly<LayoutProps<"/[locale]/docs">>): Promise<ReactNode> {
  const { locale } = await params

  if (!hasLocale(CONSTANTS.I18N.LOCALES, locale)) {
    notFound()
  }

  return (
    <Suspense fallback={DOCS_LAYOUT_FALLBACK}>
      <DocsProvider locale={locale}>
        <DocsLayoutClient links={DOCS_LINKS} locale={locale} tree={source.getPageTree(locale)}>
          {children}
        </DocsLayoutClient>
      </DocsProvider>
    </Suspense>
  )
}
