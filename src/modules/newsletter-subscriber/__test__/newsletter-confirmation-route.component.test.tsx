import { StrictMode } from "react"

import { QueryClient } from "@tanstack/react-query"
import { Outlet, RouterProvider, createMemoryHistory, createRootRouteWithContext, createRoute, createRouter } from "@tanstack/react-router"
import { act, render, screen } from "@testing-library/react"
import { IntlProvider } from "use-intl/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"

import { Route as ConfirmRoute } from "~/src/routes/_landing.newsletter.confirm"
import { Route as UnsubscribeRoute } from "~/src/routes/_landing.newsletter.unsubscribe"

import type { RouterContext } from "~/src/router"
import { ROUTES } from "~/src/routes"

const confirmMock = vi.hoisted(() => vi.fn<(input: { data: { token: string } }) => Promise<{ confirmed: boolean }>>())
const unsubscribeMock = vi.hoisted(() => vi.fn<(input: { data: { token: string } }) => Promise<{ unsubscribed: true }>>())
const TOKEN = "a".repeat(NEWSLETTER_TOKEN_LENGTH)
const SECOND_TOKEN = "b".repeat(NEWSLETTER_TOKEN_LENGTH)
const messages = getTestMessages("pl-PL")

vi.mock("~/src/modules/newsletter-subscriber/use-cases/confirm-newsletter-subscription", () => ({
  confirmNewsletterSubscription: confirmMock,
}))
vi.mock("~/src/modules/newsletter-subscriber/use-cases/unsubscribe-from-newsletter", () => ({
  unsubscribeFromNewsletter: unsubscribeMock,
}))
vi.mock(import("~/src/integrations/use-intl/i18n.metadata"), () => ({
  loadRouteMessages: vi.fn(() =>
    Promise.resolve({ metadata: { description: "Newsletter", locale: "pl-PL" as const, pathname: "/newsletter", title: "Newsletter" } }),
  ),
  routeHead: () => ({}),
}))

const createNewsletterRouter = (path = "/") => {
  const root = createRootRouteWithContext<RouterContext>()({ component: Outlet })
  const landing = createRoute({ getParentRoute: () => root, id: "_landing" })
  const home = createRoute({ component: () => <p>Home</p>, getParentRoute: () => root, path: "/" })
  // Attach the actual file routes to a small layout, as the generated route tree does.
  Object.assign(ConfirmRoute.options, { getParentRoute: () => landing, id: "/newsletter/confirm", path: "/newsletter/confirm" })
  Object.assign(UnsubscribeRoute.options, { getParentRoute: () => landing, id: "/newsletter/unsubscribe", path: "/newsletter/unsubscribe" })
  return createRouter({
    context: { queryClient: new QueryClient() },
    defaultPendingMinMs: 0,
    history: createMemoryHistory({ initialEntries: [path] }),
    routeTree: root.addChildren([home, landing.addChildren([ConfirmRoute, UnsubscribeRoute])]),
  })
}

const renderNewsletter = async (path: string) => {
  const router = createNewsletterRouter(path)
  const view = render(
    <IntlProvider locale="pl-PL" messages={messages}>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </IntlProvider>,
  )
  await act(() => router.load())
  return { ...view, router }
}

beforeEach(() => {
  vi.spyOn(globalThis, "scrollTo").mockImplementation(vi.fn<() => void>())
  confirmMock.mockReset().mockResolvedValue({ confirmed: true })
  unsubscribeMock.mockReset().mockResolvedValue({ unsubscribed: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("newsletter confirmation route", () => {
  it("does not consume a prefetched link and confirms once when the user navigates", async () => {
    const { router } = await renderNewsletter("/")
    await act(() => router.preloadRoute({ search: { token: TOKEN }, to: ROUTES.NEWSLETTER_CONFIRM }))
    expect(confirmMock).not.toHaveBeenCalled()

    await act(() => router.navigate({ search: { token: TOKEN }, to: ROUTES.NEWSLETTER_CONFIRM }))

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.confirm.confirmed.title })).toBeVisible()
    expect(confirmMock).toHaveBeenCalledExactlyOnceWith({ data: { token: TOKEN } })
    expect(router.state.location.searchStr).not.toContain("token")
    expect(router.state.location.search).toMatchObject({ status: "confirmed" })
    expect(screen.getByRole("link")).toHaveAttribute("href", "/pl-PL")
  })

  it("keeps the confirmed result when loaders invalidate and the result URL reloads", async () => {
    const { router, unmount } = await renderNewsletter(`${ROUTES.NEWSLETTER_CONFIRM}?token=${TOKEN}`)
    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.confirm.confirmed.title })).toBeVisible()

    await act(() => router.invalidate({ sync: true }))
    const resultUrl = router.state.location.href
    unmount()
    await renderNewsletter(resultUrl)

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.confirm.confirmed.title })).toBeVisible()
    expect(confirmMock).toHaveBeenCalledOnce()
  })

  it("processes a new token on the same route", async () => {
    const { router } = await renderNewsletter(`${ROUTES.NEWSLETTER_CONFIRM}?token=${TOKEN}`)
    confirmMock.mockResolvedValue({ confirmed: false })

    await act(() => router.navigate({ search: { token: SECOND_TOKEN }, to: ROUTES.NEWSLETTER_CONFIRM }))

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.confirm.expired.title })).toBeVisible()
    expect(confirmMock).toHaveBeenNthCalledWith(2, { data: { token: SECOND_TOKEN } })
    expect(confirmMock).toHaveBeenCalledTimes(2)
    expect(router.state.location.searchStr).not.toContain("token")
  })

  it.each(["", "?token=short&status=confirmed"])("renders invalid links without calling the server: %s", async (search) => {
    const { router } = await renderNewsletter(`${ROUTES.NEWSLETTER_CONFIRM}${search}`)

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.confirm.expired.title })).toBeVisible()
    expect(confirmMock).not.toHaveBeenCalled()
    expect(router.state.location.searchStr).not.toContain("token")
  })

  it("renders the expired-link page when the token has already been consumed", async () => {
    confirmMock.mockResolvedValue({ confirmed: false })
    const { router } = await renderNewsletter(`${ROUTES.NEWSLETTER_CONFIRM}?token=${TOKEN}&status=confirmed`)

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.confirm.expired.title })).toBeVisible()
    expect(router.state.location.search).toMatchObject({ status: "expired" })
  })

  it("shows a localized error and preserves the token for a successful retry", async () => {
    vi.spyOn(console, "error").mockImplementation(vi.fn<() => void>())
    vi.spyOn(console, "warn").mockImplementation(vi.fn<() => void>())
    confirmMock.mockRejectedValueOnce(new Error("Connection failed"))
    const { router } = await renderNewsletter(`${ROUTES.NEWSLETTER_CONFIRM}?token=${TOKEN}`)
    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.confirm.error.title })).toBeVisible()
    expect(router.state.location.search).toMatchObject({ token: TOKEN })

    await act(() => router.invalidate({ sync: true }))

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.confirm.confirmed.title })).toBeVisible()
    expect(confirmMock).toHaveBeenCalledTimes(2)
    expect(router.state.location.searchStr).not.toContain("token")
  })
})

describe("newsletter unsubscribe route", () => {
  it("does not unsubscribe on preload and does not repeat the action after invalidation or reload", async () => {
    const { router, unmount } = await renderNewsletter("/")
    await act(() => router.preloadRoute({ search: { token: TOKEN }, to: ROUTES.NEWSLETTER_UNSUBSCRIBE }))
    expect(unsubscribeMock).not.toHaveBeenCalled()

    await act(() => router.navigate({ search: { token: TOKEN }, to: ROUTES.NEWSLETTER_UNSUBSCRIBE }))
    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.unsubscribe.title })).toBeVisible()
    expect(router.state.location.searchStr).not.toContain("token")
    await act(() => router.invalidate({ sync: true }))
    const resultUrl = router.state.location.href
    unmount()
    await renderNewsletter(resultUrl)

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.unsubscribe.title })).toBeVisible()
    expect(unsubscribeMock).toHaveBeenCalledExactlyOnceWith({ data: { token: TOKEN } })
  })

  it("processes a different unsubscribe token", async () => {
    const { router } = await renderNewsletter(`${ROUTES.NEWSLETTER_UNSUBSCRIBE}?token=${TOKEN}`)

    await act(() => router.navigate({ search: { token: SECOND_TOKEN }, to: ROUTES.NEWSLETTER_UNSUBSCRIBE }))

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.unsubscribe.title })).toBeVisible()
    expect(unsubscribeMock).toHaveBeenNthCalledWith(2, { data: { token: SECOND_TOKEN } })
    expect(unsubscribeMock).toHaveBeenCalledTimes(2)
  })

  it.each(["", "?token=short&status=success"])("rejects malformed unsubscribe links without making a request: %s", async (search) => {
    const { router } = await renderNewsletter(`${ROUTES.NEWSLETTER_UNSUBSCRIBE}${search}`)

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.unsubscribe.error.title })).toBeVisible()
    expect(unsubscribeMock).not.toHaveBeenCalled()
    expect(router.state.location.searchStr).not.toContain("token")
  })

  it("preserves a failed unsubscribe link for retry", async () => {
    vi.spyOn(console, "error").mockImplementation(vi.fn<() => void>())
    vi.spyOn(console, "warn").mockImplementation(vi.fn<() => void>())
    unsubscribeMock.mockRejectedValueOnce(new Error("Connection failed"))
    const { router } = await renderNewsletter(`${ROUTES.NEWSLETTER_UNSUBSCRIBE}?token=${TOKEN}`)
    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.unsubscribe.error.title })).toBeVisible()
    expect(router.state.location.search).toMatchObject({ token: TOKEN })

    await act(() => router.invalidate({ sync: true }))

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.unsubscribe.title })).toBeVisible()
    expect(unsubscribeMock).toHaveBeenCalledTimes(2)
    expect(router.state.location.searchStr).not.toContain("token")
  })
})
