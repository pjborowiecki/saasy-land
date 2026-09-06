import { render, screen } from "@testing-library/react"
import { IntlProvider } from "use-intl/react"
import { expect, it } from "vite-plus/test"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"
import { I18N } from "~/src/integrations/use-intl/i18n.config"

import { LEGAL_SECTIONS } from "~/src/presentation/components/custom/legal-page/constants"
import { LegalPage } from "~/src/presentation/components/custom/legal-page/legal-page"

it.each(I18N.SUPPORTED_LOCALES)("renders the complete legal documents in %s", (locale) => {
  const messages = getTestMessages(locale)
  for (const document of ["privacy", "terms", "refunds", "licence"] as const) {
    const copy = messages.pages.legal[document]
    const view = render(
      <IntlProvider locale={locale} messages={messages}>
        <LegalPage document={document} />
      </IntlProvider>,
    )
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(copy.title)
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(LEGAL_SECTIONS[document].length)
    expect(screen.getByText(copy.lastUpdated)).toBeVisible()
    view.unmount()
  }
})
