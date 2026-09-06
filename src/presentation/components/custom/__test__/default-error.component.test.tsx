import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { IntlProvider } from "use-intl/react"
import { afterEach, expect, it, vi } from "vite-plus/test"

import { createTestRouter, renderWithRouter } from "~/src/platform/testing/lib/render"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { DefaultError, GlobalError } from "~/src/presentation/components/custom/default-error"

afterEach(() => vi.restoreAllMocks())
it("retries a failed route without exposing its private error message", async () => {
  const user = userEvent.setup()
  const router = createTestRouter()
  const invalidate = vi.spyOn(router, "invalidate").mockResolvedValue()
  const error = new Error("private database details")
  const log = vi.spyOn(console, "error").mockImplementation(() => {})
  const reset = vi.fn<() => void>()
  renderWithRouter(
    <IntlProvider locale="en-US" messages={getTestMessages("en-US")}>
      <DefaultError error={error} reset={reset} />
    </IntlProvider>,
    { router },
  )
  expect(screen.getByRole("alert")).not.toHaveTextContent(error.message)
  expect(log).toHaveBeenCalledWith(error)
  await user.click(screen.getByRole("button", { name: "Try again" }))
  await waitFor(() => {
    expect(reset).toHaveBeenCalledOnce()
  })
  expect(invalidate).toHaveBeenCalledOnce()
})
it("renders a recoverable root error even when translations cannot load", async () => {
  const user = userEvent.setup()
  vi.spyOn(console, "error").mockImplementation(() => {})
  const reset = vi.fn<() => void>()
  renderWithRouter(<GlobalError error={new Error("translation loading failed")} reset={reset} />)
  expect(screen.getByRole("heading")).toHaveTextContent("Something went wrong")
  await user.click(screen.getByRole("button", { name: "Reload" }))
  expect(reset).toHaveBeenCalledOnce()
})
