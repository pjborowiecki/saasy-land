import type { JSX } from "react"

import { getActiveSessions } from "~/src/modules/session/use-cases/get-active-sessions.use-case"

import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { SettingsPasswordFormClient } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-password-form-client"
import { SettingsSessionsCardClient } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-sessions-card-client"
import { SettingsTwoFactorCard } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-two-factor-card"

export async function SettingsSecurityTab(): Promise<JSX.Element> {
  const [sessions, currentSession] = await Promise.all([getActiveSessions(), getCurrentSession()])

  return (
    <TabsContent id="security" className="mt-8 space-y-6 outline-none">
      <SettingsPasswordFormClient />
      <SettingsTwoFactorCard twoFactorEnabled={currentSession?.user.twoFactorEnabled ?? false} />
      <SettingsSessionsCardClient currentSessionId={currentSession?.session.id} sessions={sessions} />
    </TabsContent>
  )
}
