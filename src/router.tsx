import type { JSX, ReactNode } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"

import { deLocalizeUrl, localizeUrl } from "~/src/integrations/use-intl/i18n.utils"

import { DefaultError } from "~/src/presentation/components/custom/default-error"
import { DefaultNotFound } from "~/src/presentation/components/custom/default-not-found"

import { routeTree } from "~/src/routeTree.gen"

const ONE_MIN_IN_MS = 60_000
const FIVE_MINS_IN_MS = 300_000

const PENDING_SHOW_DELAY_MS = 200
const PENDING_MIN_DISPLAY_MS = 300

export interface RouterContext {
  queryClient: QueryClient
}

const getContext = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: FIVE_MINS_IN_MS,
        staleTime: ONE_MIN_IN_MS,
      },
    },
  })

  return { queryClient }
}

export const getRouter = () => {
  const requestContext = getContext()

  const router = createRouter({
    Wrap: ({ children }: Readonly<{ children: ReactNode }>): JSX.Element => (
      <QueryClientProvider client={requestContext.queryClient}>{children}</QueryClientProvider>
    ),
    context: { ...requestContext },
    defaultErrorComponent: DefaultError,
    defaultNotFoundComponent: DefaultNotFound,
    defaultPendingMinMs: PENDING_MIN_DISPLAY_MS,
    defaultPendingMs: PENDING_SHOW_DELAY_MS,
    defaultPreload: "intent",
    defaultPreloadDelay: 100,
    defaultPreloadIntentProximity: 0,
    defaultPreloadStaleTime: 30_000,
    defaultStaleTime: ONE_MIN_IN_MS,
    defaultStructuralSharing: true,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
    routeTree,
    scrollRestoration: true,
    scrollRestorationBehavior: "instant",
  })

  setupRouterSsrQueryIntegration({ queryClient: requestContext.queryClient, router })

  return router
}
