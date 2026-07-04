import { I18N } from "./_constants/i18n"
import { PERMISSIONS } from "./_constants/permissions"
import { ROUTES } from "./_constants/routes"
import { SIDEBAR_CONFIG } from "./_constants/sidebar"
import { USER_PREFERENCES } from "./_constants/user-preferences"

export const CONSTANTS = {
  APP_NAME: "SaaSy Land",
  APP_GITHUB_OWNER: "pjborowiecki",
  APP_GITHUB_REPO: "saasyland.com",
  APP_GITHUB_URL: "https://github.com/pjborowiecki/saasyland.com",
  DEFAULT_APP_URL: "http://localhost:3000",
  CONTACT_EMAIL: "hello@saasyland.com",
  I18N,
  PERMISSIONS,
  ROUTES,
  SIDEBAR_CONFIG,
  USER_PREFERENCES,
} as const
