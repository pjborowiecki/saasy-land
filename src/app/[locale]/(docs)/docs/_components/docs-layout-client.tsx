"use client"

import { type ComponentProps, type JSX, type ReactNode, Suspense, useMemo } from "react"

import { DocsLayout } from "fumadocs-ui/layouts/docs"

import type { Locale } from "~/src/integrations/next-intl/i18n.config"

import { LocaleSwitch } from "~/src/presentation/components/custom/locale-switch"
import { ThemeSwitch } from "~/src/presentation/components/custom/theme-switch"

import { APP_NAME } from "~/src/presentation/branding"

const LOCALE_SWITCH_FALLBACK = <div className="h-9 w-full rounded-md bg-fd-muted/50" />

const DOCS_NAV = { title: APP_NAME } as const
const DOCS_THEME_SWITCH = { enabled: false } as const
const DOCS_SLOTS = { languageSelect: false } as const

type DocsLayoutProps = ComponentProps<typeof DocsLayout>

interface DocsLayoutClientProps {
  readonly children: ReactNode
  readonly links: DocsLayoutProps["links"]
  readonly locale: Locale
  readonly tree: DocsLayoutProps["tree"]
}

export function DocsLayoutClient({ children, links, locale, tree }: DocsLayoutClientProps): JSX.Element {
  const sidebar = useMemo(
    () => ({
      footer: (
        <div className="flex flex-col gap-2">
          <Suspense fallback={LOCALE_SWITCH_FALLBACK}>
            <LocaleSwitch locale={locale} />
          </Suspense>
          <ThemeSwitch />
        </div>
      ),
    }),
    [locale],
  )

  const sharedLayoutProps = {
    children,
    nav: DOCS_NAV,
    sidebar,
    slots: DOCS_SLOTS,
    themeSwitch: DOCS_THEME_SWITCH,
    tree,
  } satisfies Omit<DocsLayoutProps, "links">

  if (links !== undefined) {
    return <DocsLayout {...sharedLayoutProps} links={links} />
  }

  return <DocsLayout {...sharedLayoutProps} />
}
