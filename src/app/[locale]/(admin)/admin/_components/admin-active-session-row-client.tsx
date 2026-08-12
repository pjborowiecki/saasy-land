"use client"

import { type JSX, useCallback } from "react"

import { Laptop, Loader2, Smartphone } from "lucide-react"
import { useTranslations } from "next-intl"

import type { AuthActiveSession } from "~/src/integrations/better-auth/auth.types"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"

const MS_PER_MINUTE = 60_000
const MS_PER_HOUR = 3_600_000
const MS_PER_DAY = 86_400_000
const MOBILE_USER_AGENT_PATTERN = /mobile|iphone|android|ipad|ipod/iu

function sessionUpdatedAtMs(updatedAt: Date | string): number {
  return updatedAt instanceof Date ? updatedAt.getTime() : new Date(updatedAt).getTime()
}

function formatRelativeActiveTime(updatedAt: Date | string, now: Date): string {
  const elapsedMs = now.getTime() - sessionUpdatedAtMs(updatedAt)

  if (elapsedMs < MS_PER_MINUTE) {
    return "just now"
  }

  if (elapsedMs < MS_PER_HOUR) {
    const minutes = Math.floor(elapsedMs / MS_PER_MINUTE)
    return `${minutes} min`
  }

  if (elapsedMs < MS_PER_DAY) {
    const hours = Math.floor(elapsedMs / MS_PER_HOUR)
    return `${hours} h`
  }

  const days = Math.floor(elapsedMs / MS_PER_DAY)
  return `${days} d`
}

interface AdminActiveSessionRowClientProps {
  readonly currentSessionId: string | undefined
  readonly isPending: boolean
  readonly onRevoke: (token: string) => void
  readonly session: AuthActiveSession
}

export function AdminActiveSessionRowClient({
  currentSessionId,
  isPending,
  onRevoke,
  session,
}: AdminActiveSessionRowClientProps): JSX.Element {
  const t = useTranslations("pages.admin.settings")

  const isCurrent = currentSessionId !== undefined && session.id === currentSessionId
  const isMobile = session.userAgent !== undefined && session.userAgent !== null && MOBILE_USER_AGENT_PATTERN.test(session.userAgent)

  let deviceLabel = "Unknown device"
  if (session.userAgent !== undefined && session.userAgent !== null && session.userAgent.length > 0) {
    deviceLabel = session.userAgent
  } else if (session.ipAddress !== undefined && session.ipAddress !== null && session.ipAddress.length > 0) {
    deviceLabel = session.ipAddress
  }

  const activeAgo = isCurrent ? undefined : formatRelativeActiveTime(session.updatedAt, new Date())

  const handleRevoke = useCallback(() => {
    onRevoke(session.token)
  }, [onRevoke, session.token])

  return (
    <div className="group flex items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/40">
      <div className="flex items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground shadow-inner">
          {isMobile ? <Smartphone className="size-5" /> : <Laptop className="size-5" />}
        </div>
        <div>
          <div className="mb-0.5 flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{deviceLabel}</p>
            {isCurrent ? (
              <Badge variant="outline" className="px-0 text-xs font-medium text-ring">
                {t("security.sessions.currentBadge")}
              </Badge>
            ) : undefined}
          </div>
          <p className="text-xs text-muted-foreground">
            Unknown location {t("security.sessions.separator")}{" "}
            {isCurrent ? session.ipAddress : t("security.sessions.activeAgo", { time: activeAgo ?? "" })}
          </p>
        </div>
      </div>
      {isCurrent ? undefined : (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs font-medium text-destructive transition-opacity hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
          isDisabled={isPending}
          onPress={handleRevoke}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : t("security.sessions.revoke")}
        </Button>
      )}
    </div>
  )
}
