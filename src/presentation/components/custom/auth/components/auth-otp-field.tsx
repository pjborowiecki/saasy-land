import { type JSX, type ReactNode } from "react"

import { type StringField, fieldErrorMessage } from "~/src/integrations/tanstack-form/form.fields"

import { createOtpSlotIndices } from "~/src/modules/two-factor/two-factor.utils"

import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/src/presentation/components/shadcn/input-otp"

import { AuthFieldError } from "~/src/presentation/components/custom/auth/components/auth-field-error"
import { type AuthFormId } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"
import { AUTH_FIELD_CONTENT_CLASS, AUTH_LABEL_CLASS } from "~/src/presentation/components/custom/auth/constants/auth-styles"

const OTP_SLOT_CLASS =
  "size-12 border-input font-mono text-lead tabular-nums transition-[border-color,box-shadow] duration-200 ease-exp data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50"

const AuthOtpSlots = ({ length }: Readonly<{ length: number }>): JSX.Element => (
  <InputOTPGroup>
    {createOtpSlotIndices(length).map((index) => (
      <InputOTPSlot className={OTP_SLOT_CLASS} index={index} key={index} />
    ))}
  </InputOTPGroup>
)

interface AuthOtpFieldProps {
  readonly formId: AuthFormId
  readonly label: ReactNode
  readonly maxLength: number
  readonly name: string
  field: StringField
}

export const AuthOtpField = ({ formId, label, maxLength, name, field }: Readonly<AuthOtpFieldProps>): JSX.Element => {
  const message = fieldErrorMessage(field.state.meta.errors)
  const fieldId = `${formId}-${name}`
  const errorId = `${fieldId}-error`

  return (
    <Field>
      <FieldLabel className={AUTH_LABEL_CLASS} htmlFor={fieldId}>
        {label}
      </FieldLabel>
      <FieldContent className={AUTH_FIELD_CONTENT_CLASS}>
        <InputOTP
          aria-describedby={message === undefined ? undefined : errorId}
          aria-invalid={message !== undefined}
          id={fieldId}
          maxLength={maxLength}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={field.handleChange}
        >
          <AuthOtpSlots length={maxLength} />
        </InputOTP>
        <AuthFieldError id={errorId} message={message} />
      </FieldContent>
    </Field>
  )
}
