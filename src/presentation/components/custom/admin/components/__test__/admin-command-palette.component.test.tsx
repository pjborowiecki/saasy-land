import { fireEvent, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { IntlProvider } from "use-intl/react"
import { describe, expect, it, vi } from "vite-plus/test"

import { createTestRouter, renderWithRouter } from "~/src/platform/testing/lib/render"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { AdminCommandPalette } from "~/src/presentation/components/custom/admin/components/admin-command-palette"

import { ROUTES } from "~/src/routes"

describe("admin command palette", () => {
  it("opens with the keyboard shortcut and navigates to the selected destination", async () => {
    const router = createTestRouter()
    const navigate = vi.spyOn(router, "navigate").mockResolvedValue()
    const user = userEvent.setup()
    renderWithRouter(
      <IntlProvider locale="en-US" messages={getTestMessages("en-US")}>
        <AdminCommandPalette />
      </IntlProvider>,
      { router },
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    fireEvent.keyDown(document, { ctrlKey: true, key: "k" })
    expect(await screen.findByRole("dialog")).toBeVisible()
    const search = screen.getByPlaceholderText("Search the console")
    await user.type(search, "no-matching-destination")
    expect(await screen.findByText(getTestMessages("en-US").pages.admin.components.header.searchEmpty)).toBeVisible()
    expect(screen.queryByRole("menuitem", { name: "Settings" })).not.toBeInTheDocument()
    await user.clear(search)
    await user.type(search, "Settings")
    expect(await screen.findAllByRole("menuitem")).toHaveLength(1)
    await user.click(await screen.findByRole("menuitem", { name: "Settings" }))

    expect(navigate).toHaveBeenCalledExactlyOnceWith({ to: ROUTES.ADMIN_SETTINGS })
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })
})
