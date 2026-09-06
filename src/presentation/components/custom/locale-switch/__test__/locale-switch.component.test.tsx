import { render, screen, waitFor } from "@testing-library/react"
/** @vitest-environment jsdom */
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"

import { selectTriggerNamed } from "~/src/platform/testing/lib/select-trigger-name"

import { localeUiConfig } from "~/src/integrations/fumadocs/fumadocs.i18n"

import { LocaleSwitch } from "~/src/presentation/components/custom/locale-switch"

const POLISH_LOCALE = "pl-PL"
const polishDisplayName = localeUiConfig[POLISH_LOCALE].displayName

const replaceMock = vi.fn<(href: string) => void>()
beforeEach(() => {
  vi.stubGlobal("location", { assign: replaceMock, hash: "#intro", pathname: "/docs", search: "?q=router" })
})
afterEach(() => vi.unstubAllGlobals())

describe("locale switch component", () => {
  it("changes locale with a document navigation, preserving query and fragment", async () => {
    expect.hasAssertions()
    replaceMock.mockClear()
    const user = userEvent.setup()

    render(<LocaleSwitch locale="en-US" />)

    const englishLabel = localeUiConfig["en-US"].displayName

    await waitFor(() => {
      expect(screen.getByRole("button", { name: selectTriggerNamed(englishLabel) })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: selectTriggerNamed(englishLabel) }))
    await user.click(await screen.findByRole("option", { name: polishDisplayName }))
    expect(replaceMock).toHaveBeenCalledWith("/pl-PL/docs?q=router#intro")
  })

  it("does not change locale when the select is opened without a selection", async () => {
    expect.hasAssertions()
    replaceMock.mockClear()
    const user = userEvent.setup()
    const englishLabel = localeUiConfig["en-US"].displayName

    render(<LocaleSwitch locale="en-US" />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: selectTriggerNamed(englishLabel) })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: selectTriggerNamed(englishLabel) }))
    expect(replaceMock).not.toHaveBeenCalled()
  })

  it("supports keyboard typeahead and selection in the compact footer control", async () => {
    replaceMock.mockClear()
    const user = userEvent.setup()
    render(<LocaleSwitch appearance="compact" locale="en-US" />)

    await user.tab()
    await user.keyboard("{ArrowDown}pol{Enter}")

    expect(replaceMock).toHaveBeenCalledWith("/pl-PL/docs?q=router#intro")
  })
})
