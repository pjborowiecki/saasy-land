import type { JSX } from "react"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { SettingsPasswordFormClient } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-password-form-client"
import { SettingsSessionsCardClient } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-sessions-card-client"
import { SettingsTwoFactorCard } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-two-factor-card"
import { getSettingsSessions } from "~/src/app/[locale]/(admin)/admin/settings/_lib/settings-data"

export async function SettingsSecurityTab(): Promise<JSX.Element> {
  const securitySessions = await getSettingsSessions()

  return (
    <TabsContent id="security" className="mt-8 space-y-6 outline-none">
      <SettingsPasswordFormClient />
      <SettingsTwoFactorCard />
      <SettingsSessionsCardClient securitySessions={securitySessions} />
    </TabsContent>
  )
}
