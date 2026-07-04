import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

import { routing } from "~/src/integrations/next-intl/i18n.routing"

function getLocalePathPrefixes(): Partial<Record<Locale, string>> {
  const { localePrefix } = routing

  if (typeof localePrefix === "object" && localePrefix !== null && "prefixes" in localePrefix) {
    return localePrefix.prefixes ?? {}
  }

  return {}
}

function isLocale(value: string): value is Locale {
  return CONSTANTS.I18N.LOCALES.includes(value as Locale)
}

export function localeFromPathname(pathname: string): Locale | undefined {
  const prefixes = getLocalePathPrefixes()

  for (const locale of routing.locales) {
    const prefix = prefixes[locale]

    if (!prefix) {
      continue
    }

    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return locale
    }
  }

  if (pathname.startsWith("/auth/") || pathname === "/auth") {
    return routing.defaultLocale
  }

  return undefined
}

export function localeFromCookie(cookieHeader: string | null): Locale | undefined {
  if (!cookieHeader) {
    return undefined
  }

  const match = cookieHeader.match(new RegExp(`${CONSTANTS.I18N.COOKIE_NAME}=([^;]+)`))
  const value = match?.[1]

  if (value && isLocale(value)) {
    return value
  }

  return undefined
}

function localeFromActionUrl(actionUrl: string): Locale | undefined {
  try {
    const url = new URL(actionUrl)
    const callbackURL = url.searchParams.get("callbackURL")

    if (callbackURL) {
      const callback = new URL(decodeURIComponent(callbackURL))
      const fromCallback = localeFromPathname(callback.pathname)

      if (fromCallback) {
        return fromCallback
      }
    }

    return localeFromPathname(url.pathname)
  } catch {
    return undefined
  }
}

export function resolveLocaleFromAuthRequest(request: Request | undefined, actionUrl: string): Locale {
  const fromUrl = localeFromActionUrl(actionUrl)

  if (fromUrl) {
    return fromUrl
  }

  if (request) {
    const fromCookie = localeFromCookie(request.headers.get("cookie"))

    if (fromCookie) {
      return fromCookie
    }
  }

  return routing.defaultLocale
}
