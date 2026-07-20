/** @vitest-environment jsdom */

import { createElement, type ComponentProps } from "react"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { localeUiConfig } from "~/src/integrations/fumadocs/fumadocs.i18n"
import type * as I18nNavigation from "~/src/integrations/next-intl/i18n.navigation"

import type * as ShadcnSelect from "~/src/components/shadcn/select"

import { LocaleSwitch } from "~/src/components/custom/locale-switch"

type I18nRouter = ReturnType<typeof I18nNavigation.useRouter>
type LocaleSelectOnChange = NonNullable<ComponentProps<typeof ShadcnSelect.Select>["onChange"]>

const POLISH_LOCALE = "pl-PL"
const polishDisplayName = localeUiConfig[POLISH_LOCALE].displayName

const replaceMock = vi.hoisted(() => vi.fn<I18nRouter["replace"]>())

const localeChangeHandler = vi.hoisted((): { current?: LocaleSelectOnChange } => ({}))

vi.mock(import("~/src/components/shadcn/select"), async (importOriginal): Promise<Partial<typeof ShadcnSelect>> => {
  const actual = await importOriginal<typeof ShadcnSelect>()

  function Select(props: ComponentProps<typeof actual.Select>) {
    if (props.onChange !== undefined) {
      localeChangeHandler.current = props.onChange
    }

    return createElement(actual.Select, props)
  }

  return { ...actual, Select }
})

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
      expect(screen.getByRole("button", { name: englishLabel })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: englishLabel }))
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
      expect(screen.getByRole("button", { name: englishLabel })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: englishLabel }))
    expect(replaceMock).not.toHaveBeenCalled()
  })

  it("ignores null and invalid locale values from onChange", async () => {
    expect.hasAssertions()
    replaceMock.mockClear()

    render(<LocaleSwitch locale="en-US" />)

    await waitFor(() => {
      expect(localeChangeHandler.current).toBeDefined()
    })

    localeChangeHandler.current?.(null)
    localeChangeHandler.current?.("not-a-locale")
    expect(replaceMock).not.toHaveBeenCalled()
  })
})
