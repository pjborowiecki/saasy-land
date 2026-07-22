"use client"

import { useMemo, type JSX } from "react"

import { useTranslations } from "next-intl"

import { DataTable } from "~/src/presentation/components/custom/data-table/data-table"

import { UsersAllUsersAddUserButton } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_components/users-all-users-add-user-button"
import { useUsersAllUsersColumns } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_components/users-all-users-columns"
import { useUsersAllUsers } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_components/users-all-users-provider"
import { UsersAllUsersRowActions } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_components/users-all-users-row-actions"
import { UsersAllUsersToolbarFilters } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_components/users-all-users-toolbar-filters"

export function UsersAllUsersTable(): JSX.Element {
  const t = useTranslations("pages.admin.users")
  const columns = useUsersAllUsersColumns()
  const {
    actions: { fetch, setRoleFilter, setStatusFilter },
    state: { draftFilters, hasFetched, isDirty, isFetching, users },
  } = useUsersAllUsers()

  const options = useMemo(
    () => ({
      emptyMessage: t("table.empty"),
      loading: isFetching,
      rowActions: UsersAllUsersRowActions,
      toolbar: {
        exportCsv: { filename: "users.csv" },
        fetch: {
          hasFetched,
          isDirty,
          isFetching,
          onFetch: fetch,
        },
        filters: (
          <UsersAllUsersToolbarFilters
            onRoleChange={setRoleFilter}
            onStatusChange={setStatusFilter}
            roleFilter={draftFilters.role}
            statusFilter={draftFilters.status}
          />
        ),
        primaryAction: <UsersAllUsersAddUserButton />,
        search: {
          placeholder: t("search.placeholder"),
        },
      },
    }),
    [draftFilters.role, draftFilters.status, fetch, hasFetched, isDirty, isFetching, setRoleFilter, setStatusFilter, t],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <DataTable columns={columns} data={users} options={options} />
    </div>
  )
}
