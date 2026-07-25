"use client"

import { type ComponentProps, type ReactNode, useMemo } from "react"

import { RootProvider } from "fumadocs-ui/provider/next"

import { i18nUI } from "~/src/integrations/fumadocs/fumadocs.i18n"
import type { Locale } from "~/src/integrations/next-intl/i18n.config"
import { Link } from "~/src/integrations/next-intl/i18n.navigation"

type DocsProviderProps = Readonly<{
  locale: Locale
  children: ReactNode
}>

type RootProviderComponents = NonNullable<ComponentProps<typeof RootProvider>["components"]>
type DocsLinkProps = ComponentProps<NonNullable<RootProviderComponents["Link"]>>

function DocsLink({ prefetch: _prefetch, tw: _tw, href, children, ...props }: DocsLinkProps) {
  const linkHref = typeof href === "string" ? href : "/"

  // Forward style/data-* so Fumadocs sidebar indentation and active states work.
  return (
    <Link {...props} href={linkHref}>
      {children}
    </Link>
  )
}

const DOCS_PROVIDER_COMPONENTS = {
  Link: DocsLink,
} satisfies RootProviderComponents

const DOCS_THEME = { enabled: false } as const

export function DocsProvider({ locale, children }: DocsProviderProps) {
  const components = useMemo(() => DOCS_PROVIDER_COMPONENTS, [])
  const i18n = useMemo(() => i18nUI.provider(locale), [locale])

  return (
    <RootProvider components={components} theme={DOCS_THEME} i18n={i18n}>
      {children}
    </RootProvider>
  )
}
