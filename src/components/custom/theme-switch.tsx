"use client"

import { type JSX, useCallback, useEffect, useState } from "react"

import { useTheme } from "@wrksz/themes/client"
import { useTranslations } from "next-intl"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"
import { Skeleton } from "~/src/components/shadcn/skeleton"

const THEMES = ["light", "dark", "system"] as const
type ThemeValue = (typeof THEMES)[number]

function isThemeValue(value: string | null): value is ThemeValue {
  return value !== null && (THEMES as readonly string[]).includes(value)
}

export function ThemeSwitch(): JSX.Element {
  const t = useTranslations("components.custom.theme-switch")

  const { theme, setTheme } = useTheme()

  const handleThemeChange = useCallback(
    (value: ThemeValue | null) => {
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

  return (
    <Select value={theme ?? undefined} onValueChange={handleThemeChange}>
      <SelectTrigger className="w-full capitalize">
        <SelectValue placeholder={t("placeholder")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("label")}</SelectLabel>
          {THEMES.map((key) => (
            <SelectItem key={key} value={key}>
              {t(key)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
