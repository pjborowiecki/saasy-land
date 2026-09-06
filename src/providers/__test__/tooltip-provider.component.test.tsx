import { type ComponentProps, createElement } from "react"
/** @vitest-environment jsdom */

import type * as BaseUiTooltip from "@base-ui/react/tooltip"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vite-plus/test"

import { TooltipProvider } from "~/src/providers/tooltip-provider"

const TOOLTIP_DELAY_MS = 100

vi.mock(import("@base-ui/react/tooltip"), async (importOriginal): Promise<Partial<typeof BaseUiTooltip>> => {
  const actual = await importOriginal<typeof BaseUiTooltip>()

  return {
    Tooltip: {
      ...actual.Tooltip,
      Provider: (...args) => tooltipProviderMock(...args),
    },
  }
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

const tooltipProviderMock = (props: Readonly<ComponentProps<typeof BaseUiTooltip.Tooltip.Provider>>) => {
  const { children, ...rest } = props

  return createElement("div", { "data-props": JSON.stringify(rest), "data-testid": "tooltip-provider" }, children)
}
