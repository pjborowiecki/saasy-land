import type { JSX } from "react"

import { TabsContent } from "~/src/components/shadcn/tabs"

import { SettingsDangerZoneCard } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-danger-zone-card"
import { SettingsPreferencesCard } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-preferences-card"
import { SettingsProfileCard } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-profile-card"

export function SettingsGeneralTab(): JSX.Element {
  return (
    <TabsContent id="general" className="mt-8 space-y-6 outline-none">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SettingsProfileCard />
        <SettingsPreferencesCard />
      </div>
      <SettingsDangerZoneCard />
    </TabsContent>
  )
}
