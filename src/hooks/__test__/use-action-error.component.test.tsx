/** @vitest-environment jsdom */

import type { ReactNode } from "react"

import { renderHook } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"

import { useActionError } from "~/src/hooks/use-action-error"

const MESSAGES = {
  auth: {
    errors: {
      invalidPassword: "Invalid password.",
    },
  },
  errors: {
    action: {
      AUTH_API_ERROR: "Authentication failed.",
      FORBIDDEN: "You don't have permission to do this.",
      VALIDATION: "Please check the form and try again.",
    },
  },
}

function wrapper({ children }: { readonly children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en-US" messages={MESSAGES}>
      {children}
    </NextIntlClientProvider>
  )
}

function renderActionError() {
  return renderHook(() => useActionError(), { wrapper }).result.current
}

describe("use action error", () => {
  it("returns undefined for missing or successful results", () => {
    expect.hasAssertions()
    const actionError = renderActionError()

    expect(actionError()).toBeUndefined()
    expect(actionError({ data: { ok: true } })).toBeUndefined()
  })

  it("translates auth api failures through their better auth message key", () => {
    expect.hasAssertions()
    const actionError = renderActionError()

    expect(actionError({ serverError: { code: "AUTH_API_ERROR", message: "invalidPassword" } })).toBe("Invalid password.")
  })

  it("falls back to the generic auth message when the key is unknown", () => {
    expect.hasAssertions()
    const actionError = renderActionError()

    expect(actionError({ serverError: { code: "AUTH_API_ERROR", message: "not-a-key" } })).toBe("Authentication failed.")
  })

  it("translates other server errors by code", () => {
    expect.hasAssertions()
    const actionError = renderActionError()

    expect(actionError({ serverError: { code: "FORBIDDEN", message: "FORBIDDEN" } })).toBe("You don't have permission to do this.")
  })

  it("reports validation failures with the generic validation message", () => {
    expect.hasAssertions()
    const actionError = renderActionError()

    expect(actionError({ validationErrors: { fieldErrors: {}, formErrors: [] } })).toBe("Please check the form and try again.")
  })
})
