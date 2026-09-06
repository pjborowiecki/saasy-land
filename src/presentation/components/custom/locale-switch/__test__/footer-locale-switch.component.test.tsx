import { render, screen, waitFor } from "@testing-library/react"
/** @vitest-environment jsdom */
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vite-plus/test"

import { localeUiConfig } from "~/src/integrations/fumadocs/fumadocs.i18n"
import { I18N } from "~/src/integrations/use-intl/i18n.config"

import { LocaleSwitch } from "~/src/presentation/components/custom/locale-switch"

describe("footer locale switch", () => {
  it("shows only the current language until the dropdown is opened", async () => {
    expect.hasAssertions()
    render(<LocaleSwitch appearance="compact" locale={I18N.DEFAULT_LOCALE} />)
    const trigger = screen.getByRole("button")

    expect(trigger).toHaveTextContent("English")
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
    await userEvent.setup().click(trigger)
    expect(screen.getAllByRole("option")).toHaveLength(I18N.SUPPORTED_LOCALES.length)
    for (const locale of I18N.SUPPORTED_LOCALES) {
      expect(screen.getByRole("option", { name: localeUiConfig[locale].displayName })).toHaveAttribute("lang", locale)
    }
  })

  it("marks the current language as the selected option", async () => {
    expect.hasAssertions()
    render(<LocaleSwitch appearance="compact" locale="pl-PL" />)
    await userEvent.setup().click(screen.getByRole("button"))

    expect(screen.getByRole("option", { selected: true })).toHaveTextContent("Polski")
    expect(screen.getAllByRole("option", { selected: true })).toHaveLength(1)
  })

  it("has a localized accessible label and can close with Escape", async () => {
    expect.hasAssertions()
    render(<LocaleSwitch appearance="compact" locale="pl-PL" />)
    const trigger = screen.getByRole("button", { name: /Wybierz język/u })
    const user = userEvent.setup()

    await user.click(trigger)
    expect(screen.getByRole("listbox")).toBeVisible()
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
