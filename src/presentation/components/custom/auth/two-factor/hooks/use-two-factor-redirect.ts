import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { usePostAuthRedirect } from "~/src/hooks/use-post-auth-redirect"

export const useTwoFactorRedirect = (): (() => Promise<void>) => {
  const t = useTranslations()
  const redirectAfterAuth = usePostAuthRedirect()

  return async () => {
    toast.success(t("pages.auth.two-factor.form.success"))
    await redirectAfterAuth()
  }
}
