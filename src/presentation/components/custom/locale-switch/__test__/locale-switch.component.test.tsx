/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { selectTriggerNamed } from "~/src/platform/testing/lib/select-trigger-name"

import { localeUiConfig } from "~/src/integrations/fumadocs/fumadocs.i18n"
import type * as I18nNavigation from "~/src/integrations/next-intl/i18n.navigation"

import { LocaleSwitch } from "~/src/presentation/components/custom/locale-switch"

type I18nRouter = ReturnType<typeof I18nNavigation.useRouter>

const POLISH_LOCALE = "pl-PL"
const polishDisplayName = localeUiConfig[POLISH_LOCALE].displayName

const replaceMock = vi.hoisted(() => vi.fn<I18nRouter["replace"]>())

function createI18nRouterMock(): I18nRouter {
  return {
    back: vi.fn<I18nRouter["back"]>(),
    forward: vi.fn<I18nRouter["forward"]>(),
    prefetch: vi.fn<I18nRouter["prefetch"]>(),
    push: vi.fn<I18nRouter["push"]>(),
    refresh: vi.fn<I18nRouter["refresh"]>(),
    replace: replaceMock,
  }
}

vi.mock(
  import("~/src/integrations/next-intl/i18n.navigation"),
  (): Partial<typeof I18nNavigation> => ({
    usePathname: () => "/about",
    useRouter: () => createI18nRouterMock(),
  }),
)

describe("locale switch component", () => {
  it("changes locale through router.replace", async () => {
    expect.hasAssertions()
    replaceMock.mockClear()
    const user = userEvent.setup()

    render(<LocaleSwitch locale="en-US" />)

    const englishLabel = localeUiConfig["en-US"].displayName

    await waitFor(() => {
      expect(screen.getByRole("button", { name: selectTriggerNamed(englishLabel) })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: selectTriggerNamed(englishLabel) }))
    await user.click(await screen.findByRole("option", { name: polishDisplayName }))
    expect(replaceMock).toHaveBeenCalledWith("/about", { locale: POLISH_LOCALE })
  })

  it("does not change locale when the select is opened without a selection", async () => {
    expect.hasAssertions()
    replaceMock.mockClear()
    const user = userEvent.setup()
    const englishLabel = localeUiConfig["en-US"].displayName

    render(<LocaleSwitch locale="en-US" />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: selectTriggerNamed(englishLabel) })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: selectTriggerNamed(englishLabel) }))
    expect(replaceMock).not.toHaveBeenCalled()
  })
})
