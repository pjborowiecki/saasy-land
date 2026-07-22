import { pgEnum } from "drizzle-orm/pg-core"

import { PERMISSIONS } from "~/src/modules/identity-access/domain/permissions"
import { TIMEZONE_CODES } from "~/src/modules/shared-kernel/domain/value-objects/timezone"

export const userRoleEnum = pgEnum("user_role", PERMISSIONS.ROLE_VALUES)

export const userTimezoneEnum = pgEnum("user_timezone", TIMEZONE_CODES)
