import { screen } from "@testing-library/react"
import { IntlProvider } from "use-intl/react"
import { expect, it } from "vite-plus/test"

import { renderWithRouter } from "~/src/platform/testing/lib/render"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { DefaultNotFound } from "~/src/presentation/components/custom/default-not-found"

it("renders a translated not-found message with a home link", () => {
  renderWithRouter(
    <IntlProvider locale="en-US" messages={getTestMessages("en-US")}>
      <DefaultNotFound />
    </IntlProvider>,
  )
  expect(screen.getByRole("heading", { level: 1 })).toBeVisible()
  expect(screen.getByRole("link")).toHaveAttribute("href", "/")
})
