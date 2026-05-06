import { type NextRequest, NextResponse } from "next/server"

import createMiddleware from "next-intl/middleware"

import { CONSTANTS } from "~/src/constants"

import { routing } from "~/src/integrations/next-intl/i18n.routing"

const intlMiddleware = createMiddleware(routing)

const ignoredPathsRegex = /^\/(?:dashboard)(?:\/|$)/

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

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
