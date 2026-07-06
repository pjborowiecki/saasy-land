"use client"

import { type JSX, type ReactNode, useCallback, useState } from "react"

import { Eye, EyeOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { useController, useFormContext, type FieldPath, type FieldValues } from "react-hook-form"

import { Field, FieldContent, FieldError, FieldLabel } from "~/src/components/shadcn/field"
import { Input } from "~/src/components/shadcn/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "~/src/components/shadcn/input-group"

import { type AuthFormId } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"

const AUTH_TEXT_INPUT_CLASS =
  "h-11 w-full rounded-xl border border-white/10 bg-transparent px-4 text-sm text-foreground shadow-inner transition-all placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:outline-none"

const AUTH_PASSWORD_GROUP_CLASS =
  "h-11 rounded-xl border border-white/10 bg-transparent shadow-inner transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50"

const AUTH_PASSWORD_INPUT_CLASS = "px-4 text-sm text-foreground placeholder:text-muted-foreground"

const TEXT_FIELD_CONFIG = {
  email: { autoComplete: "email", placeholder: "placeholders.email", type: "email" },
  name: { autoComplete: "name", placeholder: "placeholders.name", type: "text" },
} as const

type TextFieldName = keyof typeof TEXT_FIELD_CONFIG

function authFieldId(formId: AuthFormId, name: string): string {
  return `${formId}-${name}`
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

  return (
    <Field>
      <FieldLabel className={labelClassName} htmlFor={authFieldId(formId, name)}>
        {label}
      </FieldLabel>
      <FieldContent>
        <Input
          {...field}
          aria-invalid={fieldState.invalid}
          autoComplete={config.autoComplete}
          className={AUTH_TEXT_INPUT_CLASS}
          disabled={disabled || form.formState.isSubmitting}
          id={authFieldId(formId, name)}
          placeholder={t(config.placeholder)}
          type={config.type}
        />
        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
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

  return (
    <Field>
      <FieldLabel className={labelClassName} htmlFor={authFieldId(formId, name)}>
        {label}
      </FieldLabel>
      <FieldContent>
        <InputGroup className={AUTH_PASSWORD_GROUP_CLASS}>
          <InputGroupInput
            {...field}
            aria-invalid={fieldState.invalid}
            autoComplete={autoComplete}
            className={AUTH_PASSWORD_INPUT_CLASS}
            disabled={disabled || form.formState.isSubmitting}
            id={authFieldId(formId, name)}
            placeholder={t("placeholderPassword")}
            type={visible ? "text" : "password"}
          />
          <InputGroupAddon align="inline-end" className="pr-1.5">
            <InputGroupButton
              aria-label={visible ? t("hidePassword") : t("showPassword")}
              className="text-muted-foreground hover:bg-white/5 hover:text-foreground"
              onClick={toggleVisible}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
      </FieldContent>
    </Field>
  )
}
