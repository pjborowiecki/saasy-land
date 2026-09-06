import { I18N, type SupportedLocale } from "~/src/integrations/use-intl/i18n.config"
import {
  canonicalizePathname,
  extractLocaleFromPath,
  isSupportedLocale,
  localizePathname,
  shouldIgnorePath,
} from "~/src/integrations/use-intl/i18n.paths"

import { readCookie } from "~/src/lib/cookie"

import { APP_URL } from "~/src/presentation/branding"

export const isLocale = (value?: string): value is SupportedLocale => value !== undefined && isSupportedLocale(value)

export const localeFromPathname = (pathname: string): SupportedLocale | undefined => {
  const canonical = canonicalizePathname(pathname)
  return shouldIgnorePath(canonical) ? undefined : (extractLocaleFromPath(canonical) ?? I18N.DEFAULT_LOCALE)
}

export const localeFromCookie = (cookieHeader?: string | null): SupportedLocale | undefined => {
  const value = readCookie({ header: cookieHeader, name: I18N.COOKIE_NAME })
  return isLocale(value) ? value : undefined
}

export const localizedPathname = (locale: SupportedLocale, pathname: string): string => localizePathname({ locale, pathname })

export const redirectPathname = (sourcePathname: string, targetPath: string, cookieHeader?: string | null): string =>
  localizePathname({ locale: resolveLocaleFromRequest(sourcePathname, cookieHeader), pathname: targetPath })

export const resolveLocaleFromRequest = (pathname: string, cookieHeader?: string | null): SupportedLocale =>
  localeFromPathname(pathname) ?? localeFromCookie(cookieHeader) ?? I18N.DEFAULT_LOCALE

export const resolveLocaleFromAuthRequest = (request: Request | undefined, actionUrl: string): SupportedLocale => {
  if (URL.canParse(actionUrl, APP_URL)) {
    const url = new URL(actionUrl, APP_URL)
    const callback = url.searchParams.get("callbackURL")
    if (callback !== null && URL.canParse(callback, APP_URL)) {
      const locale = localeFromPathname(new URL(callback, APP_URL).pathname)
      if (locale) {
        return locale
      }
    }
    const locale = localeFromPathname(url.pathname)
    if (locale) {
      return locale
    }
  }
  return localeFromCookie(request?.headers.get("cookie")) ?? I18N.DEFAULT_LOCALE
}
