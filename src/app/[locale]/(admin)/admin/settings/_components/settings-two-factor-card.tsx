import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/components/shadcn/card"

export async function SettingsTwoFactorCard(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/40 p-5">
        <CardTitle className="mb-1 text-base font-medium text-foreground">{t("security.twoFactor.title")}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{t("security.twoFactor.description")}</CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{t("security.twoFactor.app")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("security.twoFactor.appDescription")}</p>
          </div>
          <Button variant="outline" size="sm" className="h-8 shrink-0 px-4 text-xs">
            {t("security.twoFactor.enable")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
