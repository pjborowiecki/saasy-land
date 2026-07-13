"use client"

import type { JSX } from "react"

import type { AdminUserRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { UsersAllUsersProvider } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_components/users-all-users-provider"
import { UsersAllUsersTable } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_components/users-all-users-table"

interface UsersAllUsersTabViewProps {
  readonly initialUsers: readonly AdminUserRow[]
}

export function UsersAllUsersTabView({ initialUsers }: Readonly<UsersAllUsersTabViewProps>): JSX.Element {
  return (
    <UsersAllUsersProvider initialUsers={initialUsers}>
      <UsersAllUsersTable />
    </UsersAllUsersProvider>
  )
}
