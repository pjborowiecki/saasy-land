import { renderToString } from "react-dom/server"

import { QueryClientProvider } from "@tanstack/react-query"
import { createMemoryHistory } from "@tanstack/react-router"
import { IntlProvider } from "use-intl"
import { afterEach, describe, expect, it, vi } from "vite-plus/test"

import { starCountQuery } from "~/src/integrations/github/github.queries"
import { loadRouteMessages } from "~/src/integrations/use-intl/i18n.metadata"

import { ProofSection } from "~/src/presentation/components/custom/landing-page/sections/proof-section"

import english from "~/messages/en-US/pages.landing.json"
import { getRouter } from "~/src/router"

const fetchStarsMock = vi.hoisted(() => vi.fn<() => Promise<number>>())

vi.mock(import("~/src/integrations/github/github.queries"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, starCountQuery: { ...actual.starCountQuery, queryFn: fetchStarsMock } }
})

vi.mock(import("~/src/integrations/use-intl/i18n.metadata"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    loadRouteMessages: vi.fn(() =>
      Promise.resolve({ metadata: { description: "Landing page", locale: "en-US" as const, pathname: "/", title: "Home" } }),
    ),
  }
})

vi.mock("collections/server", () => ({
  blog: [],
  docs: { toFumadocsSource: () => ({ files: [] }) },
}))

const createLandingRouter = () => {
  const router = getRouter()
  router.options.context.queryClient.setDefaultOptions({ queries: { retry: false } })
  router.update({
    context: router.options.context,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  })
  return router
}

afterEach(() => {
  fetchStarsMock.mockReset()
  vi.mocked(loadRouteMessages).mockClear()
})

describe("landing page star count during server rendering", () => {
  it("waits for the repository count alongside translations and includes it in the initial HTML", async () => {
    const response = Promise.withResolvers<number>()
    fetchStarsMock.mockReturnValue(response.promise)
    const router = createLandingRouter()
    const { queryClient } = router.options.context
    const loaded = vi.fn()

    const loading = router.load().then(loaded)

    await vi.waitFor(() => {
      expect(fetchStarsMock).toHaveBeenCalledOnce()
      expect(loadRouteMessages).toHaveBeenCalledOnce()
    })
    expect(loaded).not.toHaveBeenCalled()
    response.resolve(54_321)
    await loading

    const html = renderToString(
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="en-US" messages={{ pages: { landing: english } }} timeZone="UTC">
          <ProofSection />
        </IntlProvider>
      </QueryClientProvider>,
    )

    expect(queryClient.getQueryData(starCountQuery.queryKey)).toBe(54_321)
    expect(html).toContain("54,321")
    expect(html).not.toContain('data-slot="skeleton"')
    expect(fetchStarsMock).toHaveBeenCalledOnce()
  })

  it("keeps the landing route available if no verified count can be retrieved", async () => {
    fetchStarsMock.mockRejectedValue(new Error("GitHub unavailable"))
    const router = createLandingRouter()
    const { queryClient } = router.options.context

    await router.load()

    expect(fetchStarsMock).toHaveBeenCalledOnce()
    expect(router.state.matches.at(-1)?.status).toBe("success")
    expect(router.state.matches.at(-1)?.loaderData).toEqual({
      metadata: { description: "Landing page", locale: "en-US", pathname: "/", title: "Home" },
    })
    expect(queryClient.getQueryData(starCountQuery.queryKey)).toBeUndefined()
  })
})
