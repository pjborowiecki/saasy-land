/** @vitest-environment jsdom */

import { useCallback, useState, type JSX, type ReactNode } from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { SectionErrorBoundary } from "~/src/presentation/components/custom/section-error-boundary"

const FIRST_ATTEMPT = 0
const SECOND_ATTEMPT = 1

function Boom(): JSX.Element {
  throw new Error("section blew up")
}

/** Throws once, then succeeds — so `retry()` has something different to render. */
function BoomOnce({ attempt }: Readonly<{ attempt: number }>): JSX.Element {
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
function withoutReactErrorLogging(run: () => void): void {
  const consoleError = vi.spyOn(console, "error").mockReturnValue()

  try {
    run()
  } finally {
    consoleError.mockRestore()
  }
}

function renderBoundary(children: ReactNode, title?: string): void {
  const messages = loadLocaleMessagesFromDir("en-US")

  function Wrapper({ children: wrapped }: { children: ReactNode }): JSX.Element {
    return (
      <NextIntlClientProvider locale="en-US" messages={messages}>
        {wrapped}
      </NextIntlClientProvider>
    )
  }

  render(<SectionErrorBoundary {...(title === undefined ? {} : { title })}>{children}</SectionErrorBoundary>, { wrapper: Wrapper })
}

describe("section error boundary component", () => {
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
    vi.stubEnv("NODE_ENV", "development")

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
    const messages = loadLocaleMessagesFromDir("en-US")

    function Harness(): JSX.Element {
      const [attempt, setAttempt] = useState(FIRST_ATTEMPT)

      const fixIt = useCallback(() => {
        setAttempt(SECOND_ATTEMPT)
      }, [])

      return (
        <NextIntlClientProvider locale="en-US" messages={messages}>
          <button type="button" onClick={fixIt}>
            fix it
          </button>
          <SectionErrorBoundary>
            <BoomOnce attempt={attempt} />
          </SectionErrorBoundary>
        </NextIntlClientProvider>
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
