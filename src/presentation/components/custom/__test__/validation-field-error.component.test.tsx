import { render, screen } from "@testing-library/react"
/** @vitest-environment jsdom */
import { IntlProvider } from "use-intl/react"
import { describe, expect, it } from "vite-plus/test"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { ValidationFieldError } from "~/src/presentation/components/custom/validation-field-error"

const MIN_LENGTH_PARAMS = { passwordMinLength: { min: 8 } }

const messages = getTestMessages("en-US")

const renderWithMessages = (node: React.ReactNode): ReturnType<typeof render> =>
  render(
    <IntlProvider locale="en-US" messages={messages}>
      {node}
    </IntlProvider>,
  )

describe("validationFieldError", () => {
  it("renders nothing when there is no message", () => {
    expect.hasAssertions()
    const { container } = renderWithMessages(<ValidationFieldError namespace="user.validations" />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing for an empty message", () => {
    expect.hasAssertions()
    const { container } = renderWithMessages(<ValidationFieldError message="" namespace="user.validations" />)
    expect(container).toBeEmptyDOMElement()
  })

  it("translates a validation key through the given namespace", () => {
    expect.hasAssertions()
    renderWithMessages(<ValidationFieldError message="atLeastOneFieldRequired" namespace="user.validations" />)

    expect(screen.getByText("At least one field is required.")).toBeInTheDocument()
  })

  it("passes interpolation params through for the key that declares them", () => {
    expect.hasAssertions()
    renderWithMessages(<ValidationFieldError message="passwordMinLength" namespace="auth.validations" paramsByKey={MIN_LENGTH_PARAMS} />)

    expect(screen.getByText(/8/u)).toBeInTheDocument()
  })
})
