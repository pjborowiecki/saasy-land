import "server-only"

import { headers } from "next/headers"
import { cache } from "react"

import { listActiveSessions } from "~/src/modules/session/use-cases/list-active-sessions.use-case"

import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

import { mapAuthActiveSessionToSettingsRow } from "~/src/app/[locale]/(admin)/admin/settings/_lib/map-auth-session-to-settings-row"
import type { SettingsSessionRow } from "~/src/app/[locale]/(admin)/admin/settings/_lib/settings-session.types"

/** RSC read. Per-request dedupe; sessions stay dynamic (no `use cache`). */
export const getSettingsSessions = cache(async (): Promise<SettingsSessionRow[]> => {
  const requestHeaders = await headers()

  const [sessions, currentSession] = await Promise.all([listActiveSessions(requestHeaders), getCurrentSession()])

  const currentSessionId = currentSession?.session.id

  return sessions.map((session) => mapAuthActiveSessionToSettingsRow(session, currentSessionId))
})
