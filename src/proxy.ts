import { type NextRequest, NextResponse } from "next/server"

import createMiddleware from "next-intl/middleware"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { redirectPathname } from "~/src/integrations/next-intl/i18n.locale"
import { localePathPrefixes, routing } from "~/src/integrations/next-intl/i18n.routing"

import { ROUTES } from "~/src/routes"

const intlMiddleware = createMiddleware(routing)

const LOCALE_PREFIX = `(?:${Object.values(localePathPrefixes).join("|")})?`
const AUTH_CALLBACK = new RegExp(String.raw`^${LOCALE_PREFIX}\/auth\/callback\/?$`, "u")
const APP_ROUTE = new RegExp(String.raw`^${LOCALE_PREFIX}\/app(?:\/|$)`, "u")
const ADMIN_ROUTE = new RegExp(String.raw`^${LOCALE_PREFIX}\/admin(?:\/|$)`, "u")

function redirectTo(req: NextRequest, path: string) {
  const { pathname } = req.nextUrl
  const target = redirectPathname(pathname, path, req.headers.get("cookie"))

  return NextResponse.redirect(new URL(target, req.url))
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAuthCallback = AUTH_CALLBACK.test(pathname)
  const isProtectedApp = APP_ROUTE.test(pathname) || ADMIN_ROUTE.test(pathname)

  if (isAuthCallback || isProtectedApp) {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user) {
      return redirectTo(req, ROUTES.SIGN_IN)
    }

    const isAdmin = hasPermission(session.user.role, { admin: ["access"] })

    if (isAuthCallback) {
      return redirectTo(req, isAdmin ? ROUTES.ADMIN : ROUTES.APP)
    }

    if (ADMIN_ROUTE.test(pathname) && !isAdmin) {
      return redirectTo(req, ROUTES.APP)
    }
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: [`/((?!api|_next|_vercel|.*\\..*).*)`],
}
