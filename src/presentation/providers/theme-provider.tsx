import type { ComponentProps, JSX } from "react"

import { ThemeProvider as WrkszThemeProvider } from "@wrksz/themes/next"

import { APP_NAME } from "~/src/presentation/branding"
import { THEME } from "~/src/presentation/theme"

const THEME_STORAGE_KEY = `${APP_NAME}-theme`

export function ThemeProvider({ children, ...props }: Readonly<ComponentProps<typeof WrkszThemeProvider>>): JSX.Element {
  return (
    <WrkszThemeProvider
      storage="localStorage"
      storageKey={THEME_STORAGE_KEY}
      defaultTheme={THEME.DEFAULT_THEME}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </WrkszThemeProvider>
  )
}
