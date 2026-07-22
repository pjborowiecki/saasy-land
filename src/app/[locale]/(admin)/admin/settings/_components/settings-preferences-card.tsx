import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Timezone, type TimezoneCode } from "~/src/modules/shared-kernel/domain/value-objects/timezone"

import { I18N } from "~/src/integrations/next-intl/i18n.config"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"
import { Label } from "~/src/presentation/components/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/presentation/components/shadcn/select"
import { Switch } from "~/src/presentation/components/shadcn/switch"

/** Common preference options from the shared-kernel timezone catalog (not the full IANA set). */
const PREFERENCE_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Warsaw",
] as const satisfies readonly TimezoneCode[]

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
  const tLocales = await getTranslations("locales")
  const tTimezones = await getTranslations("timezones")

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-1.5">
        <Label className="text-xs">{t("preferences.language")}</Label>
        <Select defaultValue={I18N.DEFAULT_LOCALE}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {I18N.LOCALES.map((code) => (
              <SelectItem id={code} key={code}>
                {tLocales(code)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">{t("preferences.timezone")}</Label>
        <Select defaultValue={Timezone.DEFAULT_CODE}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PREFERENCE_TIMEZONES.map((iana) => (
              <SelectItem id={iana} key={iana}>
                {tTimezones(iana)}
              </SelectItem>
            ))}
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
