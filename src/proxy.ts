import createMiddleware from "next-intl/middleware"

import { routing } from "~/src/integrations/next-intl/i18n.routing"

export default createMiddleware(routing)

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
