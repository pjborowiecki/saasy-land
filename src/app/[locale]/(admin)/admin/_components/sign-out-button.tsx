"use client"

import { useCallback, useTransition } from "react"

import { Loader2, LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { CONSTANTS } from "~/src/constants"

import { authClient } from "~/src/integrations/better-auth/auth._client"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/components/shadcn/button"

export function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const t = useTranslations()

  const handleSignout = useCallback(() => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onError: (ctx) => {
            toast.error(t(`auth.errors.${authErrorKey(ctx.error)}`))
          },
          onSuccess: () => {
            toast.success(t("admin.components.signOutButton.success"))
            router.push(CONSTANTS.ROUTES.HOME)
          },
        },
      })
    })
  }, [router, t])

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
