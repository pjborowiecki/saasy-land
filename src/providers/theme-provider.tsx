"use client"

export { ThemeProvider } from "next-themes"

export const themeProviderConfig = {
  enableSystem: true,
  attribute: "class" as const,
  themes: ["light", "dark"],
  defaultTheme: "system",
}
