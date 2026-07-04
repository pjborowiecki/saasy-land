import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"

import { CONSTANTS } from "~/src/constants"

const { ACTIONS, RESOURCES, ROLES } = CONSTANTS.PERMISSIONS

const APP_GRANTS = {
  [RESOURCES.ORDER]: [ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.REFUND],
  [RESOURCES.PRODUCT]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.DELETE, ACTIONS.PUBLISH],
  [RESOURCES.SETTINGS]: [ACTIONS.MANAGE],
} as const

const EMPTY_APP_GRANTS = {
  [RESOURCES.ORDER]: [],
  [RESOURCES.PRODUCT]: [],
  [RESOURCES.SETTINGS]: [],
} as const

export const PERMISSIONS_STATEMENTS = {
  ...defaultStatements,
  ...APP_GRANTS,
} as const

export const ac = createAccessControl(PERMISSIONS_STATEMENTS)

export const ROLES_CONFIG = {
  [ROLES.ADMIN]: ac.newRole({
    ...APP_GRANTS,
    user: [...adminAc.statements.user],
    session: [...adminAc.statements.session],
  }),
  [ROLES.CUSTOMER]: ac.newRole({
    ...EMPTY_APP_GRANTS,
    user: [],
    session: [],
  }),
} as const
