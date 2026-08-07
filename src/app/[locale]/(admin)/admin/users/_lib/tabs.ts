import { ROUTES } from "~/src/routes"

export const TAB_IDS = ["allUsers", "invitations", "roles", "security"] as const

export const TABS = [
  { href: ROUTES.ADMIN_USERS_ALL, id: "allUsers", segment: "all" },
  { href: ROUTES.ADMIN_USERS_INVITATIONS, id: "invitations", segment: "invitations" },
  { href: ROUTES.ADMIN_USERS_ROLES, id: "roles", segment: "roles" },
  { href: ROUTES.ADMIN_USERS_SECURITY, id: "security", segment: "security" },
] as const

export type UsersPageTabId = (typeof TAB_IDS)[number]

export const DEFAULT_TAB: UsersPageTabId = "allUsers"
