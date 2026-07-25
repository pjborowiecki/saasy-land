import type { JSX } from "react"

import { listUsers } from "~/src/modules/user/use-cases/list-users.use-case"
import type { User } from "~/src/modules/user/user.types"

import { AllUsersTable } from "~/src/app/[locale]/(admin)/admin/users/_components/all-users-tab/components/all-users-table/table"

const EMPTY_USERS: User["select"][] = []

export async function AllUsersTab(): Promise<JSX.Element> {
  const result = await listUsers()

  return <AllUsersTable users={result.data ?? EMPTY_USERS} />
}
