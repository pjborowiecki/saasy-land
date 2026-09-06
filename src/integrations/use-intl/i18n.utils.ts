import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

import { I18N, type SupportedLocale } from "~/src/integrations/use-intl/i18n.config"
import {
  deLocalizePathname,
  extractLocaleFromPath,
  isSupportedLocale,
  localizePathname,
  shouldIgnorePath,
} from "~/src/integrations/use-intl/i18n.paths"

import { readCookie } from "~/src/lib/cookie"

const withPathname = ({ pathname, url }: { pathname: string; url: URL }): URL => {
  const rewritten = new URL(url)
  rewritten.pathname = pathname

  return rewritten
}

export const parseLocaleCookie = (cookieHeader: string | null | undefined): SupportedLocale | undefined => {
  const stored = readCookie({ header: cookieHeader, name: I18N.COOKIE_NAME })

  if (stored !== undefined && isSupportedLocale(stored)) {
    return stored
  }

  return undefined
}

export const getCurrentLocale = createIsomorphicFn()
  .server((): SupportedLocale => {
    const request = getRequest()
    const { pathname } = new URL(request.url)

    if (shouldIgnorePath(pathname)) {
      return parseLocaleCookie(request.headers.get("cookie")) ?? I18N.DEFAULT_LOCALE
    }

    return extractLocaleFromPath(pathname) ?? I18N.DEFAULT_LOCALE
  })
  .client((): SupportedLocale => extractLocaleFromPath(globalThis.location.pathname) ?? I18N.DEFAULT_LOCALE)

export const localizeUrl = (url: URL): URL =>
  withPathname({ pathname: localizePathname({ locale: getCurrentLocale(), pathname: url.pathname }), url })

export const deLocalizeUrl = (url: URL): URL => withPathname({ pathname: deLocalizePathname(url.pathname), url })
