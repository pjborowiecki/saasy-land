import { CONSTANTS } from "~/src/constants"

import { getFormats } from "~/src/integrations/next-intl/i18n.formats"

describe("get formats component", () => {
  it("returns date and number formats for each locale", () => {
    expect.hasAssertions()

    for (const locale of CONSTANTS.I18N.LOCALES) {
      const formats = getFormats(locale)
      expect(formats.number?.["currency"]).toStrictEqual(
        expect.objectContaining({ currency: CONSTANTS.I18N.CURRENCIES[locale], style: "currency" }),
      )
      expect(formats.dateTime?.["full"]).toStrictEqual(expect.objectContaining({ year: "numeric" }))
    }
  })
})
