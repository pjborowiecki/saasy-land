import type { JSX } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Loader2, LogOut } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { settingsSignOutUserMutation } from "~/src/modules/account/use-cases/sign-out-user"

import { useActionError } from "~/src/hooks/use-action-error"

import { DropdownMenuItem } from "~/src/presentation/components/shadcn/dropdown-menu"

import { ROUTES } from "~/src/routes"

export const SignOutButton = (): JSX.Element => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTranslations("pages.admin.components.signOutButton")
  const actionError = useActionError()
  const { isPending, mutate } = useMutation({
    ...settingsSignOutUserMutation,
    onError: (error) => toast.error(actionError(error)),
    onSuccess: async () => {
      queryClient.clear()
      await router.navigate({ replace: true, to: ROUTES.SIGN_IN })
      router.clearCache()
      toast.success(t("success"))
    },
  })

  return (
    <DropdownMenuItem
      isDisabled={isPending}
      onAction={() => {
        mutate()
      }}
      variant="destructive"
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      {isPending ? t("signingOut") : t("signOut")}
    </DropdownMenuItem>
  )
}
