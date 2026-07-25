import type { JSX } from "react"

import { AllUsersTab } from "~/src/app/[locale]/(admin)/admin/users/_components/all-users-tab/all-users-tab"
import { UsersInvitationsTab } from "~/src/app/[locale]/(admin)/admin/users/_components/invitations-tab/users-invitations-tab"
import { UsersRolesTab } from "~/src/app/[locale]/(admin)/admin/users/_components/roles-tab/users-roles-tab"
import { UsersSecurityTab } from "~/src/app/[locale]/(admin)/admin/users/_components/security-tab/users-security-tab"
import { searchParamsCache } from "~/src/app/[locale]/(admin)/admin/users/_lib/search-params"
import type { UsersPageTab } from "~/src/app/[locale]/(admin)/admin/users/_lib/tabs"

const TAB_PANELS: Record<UsersPageTab, JSX.Element> = {
  allUsers: <AllUsersTab />,
  invitations: <UsersInvitationsTab />,
  roles: <UsersRolesTab />,
  security: <UsersSecurityTab />,
}

export async function ActiveTab({
  searchParams,
}: Readonly<Pick<PageProps<"/[locale]/admin/users">, "searchParams">>): Promise<JSX.Element> {
  const { tab } = searchParamsCache.parse(await searchParams)

  return TAB_PANELS[tab]
}
