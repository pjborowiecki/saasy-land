import { type NextRequest, NextResponse } from "next/server"

import createMiddleware from "next-intl/middleware"

import { CONSTANTS } from "~/src/constants"

import { auth } from "~/src/integrations/better-auth/auth._server"
import { getPostAuthRedirect, hasAdminAccess } from "~/src/integrations/better-auth/auth.access"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

const intlMiddleware = createMiddleware(routing)

const ignoredPathsRegex = /^\/(?:dashboard|app)(?:\/|$)/u
const authCallbackRegex = /^\/(?:(?<locale>[a-zA-Z]{2}(?:-[a-zA-Z]{2})?)\/)?auth\/callback\/?$/u
const appRouteRegex = /^\/(?:[a-zA-Z]{2}(?:-[a-zA-Z]{2})?\/)?app(?:\/|$)/u
const adminRouteRegex = /^\/(?:[a-zA-Z]{2}(?:-[a-zA-Z]{2})?\/)?admin(?:\/|$)/u
const EMPTY_LOCALE_PREFIX_LENGTH = 0

async function redirectAuthCallback(req: NextRequest, pathname: string): Promise<NextResponse | undefined> {
  const authCallbackMatch = authCallbackRegex.exec(pathname)
  if (authCallbackMatch === null) {
    return undefined
  }

  const localePrefix = authCallbackMatch.groups?.["locale"]
  const session = await auth.api.getSession({
    headers: req.headers,
  })
  const destination = session === null ? CONSTANTS.ROUTES.SIGN_IN : getPostAuthRedirect(session.user.role)
  const hasLocalePrefix = localePrefix !== undefined && localePrefix.length > EMPTY_LOCALE_PREFIX_LENGTH
  const redirectPath = hasLocalePrefix ? `/${localePrefix}${destination}` : destination

  return NextResponse.redirect(new URL(redirectPath, req.url))
}

async function guardProtectedRoutes(req: NextRequest, pathname: string): Promise<NextResponse | undefined> {
  const isAppRoute = appRouteRegex.test(pathname)
  const isAdminRoute = adminRouteRegex.test(pathname)

  if (!isAppRoute && !isAdminRoute) {
    return undefined
  }

  const session = await auth.api.getSession({
    headers: req.headers,
  })

  if (session === null) {
    return NextResponse.redirect(new URL(CONSTANTS.ROUTES.SIGN_IN, req.url))
  }

  if (isAdminRoute && !hasAdminAccess(session.user.role)) {
    return NextResponse.redirect(new URL(getPostAuthRedirect(session.user.role), req.url))
  }

  return undefined
}

function rewriteIgnoredPath(req: NextRequest, pathname: string): NextResponse | undefined {
  if (!ignoredPathsRegex.test(pathname)) {
    return undefined
  }

  const localeCookie = req.cookies.get(CONSTANTS.I18N.COOKIE_NAME)?.value
  const locale = routing.locales.find((entry) => entry === localeCookie) ?? routing.defaultLocale

  req.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.rewrite(req.nextUrl)
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const authCallbackRedirect = await redirectAuthCallback(req, pathname)
  if (authCallbackRedirect !== undefined) {
    return authCallbackRedirect
  }

  const protectedRouteRedirect = await guardProtectedRoutes(req, pathname)
  if (protectedRouteRedirect !== undefined) {
    return protectedRouteRedirect
  }

  const ignoredPathRewrite = rewriteIgnoredPath(req, pathname)
  if (ignoredPathRewrite !== undefined) {
    return ignoredPathRewrite
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: [`/((?!api|_next|_vercel|.*\\..*).*)`],
}
