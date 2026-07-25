"use client"

import { toast } from "sonner"

import { listUsers } from "~/src/modules/user/use-cases/list-users.use-case"
import { refreshUsersTable } from "~/src/modules/user/use-cases/refresh-users-table.use-case"
import type { User } from "~/src/modules/user/user.types"

import type { DataTableOptions } from "~/src/presentation/components/custom/data-table/_types/data-table.types"

import {
  AddUserButton,
  UserRowActions,
} from "~/src/app/[locale]/(admin)/admin/users/_components/all-users-tab/components/all-users-table/actions"
import { ToolbarFilters } from "~/src/app/[locale]/(admin)/admin/users/_components/all-users-tab/components/all-users-table/filters"

async function onFetchUsers(): Promise<void> {
  const result = await listUsers()
  if (result.serverError) {
    toast.error(result.serverError.message)
    return
  }

  const refreshResult = await refreshUsersTable()
  if (refreshResult.serverError) {
    toast.error(refreshResult.serverError.message)
  }
}

export const options: DataTableOptions<User["select"]> = {
  rowActions: UserRowActions,
  toolbar: {
    exportCsv: { filename: "users.csv" },
    fetch: {
      onFetch: onFetchUsers,
    },
    filters: <ToolbarFilters />,
    primaryAction: <AddUserButton />,
  },
}
