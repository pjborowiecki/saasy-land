import { pgEnum } from "drizzle-orm/pg-core"

import { PERMISSIONS } from "~/src/constants/_constants/permissions"
import { USER_PREFERENCES } from "~/src/constants/_constants/user-preferences"

export const userRoleEnum = pgEnum("user_role", PERMISSIONS.ROLE_VALUES)

export const userTimezoneEnum = pgEnum("user_timezone", USER_PREFERENCES.TIMEZONE_VALUES)
