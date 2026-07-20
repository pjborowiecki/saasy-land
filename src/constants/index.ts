import { I18N } from "./_constants/i18n"
import { PERMISSIONS } from "./_constants/permissions"
import { ROUTES } from "./_constants/routes"
import { SIDEBAR_CONFIG } from "./_constants/sidebar"
import { THEME } from "./_constants/theme"
import { TIMEZONE } from "./_constants/timezone"

export const CONSTANTS = {
  APP_GITHUB_OWNER: "pjborowiecki",
  APP_GITHUB_REPO: "saasyland.com",
  APP_GITHUB_URL: "https://github.com/pjborowiecki/saasyland.com",
  APP_NAME: "SaaSy Land",
  CONTACT_EMAIL: "hello@saasyland.com",
  DEFAULT_APP_URL: "http://localhost:3000",
  I18N,
  PERMISSIONS,
  ROUTES,
  SIDEBAR_CONFIG,
  THEME,
  TIMEZONE,
} as const
