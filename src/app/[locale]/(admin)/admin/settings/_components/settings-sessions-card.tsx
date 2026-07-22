import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card } from "~/src/presentation/components/shadcn/card"

import type { AdminSecuritySessionRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { SettingsSecuritySessionRow } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-security-session-row"

interface SettingsSessionsCardProps {
  readonly securitySessions: readonly AdminSecuritySessionRow[]
}

export async function SettingsSessionsCard({ securitySessions }: SettingsSessionsCardProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-1 text-base font-medium text-foreground">{t("security.sessions.title")}</h2>
          <p className="text-xs text-muted-foreground">{t("security.sessions.description")}</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 shrink-0 px-3 text-xs">
          {t("security.sessions.logoutAll")}
        </Button>
      </div>

      <div className="divide-y divide-border/40">
        {securitySessions.map((session) => (
          <SettingsSecuritySessionRow key={session.device} session={session} />
        ))}
      </div>
    </Card>
  )
}
