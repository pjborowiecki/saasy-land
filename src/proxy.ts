import { type NextRequest, NextResponse } from "next/server"

import createMiddleware from "next-intl/middleware"

import { auth } from "~/src/modules/identity-access/infrastructure/auth/auth._server"
import { hasAdminAccess } from "~/src/modules/identity-access/infrastructure/auth/auth.access"

import { I18N } from "~/src/integrations/next-intl/i18n.config"
import { localizedPathname, redirectPathname, resolveLocaleFromRequest } from "~/src/integrations/next-intl/i18n.locale"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

import { ROUTES } from "~/src/routes"

const intlMiddleware = createMiddleware(routing)

const LOCALE_PREFIX = String.raw`(?:\/[a-zA-Z]{2}(?:-[a-zA-Z]{2})?)?`
const AUTH_CALLBACK = new RegExp(String.raw`^${LOCALE_PREFIX}\/auth\/callback\/?$`, "u")
const APP_ROUTE = new RegExp(String.raw`^${LOCALE_PREFIX}\/app(?:\/|$)`, "u")
const ADMIN_ROUTE = new RegExp(String.raw`^${LOCALE_PREFIX}\/admin(?:\/|$)`, "u")
const BARE_APP_PATH = /^\/(?:dashboard|app)(?:\/|$)/u

function redirectTo(req: NextRequest, path: string) {
  const { pathname } = req.nextUrl
  const cookieHeader = req.cookies.get(I18N.COOKIE_NAME)?.value

  return NextResponse.redirect(new URL(redirectPathname(pathname, path, cookieHeader), req.url))
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const cookieHeader = req.cookies.get(I18N.COOKIE_NAME)?.value

  const isAuthCallback = AUTH_CALLBACK.test(pathname)
  const isProtectedApp = APP_ROUTE.test(pathname) || ADMIN_ROUTE.test(pathname)

  if (isAuthCallback || isProtectedApp) {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user) {
      return redirectTo(req, ROUTES.SIGN_IN)
    }

    const isAdmin = hasAdminAccess(session.user.role)

    if (isAuthCallback) {
      return redirectTo(req, isAdmin ? ROUTES.ADMIN : ROUTES.APP)
    }

    if (ADMIN_ROUTE.test(pathname) && !isAdmin) {
      return redirectTo(req, ROUTES.APP)
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
