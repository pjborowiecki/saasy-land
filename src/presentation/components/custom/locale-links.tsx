import type { JSX } from "react"

import { localeUiConfig } from "~/src/integrations/fumadocs/fumadocs.i18n"
import { I18N, type Locale } from "~/src/integrations/next-intl/i18n.config"
import { getPathname } from "~/src/integrations/next-intl/i18n.navigation"

import { cn } from "~/src/utils"

const LOCALE_LINKS = I18N.LOCALES.map((code) => ({
  code,
  href: getPathname({ href: "/", locale: code }),
  name: localeUiConfig[code].displayName,
}))

interface LocaleLinksProps {
  readonly current: Locale
  readonly label: string
}

export function LocaleLinks({ current, label }: LocaleLinksProps): JSX.Element {
  return (
    <nav aria-label={label} className="flex items-center gap-1">
      {LOCALE_LINKS.map((option) => (
        <a
          aria-current={option.code === current ? "true" : undefined}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-body-sm transition-colors duration-200 ease-exp focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            option.code === current ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
          href={option.href}
          hrefLang={option.code}
          key={option.code}
        >
          {option.code === current && <span aria-hidden className="size-1 rounded-full bg-ring" />}
          {option.name}
        </a>
      ))}
    </nav>
  )
}
