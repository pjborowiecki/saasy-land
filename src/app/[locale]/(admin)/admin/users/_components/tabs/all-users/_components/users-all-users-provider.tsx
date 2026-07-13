"use client"

import { createContext, use, useCallback, useMemo, useState, type JSX, type ReactNode } from "react"

import type { AdminUserRow } from "~/src/app/[locale]/(admin)/admin/_types"
import {
  DEFAULT_ADMIN_USERS_FILTERS,
  USERS_FILTER_ALL,
  areAdminUsersFiltersEqual,
  filterAdminUsers,
  type AdminUsersListFilters,
} from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_lib/users-filters"

interface UsersAllUsersState {
  draftFilters: AdminUsersListFilters
  hasFetched: boolean
  isDirty: boolean
  isFetching: boolean
  users: AdminUserRow[]
}

interface UsersAllUsersActions {
  fetch: () => void
  setRoleFilter: (value: string | null) => void
  setStatusFilter: (value: string | null) => void
}

interface UsersAllUsersContextValue {
  actions: UsersAllUsersActions
  state: UsersAllUsersState
}

const UsersAllUsersContext = createContext<UsersAllUsersContextValue | undefined>(undefined)

export function useUsersAllUsers(): UsersAllUsersContextValue {
  const context = use(UsersAllUsersContext)
  if (context === undefined) {
    throw new Error("useUsersAllUsers must be used within UsersAllUsersProvider.")
  }
  return context
}

interface UsersAllUsersProviderProps {
  readonly children: ReactNode
  readonly initialUsers: readonly AdminUserRow[]
}

export function UsersAllUsersProvider({ children, initialUsers }: UsersAllUsersProviderProps): JSX.Element {
  const [draftFilters, setDraftFilters] = useState<AdminUsersListFilters>(DEFAULT_ADMIN_USERS_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<AdminUsersListFilters>(DEFAULT_ADMIN_USERS_FILTERS)

  const users = useMemo(() => filterAdminUsers(initialUsers, appliedFilters), [appliedFilters, initialUsers])
  const isDirty = !areAdminUsersFiltersEqual(draftFilters, appliedFilters)

  const setRoleFilter = useCallback((value: string | null) => {
    setDraftFilters((current) => ({
      ...current,
      role: value ?? USERS_FILTER_ALL,
    }))
  }, [])

  const setStatusFilter = useCallback((value: string | null) => {
    setDraftFilters((current) => ({
      ...current,
      status: value ?? USERS_FILTER_ALL,
    }))
  }, [])

  const fetch = useCallback(() => {
    setAppliedFilters(draftFilters)
  }, [draftFilters])

  const value = useMemo(
    (): UsersAllUsersContextValue => ({
      actions: {
        fetch,
        setRoleFilter,
        setStatusFilter,
      },
      state: {
        draftFilters,
        hasFetched: true,
        isDirty,
        isFetching: false,
        users,
      },
    }),
    [draftFilters, fetch, isDirty, setRoleFilter, setStatusFilter, users],
  )

  return <UsersAllUsersContext value={value}>{children}</UsersAllUsersContext>
}
