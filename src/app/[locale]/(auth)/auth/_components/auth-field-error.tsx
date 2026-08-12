"use client"

import { type JSX } from "react"

import { useTranslations } from "next-intl"

import { AUTH_VALIDATION_PARAMS } from "~/src/integrations/better-auth/auth.validations"
import { translateValidationMessage } from "~/src/integrations/next-intl/validation-messages"

/**
 * The field error carries its own id so the control can name it through
 * `aria-describedby`, and `role="alert"` so it is announced the moment validation
 * writes it. `--destructive` is the only place this surface leaves the neutral ramp.
 *
 * `id` stays optional because this component is also consumed by the admin settings
 * forms, which own their own describedby wiring.
 */
export function AuthFieldError({
  id,
  message,
}: Readonly<{ id?: string | undefined; message?: string | undefined }>): JSX.Element | undefined {
  const t = useTranslations("auth.validations")

  if (message === undefined || message === "") {
    return undefined
  }

  return (
    <p className="text-body-sm text-destructive" id={id} role="alert">
      {translateValidationMessage(message, t, AUTH_VALIDATION_PARAMS)}
    </p>
  )
}
