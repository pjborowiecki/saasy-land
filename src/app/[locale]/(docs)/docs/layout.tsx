import { notFound } from "next/navigation"
import type { JSX } from "react"

import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { hasLocale } from "next-intl"

import { CONSTANTS } from "~/src/constants"

import { DocsProvider } from "~/src/providers/docs-provider"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"

import { GithubInfo } from "~/src/components/custom/github-info"
import { LocaleSwitch } from "~/src/components/custom/locale-switch"
import { ThemeSwitch } from "~/src/components/custom/theme-switch"

export default async function DocumentationLayout({ children, params }: Readonly<LayoutProps<"/[locale]/docs">>): Promise<JSX.Element> {
  const { locale } = await params

  if (!hasLocale(CONSTANTS.I18N.LOCALES, locale)) notFound()

  return (
    <DocsProvider locale={locale}>
      <DocsLayout
        tree={source.getPageTree(locale)}
        nav={{ title: CONSTANTS.APP_NAME }}
        themeSwitch={{ enabled: false }}
        slots={{ languageSelect: false }}
        links={[
          {
            type: "custom",
            children: <GithubInfo owner={CONSTANTS.APP_GITHUB_OWNER} repo={CONSTANTS.APP_GITHUB_REPO} />,
          },
        ]}
        sidebar={{
          footer: (
            <div className="flex flex-col gap-2">
              <LocaleSwitch locale={locale} />
              <ThemeSwitch />
            </div>
          ),
        }}
      >
        {children}
      </DocsLayout>
    </DocsProvider>
  )
}
