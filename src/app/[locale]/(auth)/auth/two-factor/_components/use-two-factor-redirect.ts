"use client"

import { useCallback } from "react"

import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import { getSession } from "~/src/integrations/better-auth/auth._client"
import { getPostAuthRedirect } from "~/src/integrations/better-auth/auth.access"
import { getPathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

export function useTwoFactorRedirect(): () => Promise<void> {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()

  return useCallback(async () => {
    toast.success(t("pages.auth.two-factor.form.success"))
    const { data: session } = await getSession()
    router.push(
      getPathname({
        href: getPostAuthRedirect(session?.user.role),
        locale,
      }),
    )
  }, [locale, router, t])
}
