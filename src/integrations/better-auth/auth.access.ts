import { type RoleAuthorizeRequest, createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"

export const ROLE_CODES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
} as const

export type Role = (typeof ROLE_CODES)[keyof typeof ROLE_CODES]

export const ROLE_VALUES = [ROLE_CODES.ADMIN, ROLE_CODES.CUSTOMER] as const satisfies readonly Role[]

export const DEFAULT_ROLE_CODE = ROLE_CODES.CUSTOMER

const APP_STATEMENTS = {
  admin: ["access"],
  category: ["create", "read", "update", "delete"],
  order: ["read", "update", "refund"],
  product: ["create", "read", "update", "delete", "publish"],
  settings: ["manage"],
} as const

export const ac = createAccessControl({ ...defaultStatements, ...APP_STATEMENTS })

export const ROLES = {
  [ROLE_CODES.ADMIN]: ac.newRole({ ...APP_STATEMENTS, ...adminAc.statements }),
  [ROLE_CODES.CUSTOMER]: ac.newRole({}),
}

export type Permission = RoleAuthorizeRequest<typeof ac.statements>

const isRole = (value: string | null | undefined): value is Role =>
  typeof value === "string" && (ROLE_VALUES as readonly string[]).includes(value)

export const hasPermission = (role: string | null | undefined, permission: Permission): boolean =>
  isRole(role) && ROLES[role].authorize(permission).success
