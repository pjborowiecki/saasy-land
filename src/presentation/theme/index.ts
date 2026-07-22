const THEMES = ["light", "dark", "system"] as const

const DEFAULT_THEME = "system" satisfies (typeof THEMES)[number]

export const THEME = {
  DEFAULT_THEME,
  THEMES,
} as const
