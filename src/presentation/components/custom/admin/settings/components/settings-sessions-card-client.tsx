import { type JSX, useCallback, useTransition } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import type { AuthActiveSession } from "~/src/integrations/better-auth/auth.types"

import { settingsRevokeOtherSessionsMutation } from "~/src/modules/session/use-cases/revoke-other-sessions"
import { settingsRevokeSessionMutation } from "~/src/modules/session/use-cases/revoke-session"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card } from "~/src/presentation/components/shadcn/card"

import { AdminActiveSessionRowClient } from "~/src/presentation/components/custom/admin/components/admin-active-session-row-client"

interface SettingsSessionsCardClientProps {
  readonly currentSessionId: string | undefined
  readonly sessions: readonly AuthActiveSession[]
}

export const SettingsSessionsCardClient = ({ currentSessionId, sessions }: SettingsSessionsCardClientProps): JSX.Element => {
  const queryClient = useQueryClient()
  const settingsRevokeSessionRequest = useMutation({
    ...settingsRevokeSessionMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session"] }),
  })
  const settingsRevokeOtherSessionsRequest = useMutation({
    ...settingsRevokeOtherSessionsMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session"] }),
  })
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const t = useTranslations("pages.admin.settings")
  const actionError = useActionError()

  const handleRevokeSession = useCallback(
    (token: string) => {
      startTransition(async () => {
        try {
          await settingsRevokeSessionRequest.mutateAsync({ token })
          toast.success(t("security.sessions.feedback.revokeSuccess"))
          void router.invalidate()
        } catch (error) {
          toast.error(actionError(error))
        }
      })
    },
    [actionError, router, t],
  )

  const handleRevokeOtherSessions = useCallback(() => {
    startTransition(async () => {
      try {
        await settingsRevokeOtherSessionsRequest.mutateAsync()
        toast.success(t("security.sessions.feedback.logoutAllSuccess"))
        void router.invalidate()
      } catch (error) {
        toast.error(actionError(error))
      }
    })
  }, [actionError, router, t])

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-1 text-base font-medium text-foreground">{t("security.sessions.title")}</h2>
          <p className="text-xs text-muted-foreground">{t("security.sessions.description")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 shrink-0 px-3 text-xs"
          isDisabled={isPending}
          onPress={handleRevokeOtherSessions}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : t("security.sessions.logoutAll")}
        </Button>
      </div>

      <div className="divide-y divide-border">
        {sessions.map((session) => (
          <AdminActiveSessionRowClient
            key={session.token}
            currentSessionId={currentSessionId}
            isPending={isPending}
            onRevoke={handleRevokeSession}
            session={session}
          />
        ))}
      </div>
    </Card>
  )
}
