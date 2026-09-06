import { type JSX, type ReactNode, useCallback, useState } from "react"

import { Eye, EyeOff } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { type StringField, fieldErrorMessage } from "~/src/integrations/tanstack-form/form.fields"

import { cn } from "~/src/lib/cn"

import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "~/src/presentation/components/shadcn/input-group"

import { AuthFieldError } from "~/src/presentation/components/custom/auth/components/auth-field-error"
import { type AuthFormId } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"
import {
  AUTH_FIELD_CONTENT_CLASS,
  AUTH_INPUT_CLASS,
  AUTH_INPUT_GROUP_CLASS,
  AUTH_LABEL_CLASS,
} from "~/src/presentation/components/custom/auth/constants/auth-styles"

/** The reveal toggle fills the field's height so its hit box clears the touch floor. */
const PASSWORD_TOGGLE_CLASS =
  "size-11 rounded-none rounded-r-lg text-muted-foreground transition-[background-color,color] duration-200 ease-exp hover:bg-muted hover:text-foreground"

const TEXT_FIELD_CONFIG = {
  email: { autoComplete: "email", placeholder: "placeholders.email", type: "email" },
  name: { autoComplete: "name", placeholder: "placeholders.name", type: "text" },
} as const

type TextFieldName = keyof typeof TEXT_FIELD_CONFIG

const authFieldId = (formId: AuthFormId, name: string): string => `${formId}-${name}`

const authErrorId = (fieldId: string): string => `${fieldId}-error`

interface AuthTextFieldProps {
  disabled?: boolean
  formId: AuthFormId
  label: ReactNode
  labelClassName?: string
  name: TextFieldName
  field: StringField
}

export const AuthTextField = ({
  disabled = false,
  formId,
  label,
  labelClassName,
  name,
  field,
}: Readonly<AuthTextFieldProps>): JSX.Element => {
  const t = useTranslations("auth.form")

  const message = field.state.meta.isTouched === false ? undefined : fieldErrorMessage(field.state.meta.errors)

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
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.value)
          }}
          aria-describedby={message === undefined ? undefined : errorId}
          aria-invalid={message !== undefined}
          autoComplete={config.autoComplete}
          className={AUTH_INPUT_CLASS}
          disabled={disabled}
          id={fieldId}
          placeholder={t(config.placeholder)}
          type={config.type}
        />
        <AuthFieldError id={errorId} message={message} />
      </FieldContent>
    </Field>
  )
}

interface AuthPasswordFieldProps {
  autoComplete?: "current-password" | "new-password"
  disabled?: boolean
  formId: AuthFormId
  label: ReactNode
  labelClassName?: string
  name: string
  field: StringField
}

export const AuthPasswordField = ({
  autoComplete = "new-password",
  disabled = false,
  formId,
  label,
  labelClassName,
  name,
  field,
}: Readonly<AuthPasswordFieldProps>): JSX.Element => {
  const [visible, setVisible] = useState(false)

  const t = useTranslations("auth.form")

  const message = field.state.meta.isTouched === false ? undefined : fieldErrorMessage(field.state.meta.errors)

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
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(event) => {
              field.handleChange(event.target.value)
            }}
            aria-describedby={message === undefined ? undefined : errorId}
            aria-invalid={message !== undefined}
            autoComplete={autoComplete}
            className="px-3 text-base text-foreground placeholder:text-muted-foreground md:text-sm"
            disabled={disabled}
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
        <AuthFieldError id={errorId} message={message} />
      </FieldContent>
    </Field>
  )
}
