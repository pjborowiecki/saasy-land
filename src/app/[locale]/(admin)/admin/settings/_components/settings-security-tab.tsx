import type { JSX } from "react"

import type { AdminSecuritySessionRow } from "~/src/lib/admin/demo-data.types"

import { TabsContent } from "~/src/components/shadcn/tabs"

import { SettingsPasswordCard } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-password-card"
import { SettingsSessionsCard } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-sessions-card"
import { SettingsTwoFactorCard } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-two-factor-card"

interface SettingsSecurityTabProps {
  readonly securitySessions: readonly AdminSecuritySessionRow[]
}

export function SettingsSecurityTab({ securitySessions }: SettingsSecurityTabProps): JSX.Element {
  return (
    <TabsContent value="security" className="mt-8 space-y-6 outline-none">
      <SettingsPasswordCard />
      <SettingsTwoFactorCard />
      <SettingsSessionsCard securitySessions={securitySessions} />
    </TabsContent>
  )
}
