import type { ReactNode } from "react"
/** @vitest-environment jsdom */

import { renderHook } from "@testing-library/react"
import { IntlProvider } from "use-intl/react"
import { describe, expect, it } from "vite-plus/test"

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
      INTERNAL_ERROR: "Something went wrong.",
      VALIDATION: "Please check the form and try again.",
    },
  },
}

const wrapper = ({ children }: { readonly children: ReactNode }) => (
  <IntlProvider locale="en-US" messages={MESSAGES}>
    {children}
  </IntlProvider>
)

const renderActionError = () => renderHook(() => useActionError(), { wrapper }).result.current

describe("use action error", () => {
  it("uses a safe fallback for unrecognized thrown values", () => {
    expect.hasAssertions()
    const actionError = renderActionError()

    expect(actionError(undefined)).toBe("Something went wrong.")
    expect(actionError({ details: "private" })).toBe("Something went wrong.")
  })

  it("translates auth api failures through their better auth message key", () => {
    expect.hasAssertions()
    const actionError = renderActionError()

    expect(actionError(new Error("invalidPassword"))).toBe("Invalid password.")
  })

  it("falls back to the generic auth message when the key is unknown", () => {
    expect.hasAssertions()
    const actionError = renderActionError()

    expect(actionError(new Error("AUTH_API_ERROR"))).toBe("Authentication failed.")
  })

  it("translates other server errors by code", () => {
    expect.hasAssertions()
    const actionError = renderActionError()

    expect(actionError(new Error("FORBIDDEN"))).toBe("You don't have permission to do this.")
  })

  it("reports validation failures with the generic validation message", () => {
    expect.hasAssertions()
    const actionError = renderActionError()

    expect(actionError(new Error("VALIDATION"))).toBe("Please check the form and try again.")
  })
})

it.each(["ZodError", "ValidationError"])("translates a native %s without leaking validation internals", (name) => {
  const error = new Error("private field details")
  error.name = name
  expect(renderActionError()(error)).toBe("Please check the form and try again.")
})
it("hides an unexpected server error message", () => {
  expect(renderActionError()(new Error("private database details"))).toBe("Something went wrong.")
})
