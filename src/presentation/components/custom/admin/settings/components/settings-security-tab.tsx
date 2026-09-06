import type { JSX } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"

import { getCurrentSessionQuery } from "~/src/integrations/better-auth/auth.session"

import { getActiveSessionsQuery } from "~/src/modules/session/use-cases/get-active-sessions"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { SettingsPasswordFormClient } from "~/src/presentation/components/custom/admin/settings/components/settings-password-form-client"
import { SettingsSessionsCardClient } from "~/src/presentation/components/custom/admin/settings/components/settings-sessions-card-client"
import { SettingsTwoFactorCard } from "~/src/presentation/components/custom/admin/settings/components/settings-two-factor-card"

export const SettingsSecurityTab = (): JSX.Element => {
  const sessions = useSuspenseQuery(getActiveSessionsQuery).data
  const currentSession = useSuspenseQuery(getCurrentSessionQuery).data

  return (
    <TabsContent id="security" className="mt-8 space-y-6 outline-none">
      <SettingsPasswordFormClient />
      <SettingsTwoFactorCard twoFactorEnabled={currentSession?.user.twoFactorEnabled ?? false} />
      <SettingsSessionsCardClient currentSessionId={currentSession?.session.id} sessions={sessions} />
    </TabsContent>
  )
}
