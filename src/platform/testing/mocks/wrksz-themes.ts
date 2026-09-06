import { type ReactElement, type ReactNode, createElement } from "react"

import { vi } from "vite-plus/test"

export type DefaultTheme = "light" | "dark" | "system"

export interface ThemeProviderProps<Themes extends string = DefaultTheme> {
  children: ReactNode
  defaultTheme?: Themes
  disableTransitionOnChange?: boolean
  storage?: string
  storageKey?: string
}

export const ThemeProvider = <Themes extends string = DefaultTheme>(props: Readonly<ThemeProviderProps<Themes>>): ReactElement => {
  const { children, ...rest } = props

  return createElement("div", { "data-props": JSON.stringify(rest), "data-testid": "theme-provider" }, children)
}

export const setThemeMock = vi.fn<(theme: DefaultTheme) => void>()
export const themeState: { value: DefaultTheme | undefined } = { value: "system" }

export const useTheme = (): { setTheme: (theme: DefaultTheme) => void; theme: DefaultTheme | undefined } => ({
  setTheme: setThemeMock,
  theme: themeState.value,
})
