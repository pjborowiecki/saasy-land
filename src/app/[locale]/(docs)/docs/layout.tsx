import { Suspense, type ReactNode } from "react"

import { DocsLayout } from "fumadocs-ui/layouts/docs"

import { DocsProvider } from "~/src/providers/docs-provider"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"
import { getRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

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

async function DocsSidebarFooter(): Promise<ReactNode> {
  const locale = await getRootLocale()

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

export default async function DocumentationLayout({ children }: Readonly<LayoutProps<"/[locale]/docs">>): Promise<ReactNode> {
  const locale = await getRootLocale()

  return (
    <DocsProvider locale={locale}>
      <DocsLayout
        links={DOCS_LINKS}
        nav={DOCS_NAV}
        sidebar={DOCS_SIDEBAR}
        slots={DOCS_SLOTS}
        themeSwitch={DOCS_THEME_SWITCH}
        tree={source.getPageTree(locale)}
      >
        {children}
      </DocsLayout>
    </DocsProvider>
  )
}
