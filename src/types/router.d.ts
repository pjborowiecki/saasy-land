import type { getRouter } from "~/src/router"
import type { RequestContext } from "~/src/server"

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
    server: { requestContext: RequestContext }
  }
  interface StaticDataRouteOption {
    namespaces?: readonly string[]
  }
}
