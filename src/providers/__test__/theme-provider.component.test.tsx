import { render, screen } from "@testing-library/react"
/** @vitest-environment jsdom */
import { describe, expect, it } from "vite-plus/test"

import { ThemeProvider } from "~/src/providers/theme-provider"

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
