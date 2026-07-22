import { createElement, type ReactElement, type ReactNode } from "react"

export type DefaultTheme = "light" | "dark" | "system"
type Theme = DefaultTheme

export interface ThemeProviderProps<Themes extends string = DefaultTheme> {
  children: ReactNode
  defaultTheme?: Themes
  disableTransitionOnChange?: boolean
  storage?: string
  storageKey?: string
}

export function ThemeProvider<Themes extends string = DefaultTheme>(
  props: Readonly<ThemeProviderProps<Themes>>,
): ReactElement {
  const { children, ...rest } = props

  return createElement(
    "div",
    { "data-props": JSON.stringify(rest), "data-testid": "theme-provider" },
    children,
  )
}

export const setThemeMock = vi.fn<(theme: Theme) => void>()
export const themeState: { value: Theme | undefined } = { value: "system" }

export function useTheme(): { setTheme: (theme: Theme) => void; theme: Theme | undefined } {
  return {
    setTheme: setThemeMock,
    theme: themeState.value,
  }
}
