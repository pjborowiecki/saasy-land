/** @vitest-environment jsdom */

import { createElement, type ComponentProps, type ReactNode } from "react"

import type * as BaseUiTooltip from "@base-ui/react/tooltip"
import { render, screen } from "@testing-library/react"
import type * as FumadocsProvider from "fumadocs-ui/provider/next"
import type * as NuqsNextApp from "nuqs/adapters/next/app"

import { DocsProvider } from "~/src/presentation/providers/docs-provider"
import { NuqsProvider } from "~/src/presentation/providers/nuqs-provider"
import { ThemeProvider } from "~/src/presentation/providers/theme-provider"
import { TooltipProvider } from "~/src/presentation/providers/tooltip-provider"
import { TranslationsProvider } from "~/src/presentation/providers/translations-provider"

import type * as I18nNavigation from "~/src/integrations/next-intl/i18n.navigation"

const TOOLTIP_DELAY_MS = 100

type I18nRouter = ReturnType<typeof I18nNavigation.useRouter>
type RootProviderComponents = NonNullable<ComponentProps<typeof FumadocsProvider.RootProvider>["components"]>
type DocsLinkProps = ComponentProps<NonNullable<RootProviderComponents["Link"]>>

function createI18nRouterMock(): I18nRouter {
  return {
    back: vi.fn<I18nRouter["back"]>(),
    forward: vi.fn<I18nRouter["forward"]>(),
    prefetch: vi.fn<I18nRouter["prefetch"]>(),
    push: vi.fn<I18nRouter["push"]>(),
    refresh: vi.fn<I18nRouter["refresh"]>(),
    replace: vi.fn<I18nRouter["replace"]>(),
  }
}

function DocsRootProviderMock(props: Readonly<ComponentProps<typeof FumadocsProvider.RootProvider>>) {
  const { children, components } = props
  const LinkComponent = components?.Link

  if (!LinkComponent) {
    return createElement("div", { "data-testid": "docs-root" }, children)
  }

  const missingHrefProps: DocsLinkProps = {}
  const stringLinkProps: DocsLinkProps = { href: "/string" }

  return createElement(
    "div",
    { "data-testid": "docs-root" },
    createElement(LinkComponent, missingHrefProps, "fallback-link"),
    createElement(LinkComponent, stringLinkProps, "string-link"),
    children,
  )
}

function TooltipProviderMock(props: Readonly<ComponentProps<typeof BaseUiTooltip.Tooltip.Provider>>) {
  const { children, ...rest } = props

  return createElement("div", { "data-props": JSON.stringify(rest), "data-testid": "tooltip-provider" }, children)
}

function NuqsAdapterMock({ children }: Readonly<{ children: ReactNode }>) {
  return createElement("div", { "data-testid": "nuqs-adapter" }, children)
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

vi.mock(
  import("nuqs/adapters/next/app"),
  (): Partial<typeof NuqsNextApp> => ({
    NuqsAdapter: NuqsAdapterMock,
  }),
)

vi.mock(import("~/src/integrations/next-intl/i18n.navigation"), async (): Promise<Partial<typeof I18nNavigation>> => {
  const { createI18nNavigationPartialMock } =
    await import("~/src/integrations/next-intl/__test__/mocks/i18n-navigation-for-component-tests")

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

describe("nuqs provider component", () => {
  it("wraps children with nuqs adapter", () => {
    expect.hasAssertions()
    render(
      <NuqsProvider>
        <span>child</span>
      </NuqsProvider>,
    )
    expect(screen.getByTestId("nuqs-adapter")).toBeInTheDocument()
    expect(screen.getByText("child")).toBeInTheDocument()
  })
})

describe("docs provider component", () => {
  it("renders docs root provider and falls back missing link href to root", () => {
    expect.hasAssertions()
    render(
      <DocsProvider locale="en-US">
        <span>docs</span>
      </DocsProvider>,
    )
    expect(screen.getByTestId("docs-root")).toBeInTheDocument()
    expect(screen.getByText("docs")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "fallback-link" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "string-link" })).toHaveAttribute("href", "/string")
  })
})
