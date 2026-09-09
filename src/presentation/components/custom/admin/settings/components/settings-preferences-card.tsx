import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { I18N } from "~/src/integrations/use-intl/i18n.config"

import { DEFAULT_TIMEZONE_CODE, type TimezoneCode } from "~/src/modules/_core/constants/timezone"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/presentation/components/shadcn/select"
import { Switch } from "~/src/presentation/components/shadcn/switch"

const PREFERENCE_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Warsaw",
] as const satisfies readonly TimezoneCode[]

export const SettingsPreferencesCard = (): JSX.Element => {
  const t = useTranslations("pages.admin.settings")
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border p-5">
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

const SettingsPreferencesSelects = (): JSX.Element => {
  const t = useTranslations("pages.admin.settings")
  const tLocales = useTranslations("locales")
  const tTimezones = useTranslations("timezones")

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-1.5">
        <Select fieldLabel={t("preferences.language")} fieldLabelClassName="text-xs" defaultValue={I18N.DEFAULT_LOCALE}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {I18N.SUPPORTED_LOCALES.map((code) => (
              <SelectItem id={code} key={code}>
                {tLocales(code)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Select fieldLabel={t("preferences.timezone")} fieldLabelClassName="text-xs" defaultValue={DEFAULT_TIMEZONE_CODE}>
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

const SettingsAnnouncementsToggle = (): JSX.Element => {
  const t = useTranslations("pages.admin.settings")
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
