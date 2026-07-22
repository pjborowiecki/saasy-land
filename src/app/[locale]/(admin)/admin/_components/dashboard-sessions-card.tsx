import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"

import { DashboardSessionItem as DashboardSessionItemRow } from "~/src/app/[locale]/(admin)/admin/_components/dashboard-session-item"
import type { DashboardSessionItem } from "~/src/app/[locale]/(admin)/admin/_types"

interface DashboardSessionsCardProps {
  readonly sessions: readonly DashboardSessionItem[]
}

export async function DashboardSessionsCard({ sessions }: DashboardSessionsCardProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.dashboard")
  return (
    <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
      <CardHeader className="border-b border-border/40 p-5">
        <CardTitle className="text-base font-medium text-foreground">{t("sessions.title")}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        {sessions.map((session) => (
          <DashboardSessionItemRow key={session.id} session={session} />
        ))}
      </CardContent>
      <div className="border-t border-border/40 bg-secondary/20 p-3">
        <Button variant="ghost" className="h-auto w-full py-1 text-xs font-medium text-muted-foreground hover:text-foreground">
          {t("sessions.signoutAll")}
        </Button>
      </div>
    </Card>
  )
}
