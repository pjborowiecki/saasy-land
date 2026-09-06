import { type JSX } from "react"

import { useTranslations } from "use-intl/react"

import { translateValidationMessage } from "~/src/integrations/use-intl/validation-messages"

import { FieldError } from "~/src/presentation/components/shadcn/field"

interface ValidationFieldErrorProps {
  readonly message?: string | undefined
  readonly namespace: string
  readonly paramsByKey?: Readonly<Record<string, Readonly<Record<string, string | number>>>>
}

export const ValidationFieldError = ({ message, namespace, paramsByKey }: ValidationFieldErrorProps): JSX.Element | undefined => {
  const t = useTranslations(namespace)

  if (message === undefined || message === "") {
    return undefined
  }

  return <FieldError>{translateValidationMessage(message, t, paramsByKey)}</FieldError>
}
