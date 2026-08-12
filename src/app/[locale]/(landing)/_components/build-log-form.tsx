"use client"

import { type JSX, type SubmitEvent, useCallback, useState } from "react"

import { ArrowRight } from "lucide-react"

import { subscribeToBuildLog } from "~/src/modules/newsletter/use-cases/subscribe-to-build-log.use-case"

import type { Locale } from "~/src/integrations/next-intl/i18n.config"

import { cn } from "~/src/utils"

const EMAIL_FIELD = "email"
const INPUT_ID = "build-log-email"

type Status = "error" | "idle" | "sending" | "success"

/** Whatever the field is saying right now, or `undefined` while it is still only a promise. */
function statusMessage(status: Status, error: string, success: string): string | undefined {
  if (status === "success") {
    return success
  }

  if (status === "error") {
    return error
  }

  return undefined
}

interface BuildLogStatusProps {
  readonly message: string | undefined
  readonly note: string
}

/**
 * One line that starts as the promise and becomes the answer. It is a live region from
 * first paint, because a region announced into existence is a region nobody hears.
 */
function BuildLogStatus({ message, note }: BuildLogStatusProps): JSX.Element {
  return (
    <p aria-live="polite" className="mt-2 flex items-center gap-2 font-mono text-spec text-muted-foreground">
      {message === undefined ? undefined : <span aria-hidden className="size-1.5 shrink-0 bg-primary" />}
      <span className={cn(message !== undefined && "text-foreground")}>{message ?? note}</span>
    </p>
  )
}

interface BuildLogFormProps {
  readonly button: string
  readonly error: string
  readonly label: string
  readonly locale: Locale
  readonly note: string
  readonly placeholder: string
  readonly success: string
}

/**
 * The build log capture: a hairline rule, an address, and an arrow.
 *
 * No filled surface and no card. The page already spends its filled surfaces above the
 * fold and at the pricing chip, so the submit is a text button that only heats up on
 * hover. The rule under the field is the whole control.
 *
 * Copy arrives as props: `pages.landing` is server-only, and this is the one client
 * component in the chrome that needs it.
 */
export function BuildLogForm({ button, error, label, locale, note, placeholder, success }: BuildLogFormProps): JSX.Element {
  const [status, setStatus] = useState<Status>("idle")

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()
      const form = event.currentTarget
      const field = new FormData(form).get(EMAIL_FIELD)
      const email = typeof field === "string" ? field : ""

      setStatus("sending")

      // A dropped connection has to land in the same place as a refused send, or the field
      // stays disabled and "sending" forever on the one failure it is most likely to hit.
      try {
        const result = await subscribeToBuildLog({ email, locale })

        if (result?.data?.subscribed === true) {
          form.reset()
          setStatus("success")
          return
        }
      } catch {
        setStatus("error")
        return
      }

      setStatus("error")
    },
    [locale],
  )

  const isSending = status === "sending"

  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={INPUT_ID}>
        {label}
      </label>
      <div className="flex items-center gap-4 border-b border-border transition-colors duration-200 ease-exp focus-within:border-primary">
        <input
          autoComplete="email"
          className="h-11 w-full min-w-0 bg-transparent font-sans text-body-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
          disabled={isSending}
          id={INPUT_ID}
          name={EMAIL_FIELD}
          placeholder={placeholder}
          required
          type="email"
        />
        <button
          className="group flex h-11 shrink-0 items-center gap-2 font-sans text-body-sm font-semibold text-foreground transition-[color,opacity] duration-200 ease-exp hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
          disabled={isSending}
          type="submit"
        >
          {button}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-200 ease-exp group-hover:translate-x-0.5"
            strokeWidth={1.5}
          />
        </button>
      </div>
      <BuildLogStatus message={statusMessage(status, error, success)} note={note} />
    </form>
  )
}
