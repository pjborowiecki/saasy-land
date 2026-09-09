import { type ReactNode, useMemo } from "react"

import { RootProvider } from "fumadocs-ui/provider/tanstack"

import { i18nUI } from "~/src/integrations/fumadocs/fumadocs.i18n"
import type { Locale } from "~/src/integrations/use-intl/i18n.config"

type DocsProviderProps = Readonly<{
  locale: Locale
  children: ReactNode
}>

const DOCS_THEME = { enabled: false } as const

export const DocsProvider = ({ locale, children }: DocsProviderProps) => {
  const i18n = useMemo(() => i18nUI.provider(locale), [locale])

  return (
    <RootProvider theme={DOCS_THEME} i18n={i18n}>
      {children}
    </RootProvider>
  )
}
