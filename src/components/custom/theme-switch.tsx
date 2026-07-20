"use client"

import { type JSX, useCallback, useEffect, useState } from "react"

import type { Key } from "@react-types/shared"
import { useTheme } from "@wrksz/themes/client"
import { useTranslations } from "next-intl"

import { CONSTANTS } from "~/src/constants"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"
import { Skeleton } from "~/src/components/shadcn/skeleton"

type ThemeValue = (typeof CONSTANTS.THEME.THEMES)[number]

function isThemeValue(value: Key | null): value is ThemeValue {
  return typeof value === "string" && (CONSTANTS.THEME.THEMES as readonly string[]).includes(value)
}

export function ThemeSwitchClient({
  darkLabel,
  label,
  lightLabel,
  placeholder,
  systemLabel,
}: {
  darkLabel: string
  label: string
  lightLabel: string
  placeholder: string
  systemLabel: string
}): JSX.Element {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = useCallback(
    (value: Key | null) => {
      if (isThemeValue(value)) {
        setTheme(value)
      }
    },
    [setTheme],
  )

  const [mounted, setMounted] = useState(false)
  useEffect(function markThemeSwitchMounted() {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Skeleton className="h-8 w-full" />
  }

  const themeLabels = {
    dark: darkLabel,
    light: lightLabel,
    system: systemLabel,
  } satisfies Record<ThemeValue, string>

  return (
    <Select placeholder={placeholder} onChange={handleThemeChange} {...(theme === undefined ? {} : { value: theme })}>
      <SelectTrigger className="w-full capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {CONSTANTS.THEME.THEMES.map((themeValue) => (
            <SelectItem key={themeValue} id={themeValue}>
              {themeLabels[themeValue]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function ThemeSwitch(): JSX.Element {
  const t = useTranslations("components.custom.theme-switch")

  return (
    <ThemeSwitchClient
      darkLabel={t("dark")}
      label={t("label")}
      lightLabel={t("light")}
      placeholder={t("placeholder")}
      systemLabel={t("system")}
    />
  )
}
