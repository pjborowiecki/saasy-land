"use client"

import { type ComponentProps, type JSX, type ReactNode, useMemo } from "react"

import { DocsLayout } from "fumadocs-ui/layouts/docs"

import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

import { LocaleSwitch } from "~/src/components/custom/locale-switch"
import { ThemeSwitch } from "~/src/components/custom/theme-switch"

const DOCS_NAV = { title: CONSTANTS.APP_NAME } as const
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
          <LocaleSwitch locale={locale} />
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
