"use client"

import { type JSX } from "react"

import { useTranslations } from "next-intl"

import { translateValidationMessage } from "~/src/integrations/next-intl/validation-messages"

import { FieldError } from "~/src/presentation/components/shadcn/field"

interface ValidationFieldErrorProps {
  readonly message?: string
  readonly namespace: string
  readonly paramsByKey?: Readonly<Record<string, Readonly<Record<string, string | number>>>>
}

export function ValidationFieldError({ message, namespace, paramsByKey }: ValidationFieldErrorProps): JSX.Element | undefined {
  const t = useTranslations(namespace)

  if (message === undefined || message === "") {
    return undefined
  }

  return <FieldError>{translateValidationMessage(message, t, paramsByKey)}</FieldError>
}
