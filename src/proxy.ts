import { type NextRequest, NextResponse } from "next/server"

import createMiddleware from "next-intl/middleware"

import { CONSTANTS } from "~/src/constants"

import { auth } from "~/src/integrations/better-auth/auth._server"
import { getPostAuthRedirect, hasAdminAccess } from "~/src/integrations/better-auth/auth.access"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

const intlMiddleware = createMiddleware(routing)

const ignoredPathsRegex = /^\/(?:dashboard|app)(?:\/|$)/
const authCallbackRegex = /^\/(?:([a-zA-Z]{2}(?:-[a-zA-Z]{2})?)\/)?auth\/callback\/?$/

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const authCallbackMatch = authCallbackRegex.exec(pathname)
  if (authCallbackMatch) {
    const localePrefix = authCallbackMatch[1]
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    const destination = session ? getPostAuthRedirect(session.user.role) : CONSTANTS.ROUTES.SIGN_IN
    const redirectPath = localePrefix ? `/${localePrefix}${destination}` : destination

    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  const isAppRoute = /^\/(?:[a-zA-Z]{2}(?:-[a-zA-Z]{2})?\/)?app(?:\/|$)/.test(pathname)
  const isAdminRoute = /^\/(?:[a-zA-Z]{2}(?:-[a-zA-Z]{2})?\/)?admin(?:\/|$)/.test(pathname)

  if (isAppRoute || isAdminRoute) {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session) {
      return NextResponse.redirect(new URL(CONSTANTS.ROUTES.SIGN_IN, req.url))
    }

    if (isAdminRoute && !hasAdminAccess(session.user.role)) {
      return NextResponse.redirect(new URL(getPostAuthRedirect(session.user.role), req.url))
    }
  }

  if (ignoredPathsRegex.test(pathname)) {
    const localeCookie = req.cookies.get(CONSTANTS.I18N.COOKIE_NAME)?.value
    const locale = routing.locales.find((l) => l === localeCookie) ?? routing.defaultLocale

    req.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.rewrite(req.nextUrl)
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: [`/((?!api|_next|_vercel|.*\\..*).*)`],
}
