"use client"

import { useCallback } from "react"

import { useTranslations } from "next-intl"
import type { SafeActionResult } from "next-safe-action"

import { type ActionServerError, ERROR_CODES } from "~/src/modules/_core/constants/errors"

import { AUTH_ERRORS, type AuthErrorMessageKey } from "~/src/integrations/better-auth/auth.errors"

const AUTH_ERROR_MESSAGE_KEYS = new Set<string>(Object.values(AUTH_ERRORS))

function isAuthErrorMessageKey(value: string): value is AuthErrorMessageKey {
  return AUTH_ERROR_MESSAGE_KEYS.has(value)
}

type ActionResult = SafeActionResult<ActionServerError, undefined, object | undefined>

export function useActionError(): (result?: ActionResult) => string | undefined {
  const t = useTranslations()

  return useCallback(
    (result) => {
      if (result?.serverError) {
        const { code, message } = result.serverError

        return code === ERROR_CODES.AUTH_API_ERROR && isAuthErrorMessageKey(message)
          ? t(`auth.errors.${message}`)
          : t(`errors.action.${code}`)
      }

      return result?.validationErrors ? t(`errors.action.${ERROR_CODES.VALIDATION}`) : undefined
    },
    [t],
  )
}
