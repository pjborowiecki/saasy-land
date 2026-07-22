/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { DropdownMenuItem } from "~/src/presentation/components/shadcn/dropdown-menu"
import { SidebarProvider } from "~/src/presentation/components/shadcn/sidebar"

import { UserWidgetClient } from "~/src/app/[locale]/(admin)/admin/_components/user-widget-client"

vi.mock(import("~/src/hooks/use-mobile"), () => ({
  useIsMobile: () => false,
}))

vi.mock(import("~/src/app/[locale]/(admin)/admin/_components/sign-out-button"), () => ({
  SignOutButton: () => <DropdownMenuItem textValue="Sign out">Sign out</DropdownMenuItem>,
}))

const EXPECTED_NAME_OCCURRENCES = 1

describe("user widget client component", () => {
  it("opens the account menu with settings and sign out only", async () => {
    expect.hasAssertions()
    const user = userEvent.setup()

    render(
      <NextIntlClientProvider locale="en-US" messages={loadLocaleMessagesFromDir("en-US")}>
        <SidebarProvider>
          <UserWidgetClient email="piotr.borowiecki@yahoo.com" name="Piotr" />
        </SidebarProvider>
      </NextIntlClientProvider>,
    )

    await user.click(screen.getByRole("button", { name: /piotr/iu }))

    await expect(screen.findByRole("menuitem", { name: /settings/iu })).resolves.toBeVisible()
    await expect(screen.findByRole("menuitem", { name: /sign out/iu })).resolves.toBeVisible()
    expect(screen.getAllByText("Piotr")).toHaveLength(EXPECTED_NAME_OCCURRENCES)
  })
})
