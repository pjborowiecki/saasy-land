"use client"

import type { JSX } from "react"

import type { User } from "~/src/modules/user/user.types"

import { DataTable } from "~/src/presentation/components/custom/data-table/data-table"

import { useAllUsersColumns } from "~/src/app/[locale]/(admin)/admin/users/_components/all-users-tab/components/all-users-table/columns"
import { options } from "~/src/app/[locale]/(admin)/admin/users/_components/all-users-tab/components/all-users-table/options"

interface AllUsersTableProps {
  readonly users: User["select"][]
}

export function AllUsersTable({ users }: Readonly<AllUsersTableProps>): JSX.Element {
  const columns = useAllUsersColumns()

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden outline-none">
      <DataTable columns={columns} data={users} options={options} />
    </div>
  )
}
