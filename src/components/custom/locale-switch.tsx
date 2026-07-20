"use client"

import { type JSX, useCallback } from "react"

import type { Key } from "@react-types/shared"
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
    (next: Key | null) => {
      if (typeof next === "string" && hasLocale(CONSTANTS.I18N.LOCALES, next)) {
        router.replace(pathname, { locale: next })
      }
    },
    [pathname, router],
  )

  return (
    <Select value={locale} onChange={handleLocaleChange}>
      <SelectTrigger className="w-full">{localeUiConfig[locale].displayName}</SelectTrigger>
      <SelectContent offset={4} placement="top">
        <SelectGroup>
          {CONSTANTS.I18N.LOCALES.map((loc) => (
            <SelectItem key={loc} id={loc}>
              {localeUiConfig[loc].displayName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
