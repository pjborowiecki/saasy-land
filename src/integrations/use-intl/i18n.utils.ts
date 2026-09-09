import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

import { I18N, type SupportedLocale } from "~/src/integrations/use-intl/i18n.config"
import { localeFromCookie } from "~/src/integrations/use-intl/i18n.locale"
import { deLocalizePathname, extractLocaleFromPath, localizePathname, shouldIgnorePath } from "~/src/integrations/use-intl/i18n.paths"

const withPathname = ({ pathname, url }: { pathname: string; url: URL }): URL => {
  const rewritten = new URL(url)
  rewritten.pathname = pathname

  return rewritten
}

export const getCurrentLocale = createIsomorphicFn()
  .server((): SupportedLocale => {
    const request = getRequest()
    const { pathname } = new URL(request.url)

    if (shouldIgnorePath(pathname)) {
      return localeFromCookie(request.headers.get("cookie")) ?? I18N.DEFAULT_LOCALE
    }

    return extractLocaleFromPath(pathname) ?? I18N.DEFAULT_LOCALE
  })
  .client((): SupportedLocale => extractLocaleFromPath(globalThis.location.pathname) ?? I18N.DEFAULT_LOCALE)

export const localizeUrl = (url: URL): URL =>
  withPathname({ pathname: localizePathname({ locale: getCurrentLocale(), pathname: url.pathname }), url })

export const deLocalizeUrl = (url: URL): URL => withPathname({ pathname: deLocalizePathname(url.pathname), url })
