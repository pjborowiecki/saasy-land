import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/components/shadcn/card"
import { Switch } from "~/src/components/shadcn/switch"

export async function DashboardSecurityCard(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.dashboard")
  return (
    <Card className="group relative overflow-hidden border-border/80 p-5 transition-colors hover:border-border/40">
      <h2 className="mb-4 text-base font-medium text-foreground">{t("security.title")}</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{t("security.mfa")}</p>
            <p className="text-xs text-muted-foreground">{t("security.mfaDesc")}</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{t("security.email")}</p>
            <p className="text-xs text-muted-foreground">{t("security.emailDesc")}</p>
          </div>
          <Switch />
        </div>
      </div>
    </Card>
  )
}
