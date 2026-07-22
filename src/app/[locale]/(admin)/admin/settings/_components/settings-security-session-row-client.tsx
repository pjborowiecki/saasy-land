"use client"

import { type JSX, useCallback } from "react"

import { Laptop, Loader2, Smartphone } from "lucide-react"
import { useTranslations } from "next-intl"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"

import type { SettingsSessionRow } from "~/src/app/[locale]/(admin)/admin/settings/_lib/settings-session.types"

interface SettingsSecuritySessionRowClientProps {
  readonly isPending: boolean
  readonly onRevoke: (token: string) => void
  readonly session: SettingsSessionRow
}

export function SettingsSecuritySessionRowClient({ isPending, onRevoke, session }: SettingsSecuritySessionRowClientProps): JSX.Element {
  const t = useTranslations("pages.admin.settings")

  const handleRevoke = useCallback(() => {
    onRevoke(session.token)
  }, [onRevoke, session.token])

  return (
    <div className="group flex items-center justify-between gap-4 p-5 transition-colors hover:bg-secondary/20">
      <div className="flex items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground shadow-inner">
          {session.icon === "laptop" ? <Laptop className="size-5" /> : <Smartphone className="size-5" />}
        </div>
        <div>
          <div className="mb-0.5 flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{session.device}</p>
            {session.isCurrent ? (
              <Badge
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500"
              >
                {t("security.sessions.currentBadge")}
              </Badge>
            ) : undefined}
          </div>
          <p className="text-xs text-muted-foreground">
            {session.location} {t("security.sessions.separator")}{" "}
            {session.isCurrent ? session.ip : t("security.sessions.activeAgo", { time: session.time ?? "" })}
          </p>
        </div>
      </div>
      {session.isCurrent ? undefined : (
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
