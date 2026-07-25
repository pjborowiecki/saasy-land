export const TABS = ["allUsers", "invitations", "roles", "security"] as const

export type UsersPageTab = (typeof TABS)[number]

export const DEFAULT_TAB: UsersPageTab = "allUsers"
