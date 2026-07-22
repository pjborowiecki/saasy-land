/** @vitest-environment jsdom */

import { createElement, type ReactNode } from "react"

import { render, screen } from "@testing-library/react"
import type * as NuqsNextApp from "nuqs/adapters/next/app"

import { NuqsProvider } from "~/src/providers/nuqs-provider"

function NuqsAdapterMock({ children }: Readonly<{ children: ReactNode }>) {
  return createElement("div", { "data-testid": "nuqs-adapter" }, children)
}

vi.mock(
  import("nuqs/adapters/next/app"),
  (): Partial<typeof NuqsNextApp> => ({
    NuqsAdapter: NuqsAdapterMock,
  }),
)

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
