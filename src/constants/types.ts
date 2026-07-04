import type { CONSTANTS } from "~/src/constants"

export type Locale = (typeof CONSTANTS.I18N.LOCALES)[number]
export type DefaultLocale = typeof CONSTANTS.I18N.DEFAULT_LOCALE

export type Currency = (typeof CONSTANTS.I18N.CURRENCIES)[Locale]
export type DefaultCurrency = typeof CONSTANTS.I18N.DEFAULT_CURRENCY

export type Role = (typeof CONSTANTS.PERMISSIONS.ROLES)[keyof typeof CONSTANTS.PERMISSIONS.ROLES]
export type Timezone = (typeof CONSTANTS.USER_PREFERENCES.TIMEZONES)[keyof typeof CONSTANTS.USER_PREFERENCES.TIMEZONES]
export type AppResource = (typeof CONSTANTS.PERMISSIONS.RESOURCES)[keyof typeof CONSTANTS.PERMISSIONS.RESOURCES]
export type PermissionAction = (typeof CONSTANTS.PERMISSIONS.ACTIONS)[keyof typeof CONSTANTS.PERMISSIONS.ACTIONS]
