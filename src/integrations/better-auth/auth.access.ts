import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"

export const RoleCode = {
  ADMIN: "admin",
  CUSTOMER: "customer",
} as const

export type RoleName = (typeof RoleCode)[keyof typeof RoleCode]

export const ROLE_VALUES = [RoleCode.ADMIN, RoleCode.CUSTOMER] as const satisfies readonly RoleName[]

export const DEFAULT_ROLE = RoleCode.CUSTOMER

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
  CATEGORY: "category",
  ORDER: "order",
  PRODUCT: "product",
  SETTINGS: "settings",
} as const

export const PERMISSIONS = {
  ACTIONS,
  DEFAULT_ROLE,
  RESOURCES,
  ROLES: RoleCode,
  ROLE_VALUES,
  category: {
    create: { category: ["create"] },
    delete: { category: ["delete"] },
    read: { category: ["read"] },
    update: { category: ["update"] },
  },
  order: {
    read: { order: ["read"] },
    refund: { order: ["refund"] },
    update: { order: ["update"] },
  },
  product: {
    create: { product: ["create"] },
    delete: { product: ["delete"] },
    publish: { product: ["publish"] },
    read: { product: ["read"] },
    update: { product: ["update"] },
  },
  session: {
    list: { session: ["list"] },
    revoke: { session: ["revoke"] },
  },
  settings: {
    manage: { settings: ["manage"] },
  },
  user: {
    ban: { user: ["ban"] },
    create: { user: ["create"] },
    delete: { user: ["delete"] },
    get: { user: ["get"] },
    impersonate: { user: ["impersonate"] },
    list: { user: ["list"] },
    setPassword: { user: ["set-password"] },
    setRole: { user: ["set-role"] },
    update: { user: ["update"] },
  },
} as const

const APP_GRANTS = {
  [RESOURCES.CATEGORY]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE],
  [RESOURCES.ORDER]: [ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.REFUND],
  [RESOURCES.PRODUCT]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.PUBLISH],
  [RESOURCES.SETTINGS]: [ACTIONS.MANAGE],
} as const

export const ac = createAccessControl({
  ...defaultStatements,
  ...APP_GRANTS,
})

export const ROLES_CONFIG = {
  [RoleCode.ADMIN]: ac.newRole({
    ...APP_GRANTS,
    session: [...adminAc.statements.session],
    user: [...adminAc.statements.user],
  }),
  [RoleCode.CUSTOMER]: ac.newRole({
    category: [],
    order: [],
    product: [],
    session: [],
    settings: [],
    user: [],
  }),
} as const

export const ADMIN_PANEL_ROLES = [RoleCode.ADMIN] as const

export type PermissionRequest = Record<string, string | readonly string[]>

function isRoleName(value: string): value is RoleName {
  return value in ROLES_CONFIG
}

export function hasPermission(role: string | null | undefined, permission: PermissionRequest): boolean {
  if (!role?.length) {
    return false
  }

  for (const roleName of role.split(",")) {
    const trimmedRole = roleName.trim()

    if (isRoleName(trimmedRole) && ROLES_CONFIG[trimmedRole].authorize(permission).success) {
      return true
    }
  }

  return false
}

export function hasAdminPanelAccess(role?: string | null): boolean {
  return hasPermission(role, PERMISSIONS.user.list)
}
