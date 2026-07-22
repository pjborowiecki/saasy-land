"use client"

import { type JSX, type ReactNode } from "react"

import { useController, useFormContext, type FieldPath, type FieldValues } from "react-hook-form"

import { createOtpSlotIndices } from "~/src/modules/two-factor/two-factor.utils"

import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/src/presentation/components/shadcn/input-otp"

import { AuthFieldError } from "~/src/app/[locale]/(auth)/auth/_components/auth-field-error"
import { type AuthFormId } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"

function AuthOtpSlots({ length }: Readonly<{ length: number }>): JSX.Element {
  return (
    <InputOTPGroup>
      {createOtpSlotIndices(length).map((index) => (
        <InputOTPSlot index={index} key={index} />
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

  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <FieldContent>
        <InputOTP id={fieldId} maxLength={maxLength} {...field}>
          <AuthOtpSlots length={maxLength} />
        </InputOTP>
        <AuthFieldError message={fieldState.error?.message} />
      </FieldContent>
    </Field>
  )
}
