import { screen } from "@testing-library/react"
import { Link } from "fumadocs-core/framework"
import { describe, expect, it } from "vite-plus/test"

import { renderWithRouter } from "~/src/platform/testing/lib/render"

import { DocsProvider } from "~/src/providers/docs-provider"

describe("docs provider", () => {
  it("uses Fumadocs' TanStack links and preserves link attributes", () => {
    renderWithRouter(
      <DocsProvider locale="en-US">
        <Link className="sidebar-item" href="/docs" prefetch={false} style={{ paddingInlineStart: "20px" }} target="_blank">
          Documentation
        </Link>
      </DocsProvider>,
    )

    const link = screen.getByRole("link", { name: "Documentation" })
    expect(link).toHaveAttribute("href", "/docs")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveClass("sidebar-item")
    expect(link).toHaveStyle({ paddingInlineStart: "20px" })
    expect(link).not.toHaveAttribute("prefetch")
  })
})
