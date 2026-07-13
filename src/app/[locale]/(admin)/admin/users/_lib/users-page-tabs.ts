export const USERS_PAGE_TABS = ["allUsers", "invitations", "roles", "security"] as const

export type UsersPageTab = (typeof USERS_PAGE_TABS)[number]

export const USERS_PAGE_DEFAULT_TAB: UsersPageTab = "allUsers"

export function isUsersPageTab(value: unknown): value is UsersPageTab {
  return typeof value === "string" && USERS_PAGE_TABS.some((tab) => tab === value)
}

export function getUsersPageTabHref(pathname: string, tab: UsersPageTab): string {
  if (tab === USERS_PAGE_DEFAULT_TAB) {
    return pathname
  }

  return `${pathname}?tab=${tab}`
}
