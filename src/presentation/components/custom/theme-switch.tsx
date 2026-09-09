import type { JSX } from "react"

import type { Key } from "@react-types/shared"
import { useHydrated } from "@tanstack/react-router"
import { useTheme } from "@wrksz/themes/client"
import { useTranslations } from "use-intl/react"

import { THEME } from "~/src/presentation/theme"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/src/presentation/components/shadcn/select"
import { Skeleton } from "~/src/presentation/components/shadcn/skeleton"

type ThemeValue = (typeof THEME.THEMES)[number]

export const isThemeValue = (value: Key | null): value is ThemeValue =>
  typeof value === "string" && (THEME.THEMES as readonly string[]).includes(value)

export const ThemeSwitch = (): JSX.Element => {
  const t = useTranslations("components.custom.theme-switch")
  const { theme, setTheme } = useTheme()
  const hydrated = useHydrated()

  if (!hydrated) {
    return <Skeleton className="h-8 w-full" />
  }

  const themeLabels = {
    dark: t("dark"),
    light: t("light"),
    system: t("system"),
  } satisfies Record<ThemeValue, string>

  const selectedLabel = theme === undefined ? undefined : themeLabels[theme]

  return (
    <Select
      className="w-full"
      fieldLabel={t("label")}
      fieldLabelClassName="sr-only"
      placeholder={t("placeholder")}
      onChange={(value) => {
        if (isThemeValue(value)) {
          setTheme(value)
        }
      }}
      {...(theme === undefined ? {} : { value: theme })}
    >
      <SelectTrigger className="h-9 w-full capitalize data-[size=default]:h-9">
        <SelectValue>
          {({ selectedText }) => {
            if (selectedText.length > 0) {
              return selectedText
            }

            return selectedLabel ?? t("placeholder")
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("label")}</SelectLabel>
          {THEME.THEMES.map((themeValue) => (
            <SelectItem key={themeValue} id={themeValue}>
              {themeLabels[themeValue]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
