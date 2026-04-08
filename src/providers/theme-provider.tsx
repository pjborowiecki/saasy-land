import type { ComponentProps, JSX } from "react"

import { ThemeProvider as WrkszThemeProvider } from "@wrksz/themes/next"

import { CONSTANTS } from "~/src/constants"

const THEME_STORAGE_KEY = `${CONSTANTS.APP_NAME}-theme`

export function ThemeProvider({ children, ...props }: Readonly<ComponentProps<typeof WrkszThemeProvider>>): JSX.Element {
  return (
    <WrkszThemeProvider storage="localStorage" storageKey={THEME_STORAGE_KEY} defaultTheme="system" disableTransitionOnChange {...props}>
      {children}
    </WrkszThemeProvider>
  )
}
