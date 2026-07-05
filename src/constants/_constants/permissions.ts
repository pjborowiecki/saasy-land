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

const ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
} as const

const DEFAULT_ROLE = ROLES.CUSTOMER

const ROLE_VALUES = [ROLES.ADMIN, ROLES.CUSTOMER] as const

export const PERMISSIONS = {
  ACTIONS,
  DEFAULT_ROLE,
  RESOURCES,
  ROLES,
  ROLE_VALUES,
} as const
