import type { JSX } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { settingsSignOutUserMutation } from "~/src/modules/account/use-cases/sign-out-user"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Spinner } from "~/src/presentation/components/shadcn/spinner"

import { ROUTES } from "~/src/routes"

interface AppAccountProps {
  readonly email: string
  readonly name: string
}

export const AppAccount = ({ email, name }: AppAccountProps): JSX.Element => {
  const t = useTranslations("pages.app.account")
  const queryClient = useQueryClient()
  const router = useRouter()
  const actionError = useActionError()
  const { isPending, mutate } = useMutation({
    ...settingsSignOutUserMutation,
    onError: (error) => toast.error(actionError(error)),
    onSuccess: async () => {
      queryClient.clear()
      await router.navigate({ replace: true, to: ROUTES.SIGN_IN })
      router.clearCache()
      toast.success(t("signedOut"))
    },
  })
  return (
    <section aria-label={t("label")} className="flex min-w-0 items-center gap-2.5">
      <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-body-sm font-semibold">
        {name.charAt(0).toUpperCase()}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-body-sm font-medium">{name}</span>
        <span className="truncate text-label text-muted-foreground">{email}</span>
      </div>
      <Button
        aria-label={isPending ? t("signingOut") : t("signOut")}
        className="shrink-0 text-muted-foreground"
        isDisabled={isPending}
        onPress={() => {
          mutate()
        }}
        size="icon-sm"
        variant="ghost"
      >
        {isPending ? <Spinner /> : <LogOut aria-hidden strokeWidth={1.5} />}
      </Button>
    </section>
  )
}
