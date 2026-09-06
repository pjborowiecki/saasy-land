import type { ReactElement, ReactNode } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterContextProvider, createMemoryHistory, createRootRoute, createRouter } from "@tanstack/react-router"
import { type RenderOptions, render } from "@testing-library/react"

export const createTestRouter = (path = "/") =>
  createRouter({ history: createMemoryHistory({ initialEntries: [path] }), routeTree: createRootRoute() })

export const TestProviders = ({
  children,
  router,
  queryClient,
}: {
  children: ReactNode
  router: ReturnType<typeof createTestRouter>
  queryClient: QueryClient
}) => (
  <QueryClientProvider client={queryClient}>
    <RouterContextProvider router={router}>{children}</RouterContextProvider>
  </QueryClientProvider>
)

export const renderWithRouter = (
  ui: ReactElement,
  {
    router = createTestRouter(),
    queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false }, queries: { retry: false } } }),
    ...options
  }: RenderOptions & {
    router?: ReturnType<typeof createTestRouter>
    queryClient?: QueryClient
  } = {},
) => ({
  ...render(
    <TestProviders router={router} queryClient={queryClient}>
      {ui}
    </TestProviders>,
    options,
  ),
  queryClient,
  router,
})
