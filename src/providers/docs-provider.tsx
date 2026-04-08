"use client"

import type { ComponentProps, FC, ReactNode } from "react"

import { RootProvider } from "fumadocs-ui/provider/next"
import { hasLocale } from "use-intl/core"

import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

import { i18nUI } from "~/src/integrations/fumadocs/fumadocs.i18n"
import { Link, usePathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

type DocsProviderProps = Readonly<{
  locale: Locale
  children: ReactNode
}>

type FumadocsLinkProps = ComponentProps<"a"> & { prefetch?: boolean }
const FumadocsLink = Link as FC<FumadocsLinkProps>

export function DocsProvider({ locale, children }: DocsProviderProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <RootProvider
      components={{ Link: FumadocsLink }}
      theme={{ enabled: false }}
      i18n={{
        ...i18nUI.provider(locale),
        onLocaleChange: (next) => {
          if (hasLocale(CONSTANTS.LOCALES, next)) {
            router.replace(pathname, { locale: next })
          }
        },
      }}
    >
      {children}
    </RootProvider>
  )
}
