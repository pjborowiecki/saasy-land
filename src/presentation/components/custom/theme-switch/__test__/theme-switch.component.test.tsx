/** @vitest-environment jsdom */
import { renderToString } from "react-dom/server"

import { fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { IntlProvider } from "use-intl/react"
import { beforeEach, describe, expect, it, vi } from "vite-plus/test"

import { selectTriggerNamed } from "~/src/platform/testing/lib/select-trigger-name"
import { setThemeMock, themeState } from "~/src/platform/testing/mocks/wrksz-themes"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { ThemeSwitch } from "~/src/presentation/components/custom/theme-switch"

const messages = getTestMessages("en-US")
const labels = messages.components.custom["theme-switch"]

const renderThemeSwitch = () =>
  render(
    <IntlProvider locale="en-US" messages={messages}>
      <ThemeSwitch />
    </IntlProvider>,
  )

describe("theme switch", () => {
  beforeEach(() => {
    setThemeMock.mockClear()
    themeState.value = "system"
  })

  it("hydrates the server placeholder into the saved browser theme without a mismatch", async () => {
    themeState.value = undefined
    const element = (
      <IntlProvider locale="en-US" messages={messages}>
        <ThemeSwitch />
      </IntlProvider>
    )
    document.body.innerHTML = `<div data-testid="theme-hydration-root">${renderToString(element)}</div>`
    const container = screen.getByTestId("theme-hydration-root")

    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull()
    expect(within(container).queryByRole("button")).toBeNull()

    themeState.value = "dark"
    const onRecoverableError = vi.fn<(error: unknown) => void>()
    render(element, { container, hydrate: true, onRecoverableError })

    expect(await within(container).findByRole("button", { name: selectTriggerNamed(labels.dark) })).toBeInTheDocument()
    expect(container.querySelector('[data-slot="skeleton"]')).toBeNull()
    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(setThemeMock).not.toHaveBeenCalled()
  })

  it("keeps the saved theme when the native select receives an empty value", async () => {
    renderThemeSwitch()
    await screen.findByRole("button", { name: selectTriggerNamed(labels.system) })

    fireEvent.change(screen.getByRole("combobox", { hidden: true }), { target: { value: "" } })

    expect(setThemeMock).not.toHaveBeenCalled()
    expect(screen.getByRole("button", { name: selectTriggerNamed(labels.system) })).toBeInTheDocument()
  })

  it("renders the translated current theme after hydration", async () => {
    expect.hasAssertions()
    renderThemeSwitch()

    expect(await screen.findByRole("button", { name: selectTriggerNamed(labels.system) })).toBeInTheDocument()
  })

  it("shows the placeholder when no theme is selected", async () => {
    expect.hasAssertions()
    themeState.value = undefined
    renderThemeSwitch()

    expect(await screen.findByRole("button", { name: selectTriggerNamed(labels.placeholder) })).toBeInTheDocument()
  })

  it("keeps the current theme when opening without selecting an option", async () => {
    expect.hasAssertions()
    const user = userEvent.setup()
    renderThemeSwitch()

    await user.click(await screen.findByRole("button", { name: selectTriggerNamed(labels.system) }))

    expect(setThemeMock).not.toHaveBeenCalled()
  })

  it("updates the theme when an option is selected", async () => {
    expect.hasAssertions()
    const user = userEvent.setup()
    renderThemeSwitch()

    await user.click(await screen.findByRole("button", { name: selectTriggerNamed(labels.system) }))
    await user.click(await screen.findByRole("option", { name: labels.dark }))

    expect(setThemeMock).toHaveBeenCalledWith("dark")
  })
})
