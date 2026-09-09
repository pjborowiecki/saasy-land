import { type JSX } from "react"

import { useTranslations } from "use-intl/react"

import { AUTH_VALIDATION_PARAMS } from "~/src/integrations/better-auth/auth.validations"
import { translateValidationMessage } from "~/src/integrations/use-intl/validation-messages"

export const AuthFieldError = ({
  id,
  message,
}: Readonly<{ id?: string | undefined; message?: string | undefined }>): JSX.Element | undefined => {
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
