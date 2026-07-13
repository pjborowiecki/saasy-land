import type { JSX } from "react"

import { UsersAllUsersTab } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/users-all-users-tab"
import { UsersInvitationsTab } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/invitations/users-invitations-tab"
import { UsersRolesTab } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/roles/users-roles-tab"
import { UsersSecurityTab } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/security/users-security-tab"
import type { UsersPageTab } from "~/src/app/[locale]/(admin)/admin/users/_lib/users-page-tabs"

interface UsersTabPanelProps {
  readonly tab: UsersPageTab
}

export function UsersTabPanel({ tab }: Readonly<UsersTabPanelProps>): JSX.Element {
  switch (tab) {
    case "allUsers": {
      return <UsersAllUsersTab />
    }
    case "invitations": {
      return <UsersInvitationsTab />
    }
    case "roles": {
      return <UsersRolesTab />
    }
    case "security": {
      return <UsersSecurityTab />
    }
  }
}
