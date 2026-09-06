import { render, screen, waitFor } from "@testing-library/react"
/** @vitest-environment jsdom */
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vite-plus/test"

import { selectTriggerNamed } from "~/src/platform/testing/lib/select-trigger-name"
import { setThemeMock, themeState } from "~/src/platform/testing/mocks/wrksz-themes"

import { ThemeSwitchClient } from "~/src/presentation/components/custom/theme-switch"

const themeSwitchLabels = {
  darkLabel: "Dark",
  label: "Theme",
  lightLabel: "Light",
  placeholder: "Select",
  systemLabel: "System",
} as const

describe("themeSwitchClient branches", () => {
  it("shows the placeholder when theme is undefined", async () => {
    expect.hasAssertions()
    setThemeMock.mockClear()
    themeState.value = void 0

    render(<ThemeSwitchClient {...themeSwitchLabels} />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: selectTriggerNamed(themeSwitchLabels.placeholder) })).toBeInTheDocument()
    })
  })

  it("does not update theme when the select is opened without a selection", async () => {
    expect.hasAssertions()
    setThemeMock.mockClear()
    themeState.value = "light"
    const user = userEvent.setup()

    render(<ThemeSwitchClient {...themeSwitchLabels} />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: selectTriggerNamed(themeSwitchLabels.lightLabel) })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: selectTriggerNamed(themeSwitchLabels.lightLabel) }))
    expect(setThemeMock).not.toHaveBeenCalled()
  })
})
