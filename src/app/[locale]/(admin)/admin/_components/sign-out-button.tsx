"use client"

import { useCallback, useTransition, type JSX } from "react"

import { Loader2, LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { CONSTANTS } from "~/src/constants"

import { authClient } from "~/src/integrations/better-auth/auth._client"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { DropdownMenuItem } from "~/src/components/shadcn/dropdown-menu"

export function SignOutButton(): JSX.Element {
  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const t = useTranslations("pages.admin.components.signOutButton")
  const tAuth = useTranslations("auth")

  const handleSignout = useCallback(() => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onError: (ctx) => {
            toast.error(tAuth(`errors.${authErrorKey(ctx.error)}`))
          },
          onSuccess: () => {
            toast.success(t("success"))
            router.push(CONSTANTS.ROUTES.HOME)
          },
        },
      })
    })
  }, [router, t, tAuth])

  return (
    <DropdownMenuItem disabled={isPending} variant="destructive" onClick={handleSignout}>
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      {isPending ? t("signingOut") : t("signOut")}
    </DropdownMenuItem>
  )
}
