import { type NextRequest, NextResponse } from "next/server"

import createMiddleware from "next-intl/middleware"

import { CONSTANTS } from "~/src/constants"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

const intlMiddleware = createMiddleware(routing)

const ignoredPathsRegex = /^\/(?:dashboard|app)(?:\/|$)/

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAppRoute = /^\/(?:[a-zA-Z]{2}(?:-[a-zA-Z]{2})?\/)?app(?:\/|$)/.test(pathname)

  if (isAppRoute) {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session) {
      return NextResponse.redirect(new URL(CONSTANTS.ROUTES.SIGN_IN, req.url))
    }
  }

  if (ignoredPathsRegex.test(pathname)) {
    const localeCookie = req.cookies.get(CONSTANTS.LOCALE_COOKIE_NAME)?.value
    const locale = routing.locales.find((l) => l === localeCookie) ?? routing.defaultLocale

    req.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.rewrite(req.nextUrl)
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
