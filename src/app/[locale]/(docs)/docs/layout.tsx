import { Suspense, type ReactNode } from "react"

import { DocsProvider } from "~/src/providers/docs-provider"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"
import { getRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

import { GithubInfo } from "~/src/presentation/components/custom/github-info"

import { DocsLayoutClient } from "~/src/app/[locale]/(docs)/docs/_components/docs-layout-client"
import { APP_GITHUB_OWNER, APP_GITHUB_REPO } from "~/src/presentation/branding"

const DOCS_LINKS = [
  {
    children: <GithubInfo owner={APP_GITHUB_OWNER} repo={APP_GITHUB_REPO} />,
    type: "custom" as const,
  },
]

const DOCS_LAYOUT_FALLBACK = <div className="min-h-svh w-full animate-pulse bg-fd-background" />

async function DocumentationLayoutContent({ children }: Readonly<{ children: ReactNode }>): Promise<ReactNode> {
  const locale = await getRootLocale()

  return (
    <DocsProvider locale={locale}>
      <DocsLayoutClient links={DOCS_LINKS} locale={locale} tree={source.getPageTree(locale)}>
        {children}
      </DocsLayoutClient>
    </DocsProvider>
  )
}

export default function DocumentationLayout({ children }: Readonly<LayoutProps<"/[locale]/docs">>): ReactNode {
  return (
    <Suspense fallback={DOCS_LAYOUT_FALLBACK}>
      <DocumentationLayoutContent>{children}</DocumentationLayoutContent>
    </Suspense>
  )
}
