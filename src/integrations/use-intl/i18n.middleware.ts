import "@tanstack/react-start/server-only"

import { I18N } from "~/src/integrations/use-intl/i18n.config"
import { localeFromCookie } from "~/src/integrations/use-intl/i18n.locale"
import { canonicalizePathname, extractLocaleFromPath, shouldIgnorePath } from "~/src/integrations/use-intl/i18n.paths"

const HTTP_STATUS = { PERMANENT_REDIRECT: 308 } as const
const HTML_ACCEPT_PATTERN = /(?:^|,)\s*(?:text\/html|application\/xhtml\+xml)(?:\s*;|,|$)/iu

export interface LocaleMiddlewareResponse {
  readonly redirect?: Response
  readonly setCookie?: { readonly name: string; readonly value: string }
}

export const handleLocaleMiddleware = (request: Request): LocaleMiddlewareResponse => {
  const url = new URL(request.url)
  const { pathname } = url
  const destination = request.headers.get("sec-fetch-dest")
  const accept = request.headers.get("accept")
  const isDocument =
    destination === null
      ? accept === null || HTML_ACCEPT_PATTERN.test(accept)
      : destination === "document" || destination === "iframe" || destination === "frame"

  if ((request.method !== "GET" && request.method !== "HEAD") || !isDocument || shouldIgnorePath(pathname)) {
    return {}
  }

  const canonical = canonicalizePathname(pathname)

  if (canonical !== pathname) {
    url.pathname = canonical

    return { redirect: Response.redirect(url.href, HTTP_STATUS.PERMANENT_REDIRECT) }
  }

  const urlLocale = extractLocaleFromPath(pathname) ?? I18N.DEFAULT_LOCALE
  const cookieLocale = localeFromCookie(request.headers.get("cookie")) ?? I18N.DEFAULT_LOCALE

  if (urlLocale === cookieLocale) {
    return {}
  }

  return { setCookie: { name: I18N.COOKIE_NAME, value: urlLocale } }
}
