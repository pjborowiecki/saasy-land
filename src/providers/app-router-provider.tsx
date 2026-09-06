import { type JSX, type ReactNode, useCallback } from "react"

import { useNavigate } from "@tanstack/react-router"
import { I18nProvider, RouterProvider } from "react-aria-components"

import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

export const AppRouterProvider = ({ children }: { readonly children: ReactNode }): JSX.Element => {
  const navigateRoute = useNavigate()
  const locale = getCurrentLocale()

  const navigate = useCallback(
    (href: string) => {
      void navigateRoute({ to: href })
    },
    [navigateRoute],
  )
  const useHref = useCallback((href: string) => localizePathname({ locale, pathname: href }), [locale])

  return (
    <I18nProvider locale={locale}>
      <RouterProvider navigate={navigate} useHref={useHref}>
        {children}
      </RouterProvider>
    </I18nProvider>
  )
}
