import { type ComponentProps, createElement } from "react"
/** @vitest-environment jsdom */

import { screen } from "@testing-library/react"
import type * as FumadocsProvider from "fumadocs-ui/provider/tanstack"
import { describe, expect, it, vi } from "vite-plus/test"

import { renderWithRouter as render } from "~/src/platform/testing/lib/render"

import { DocsProvider } from "~/src/providers/docs-provider"

type RootProviderComponents = NonNullable<ComponentProps<typeof FumadocsProvider.RootProvider>["components"]>
type DocsLinkProps = ComponentProps<NonNullable<RootProviderComponents["Link"]>>

vi.mock(import("fumadocs-ui/provider/tanstack"), (): Partial<typeof FumadocsProvider> => ({
  RootProvider: (...args) => docsRootProviderMock(...args),
}))

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
    expect(styledLink).toHaveAttribute("target", "_blank")
  })
})

const docsRootProviderMock = (props: Readonly<ComponentProps<typeof FumadocsProvider.RootProvider>>) => {
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
    target: "_blank",
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
