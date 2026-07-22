import type { auth } from "~/src/integrations/better-auth/auth.server"

export type AuthActiveSession = Awaited<ReturnType<typeof auth.api.listSessions>>[number]

export interface AuthSession {
  readonly user: {
    readonly id: string
    readonly role?: string | null
  }
}
