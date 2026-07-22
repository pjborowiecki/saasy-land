/** @vitest-environment jsdom */

import type { ReactNode } from "react"

import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { ProductStatusBadge } from "~/src/app/[locale]/(admin)/admin/_components/product-status-badge"
import { RegionProgressBar } from "~/src/app/[locale]/(admin)/admin/_components/region-progress-bar"
import { AuthSeparator } from "~/src/app/[locale]/(auth)/auth/_components/auth-separator"
import { PasswordRequirements } from "~/src/app/[locale]/(auth)/auth/_components/password-requirements"

function renderWithMessages(ui: ReactNode): ReturnType<typeof render> {
  return render(
    <NextIntlClientProvider locale="en-US" messages={loadLocaleMessagesFromDir("en-US")}>
      {ui}
    </NextIntlClientProvider>,
  )
}

function PasswordRequirementsHarness({ password }: { readonly password: string }): ReactNode {
  const form = useForm<{ password: string }>({ defaultValues: { password } })

  return (
    <FormProvider {...form}>
      <PasswordRequirements />
    </FormProvider>
  )
}

describe("product status badge component", () => {
  it("renders the status label with a colored badge", () => {
    expect.hasAssertions()
    renderWithMessages(<ProductStatusBadge status="Published" statusColor="emerald" />)

    expect(screen.getByText("Published")).toBeInTheDocument()
  })
})

describe("region progress bar component", () => {
  it("applies the requested width percentage", () => {
    expect.hasAssertions()
    const { container } = render(<RegionProgressBar percentage={42} />)

    expect(container.firstElementChild).toHaveStyle({ width: "42%" })
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
    renderWithMessages(<PasswordRequirementsHarness password="Secret1!" />)

    expect(screen.getByText(/at least 8 characters/iu)).toBeInTheDocument()
    expect(screen.getByText(/special character/iu)).toBeInTheDocument()
    expect(screen.getByText(/uppercase/iu)).toBeInTheDocument()
  })
})
