import { render, screen } from "@testing-library/react"
/** @vitest-environment jsdom */
import userEvent from "@testing-library/user-event"
import { IntlProvider } from "use-intl/react"
import { describe, expect, it, vi } from "vite-plus/test"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { DropdownMenuItem } from "~/src/presentation/components/shadcn/dropdown-menu"
import { SidebarProvider } from "~/src/presentation/components/shadcn/sidebar"

import { UserWidgetClient } from "~/src/presentation/components/custom/admin/components/user-widget-client"

vi.mock(import("~/src/hooks/use-mobile"), () => ({
  useIsMobile: () => false,
}))

vi.mock(import("~/src/presentation/components/custom/admin/components/sign-out-button"), () => ({
  SignOutButton: () => <DropdownMenuItem textValue="Sign out">Sign out</DropdownMenuItem>,
}))

const EXPECTED_NAME_OCCURRENCES = 1

describe("user widget client component", () => {
  it("opens the account menu with settings and sign out only", async () => {
    expect.hasAssertions()
    const user = userEvent.setup()

    render(
      <IntlProvider locale="en-US" messages={getTestMessages("en-US")}>
        <SidebarProvider>
          <UserWidgetClient email="piotr.borowiecki@yahoo.com" name="Piotr" />
        </SidebarProvider>
      </IntlProvider>,
    )

    await user.click(screen.getByRole("button", { name: /piotr/iu }))

    await expect(screen.findByRole("menuitem", { name: /settings/iu })).resolves.toBeVisible()
    await expect(screen.findByRole("menuitem", { name: /sign out/iu })).resolves.toBeVisible()
    expect(screen.getAllByText("Piotr")).toHaveLength(EXPECTED_NAME_OCCURRENCES)
  })
})
