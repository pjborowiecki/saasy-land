"use client"

import { useCallback } from "react"

import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { getSession } from "~/src/modules/identity-access/infrastructure/auth/auth._client"
import { hasAdminAccess } from "~/src/modules/identity-access/infrastructure/auth/auth.access"

import { getPathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { ROUTES } from "~/src/routes"

export function useTwoFactorRedirect(): () => Promise<void> {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()

  return useCallback(async () => {
    toast.success(t("pages.auth.two-factor.form.success"))
    const { data: session } = await getSession()
    let href: string = ROUTES.APP

    if (hasAdminAccess(session?.user.role)) {
      href = ROUTES.ADMIN
    }

    router.push(getPathname({ href, locale }))
  }, [locale, router, t])
}
