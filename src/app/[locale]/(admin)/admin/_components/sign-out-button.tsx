"use client"

import { useCallback, useTransition, type JSX } from "react"

import { Loader2, LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { settingsSignOutUser } from "~/src/modules/account/use-cases/sign-out-user.use-case"

import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { useActionError } from "~/src/hooks/use-action-error"

import { DropdownMenuItem } from "~/src/presentation/components/shadcn/dropdown-menu"

import { ROUTES } from "~/src/routes"

export function SignOutButton(): JSX.Element {
  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const t = useTranslations("pages.admin.components.signOutButton")
  const actionError = useActionError()

  const handleSignout = useCallback(() => {
    startTransition(async () => {
      const result = await settingsSignOutUser()

      const error = actionError(result)

      if (error) {
        toast.error(error)
        return
      }

      toast.success(t("success"))
      router.push(ROUTES.HOME)
    })
  }, [actionError, router, t])

  return (
    <DropdownMenuItem isDisabled={isPending} onAction={handleSignout} variant="destructive">
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      {isPending ? t("signingOut") : t("signOut")}
    </DropdownMenuItem>
  )
}
