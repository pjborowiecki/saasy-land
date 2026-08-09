"use client"

import { useCallback, type JSX, type ReactNode } from "react"

import { useLocale } from "next-intl"
import { RouterProvider } from "react-aria-components"

import { getPathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

export function AppRouterProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const router = useRouter()
  const locale = useLocale()

  const navigate = useCallback(
    (href: string) => {
      router.push(href)
    },
    [router],
  )
  const useHref = useCallback((href: string) => getPathname({ href, locale }), [locale])

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      {children}
    </RouterProvider>
  )
}
