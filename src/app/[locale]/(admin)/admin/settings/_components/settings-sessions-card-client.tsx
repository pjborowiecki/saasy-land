"use client"

import { useCallback, useTransition, type JSX } from "react"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { settingsRevokeOtherSessions } from "~/src/modules/session/use-cases/revoke-other-sessions.use-case"
import { settingsRevokeSession } from "~/src/modules/session/use-cases/revoke-session.use-case"

import type { AuthActiveSession } from "~/src/integrations/better-auth/auth.types"
import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card } from "~/src/presentation/components/shadcn/card"

import { AdminActiveSessionRowClient } from "~/src/app/[locale]/(admin)/admin/_components/admin-active-session-row-client"

interface SettingsSessionsCardClientProps {
  readonly currentSessionId: string | undefined
  readonly sessions: readonly AuthActiveSession[]
}

export function SettingsSessionsCardClient({ currentSessionId, sessions }: SettingsSessionsCardClientProps): JSX.Element {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const t = useTranslations("pages.admin.settings")
  const actionError = useActionError()

  const handleRevokeSession = useCallback(
    (token: string) => {
      startTransition(async () => {
        const result = await settingsRevokeSession({ token })

        const error = actionError(result)

        if (error) {
          toast.error(error)
          return
        }

        toast.success(t("security.sessions.feedback.revokeSuccess"))
        router.refresh()
      })
    },
    [actionError, router, t],
  )

  const handleRevokeOtherSessions = useCallback(() => {
    startTransition(async () => {
      const result = await settingsRevokeOtherSessions()

      const error = actionError(result)

      if (error) {
        toast.error(error)
        return
      }

      toast.success(t("security.sessions.feedback.logoutAllSuccess"))
      router.refresh()
    })
  }, [actionError, router, t])

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 p-5 sm:flex-row sm:items-center">
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

      <div className="divide-y divide-border/40">
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
