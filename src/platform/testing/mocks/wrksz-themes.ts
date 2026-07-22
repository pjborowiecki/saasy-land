import { createElement, type ReactElement, type ReactNode } from "react"

export type DefaultTheme = "light" | "dark" | "system"

export interface ThemeProviderProps<Themes extends string = DefaultTheme> {
  children: ReactNode
  defaultTheme?: Themes
  disableTransitionOnChange?: boolean
  storage?: string
  storageKey?: string
}

export function ThemeProvider<Themes extends string = DefaultTheme>(props: Readonly<ThemeProviderProps<Themes>>): ReactElement {
  const { children, ...rest } = props

  return createElement("div", { "data-props": JSON.stringify(rest), "data-testid": "theme-provider" }, children)
}

export const setThemeMock = vi.fn<(theme: DefaultTheme) => void>()
export const themeState: { value: DefaultTheme | undefined } = { value: "system" }

export function useTheme(): { setTheme: (theme: DefaultTheme) => void; theme: DefaultTheme | undefined } {
  return {
    setTheme: setThemeMock,
    theme: themeState.value,
  }
}
