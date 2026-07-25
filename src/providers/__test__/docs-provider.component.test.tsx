/** @vitest-environment jsdom */

import { createElement, type ComponentProps } from "react"

import { render, screen } from "@testing-library/react"
import type * as FumadocsProvider from "fumadocs-ui/provider/next"

import { DocsProvider } from "~/src/providers/docs-provider"

import type * as I18nNavigation from "~/src/integrations/next-intl/i18n.navigation"

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
  const styledLinkProps: DocsLinkProps = {
    className: "sidebar-item",
    href: "/styled",
    style: { paddingInlineStart: "20px" },
  }

  return createElement(
    "div",
    { "data-testid": "docs-root" },
    createElement(LinkComponent, missingHrefProps, "fallback-link"),
    createElement(LinkComponent, stringLinkProps, "string-link"),
    createElement(LinkComponent, styledLinkProps, "styled-link"),
    children,
  )
}

vi.mock(
  import("fumadocs-ui/provider/next"),
  (): Partial<typeof FumadocsProvider> => ({
    RootProvider: DocsRootProviderMock,
  }),
)

vi.mock(import("~/src/integrations/next-intl/i18n.navigation"), async (): Promise<Partial<typeof I18nNavigation>> => {
  const { createI18nNavigationPartialMock } =
    await import("~/src/integrations/next-intl/__test__/mocks/i18n-navigation-for-component-tests")

  return createI18nNavigationPartialMock(createI18nRouterMock)
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

  it("forwards style and className to docs links", () => {
    expect.hasAssertions()
    render(
      <DocsProvider locale="en-US">
        <span>docs</span>
      </DocsProvider>,
    )
    const styledLink = screen.getByRole("link", { name: "styled-link" })
    expect(styledLink).toHaveStyle({ paddingInlineStart: "20px" })
    expect(styledLink).toHaveClass("sidebar-item")
  })
})
