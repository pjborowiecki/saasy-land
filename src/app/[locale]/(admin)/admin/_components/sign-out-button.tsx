"use client"

import { useCallback, useTransition, type JSX } from "react"

import { Loader2, LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { authClient } from "~/src/modules/identity-access/infrastructure/auth/auth._client"
import { authErrorKey } from "~/src/modules/identity-access/infrastructure/auth/auth.errors"

import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { DropdownMenuItem } from "~/src/presentation/components/shadcn/dropdown-menu"

import { ROUTES } from "~/src/routes"

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
            router.push(ROUTES.HOME)
          },
        },
      })
    })
  }, [router, t, tAuth])

  return (
    <DropdownMenuItem isDisabled={isPending} onAction={handleSignout} variant="destructive">
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      {isPending ? t("signingOut") : t("signOut")}
    </DropdownMenuItem>
  )
}
