import type { AdminSecuritySessionRow } from "~/src/app/[locale]/(admin)/admin/_types"

/** Session row for settings UI — includes revoke token (server-only detail, passed to client actions). */
export interface SettingsSessionRow extends AdminSecuritySessionRow {
  readonly token: string
}
