import { type JSX, Suspense } from "react"

import type { getUsers } from "~/src/modules/user/use-cases/get-users"

import { useAllUsersColumns } from "~/src/presentation/components/custom/admin/users/all/components/columns"
import { DATA_TABLE_OPTIONS } from "~/src/presentation/components/custom/admin/users/all/constants/options"
import { DataTable } from "~/src/presentation/components/custom/data-table/data-table"

export interface AllUsersTableProps {
  readonly users?: Awaited<ReturnType<typeof getUsers>> | undefined
}

const AllUsersTableContent = ({ users }: Readonly<AllUsersTableProps>): JSX.Element => {
  const columns = useAllUsersColumns()

  return <DataTable columns={columns} data={users} isLoading={users === undefined} options={DATA_TABLE_OPTIONS} />
}

const FALLBACK = <AllUsersTableContent />

export const AllUsersTable = ({ users }: Readonly<AllUsersTableProps>): JSX.Element => (
  <Suspense fallback={FALLBACK}>
    <AllUsersTableContent users={users} />
  </Suspense>
)
