import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/components/shadcn/card"

export async function SettingsDangerZoneCard(): Promise<JSX.Element> {
  const t = await getTranslations("admin.settings")
  return (
    <Card className="overflow-hidden border-destructive/20 bg-destructive/5">
      <CardHeader className="border-b border-destructive/10 p-5">
        <CardTitle className="mb-1 text-base font-medium text-destructive">{t("dangerZone.title")}</CardTitle>
        <CardDescription className="text-xs text-destructive/80">{t("dangerZone.description")}</CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-foreground">{t("dangerZone.delete.title")}</p>
            <p className="text-xs text-muted-foreground">{t("dangerZone.delete.description")}</p>
          </div>
          <Button variant="destructive" className="shrink-0">
            {t("dangerZone.delete.button")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
