"use client"

import { type JSX, type ReactNode, useCallback, useState } from "react"

import { Eye, EyeOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { useController, useFormContext, type FieldPath, type FieldValues } from "react-hook-form"

import { cn } from "~/src/utils"

import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "~/src/presentation/components/shadcn/input-group"

import { AuthFieldError } from "~/src/app/[locale]/(auth)/auth/_components/auth-field-error"
import { type AuthFormId } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import {
  AUTH_FIELD_CONTENT_CLASS,
  AUTH_INPUT_CLASS,
  AUTH_INPUT_GROUP_CLASS,
  AUTH_LABEL_CLASS,
} from "~/src/app/[locale]/(auth)/auth/_constants/auth-styles"

/** The reveal toggle fills the field's height so its hit box clears the touch floor. */
const PASSWORD_TOGGLE_CLASS =
  "size-11 rounded-none rounded-r-lg text-muted-foreground transition-[background-color,color] duration-200 ease-exp hover:bg-muted hover:text-foreground"

const TEXT_FIELD_CONFIG = {
  email: { autoComplete: "email", placeholder: "placeholders.email", type: "email" },
  name: { autoComplete: "name", placeholder: "placeholders.name", type: "text" },
} as const

type TextFieldName = keyof typeof TEXT_FIELD_CONFIG

function authFieldId(formId: AuthFormId, name: string): string {
  return `${formId}-${name}`
}

function authErrorId(fieldId: string): string {
  return `${fieldId}-error`
}

interface AuthTextFieldProps<T extends FieldValues> {
  disabled?: boolean
  formId: AuthFormId
  label: ReactNode
  labelClassName?: string
  name: Extract<FieldPath<T>, TextFieldName>
}

export function AuthTextField<T extends FieldValues>({
  disabled = false,
  formId,
  label,
  labelClassName,
  name,
}: Readonly<AuthTextFieldProps<T>>): JSX.Element {
  const t = useTranslations("auth.form")

  const form = useFormContext<T>()
  const { field, fieldState } = useController({ control: form.control, name })

  const config = TEXT_FIELD_CONFIG[name]
  const fieldId = authFieldId(formId, name)
  const errorId = authErrorId(fieldId)

  return (
    <Field>
      <FieldLabel className={cn(AUTH_LABEL_CLASS, labelClassName)} htmlFor={fieldId}>
        {label}
      </FieldLabel>
      <FieldContent className={AUTH_FIELD_CONTENT_CLASS}>
        <Input
          {...field}
          aria-describedby={fieldState.error === undefined ? undefined : errorId}
          aria-invalid={fieldState.invalid}
          autoComplete={config.autoComplete}
          className={AUTH_INPUT_CLASS}
          disabled={disabled || form.formState.isSubmitting}
          id={fieldId}
          placeholder={t(config.placeholder)}
          type={config.type}
        />
        <AuthFieldError id={errorId} message={fieldState.error?.message} />
      </FieldContent>
    </Field>
  )
}

interface AuthPasswordFieldProps<T extends FieldValues> {
  autoComplete?: "current-password" | "new-password"
  disabled?: boolean
  formId: AuthFormId
  label: ReactNode
  labelClassName?: string
  name: FieldPath<T>
}

export function AuthPasswordField<T extends FieldValues>({
  autoComplete = "new-password",
  disabled = false,
  formId,
  label,
  labelClassName,
  name,
}: Readonly<AuthPasswordFieldProps<T>>): JSX.Element {
  const [visible, setVisible] = useState(false)

  const t = useTranslations("auth.form")

  const form = useFormContext<T>()
  const { field, fieldState } = useController({ control: form.control, name })

  const toggleVisible = useCallback(() => {
    setVisible((current) => !current)
  }, [])

  const fieldId = authFieldId(formId, name)
  const errorId = authErrorId(fieldId)

  return (
    <Field>
      <FieldLabel className={cn(AUTH_LABEL_CLASS, labelClassName)} htmlFor={fieldId}>
        {label}
      </FieldLabel>
      <FieldContent className={AUTH_FIELD_CONTENT_CLASS}>
        <InputGroup className={AUTH_INPUT_GROUP_CLASS}>
          <InputGroupInput
            {...field}
            aria-describedby={fieldState.error === undefined ? undefined : errorId}
            aria-invalid={fieldState.invalid}
            autoComplete={autoComplete}
            className="px-3 text-base text-foreground placeholder:text-muted-foreground md:text-sm"
            disabled={disabled || form.formState.isSubmitting}
            id={fieldId}
            placeholder={t("placeholderPassword")}
            type={visible ? "text" : "password"}
          />
          <InputGroupAddon align="inline-end" className="pr-0">
            <InputGroupButton
              aria-label={visible ? t("hidePassword") : t("showPassword")}
              className={PASSWORD_TOGGLE_CLASS}
              onClick={toggleVisible}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              {visible ? (
                <EyeOff aria-hidden className="size-4" strokeWidth={1.5} />
              ) : (
                <Eye aria-hidden className="size-4" strokeWidth={1.5} />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <AuthFieldError id={errorId} message={fieldState.error?.message} />
      </FieldContent>
    </Field>
  )
}
