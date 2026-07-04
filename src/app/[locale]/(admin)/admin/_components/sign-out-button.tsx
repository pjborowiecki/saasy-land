"use client"

import { useTransition } from "react"

import { Loader2, LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { CONSTANTS } from "~/src/constants"

import { authClient } from "~/src/integrations/better-auth/auth._client"
import { AUTH_ERRORS } from "~/src/integrations/better-auth/auth.errors"
import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/components/shadcn/button"

export function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const t = useTranslations()

  function handleSignout() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onError: (ctx) => {
            const key = AUTH_ERRORS[ctx.error.code as keyof typeof AUTH_ERRORS] ?? AUTH_ERRORS.UNKNOWN_ERROR
            toast.error(t(`auth.errors.${key}`))
          },
          onSuccess: () => {
            toast.success(t("admin.components.signOutButton.success"))
            router.push(CONSTANTS.ROUTES.HOME)
          },
        },
      })
    })
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
      disabled={isPending}
      onClick={handleSignout}
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      {isPending ? t("admin.components.signOutButton.signingOut") : t("admin.components.signOutButton.signOut")}
    </Button>
  )
}
