import { pgEnum } from "drizzle-orm/pg-core"

import { PERMISSIONS } from "~/src/constants/_constants/permissions"
import { TIMEZONE } from "~/src/constants/_constants/timezone"

export const userRoleEnum = pgEnum("user_role", PERMISSIONS.ROLE_VALUES)

export const userTimezoneEnum = pgEnum("user_timezone", TIMEZONE.TIMEZONES)
