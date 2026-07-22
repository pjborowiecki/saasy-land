"use client"

import { type JSX } from "react"

import { AUTH_VALIDATION_PARAMS } from "~/src/integrations/better-auth/auth.validations"

import { ValidationFieldError } from "~/src/presentation/components/custom/validation-field-error"

export function AuthFieldError({ message }: { readonly message?: string | undefined }): JSX.Element | null {
  return (
    <ValidationFieldError
      namespace="auth.validations"
      paramsByKey={AUTH_VALIDATION_PARAMS}
      {...(message === undefined ? {} : { message })}
    />
  )
}
