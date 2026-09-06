import { type JSX, useCallback } from "react"

import type { Key } from "@react-types/shared"

import { localeUiConfig } from "~/src/integrations/fumadocs/fumadocs.i18n"
import { I18N } from "~/src/integrations/use-intl/i18n.config"
import { isSupportedLocale, localizePathname } from "~/src/integrations/use-intl/i18n.paths"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/src/presentation/components/shadcn/select"

type AppLocale = (typeof I18N.SUPPORTED_LOCALES)[number]

export const parseLocaleSelection = (next: Key | null): AppLocale | undefined => {
  if (typeof next === "string" && isSupportedLocale(next)) {
    return next
  }

  return undefined
}

export const applyLocaleNavigation = (next: Key | null, pathname: string, replace: (href: string) => void): void => {
  const nextLocale = parseLocaleSelection(next)
  if (nextLocale !== undefined) {
    const url = new URL(pathname, "https://locale.invalid")
    replace(`${localizePathname({ locale: nextLocale, pathname: url.pathname })}${url.search}${url.hash}`)
  }
}

export const formatLocaleSwitchDisplayText = (selectedText: string | null | undefined, locale: AppLocale): string => {
  // React-aria can yield "" after remount/locale navigation — treat empty like missing.
  if (selectedText === undefined || selectedText === null || selectedText.length === 0) {
    return localeUiConfig[locale].displayName
  }

  return selectedText
}

interface LocaleSwitchProps {
  appearance?: "compact" | "field"
  locale: AppLocale
}

const COMPACT_TRIGGER_CLASS =
  "h-11 w-auto gap-1.5 rounded-sm border-transparent p-0 text-body-sm text-muted-foreground hover:text-foreground data-[size=default]:h-11 dark:bg-transparent dark:hover:bg-transparent"

export const LocaleSwitch = ({ appearance = "field", locale }: Readonly<LocaleSwitchProps>): JSX.Element => {
  const handleLocaleChange = useCallback((next: Key | null) => {
    applyLocaleNavigation(next, `${globalThis.location.pathname}${globalThis.location.search}${globalThis.location.hash}`, (href) => {
      globalThis.location.assign(href)
    })
  }, [])

  return (
    <Select
      className={appearance === "compact" ? "w-auto" : "w-full"}
      data-testid="locale-switch"
      fieldLabel={localeUiConfig[locale].chooseLanguage}
      fieldLabelClassName="sr-only"
      value={locale}
      onChange={handleLocaleChange}
    >
      <SelectTrigger className={appearance === "compact" ? COMPACT_TRIGGER_CLASS : "h-9 w-full data-[size=default]:h-9"}>
        <SelectValue>{({ selectedText }) => formatLocaleSwitchDisplayText(selectedText, locale)}</SelectValue>
      </SelectTrigger>
      <SelectContent className={appearance === "compact" ? "dark min-w-48" : "min-w-48"} offset={4} placement="top end">
        <SelectGroup>
          {I18N.SUPPORTED_LOCALES.map((loc) => (
            <SelectItem key={loc} id={loc} lang={loc}>
              {localeUiConfig[loc].displayName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
