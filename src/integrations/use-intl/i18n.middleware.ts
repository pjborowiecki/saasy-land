import "@tanstack/react-start/server-only"

import { I18N } from "~/src/integrations/use-intl/i18n.config"
import { canonicalizePathname, extractLocaleFromPath, shouldIgnorePath } from "~/src/integrations/use-intl/i18n.paths"
import { parseLocaleCookie } from "~/src/integrations/use-intl/i18n.utils"

const HTTP_STATUS = { PERMANENT_REDIRECT: 308 } as const

export interface LocaleMiddlewareResponse {
  readonly redirect?: Response
  readonly setCookie?: { readonly name: string; readonly value: string }
}

export const handleLocaleMiddleware = (request: Request): LocaleMiddlewareResponse => {
  const url = new URL(request.url)
  const { pathname } = url

  if (shouldIgnorePath(pathname)) {
    return {}
  }

  const canonical = canonicalizePathname(pathname)

  if (canonical !== pathname) {
    url.pathname = canonical

    return { redirect: Response.redirect(url.href, HTTP_STATUS.PERMANENT_REDIRECT) }
  }

  const urlLocale = extractLocaleFromPath(pathname) ?? I18N.DEFAULT_LOCALE
  const cookieLocale = parseLocaleCookie(request.headers.get("cookie")) ?? I18N.DEFAULT_LOCALE

  if (urlLocale === cookieLocale) {
    return {}
  }

  return { setCookie: { name: I18N.COOKIE_NAME, value: urlLocale } }
}
