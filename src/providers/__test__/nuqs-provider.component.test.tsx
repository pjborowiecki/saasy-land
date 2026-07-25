/** @vitest-environment jsdom */

import { createElement, type ReactNode } from "react"

import { render, screen } from "@testing-library/react"
import type * as NuqsNextApp from "nuqs/adapters/next/app"

import { NuqsProvider } from "~/src/providers/nuqs-provider"

interface AdapterProps {
  children: ReactNode
  defaultOptions?: {
    history?: "push" | "replace"
    scroll?: boolean
    shallow?: boolean
  }
}

const adapterPropsSpy = vi.hoisted(() => vi.fn<(props: Omit<AdapterProps, "children">) => void>())

function NuqsAdapterMock({ children, ...adapterProps }: AdapterProps) {
  adapterPropsSpy(adapterProps)
  return createElement("div", { "data-testid": "nuqs-adapter" }, children)
}

vi.mock(
  import("nuqs/adapters/next/app"),
  (): Partial<typeof NuqsNextApp> => ({
    NuqsAdapter: NuqsAdapterMock,
  }),
)

describe("nuqs provider component", () => {
  it("wraps children with nuqs adapter defaults for admin URL state", () => {
    expect.hasAssertions()
    adapterPropsSpy.mockClear()

    render(
      <NuqsProvider>
        <span>child</span>
      </NuqsProvider>,
    )

    expect(screen.getByTestId("nuqs-adapter")).toBeInTheDocument()
    expect(screen.getByText("child")).toBeInTheDocument()
    expect(adapterPropsSpy).toHaveBeenCalledWith({
      defaultOptions: {
        history: "push",
        scroll: false,
        shallow: false,
      },
    })
  })
})
