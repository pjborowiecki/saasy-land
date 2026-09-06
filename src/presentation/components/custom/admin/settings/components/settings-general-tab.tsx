import type { JSX } from "react"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { SettingsDangerZoneCard } from "~/src/presentation/components/custom/admin/settings/components/settings-danger-zone-card"
import { SettingsPreferencesCard } from "~/src/presentation/components/custom/admin/settings/components/settings-preferences-card"
import { SettingsProfileCard } from "~/src/presentation/components/custom/admin/settings/components/settings-profile-card"

export const SettingsGeneralTab = (): JSX.Element => (
  <TabsContent id="general" className="mt-8 space-y-6 outline-none">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <SettingsProfileCard />
      <SettingsPreferencesCard />
    </div>
    <SettingsDangerZoneCard />
  </TabsContent>
)
