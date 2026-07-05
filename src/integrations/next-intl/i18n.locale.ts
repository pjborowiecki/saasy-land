import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

import { localePathPrefixes, routing } from "~/src/integrations/next-intl/i18n.routing"

export function isLocale(value: string | undefined): value is Locale {
  for (const locale of CONSTANTS.I18N.LOCALES) {
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

export function localeFromCookie(cookieHeader: string | null | undefined): Locale | undefined {
  const [, value] = cookieHeader?.match(new RegExp(String.raw`(?:^|;\s*)${CONSTANTS.I18N.COOKIE_NAME}=([^;]+)`, "u")) ?? []

  return isLocale(value) ? value : undefined
}

function localeFromActionUrl(actionUrl: string): Locale | undefined {
  if (!URL.canParse(actionUrl, "http://localhost")) {
    return undefined
  }

  const url = new URL(actionUrl, "http://localhost")
  const callbackURL = url.searchParams.get("callbackURL")

  if (callbackURL !== null && URL.canParse(callbackURL, "http://localhost")) {
    const fromCallback = localeFromPathname(new URL(callbackURL, "http://localhost").pathname)

    if (fromCallback) {
      return fromCallback
    }
  }

  return localeFromPathname(url.pathname)
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
