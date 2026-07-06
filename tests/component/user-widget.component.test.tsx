/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { SidebarProvider } from "~/src/components/shadcn/sidebar"

import { UserWidgetClient } from "~/src/app/[locale]/(admin)/admin/_components/user-widget-client"

vi.mock(import("~/src/hooks/use-mobile"), () => ({
  useIsMobile: () => false,
}))

vi.mock(import("~/src/app/[locale]/(admin)/admin/_components/sign-out-button"), () => ({
  SignOutButton: () => <button type="button">Sign out</button>,
}))

describe("user widget client component", () => {
  it("opens the account menu and shows sign out", async () => {
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

    await expect(screen.findByRole("button", { name: /sign out/iu })).resolves.toBeVisible()
  })
})
