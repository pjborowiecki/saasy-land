"use client"

import type { JSX } from "react"

import { hasLocale } from "next-intl"

import { CONSTANTS } from "~/src/constants"

import { localeUiConfig } from "~/src/integrations/fumadocs/fumadocs.i18n"
import { usePathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "~/src/components/shadcn/select"

type LocaleSwitchProps = {
  locale: (typeof CONSTANTS.I18N.LOCALES)[number]
}

export function LocaleSwitch({ locale }: Readonly<LocaleSwitchProps>): JSX.Element {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Select
      value={locale}
      onValueChange={(next) => {
        if (hasLocale(CONSTANTS.I18N.LOCALES, next)) {
          router.replace(pathname, { locale: next })
        }
      }}
    >
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
