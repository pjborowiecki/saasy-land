"use client"

import { type JSX, useEffect, useState } from "react"

import { useTheme } from "@wrksz/themes/client"
import { useTranslations } from "next-intl"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"
import { Skeleton } from "~/src/components/shadcn/skeleton"

const THEMES = ["light", "dark", "system"] as const

export function ThemeSwitch(): JSX.Element {
  const t = useTranslations("components.custom.themeSwitch")

  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  useEffect(function markThemeSwitchMounted() {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Skeleton className="h-8 w-full" />
  }

  return (
    <Select value={theme} onValueChange={(v) => v && setTheme(v)}>
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
