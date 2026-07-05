"use client"

import { type JSX, useCallback } from "react"

import { hasLocale } from "next-intl"

import { CONSTANTS } from "~/src/constants"

import { localeUiConfig } from "~/src/integrations/fumadocs/fumadocs.i18n"
import { usePathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "~/src/components/shadcn/select"

type AppLocale = (typeof CONSTANTS.I18N.LOCALES)[number]

interface LocaleSwitchProps {
  locale: AppLocale
}

export function LocaleSwitch({ locale }: Readonly<LocaleSwitchProps>): JSX.Element {
  const pathname = usePathname()
  const router = useRouter()

  const handleLocaleChange = useCallback(
    (next: AppLocale | null) => {
      if (next !== null && hasLocale(CONSTANTS.I18N.LOCALES, next)) {
        router.replace(pathname, { locale: next })
      }
    },
    [pathname, router],
  )

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-full">{localeUiConfig[locale].displayName}</SelectTrigger>
      <SelectContent alignItemWithTrigger={false} side="top" sideOffset={4}>
        <SelectGroup>
          {CONSTANTS.I18N.LOCALES.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {localeUiConfig[loc].displayName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
