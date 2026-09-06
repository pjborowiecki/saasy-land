import { type JSX, type ReactNode, useCallback, useState } from "react"
/** @vitest-environment jsdom */

import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { IntlProvider } from "use-intl/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"

import { renderWithRouter as render } from "~/src/platform/testing/lib/render"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { SectionErrorBoundary } from "~/src/presentation/components/custom/section-error-boundary"

const FIRST_ATTEMPT = 0
const SECOND_ATTEMPT = 1

const Boom = (): JSX.Element => {
  throw new Error("section blew up")
}

/** Throws once, then succeeds — so `retry()` has something different to render. */
const BoomOnce = ({ attempt }: Readonly<{ attempt: number }>): JSX.Element => {
  if (attempt === FIRST_ATTEMPT) {
    throw new Error("section blew up")
  }

  return <p>recovered</p>
}

/**
 * React reports every error a boundary catches through `console.error`. These tests
 * throw deliberately, so the report is expected output rather than a failure — silence
 * it for the render that provokes it and leave the rest of the suite untouched.
 */
const withoutReactErrorLogging = (run: () => void): void => {
  const consoleError = vi.spyOn(console, "error").mockReturnValue()

  try {
    run()
  } finally {
    consoleError.mockRestore()
  }
}

const renderBoundary = (children: ReactNode, title?: string): void => {
  const messages = getTestMessages("en-US")

  const Wrapper = ({ children: wrapped }: { children: ReactNode }): JSX.Element => (
    <IntlProvider locale="en-US" messages={messages}>
      {wrapped}
    </IntlProvider>
  )

  render(<SectionErrorBoundary {...(title === undefined ? {} : { title })}>{children}</SectionErrorBoundary>, { wrapper: Wrapper })
}

describe("section error boundary component", () => {
  beforeEach(() => vi.stubEnv("DEV", false))
  afterEach(() => vi.unstubAllEnvs())
  it("renders children while nothing throws", () => {
    expect.hasAssertions()
    renderBoundary(<p>all good</p>)

    expect(screen.getByText("all good")).toBeInTheDocument()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("falls back to the translated heading when no title is given", () => {
    expect.hasAssertions()
    withoutReactErrorLogging(() => {
      renderBoundary(<Boom />)
    })

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong")
  })

  it("prefers a caller-supplied title", () => {
    expect.hasAssertions()
    withoutReactErrorLogging(() => {
      renderBoundary(<Boom />, "Users failed to load")
    })

    expect(screen.getByText("Users failed to load")).toBeInTheDocument()
  })

  it("hides the raw error message outside development", () => {
    expect.hasAssertions()
    withoutReactErrorLogging(() => {
      renderBoundary(<Boom />)
    })

    expect(screen.queryByText("section blew up")).not.toBeInTheDocument()
  })

  it("surfaces the raw error message in development", () => {
    expect.hasAssertions()
    vi.stubEnv("DEV", true)

    try {
      withoutReactErrorLogging(() => {
        renderBoundary(<Boom />)
      })
      expect(screen.getByText("section blew up")).toBeInTheDocument()
    } finally {
      vi.unstubAllEnvs()
    }
  })

  it("re-renders the failed subtree when retry is pressed", async () => {
    expect.hasAssertions()
    const user = userEvent.setup()
    const messages = getTestMessages("en-US")

    const Harness = (): JSX.Element => {
      const [attempt, setAttempt] = useState(FIRST_ATTEMPT)

      const fixIt = useCallback(() => {
        setAttempt(SECOND_ATTEMPT)
      }, [])

      return (
        <IntlProvider locale="en-US" messages={messages}>
          <button type="button" onClick={fixIt}>
            fix it
          </button>
          <SectionErrorBoundary>
            <BoomOnce attempt={attempt} />
          </SectionErrorBoundary>
        </IntlProvider>
      )
    }

    withoutReactErrorLogging(() => {
      render(<Harness />)
    })
    expect(screen.getByRole("alert")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "fix it" }))
    await user.click(screen.getByRole("button", { name: "Try again" }))

    expect(screen.getByText("recovered")).toBeInTheDocument()
  })
})
