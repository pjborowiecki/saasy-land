import { I18N, type SupportedLocale } from "./i18n.config.ts"

const IGNORED_PATHS_REGEX = /^\/(?:api|rpc|_serverFn)(?:\/|$)/u
const LOCALE_SEGMENT_REGEX = /^\/(?<locale>[a-zA-Z-]+)(?:\/|$)/u

const SLASH_LENGTH = 1

const LANGUAGE_SEPARATOR = "-"

const SUPPORTED_LOCALE_SET = new Set<string>(I18N.SUPPORTED_LOCALES)

const LANGUAGE_ALIASES = new Map<string, SupportedLocale>(
  I18N.SUPPORTED_LOCALES.map((locale): [string, SupportedLocale] => {
    const language = locale.slice(0, locale.indexOf(LANGUAGE_SEPARATOR))

    return [language, locale]
  }),
)

export const isSupportedLocale = (locale: string): locale is SupportedLocale => SUPPORTED_LOCALE_SET.has(locale)

export const shouldIgnorePath = (pathname: string): boolean => IGNORED_PATHS_REGEX.test(pathname)

const extractLocalePrefix = (pathname: string): SupportedLocale | undefined => {
  const segment = LOCALE_SEGMENT_REGEX.exec(pathname)?.groups?.["locale"]

  if (segment !== undefined && isSupportedLocale(segment)) {
    return segment
  }

  return undefined
}

export const extractLocaleFromPath = (pathname: string): SupportedLocale | undefined => {
  const prefix = extractLocalePrefix(pathname)

  if (prefix !== undefined && prefix !== I18N.DEFAULT_LOCALE) {
    return prefix
  }

  return undefined
}

export const deLocalizePathname = (pathname: string): string => {
  const prefix = extractLocalePrefix(pathname)

  if (prefix === undefined) {
    return pathname
  }

  return pathname.slice(prefix.length + SLASH_LENGTH) || "/"
}

export const localizePathname = ({ locale, pathname }: { locale: SupportedLocale; pathname: string }): string => {
  if (!pathname.startsWith("/") || pathname.startsWith("//") || shouldIgnorePath(pathname)) {
    return pathname
  }

  const basePath = deLocalizePathname(pathname)

  if (locale === I18N.DEFAULT_LOCALE) {
    return basePath
  }

  if (basePath === "/") {
    return `/${locale}`
  }

  return `/${locale}${basePath}`
}

export const canonicalizePathname = (pathname: string): string => {
  const segment = LOCALE_SEGMENT_REGEX.exec(pathname)?.groups?.["locale"]
  const locale = segment === undefined ? undefined : (extractLocalePrefix(pathname) ?? LANGUAGE_ALIASES.get(segment))

  if (segment === undefined || locale === undefined) {
    return pathname
  }

  const rest = pathname.slice(segment.length + SLASH_LENGTH) || "/"

  return shouldIgnorePath(rest) ? rest : localizePathname({ locale, pathname: rest })
}

export interface LocaleLink {
  readonly href: string
  readonly hrefLang?: string
  readonly rel: "alternate" | "canonical"
}

export const localeLinks = ({ origin, pathname }: { origin: string; pathname: string }): LocaleLink[] => {
  const basePath = deLocalizePathname(pathname)

  return [
    { href: `${origin}${pathname}`, rel: "canonical" },
    ...I18N.SUPPORTED_LOCALES.map((locale) => ({
      href: `${origin}${localizePathname({ locale, pathname: basePath })}`,
      hrefLang: locale,
      rel: "alternate" as const,
    })),
    { href: `${origin}${basePath}`, hrefLang: "x-default", rel: "alternate" },
  ]
}
