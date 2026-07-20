/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { ThemeSwitch, ThemeSwitchClient } from "~/src/components/custom/theme-switch"

import { setThemeMock, themeState } from "~/tests/mocks/wrksz-themes"

const themeMessages = loadLocaleMessagesFromDir("en-US").components.custom["theme-switch"]
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
      <NextIntlClientProvider locale="en-US" messages={emptyMessages}>
        <ThemeSwitchClient
          darkLabel={themeMessages.dark}
          label={themeMessages.label}
          lightLabel={themeMessages.light}
          placeholder={themeMessages.placeholder}
          systemLabel={themeMessages.system}
        />
      </NextIntlClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByRole("button", { name: themeMessages.system })).toBeInTheDocument()
    })
  })

  it("does not update theme when the select is opened without a selection", async () => {
    expect.hasAssertions()
    setThemeMock.mockClear()
    themeState.value = "system"
    const user = userEvent.setup()

    render(<ThemeSwitchClient {...themeSwitchLabels} />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: themeSwitchLabels.systemLabel })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: themeSwitchLabels.systemLabel }))
    expect(setThemeMock).not.toHaveBeenCalled()
  })

  it("updates theme for valid selection", async () => {
    expect.hasAssertions()
    setThemeMock.mockClear()
    themeState.value = "system"
    const user = userEvent.setup()

    render(<ThemeSwitchClient {...themeSwitchLabels} />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: themeSwitchLabels.systemLabel })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: themeSwitchLabels.systemLabel }))
    await user.click(await screen.findByRole("option", { name: themeSwitchLabels.darkLabel }))
    expect(setThemeMock).toHaveBeenCalledWith("dark")
  })
})

describe("theme switch component", () => {
  it("loads labels from translations", async () => {
    expect.hasAssertions()
    themeState.value = "system"

    render(
      <NextIntlClientProvider locale="en-US" messages={loadLocaleMessagesFromDir("en-US")}>
        <ThemeSwitch />
      </NextIntlClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByRole("button", { name: themeMessages.system })).toBeInTheDocument()
    })
  })
})
