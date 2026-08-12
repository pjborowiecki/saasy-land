"use client"

import { type JSX, type ReactNode } from "react"

import { useController, useFormContext, type FieldPath, type FieldValues } from "react-hook-form"

import { createOtpSlotIndices } from "~/src/modules/two-factor/two-factor.utils"

import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/src/presentation/components/shadcn/input-otp"

import { AuthFieldError } from "~/src/app/[locale]/(auth)/auth/_components/auth-field-error"
import { type AuthFormId } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import { AUTH_FIELD_CONTENT_CLASS, AUTH_LABEL_CLASS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-styles"

/*
 * The one place mono is earned on this surface: the digits are a code, and a code is
 * read character by character. Slots are 48px so each is its own touch target, share
 * their hairlines, and take the control radius only at the two outer corners so the run
 * reads as a single field.
 */
const OTP_SLOT_CLASS =
  "size-12 border-input font-mono text-lead tabular-nums transition-[border-color,box-shadow] duration-200 ease-exp data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50"

function AuthOtpSlots({ length }: Readonly<{ length: number }>): JSX.Element {
  return (
    <InputOTPGroup>
      {createOtpSlotIndices(length).map((index) => (
        <InputOTPSlot className={OTP_SLOT_CLASS} index={index} key={index} />
      ))}
    </InputOTPGroup>
  )
}

interface AuthOtpFieldProps<T extends FieldValues> {
  readonly formId: AuthFormId
  readonly label: ReactNode
  readonly maxLength: number
  readonly name: FieldPath<T>
}

export function AuthOtpField<T extends FieldValues>({ formId, label, maxLength, name }: Readonly<AuthOtpFieldProps<T>>): JSX.Element {
  const form = useFormContext<T>()
  const { field, fieldState } = useController({ control: form.control, name })
  const fieldId = `${formId}-${name}`
  const errorId = `${fieldId}-error`

  return (
    <Field>
      <FieldLabel className={AUTH_LABEL_CLASS} htmlFor={fieldId}>
        {label}
      </FieldLabel>
      <FieldContent className={AUTH_FIELD_CONTENT_CLASS}>
        <InputOTP
          aria-describedby={fieldState.error === undefined ? undefined : errorId}
          aria-invalid={fieldState.invalid}
          id={fieldId}
          maxLength={maxLength}
          {...field}
        >
          <AuthOtpSlots length={maxLength} />
        </InputOTP>
        <AuthFieldError id={errorId} message={fieldState.error?.message} />
      </FieldContent>
    </Field>
  )
}
