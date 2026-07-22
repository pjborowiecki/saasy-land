import { env } from "~/src/platform/env"

import { I18N, type Locale } from "~/src/integrations/next-intl/i18n.config"
import { localePathPrefixes, routing } from "~/src/integrations/next-intl/i18n.routing"

export function isLocale(value?: string): value is Locale {
  for (const locale of I18N.LOCALES) {
    if (locale === value) {
      return true
    }
  }

  return false
}

export function localeFromPathname(pathname: string): Locale | undefined {
  for (const locale of routing.locales) {
    const prefix = localePathPrefixes[locale]

    if (prefix?.length && (pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      return locale
    }
  }

  return pathname.startsWith("/auth/") || pathname === "/auth" ? routing.defaultLocale : undefined
}

export function localeFromCookie(cookieHeader?: string | null): Locale | undefined {
  const [, value] = cookieHeader?.match(new RegExp(String.raw`(?:^|;\s*)${I18N.COOKIE_NAME}=([^;]+)`, "u")) ?? []

  return isLocale(value) ? value : undefined
}

function localeFromActionUrl(actionUrl: string): Locale | undefined {
  const baseUrl = env.NEXT_PUBLIC_APP_URL

  if (!URL.canParse(actionUrl, baseUrl)) {
    return undefined
  }

  const url = new URL(actionUrl, baseUrl)
  const callbackURL = url.searchParams.get("callbackURL")

  if (callbackURL !== null && URL.canParse(callbackURL, baseUrl)) {
    const fromCallback = localeFromPathname(new URL(callbackURL, baseUrl).pathname)

    if (fromCallback) {
      return fromCallback
    }
  }

  return localeFromPathname(url.pathname)
}

export function localizedPathname(locale: Locale, pathname: string): string {
  if (locale === routing.defaultLocale) {
    return pathname
  }

  const prefix = localePathPrefixes[locale]

  if (prefix === undefined || prefix.length === 0) {
    return pathname
  }

  return `${prefix}${pathname}`
}

/** Build a redirect target that preserves an explicit locale prefix from the incoming URL. */
export function redirectPathname(sourcePathname: string, targetPath: string, cookieHeader?: string | null): string {
  const locale = resolveLocaleFromRequest(sourcePathname, cookieHeader)
  const localized = localizedPathname(locale, targetPath)

  if (locale !== routing.defaultLocale) {
    return localized
  }

  for (const prefix of Object.values(localePathPrefixes)) {
    if (prefix !== undefined && prefix.length > 0 && (sourcePathname === prefix || sourcePathname.startsWith(`${prefix}/`))) {
      return `${prefix}${targetPath}`
    }
  }

  return localized
}

export function resolveLocaleFromRequest(pathname: string, cookieHeader?: string | null): Locale {
  return localeFromPathname(pathname) ?? localeFromCookie(cookieHeader) ?? routing.defaultLocale
}

export function resolveLocaleFromAuthRequest(request: Request | undefined, actionUrl: string): Locale {
  const fromAction = localeFromActionUrl(actionUrl)

  if (fromAction) {
    return fromAction
  }

  const fromCookie = localeFromCookie(request?.headers.get("cookie"))

  if (fromCookie) {
    return fromCookie
  }

  return routing.defaultLocale
}
