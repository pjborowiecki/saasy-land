import { type ComponentProps, type ReactNode, useMemo } from "react"

import { Link } from "@tanstack/react-router"
import { RootProvider } from "fumadocs-ui/provider/tanstack"

import { i18nUI } from "~/src/integrations/fumadocs/fumadocs.i18n"
import type { Locale } from "~/src/integrations/use-intl/i18n.config"

type DocsProviderProps = Readonly<{
  locale: Locale
  children: ReactNode
}>

type RootProviderComponents = NonNullable<ComponentProps<typeof RootProvider>["components"]>
type DocsLinkProps = ComponentProps<NonNullable<RootProviderComponents["Link"]>>

const DocsLink = ({ prefetch: _prefetch, href, target, ...props }: DocsLinkProps) => {
  const linkHref = typeof href === "string" ? href : "/"
  return <Link {...props} {...(target === undefined ? {} : { target })} to={linkHref} />
}

const DOCS_PROVIDER_COMPONENTS = {
  Link: DocsLink,
} satisfies RootProviderComponents

const DOCS_THEME = { enabled: false } as const

export const DocsProvider = ({ locale, children }: DocsProviderProps) => {
  const components = useMemo(() => DOCS_PROVIDER_COMPONENTS, [])
  const i18n = useMemo(() => i18nUI.provider(locale), [locale])

  return (
    <RootProvider components={components} theme={DOCS_THEME} i18n={i18n}>
      {children}
    </RootProvider>
  )
}
