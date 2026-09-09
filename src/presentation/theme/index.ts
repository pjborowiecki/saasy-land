import { APP_NAME } from "~/src/presentation/branding"

const THEMES = ["light", "dark", "system"] as const

const DEFAULT_THEME = "system" satisfies (typeof THEMES)[number]
const STORAGE_KEY = `${APP_NAME}-theme`

export const THEME = {
  DEFAULT_THEME,
  STORAGE_KEY,
  THEMES,
} as const
