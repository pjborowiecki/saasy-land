import { render, screen, waitFor } from "@testing-library/react"
/** @vitest-environment jsdom */
import userEvent from "@testing-library/user-event"
import { IntlProvider } from "use-intl/react"
import { describe, expect, it } from "vite-plus/test"

import { selectTriggerNamed } from "~/src/platform/testing/lib/select-trigger-name"
import { setThemeMock, themeState } from "~/src/platform/testing/mocks/wrksz-themes"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { ThemeSwitch, ThemeSwitchClient } from "~/src/presentation/components/custom/theme-switch"

const themeMessages = getTestMessages("en-US").components.custom["theme-switch"]
const emptyMessages = {}

const themeSwitchLabels = {
  darkLabel: "Dark",
  label: "Theme",
  lightLabel: "Light",
  placeholder: "Select",
  systemLabel: "System",
} as const

describe("theme switch client component", () => {
  it("renders translated theme options after mount", async () => {
    expect.hasAssertions()
    themeState.value = "system"

    render(
      <IntlProvider locale="en-US" messages={emptyMessages}>
        <ThemeSwitchClient
          darkLabel={themeMessages.dark}
          label={themeMessages.label}
          lightLabel={themeMessages.light}
          placeholder={themeMessages.placeholder}
          systemLabel={themeMessages.system}
        />
      </IntlProvider>,
    )

    await waitFor(() => {
      expect(screen.getByRole("button", { name: selectTriggerNamed(themeMessages.system) })).toBeInTheDocument()
    })
  })

  it("does not update theme when the select is opened without a selection", async () => {
    expect.hasAssertions()
    setThemeMock.mockClear()
    themeState.value = "system"
    const user = userEvent.setup()

    render(<ThemeSwitchClient {...themeSwitchLabels} />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: selectTriggerNamed(themeSwitchLabels.systemLabel) })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: selectTriggerNamed(themeSwitchLabels.systemLabel) }))
    expect(setThemeMock).not.toHaveBeenCalled()
  })

  it("updates theme for valid selection", async () => {
    expect.hasAssertions()
    setThemeMock.mockClear()
    themeState.value = "system"
    const user = userEvent.setup()

    render(<ThemeSwitchClient {...themeSwitchLabels} />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: selectTriggerNamed(themeSwitchLabels.systemLabel) })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: selectTriggerNamed(themeSwitchLabels.systemLabel) }))
    await user.click(await screen.findByRole("option", { name: themeSwitchLabels.darkLabel }))
    expect(setThemeMock).toHaveBeenCalledWith("dark")
  })
})

describe("theme switch component", () => {
  it("loads labels from translations", async () => {
    expect.hasAssertions()
    themeState.value = "system"

    render(
      <IntlProvider locale="en-US" messages={getTestMessages("en-US")}>
        <ThemeSwitch />
      </IntlProvider>,
    )

    await waitFor(() => {
      expect(screen.getByRole("button", { name: selectTriggerNamed(themeMessages.system) })).toBeInTheDocument()
    })
  })
})
