"use client"

import { type JSX, useCallback } from "react"

import type { Key } from "@react-types/shared"
import { hasLocale } from "next-intl"

import { localeUiConfig } from "~/src/integrations/fumadocs/fumadocs.i18n"
import { I18N } from "~/src/integrations/next-intl/i18n.config"
import { usePathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/src/presentation/components/shadcn/select"

type AppLocale = (typeof I18N.LOCALES)[number]

export function parseLocaleSelection(next: Key | null): AppLocale | undefined {
  if (typeof next === "string" && hasLocale(I18N.LOCALES, next)) {
    return next
  }

  return undefined
}

export function applyLocaleNavigation(
  next: Key | null,
  pathname: string,
  replace: (href: string, options?: { locale: AppLocale }) => void,
): void {
  const nextLocale = parseLocaleSelection(next)
  if (nextLocale !== undefined) {
    replace(pathname, { locale: nextLocale })
  }
}

export function formatLocaleSwitchDisplayText(selectedText: string | null | undefined, locale: AppLocale): string {
  // react-aria can yield "" after remount/locale navigation — treat empty like missing.
  if (selectedText === undefined || selectedText === null || selectedText.length === 0) {
    return localeUiConfig[locale].displayName
  }

  return selectedText
}

interface LocaleSwitchProps {
  locale: AppLocale
}

export function LocaleSwitch({ locale }: Readonly<LocaleSwitchProps>): JSX.Element {
  const pathname = usePathname()
  const router = useRouter()

  const handleLocaleChange = useCallback(
    (next: Key | null) => {
      applyLocaleNavigation(next, pathname, router.replace)
    },
    [pathname, router],
  )

  return (
    <Select className="w-full" fieldLabel="Language" fieldLabelClassName="sr-only" value={locale} onChange={handleLocaleChange}>
      <SelectTrigger className="h-9 w-full data-[size=default]:h-9">
        <SelectValue>{({ selectedText }) => formatLocaleSwitchDisplayText(selectedText, locale)}</SelectValue>
      </SelectTrigger>
      <SelectContent offset={4} placement="top">
        <SelectGroup>
          {I18N.LOCALES.map((loc) => (
            <SelectItem key={loc} id={loc}>
              {localeUiConfig[loc].displayName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
