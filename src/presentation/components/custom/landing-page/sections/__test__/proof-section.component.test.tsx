import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, cleanup, render, screen, waitFor } from "@testing-library/react"
import { IntlProvider } from "use-intl"
import { afterEach, describe, expect, it, vi } from "vite-plus/test"

import { starCountQuery } from "~/src/integrations/github/github.queries"

import { ProofSection } from "~/src/presentation/components/custom/landing-page/sections/proof-section"

import german from "~/messages/de-DE/pages.landing.json"
import english from "~/messages/en-US/pages.landing.json"

const fetchStarsMock = vi.hoisted(() => vi.fn<() => Promise<number>>())

vi.mock(import("~/src/integrations/github/github.queries"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, starCountQuery: { ...actual.starCountQuery, queryFn: fetchStarsMock } }
})

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

const renderProof = (locale: "en-US" | "de-DE" = "en-US") =>
  render(
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale={locale} messages={{ pages: { landing: locale === "de-DE" ? german : english } }} timeZone="UTC">
        <ProofSection />
      </IntlProvider>
    </QueryClientProvider>,
  )

afterEach(() => {
  cleanup()
  queryClient.clear()
  fetchStarsMock.mockReset()
})

describe("landing page proof statistics", () => {
  it.each([
    { formatted: "54,321", locale: "en-US" },
    { formatted: "54.321", locale: "de-DE" },
  ] as const)("formats the actual GitHub count for $locale", async ({ formatted, locale }) => {
    fetchStarsMock.mockResolvedValue(54_321)

    renderProof(locale)

    expect(await screen.findByText(formatted, { selector: "dd" })).toBeVisible()
    expect(screen.queryByText("435", { selector: "dd" })).not.toBeInTheDocument()
  })

  it("shows a genuine zero-star count", async () => {
    fetchStarsMock.mockResolvedValue(0)

    renderProof()

    expect(await screen.findByText("0", { selector: "dd" })).toBeVisible()
    expect(screen.queryByText("—", { selector: "dd" })).not.toBeInTheDocument()
  })

  it("shows a count loaded by the server immediately without a client fetch", () => {
    queryClient.setQueryData(starCountQuery.queryKey, 54_321)

    renderProof()

    expect(screen.getByText("54,321", { selector: "dd" })).toBeVisible()
    expect(fetchStarsMock).not.toHaveBeenCalled()
  })

  it("keeps other facts visible while the GitHub request is pending, then displays its result", async () => {
    const response = Promise.withResolvers<number>()
    fetchStarsMock.mockReturnValue(response.promise)

    renderProof()

    expect(screen.getByText("100%", { selector: "dd" })).toBeVisible()
    expect(screen.queryByText("—", { selector: "dd" })).not.toBeInTheDocument()
    await act(async () => {
      response.resolve(54_321)
      await response.promise
    })
    expect(await screen.findByText("54,321", { selector: "dd" })).toBeVisible()
  })

  it("keeps the last verified count visible when refreshing the server-function request fails", async () => {
    queryClient.setQueryData(starCountQuery.queryKey, 54_321, { updatedAt: 0 })
    fetchStarsMock.mockRejectedValue(new Error("Server function unavailable"))

    renderProof()

    await waitFor(() => {
      expect(queryClient.getQueryState(starCountQuery.queryKey)?.status).toBe("error")
    })
    expect(screen.getByText("GitHub stars", { selector: "dt" })).toBeVisible()
    expect(screen.getByText("100%", { selector: "dd" })).toBeVisible()
    expect(screen.getByText("54,321", { selector: "dd" })).toBeVisible()
    expect(screen.queryByText("—", { selector: "dd" })).not.toBeInTheDocument()
    expect(screen.queryByText("435", { selector: "dd" })).not.toBeInTheDocument()
  })
})
