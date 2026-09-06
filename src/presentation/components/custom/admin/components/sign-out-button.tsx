import { type JSX, useCallback, useTransition } from "react"

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
  const settingsSignOutUserRequest = useMutation({
    ...settingsSignOutUserMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session"] }),
  })
  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const t = useTranslations("pages.admin.components.signOutButton")
  const actionError = useActionError()

  const handleSignout = useCallback(() => {
    startTransition(async () => {
      try {
        await settingsSignOutUserRequest.mutateAsync()
        toast.success(t("success"))
        void router.navigate({ to: ROUTES.HOME })
      } catch (error) {
        toast.error(actionError(error))
      }
    })
  }, [actionError, router, t])

  return (
    <DropdownMenuItem isDisabled={isPending} onAction={handleSignout} variant="destructive">
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      {isPending ? t("signingOut") : t("signOut")}
    </DropdownMenuItem>
  )
}
