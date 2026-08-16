/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react"

import { I18N } from "~/src/integrations/next-intl/i18n.config"

import { LocaleLinks } from "~/src/presentation/components/custom/locale-links"

const LABEL = "Language"

/** Every locale but the one being viewed. */
const CURRENT_LOCALE_COUNT = 1

describe("locale links", () => {
  it("renders one link per enabled locale, named in its own language", () => {
    expect.hasAssertions()
    render(<LocaleLinks current={I18N.DEFAULT_LOCALE} label={LABEL} />)

    const links = screen.getAllByRole("link")

    expect(links).toHaveLength(I18N.LOCALES.length)
    expect(screen.getByText("English")).toBeInTheDocument()
    expect(screen.getByText("Polski")).toBeInTheDocument()
  })

  it("marks only the current locale, and marks it for assistive tech too", () => {
    expect.hasAssertions()
    render(<LocaleLinks current="pl-PL" label={LABEL} />)

    const current = screen.getByRole("link", { current: true })

    expect(current).toHaveAttribute("hrefLang", "pl-PL")
    expect(screen.getAllByRole("link", { current: false })).toHaveLength(I18N.LOCALES.length - CURRENT_LOCALE_COUNT)
  })

  it("names the navigation so a screen reader can skip it", () => {
    expect.hasAssertions()
    render(<LocaleLinks current={I18N.DEFAULT_LOCALE} label={LABEL} />)

    expect(screen.getByRole("navigation", { name: LABEL })).toBeInTheDocument()
  })
})
