import { headers } from "next/headers"
import type { JSX } from "react"

import { listActiveSessions } from "~/src/modules/session/use-cases/list-active-sessions.use-case"

import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { SettingsPasswordFormClient } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-password-form-client"
import { SettingsSessionsCardClient } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-sessions-card-client"
import { SettingsTwoFactorCard } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-two-factor-card"

export async function SettingsSecurityTab(): Promise<JSX.Element> {
  const requestHeaders = await headers()

  const [sessions, currentSession] = await Promise.all([listActiveSessions(requestHeaders), getCurrentSession()])

  return (
    <TabsContent id="security" className="mt-8 space-y-6 outline-none">
      <SettingsPasswordFormClient />
      <SettingsTwoFactorCard />
      <SettingsSessionsCardClient currentSessionId={currentSession?.session.id} sessions={sessions} />
    </TabsContent>
  )
}
