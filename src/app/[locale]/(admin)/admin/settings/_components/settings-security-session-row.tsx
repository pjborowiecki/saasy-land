import type { JSX } from "react"

import { Laptop, Smartphone } from "lucide-react"
import { getTranslations } from "next-intl/server"

import type { AdminSecuritySessionRow } from "~/src/lib/admin/demo-data.types"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"

interface SettingsSecuritySessionRowProps {
  readonly session: AdminSecuritySessionRow
}

export async function SettingsSecuritySessionRow({ session }: SettingsSecuritySessionRowProps): Promise<JSX.Element> {
  const t = await getTranslations("admin.settings")
  return (
    <div className="group flex items-center justify-between gap-4 p-5 transition-colors hover:bg-secondary/20">
      <div className="flex items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground shadow-inner">
          {session.icon === "laptop" ? <Laptop className="size-5" /> : <Smartphone className="size-5" />}
        </div>
        <SettingsSecuritySessionDetails session={session} />
      </div>
      {!session.isCurrent && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs font-medium text-destructive transition-opacity hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
        >
          {t("security.sessions.revoke")}
        </Button>
      )}
    </div>
  )
}

async function SettingsSecuritySessionDetails({ session }: SettingsSecuritySessionRowProps): Promise<JSX.Element> {
  const t = await getTranslations("admin.settings")
  return (
    <div>
      <div className="mb-0.5 flex items-center gap-2">
        <p className="text-sm font-medium text-foreground">{session.device}</p>
        {session.isCurrent && (
          <Badge
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500"
          >
            {t("security.sessions.currentBadge")}
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {session.location} {t("security.sessions.separator")}{" "}
        {session.isCurrent ? session.ip : t("security.sessions.activeAgo", { time: session.time ?? "" })}
      </p>
    </div>
  )
}
