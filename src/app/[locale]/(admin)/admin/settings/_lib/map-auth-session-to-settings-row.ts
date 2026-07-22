import type { AuthActiveSession } from "~/src/integrations/better-auth/auth.types"

import type { SettingsSessionRow } from "~/src/app/[locale]/(admin)/admin/settings/_lib/settings-session.types"

const MS_PER_MINUTE = 60_000
const MS_PER_HOUR = 3_600_000
const MS_PER_DAY = 86_400_000
const MOBILE_USER_AGENT_PATTERN = /mobile|iphone|android|ipad|ipod/iu

function resolveSessionIcon(userAgent?: string | null): SettingsSessionRow["icon"] {
  if (userAgent !== undefined && userAgent !== null && MOBILE_USER_AGENT_PATTERN.test(userAgent)) {
    return "smartphone"
  }

  return "laptop"
}

function resolveSessionDevice(userAgent?: string | null, ipAddress?: string | null): string {
  if (userAgent !== undefined && userAgent !== null && userAgent.length > 0) {
    return userAgent
  }

  if (ipAddress !== undefined && ipAddress !== null && ipAddress.length > 0) {
    return ipAddress
  }

  return "Unknown device"
}

function formatRelativeActiveTime(updatedAt: Date, now: Date): string {
  const elapsedMs = now.getTime() - updatedAt.getTime()

  if (elapsedMs < MS_PER_MINUTE) {
    return "just now"
  }

  if (elapsedMs < MS_PER_HOUR) {
    const minutes = Math.floor(elapsedMs / MS_PER_MINUTE)
    return `${minutes} min`
  }

  if (elapsedMs < MS_PER_DAY) {
    const hours = Math.floor(elapsedMs / MS_PER_HOUR)
    return `${hours} h`
  }

  const days = Math.floor(elapsedMs / MS_PER_DAY)
  return `${days} d`
}

export function mapAuthActiveSessionToSettingsRow(
  session: AuthActiveSession,
  currentSessionId: string | undefined,
  now = new Date(),
): SettingsSessionRow {
  const isCurrent = currentSessionId !== undefined && session.id === currentSessionId
  const time = isCurrent ? undefined : formatRelativeActiveTime(session.updatedAt, now)

  return {
    device: resolveSessionDevice(session.userAgent, session.ipAddress),
    icon: resolveSessionIcon(session.userAgent),
    ...(session.ipAddress !== undefined && session.ipAddress !== null ? { ip: session.ipAddress } : {}),
    isCurrent,
    location: "Unknown location",
    ...(time === undefined ? {} : { time }),
    token: session.token,
  }
}
