/** @vitest-environment jsdom */

import { createElement, type ComponentProps } from "react"

import type * as BaseUiTooltip from "@base-ui/react/tooltip"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as FumadocsProvider from "fumadocs-ui/provider/next"

import { DocsProvider } from "~/src/providers/docs-provider"
import { ThemeProvider } from "~/src/providers/theme-provider"
import { TooltipProvider } from "~/src/providers/tooltip-provider"
import { TranslationsProvider } from "~/src/providers/translations-provider"

import type * as I18nNavigation from "~/src/integrations/next-intl/i18n.navigation"

const TOOLTIP_DELAY_MS = 100

type I18nRouter = ReturnType<typeof I18nNavigation.useRouter>

const replaceMock = vi.hoisted(() => vi.fn<I18nRouter["replace"]>())
const localeChangeRef = vi.hoisted(() => ({
  current: (_locale: string) => {},
}))

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

function clickInvalidLocale(): void {
  localeChangeRef.current("invalid")
}

function clickValidLocale(): void {
  localeChangeRef.current("pl-PL")
}

function DocsRootProviderMock(props: Readonly<ComponentProps<typeof FumadocsProvider.RootProvider>>) {
  const { children, components, i18n } = props
  const LinkComponent = components?.Link ?? "a"

  if (i18n?.onLocaleChange) {
    localeChangeRef.current = i18n.onLocaleChange
  }

  return createElement(
    "div",
    { "data-testid": "docs-root" },
    createElement(LinkComponent, { href: { pathname: "/object" } } as unknown as ComponentProps<typeof LinkComponent>, "object-link"),
    createElement(LinkComponent, { href: "/string" }, "string-link"),
    createElement("button", { onClick: clickInvalidLocale, type: "button" }, "invalid-locale"),
    createElement("button", { onClick: clickValidLocale, type: "button" }, "valid-locale"),
    children,
  )
}

function TooltipProviderMock(props: Readonly<ComponentProps<typeof BaseUiTooltip.Tooltip.Provider>>) {
  const { children, ...rest } = props

  return createElement("div", { "data-props": JSON.stringify(rest), "data-testid": "tooltip-provider" }, children)
}

vi.mock(import("@base-ui/react/tooltip"), async (importOriginal): Promise<Partial<typeof BaseUiTooltip>> => {
  const actual = await importOriginal<typeof BaseUiTooltip>()

  return {
    Tooltip: {
      ...actual.Tooltip,
      Provider: TooltipProviderMock,
    },
  }
})

vi.mock(
  import("fumadocs-ui/provider/next"),
  (): Partial<typeof FumadocsProvider> => ({
    RootProvider: DocsRootProviderMock,
  }),
)

vi.mock(import("~/src/integrations/next-intl/i18n.navigation"), async (): Promise<Partial<typeof I18nNavigation>> => {
  const { createI18nNavigationPartialMock } = await import("~/tests/mocks/i18n-navigation-for-component-tests")

  return createI18nNavigationPartialMock(createI18nRouterMock)
})

describe("theme provider component", () => {
  it("wraps children with wrksz theme provider", () => {
    expect.hasAssertions()
    render(
      <ThemeProvider>
        <span>child</span>
      </ThemeProvider>,
    )
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument()
    expect(screen.getByText("child")).toBeInTheDocument()
  })
})

describe("tooltip provider component", () => {
  it("wraps children with tooltip provider", () => {
    expect.hasAssertions()
    render(
      <TooltipProvider delay={TOOLTIP_DELAY_MS}>
        <span>child</span>
      </TooltipProvider>,
    )
    expect(screen.getByTestId("tooltip-provider")).toHaveAttribute("data-props", expect.stringContaining(`"delay":${TOOLTIP_DELAY_MS}`))
  })
})

describe("translations provider component", () => {
  it("re-exports next-intl provider", () => {
    expect.hasAssertions()
    expect(TranslationsProvider).toBeDefined()
  })
})

describe("docs provider component", () => {
  it("renders docs root provider", () => {
    expect.hasAssertions()
    replaceMock.mockClear()
    render(
      <DocsProvider locale="en-US">
        <span>docs</span>
      </DocsProvider>,
    )
    expect(screen.getByTestId("docs-root")).toBeInTheDocument()
    expect(screen.getByText("docs")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "object-link" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "string-link" })).toHaveAttribute("href", "/string")
  })

  it("ignores invalid locale changes", async () => {
    expect.hasAssertions()
    replaceMock.mockClear()
    const user = userEvent.setup()
    render(
      <DocsProvider locale="en-US">
        <span>docs</span>
      </DocsProvider>,
    )

    await user.click(screen.getByRole("button", { name: "invalid-locale" }))
    expect(replaceMock).not.toHaveBeenCalled()
  })

  it("changes locale for valid values", async () => {
    expect.hasAssertions()
    replaceMock.mockClear()
    const user = userEvent.setup()
    render(
      <DocsProvider locale="en-US">
        <span>docs</span>
      </DocsProvider>,
    )

    await user.click(screen.getByRole("button", { name: "valid-locale" }))
    expect(replaceMock).toHaveBeenCalledWith("/docs", { locale: "pl-PL" })
  })
})
