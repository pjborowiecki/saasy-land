import { CalendarDate } from "@internationalized/date"
import { getRequest } from "@tanstack/react-start/server"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Link } from "react-aria-components"
import { expect, it, vi } from "vite-plus/test"

import { createTestRouter, renderWithRouter } from "~/src/platform/testing/lib/render"

import { AppRouterProvider } from "~/src/providers/app-router-provider"

import { Calendar } from "~/src/presentation/components/shadcn/calendar"

const renderLink = () => {
  vi.mocked(getRequest).mockReturnValue(new Request("http://localhost/pl-PL"))
  const router = createTestRouter("/pl-PL")
  const navigate = vi.spyOn(router, "navigate").mockResolvedValue()
  renderWithRouter(
    <AppRouterProvider>
      <Link href="/admin">Console</Link>
      <Calendar aria-label="Calendar" defaultValue={new CalendarDate(2026, 9, 6)} />
    </AppRouterProvider>,
    { router },
  )
  return navigate
}
it("gives React Aria links and calendar labels the selected app locale", () => {
  renderLink()
  expect(screen.getByRole("link", { name: "Console" })).toHaveAttribute("href", "/pl-PL/admin")
  expect(screen.getByText("wrzesień 2026")).toBeVisible()
})
it("navigates through TanStack Router on click", async () => {
  const navigate = renderLink()
  await userEvent.setup().click(screen.getByRole("link", { name: "Console" }))
  expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ to: "/admin" }))
})
