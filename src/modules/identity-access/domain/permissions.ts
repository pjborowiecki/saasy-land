import { DEFAULT_ROLE, ROLE_VALUES, RoleCode } from "~/src/modules/identity-access/domain/value-objects/role"

const ACTIONS = {
  CREATE: "create",
  DELETE: "delete",
  MANAGE: "manage",
  PUBLISH: "publish",
  READ: "read",
  REFUND: "refund",
  UPDATE: "update",
} as const

const RESOURCES = {
  ORDER: "order",
  PRODUCT: "product",
  SETTINGS: "settings",
} as const

/** Authz catalogs. Role codes come from {@link RoleCode} — do not redefine them here. */
export const PERMISSIONS = {
  ACTIONS,
  DEFAULT_ROLE,
  RESOURCES,
  ROLES: RoleCode,
  ROLE_VALUES,
} as const

export type { RoleName } from "~/src/modules/identity-access/domain/value-objects/role"
export type AppResource = (typeof PERMISSIONS.RESOURCES)[keyof typeof PERMISSIONS.RESOURCES]
export type PermissionAction = (typeof PERMISSIONS.ACTIONS)[keyof typeof PERMISSIONS.ACTIONS]
