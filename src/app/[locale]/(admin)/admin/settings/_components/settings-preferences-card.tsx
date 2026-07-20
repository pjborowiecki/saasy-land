import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/components/shadcn/card"
import { Label } from "~/src/components/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"
import { Switch } from "~/src/components/shadcn/switch"

export async function SettingsPreferencesCard(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/40 p-5">
        <CardTitle className="mb-1 text-base font-medium text-foreground">{t("preferences.title")}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{t("preferences.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6 p-5">
        <SettingsPreferencesSelects />
        <SettingsAnnouncementsToggle />
      </CardContent>
    </Card>
  )
}

async function SettingsPreferencesSelects(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-1.5">
        <Label className="text-xs">{t("preferences.language")}</Label>
        <Select defaultValue="en">
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="en">{t("preferences.languages.en")}</SelectItem>
            <SelectItem id="es">{t("preferences.languages.es")}</SelectItem>
            <SelectItem id="fr">{t("preferences.languages.fr")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">{t("preferences.timezone")}</Label>
        <Select defaultValue="est">
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="utc">{t("preferences.timezones.utc")}</SelectItem>
            <SelectItem id="est">{t("preferences.timezones.est")}</SelectItem>
            <SelectItem id="pst">{t("preferences.timezones.pst")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

async function SettingsAnnouncementsToggle(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-foreground">{t("preferences.announcements.title")}</p>
        <p className="text-xs text-muted-foreground">{t("preferences.announcements.description")}</p>
      </div>
      <Switch defaultSelected />
    </div>
  )
}
