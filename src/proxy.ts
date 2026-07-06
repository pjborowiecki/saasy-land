import { type NextRequest, NextResponse } from "next/server"

import createMiddleware from "next-intl/middleware"

import { CONSTANTS } from "~/src/constants"

import { auth } from "~/src/integrations/better-auth/auth._server"
import { getPostAuthRedirect, hasAdminAccess } from "~/src/integrations/better-auth/auth.access"
import { localizedPathname, redirectPathname, resolveLocaleFromRequest } from "~/src/integrations/next-intl/i18n.locale"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

const intlMiddleware = createMiddleware(routing)

const LOCALE_PREFIX = String.raw`(?:\/[a-zA-Z]{2}(?:-[a-zA-Z]{2})?)?`
const AUTH_CALLBACK = new RegExp(String.raw`^${LOCALE_PREFIX}\/auth\/callback\/?$`, "u")
const APP_ROUTE = new RegExp(String.raw`^${LOCALE_PREFIX}\/app(?:\/|$)`, "u")
const ADMIN_ROUTE = new RegExp(String.raw`^${LOCALE_PREFIX}\/admin(?:\/|$)`, "u")
const BARE_APP_PATH = /^\/(?:dashboard|app)(?:\/|$)/u

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const cookieHeader = req.cookies.get(CONSTANTS.I18N.COOKIE_NAME)?.value

  if (AUTH_CALLBACK.test(pathname)) {
    const session = await auth.api.getSession({ headers: req.headers })
    const destination = session?.user ? getPostAuthRedirect(session.user.role) : CONSTANTS.ROUTES.SIGN_IN

    return NextResponse.redirect(new URL(redirectPathname(pathname, destination, cookieHeader), req.url))
  }

  if (APP_ROUTE.test(pathname) || ADMIN_ROUTE.test(pathname)) {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user) {
      return NextResponse.redirect(new URL(redirectPathname(pathname, CONSTANTS.ROUTES.SIGN_IN, cookieHeader), req.url))
    }

    if (ADMIN_ROUTE.test(pathname) && !hasAdminAccess(session.user.role)) {
      const destination = getPostAuthRedirect(session.user.role)

      return NextResponse.redirect(new URL(redirectPathname(pathname, destination, cookieHeader), req.url))
    }
  }

  if (BARE_APP_PATH.test(pathname)) {
    const locale = resolveLocaleFromRequest(pathname, cookieHeader)
    req.nextUrl.pathname = localizedPathname(locale, pathname)

    return NextResponse.rewrite(req.nextUrl)
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: [`/((?!api|_next|_vercel|.*\\..*).*)`],
}
