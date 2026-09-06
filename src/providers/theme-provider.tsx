import type { ComponentProps, JSX } from "react"

import { ThemeProvider as WrkszThemeProvider } from "@wrksz/themes"

import { THEME } from "~/src/presentation/theme"

import { APP_NAME } from "~/src/presentation/branding"

const THEME_STORAGE_KEY = `${APP_NAME}-theme`

export const ThemeProvider = ({ children, ...props }: Readonly<ComponentProps<typeof WrkszThemeProvider>>): JSX.Element => (
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
