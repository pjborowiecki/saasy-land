import { type ReactNode, Suspense } from "react"

import { Outlet, createFileRoute } from "@tanstack/react-router"
import { useFumadocsLoader } from "fumadocs-core/source/client"
import { DocsLayout } from "fumadocs-ui/layouts/docs"

import { DocsProvider } from "~/src/providers/docs-provider"

import { getDocsTree } from "~/src/integrations/fumadocs/fumadocs.docs"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { GithubInfo } from "~/src/presentation/components/custom/github-info"
import { LocaleSwitch } from "~/src/presentation/components/custom/locale-switch"
import { ThemeSwitch } from "~/src/presentation/components/custom/theme-switch"

import { APP_GITHUB_OWNER, APP_GITHUB_REPO, APP_NAME } from "~/src/presentation/branding"

const DOCS_LINKS = [
  {
    children: <GithubInfo owner={APP_GITHUB_OWNER} repo={APP_GITHUB_REPO} />,
    type: "custom" as const,
  },
]

const DOCS_NAV = { title: APP_NAME } as const
const DOCS_THEME_SWITCH = { enabled: false } as const
const DOCS_SLOTS = { languageSelect: false } as const

const LOCALE_SWITCH_FALLBACK = <div className="h-9 w-full rounded-md bg-fd-muted/50" />

const DocsSidebarFooter = (): ReactNode => {
  const locale = getCurrentLocale()

  return (
    <div className="flex flex-col gap-2">
      <Suspense fallback={LOCALE_SWITCH_FALLBACK}>
        <LocaleSwitch locale={locale} />
      </Suspense>
      <ThemeSwitch />
    </div>
  )
}

const DOCS_SIDEBAR = { footer: <DocsSidebarFooter /> }

const DocumentationLayout = (): ReactNode => {
  const { tree } = useFumadocsLoader(Route.useLoaderData())
  const locale = getCurrentLocale()

  return (
    <DocsProvider locale={locale}>
      <DocsLayout links={DOCS_LINKS} nav={DOCS_NAV} sidebar={DOCS_SIDEBAR} slots={DOCS_SLOTS} themeSwitch={DOCS_THEME_SWITCH} tree={tree}>
        <Outlet />
      </DocsLayout>
    </DocsProvider>
  )
}

export const Route = createFileRoute("/docs")({
  component: DocumentationLayout,
  loader: () => getDocsTree(),
  staticData: { namespaces: [] },
})
