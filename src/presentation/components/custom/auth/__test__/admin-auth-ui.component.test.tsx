import type { ReactNode } from "react"
/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react"
import { IntlProvider } from "use-intl/react"
import { describe, expect, it } from "vite-plus/test"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { AnalyticsChartBar } from "~/src/presentation/components/custom/admin/analytics/components/analytics-chart-bar"
import { RegionProgressBar } from "~/src/presentation/components/custom/admin/analytics/components/region-progress-bar"
import { ProductStatusBadge } from "~/src/presentation/components/custom/admin/products/components/product-status-badge"
import { AuthGateFrame } from "~/src/presentation/components/custom/auth/components/auth-gate-frame"
import { AuthSeparator } from "~/src/presentation/components/custom/auth/components/auth-separator"
import { PasswordRequirements } from "~/src/presentation/components/custom/auth/components/password-requirements"

const MessagesProvider = ({ children }: Readonly<{ children: ReactNode }>) => (
  <IntlProvider locale="en-US" messages={getTestMessages("en-US")}>
    {children}
  </IntlProvider>
)

const renderWithMessages = (ui: ReactNode): ReturnType<typeof render> => render(ui, { wrapper: MessagesProvider })

describe("product status badge component", () => {
  it("renders the status label with a colored badge", () => {
    expect.hasAssertions()
    renderWithMessages(<ProductStatusBadge status="published" />)

    expect(screen.getByText("Active")).toBeInTheDocument()
  })
})

describe("region progress bar component", () => {
  it("applies the requested width percentage", () => {
    expect.hasAssertions()
    const { container } = render(<RegionProgressBar percentage={42} />)

    expect(container.firstElementChild).toHaveStyle({ width: "42%" })
  })
})

describe("analytics chart bar", () => {
  it("renders incoming measurements without requiring a predefined bar ID", () => {
    const { container, rerender } = render(<AnalyticsChartBar bar={{ height1: "24%", height2: "12%", id: "new-measurement" }} />)
    expect(container.firstElementChild?.children[0]).toHaveStyle({ height: "24%" })
    expect(container.firstElementChild?.children[1]).toHaveStyle({ height: "12%" })

    rerender(<AnalyticsChartBar bar={{ height1: "35%", height2: "18%", id: "new-measurement" }} />)
    expect(container.firstElementChild?.children[0]).toHaveStyle({ height: "35%" })
    expect(container.firstElementChild?.children[1]).toHaveStyle({ height: "18%" })
  })
})

describe("auth separator component", () => {
  it("renders the separator label", () => {
    expect.hasAssertions()
    renderWithMessages(<AuthSeparator label="Or continue with" />)

    expect(screen.getByText("Or continue with")).toBeInTheDocument()
  })
})

describe("password requirements component", () => {
  it("marks all rules satisfied for a strong password", () => {
    expect.hasAssertions()
    renderWithMessages(<PasswordRequirements confirmPassword="Strong123!" password="Strong123!" />)

    expect(screen.getByText(/at least 8 characters/iu)).toBeInTheDocument()
    expect(screen.getByText(/special character/iu)).toBeInTheDocument()
    expect(screen.getByText(/uppercase/iu)).toBeInTheDocument()
    expect(screen.getByText("Passwords match")).toBeVisible()
    expect(screen.getAllByText("Requirement met")).toHaveLength(4)
    for (const label of screen.getAllByText("Requirement met")) {
      expect(label).toHaveClass("sr-only")
    }
  })

  it("shows all four requirements as unmet while both password fields are empty", () => {
    renderWithMessages(<PasswordRequirements confirmPassword="" password="" />)

    expect(screen.getAllByRole("listitem")).toHaveLength(4)
    expect(screen.getAllByText("Requirement not met")).toHaveLength(4)
    for (const label of screen.getAllByText("Requirement not met")) {
      expect(label).toHaveClass("sr-only")
    }
  })

  it("updates the matching requirement when either password changes", () => {
    const { rerender } = renderWithMessages(<PasswordRequirements confirmPassword="Different1!" password="Strong123!" />)

    expect(screen.getByText("Passwords match").parentElement).toHaveTextContent("Requirement not met")
    rerender(<PasswordRequirements confirmPassword="Strong123!" password="Strong123!" />)
    expect(screen.getByText("Passwords match").parentElement).toHaveTextContent("Requirement met")
    rerender(<PasswordRequirements confirmPassword="Strong123!" password="Changed123!" />)
    expect(screen.getByText("Passwords match").parentElement).toHaveTextContent("Requirement not met")
  })
})

describe("auth gate headline", () => {
  it("welcomes new customers on signup and keeps the returning-customer headline on sign in", () => {
    const { rerender } = renderWithMessages(<AuthGateFrame isSignUp />)

    expect(screen.getByText("Start building the part only you can build.")).toBeInTheDocument()
    expect(screen.queryByText("Get back to the part only you can build.")).not.toBeInTheDocument()
    rerender(<AuthGateFrame />)
    expect(screen.getByText("Get back to the part only you can build.")).toBeInTheDocument()
    expect(screen.queryByText("Start building the part only you can build.")).not.toBeInTheDocument()
  })
})
