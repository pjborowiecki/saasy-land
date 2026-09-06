import { type JSX, useCallback, useEffect, useState } from "react"

import type { Key } from "@react-types/shared"
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

export const applyThemeSelection = (value: Key | null, setTheme: (theme: ThemeValue) => void): void => {
  if (isThemeValue(value)) {
    setTheme(value)
  }
}

export const ThemeSwitchClient = ({
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
}): JSX.Element => {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = useCallback(
    (value: Key | null) => {
      applyThemeSelection(value, setTheme)
    },
    [setTheme],
  )

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
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

  const selectedLabel = theme === undefined ? undefined : themeLabels[theme]

  return (
    <Select
      className="w-full"
      fieldLabel={label}
      fieldLabelClassName="sr-only"
      placeholder={placeholder}
      onChange={handleThemeChange}
      {...(theme === undefined ? {} : { value: theme })}
    >
      <SelectTrigger className="h-9 w-full capitalize data-[size=default]:h-9">
        <SelectValue>
          {({ selectedText }) => {
            if (selectedText.length > 0) {
              return selectedText
            }

            return selectedLabel ?? placeholder
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
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

export const ThemeSwitch = (): JSX.Element => {
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
