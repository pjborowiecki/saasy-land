import type { ReactElement } from "react"

import { QueryClient } from "@tanstack/react-query"
import { act, cleanup, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { IntlProvider } from "use-intl/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"
import { renderWithRouter } from "~/src/platform/testing/lib/render"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { LICENSE_MUTATION_KEYS, LICENSE_STATUS, LICENSE_TIER } from "~/src/modules/license/license.constants"
import type { License } from "~/src/modules/license/license.types"
import type { deactivateLicenseMutation } from "~/src/modules/license/use-cases/deactivate-license"
import {
  currentLicenseQuery,
  type getCurrentLicenseActivations,
  licenseActivationsQuery,
} from "~/src/modules/license/use-cases/get-current-license"
import type { startCheckoutMutation } from "~/src/modules/license/use-cases/start-checkout"

import { Route as OverviewRoute } from "~/src/routes/app.index"
import { Route as LicenseRoute } from "~/src/routes/app.license"

import { CONTACT_EMAIL } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

const messages = getTestMessages("en-US")
const overviewMessages = messages.pages.app
const licenseMessages = messages.pages.license
const LICENSE_KEY = "private-purchased-license-key"
const Overview = OverviewRoute.options.component
const LicensePage = LicenseRoute.options.component

if (Overview === undefined || LicensePage === undefined) {
  throw new Error("App routes must have page components")
}

const currentLicenseMock = vi.hoisted(() => vi.fn<() => Promise<License["select"] | null>>())
const activationsMock = vi.hoisted(() => vi.fn<() => ReturnType<typeof getCurrentLicenseActivations>>())
const checkoutMock = vi.hoisted(() => vi.fn<NonNullable<typeof startCheckoutMutation.mutationFn>>())
const deactivateMock = vi.hoisted(() => vi.fn<NonNullable<typeof deactivateLicenseMutation.mutationFn>>())

vi.mock(import("~/src/modules/license/use-cases/get-current-license"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    currentLicenseQuery: { ...actual.currentLicenseQuery, queryFn: currentLicenseMock },
    licenseActivationsQuery: { ...actual.licenseActivationsQuery, queryFn: activationsMock },
  }
})
vi.mock(import("~/src/modules/license/use-cases/start-checkout"), () => ({
  startCheckoutMutation: { mutationFn: checkoutMock, mutationKey: LICENSE_MUTATION_KEYS.START_CHECKOUT },
}))
vi.mock(import("~/src/modules/license/use-cases/deactivate-license"), () => ({
  deactivateLicenseMutation: { mutationFn: deactivateMock, mutationKey: LICENSE_MUTATION_KEYS.DEACTIVATE },
}))

const ownedLicense: License["select"] = {
  createdAt: new Date("2026-09-08T10:00:00Z"),
  id: "license-1",
  key: LICENSE_KEY,
  polarCustomerId: "customer-1",
  polarLicenseKeyId: "polar-license-1",
  polarOrderId: "order-1",
  status: LICENSE_STATUS.ACTIVE,
  tier: LICENSE_TIER.AGENCY,
  updatedAt: new Date("2026-09-08T10:00:00Z"),
  userId: "user-1",
}

const renderPage = (page: ReactElement, license: License["select"] | null) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } })
  queryClient.setQueryData(currentLicenseQuery.queryKey, license)
  queryClient.setQueryData(licenseActivationsQuery.queryKey, { activations: [], limitActivations: 2 })
  currentLicenseMock.mockResolvedValue(license)
  activationsMock.mockResolvedValue({ activations: [], limitActivations: 2 })
  renderWithRouter(
    <IntlProvider locale="en-US" messages={messages} timeZone="UTC">
      {page}
    </IntlProvider>,
    { queryClient },
  )
  return { queryClient, user: userEvent.setup() }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(toast, "error").mockReturnValue(0)
  vi.spyOn(toast, "success").mockReturnValue(0)
})

afterEach(cleanup)

describe("app overview", () => {
  it("offers the available packages and useful resources to an account without a license", () => {
    renderPage(<Overview />, JSON_NULL)

    expect(screen.getByRole("heading", { level: 1, name: overviewMessages.title })).toBeVisible()
    expect(screen.getByRole("heading", { name: licenseMessages.buy.title })).toBeVisible()
    expect(screen.getByRole("button", { name: licenseMessages.buy.core })).toBeEnabled()
    expect(screen.getByRole("button", { name: licenseMessages.buy.complete })).toBeEnabled()
    expect(screen.getByRole("button", { name: licenseMessages.buy.agency })).toBeEnabled()
    expect(screen.getByRole("link", { name: overviewMessages.overview.docs.action })).toHaveAttribute("href", ROUTES.DOCS)
    expect(screen.getByRole("link", { name: overviewMessages.overview.support.action })).toHaveAttribute("href", `mailto:${CONTACT_EMAIL}`)
    expect(screen.queryByRole("link", { name: overviewMessages.license })).not.toBeInTheDocument()
  })

  it.each([
    { license: ownedLicense, status: overviewMessages.overview.license.active },
    { license: { ...ownedLicense, key: JSON_NULL }, status: overviewMessages.overview.license.pending },
    {
      license: { ...ownedLicense, key: JSON_NULL, status: LICENSE_STATUS.REVOKED },
      status: overviewMessages.overview.license.revoked,
    },
  ])("shows the actual purchased tier and $status state without revealing the key", ({ license, status }) => {
    renderPage(<Overview />, license)

    expect(screen.getByText(licenseMessages.tier.agency)).toBeVisible()
    expect(screen.getByText(status)).toBeVisible()
    expect(screen.getByRole("link", { name: overviewMessages.license })).toHaveAttribute("href", ROUTES.APP_LICENSE)
    expect(screen.queryByText(LICENSE_KEY)).not.toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: licenseMessages.buy.title })).not.toBeInTheDocument()
  })

  it("submits the selected package once, prevents duplicate checkout, and recovers after a failure", async () => {
    const checkout = Promise.withResolvers<{ url: string }>()
    checkoutMock.mockReturnValue(checkout.promise)
    const { user } = renderPage(<Overview />, JSON_NULL)

    await user.click(screen.getByRole("button", { name: licenseMessages.buy.agency }))

    expect(checkoutMock).toHaveBeenCalledExactlyOnceWith({ tier: LICENSE_TIER.AGENCY }, expect.anything())
    const pendingButtons = screen.getAllByRole("button", { name: (name) => name.endsWith(licenseMessages.buy.pending) })
    expect(pendingButtons).toHaveLength(3)
    for (const button of pendingButtons) {
      expect(button).toBeDisabled()
      await user.click(button)
    }
    expect(checkoutMock).toHaveBeenCalledOnce()

    await act(async () => {
      checkout.reject(new Error("Checkout unavailable"))
      await checkout.promise.catch(() => {})
    })

    await waitFor(() => {
      expect(screen.getByRole("button", { name: licenseMessages.buy.agency })).toBeEnabled()
    })
    expect(toast.error).toHaveBeenCalledWith(messages.errors.action.INTERNAL_ERROR)
  })
})

describe("license page", () => {
  it("keeps its page heading and description when there is no purchase yet", () => {
    renderPage(<LicensePage />, JSON_NULL)

    expect(screen.getByRole("heading", { level: 1, name: licenseMessages.title })).toBeVisible()
    expect(screen.getByText(licenseMessages.description)).toBeVisible()
    expect(screen.getByRole("heading", { name: licenseMessages.buy.title })).toBeVisible()
  })

  it("shows the purchased key and refreshes the machine list after freeing a slot", async () => {
    deactivateMock.mockResolvedValue({ deactivated: true })
    const { queryClient, user } = renderPage(<LicensePage />, ownedLicense)
    act(() => {
      queryClient.setQueryData(licenseActivationsQuery.queryKey, {
        activations: [
          {
            createdAt: new Date("2026-09-08T10:00:00Z"),
            id: "activation-1",
            label: "Development laptop",
            licenseKeyId: "polar-license-1",
            meta: {},
            modifiedAt: JSON_NULL,
          },
        ],
        limitActivations: 2,
      })
    })

    expect(screen.getByText(LICENSE_KEY)).toBeVisible()
    expect(screen.getByRole("link", { name: licenseMessages.manage })).toHaveAttribute("href", ROUTES.API_AUTH_CUSTOMER_PORTAL)
    expect(await screen.findByText("Development laptop")).toBeVisible()
    await user.click(screen.getByRole("button", { name: licenseMessages.activations.deactivate }))

    expect(deactivateMock).toHaveBeenCalledExactlyOnceWith({ activationId: "activation-1" }, expect.anything())
    await waitFor(() => {
      expect(screen.queryByText("Development laptop")).not.toBeInTheDocument()
    })
    expect(activationsMock).toHaveBeenCalledOnce()
    expect(screen.getByText(licenseMessages.activations.none)).toBeVisible()
    expect(toast.success).toHaveBeenCalledWith(licenseMessages.activations.success)
  })
})
