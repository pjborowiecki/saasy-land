"use client"

import { Suspense, use, type JSX } from "react"

import type { listUsers } from "~/src/modules/user/use-cases/list-users.use-case"

import { DataTable } from "~/src/presentation/components/custom/data-table/data-table"

import { useAllUsersColumns } from "~/src/app/[locale]/(admin)/admin/users/all/_components/columns"
import { DATA_TABLE_OPTIONS } from "~/src/app/[locale]/(admin)/admin/users/all/_components/options"

export interface AllUsersTableProps {
  /** Omitted while pending: the table renders its skeleton rows instead. */
  readonly usersPromise?: ReturnType<typeof listUsers> | undefined
}

function AllUsersTableContent({ usersPromise }: Readonly<AllUsersTableProps>): JSX.Element {
  const columns = useAllUsersColumns()
  const users = usersPromise === undefined ? undefined : use(usersPromise)?.data

  return <DataTable columns={columns} data={users} isLoading={usersPromise === undefined} options={DATA_TABLE_OPTIONS} />
}

const FALLBACK = <AllUsersTableContent />

export function AllUsersTable({ usersPromise }: Readonly<AllUsersTableProps>): JSX.Element {
  return (
    <Suspense fallback={FALLBACK}>
      <AllUsersTableContent usersPromise={usersPromise} />
    </Suspense>
  )
}
