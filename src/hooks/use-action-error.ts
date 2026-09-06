import { useCallback } from "react"

import { useTranslations } from "use-intl/react"

import { AUTH_ERRORS } from "~/src/integrations/better-auth/auth.errors"

import { ERROR_CODES } from "~/src/modules/_core/constants/errors"

const AUTH_ERROR_KEYS = Object.values(AUTH_ERRORS)
const ACTION_ERROR_KEYS = Object.values(ERROR_CODES)

export const useActionError = (): ((error: unknown) => string) => {
  const t = useTranslations()
  return useCallback(
    (error: unknown) => {
      const message = error instanceof Error ? error.message : ""
      const authKey = AUTH_ERROR_KEYS.find((key) => key === message)
      if (authKey !== undefined) {
        return t(`auth.errors.${authKey}`)
      }
      const actionKey = ACTION_ERROR_KEYS.find((key) => key === message)
      if (actionKey !== undefined) {
        return t(`errors.action.${actionKey}`)
      }
      if (error instanceof Error && (error.name === "ZodError" || error.name === "ValidationError")) {
        return t(`errors.action.${ERROR_CODES.VALIDATION}`)
      }
      return t(`errors.action.${ERROR_CODES.INTERNAL_ERROR}`)
    },
    [t],
  )
}
