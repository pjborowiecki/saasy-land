"use client"

import { useCallback } from "react"

import { useLocale } from "next-intl"

import { hasAdminPanelAccess } from "~/src/integrations/better-auth/auth.access"
import { getSession } from "~/src/integrations/better-auth/auth.client"
import { getPathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { ROUTES } from "~/src/routes"

export function usePostAuthRedirect(): () => Promise<void> {
  const router = useRouter()
  const locale = useLocale()

  return useCallback(async () => {
    const { data: session } = await getSession()
    const href = hasAdminPanelAccess(session?.user.role) ? ROUTES.ADMIN : ROUTES.APP

    router.push(getPathname({ href, locale }))
  }, [locale, router])
}
