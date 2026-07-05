"use client"

import { type JSX } from "react"

import { useTranslations } from "next-intl"
import type z from "zod/v4"

import type { signUpWithPasswordSchema } from "~/src/integrations/better-auth/auth.schemas"

import { FieldGroup } from "~/src/components/shadcn/field"

import { AuthPasswordField, AuthTextField } from "~/src/app/[locale]/(auth)/auth/_components/auth-form-fields"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"

export type SignUpFormValues = z.infer<ReturnType<typeof signUpWithPasswordSchema>>

export function SignUpFormFields(): JSX.Element {
  const t = useTranslations()

  return (
    <FieldGroup className="flex flex-col gap-4">
      <AuthTextField<SignUpFormValues> formId={AUTH_FORM_IDS.SIGN_UP} label={t("auth.signUpPage.form.name")} name="name" />
      <AuthTextField<SignUpFormValues> formId={AUTH_FORM_IDS.SIGN_UP} label={t("auth.signUpPage.form.email")} name="email" />
      <AuthPasswordField<SignUpFormValues> formId={AUTH_FORM_IDS.SIGN_UP} label={t("auth.signUpPage.form.password")} name="password" />
      <AuthPasswordField<SignUpFormValues>
        formId={AUTH_FORM_IDS.SIGN_UP}
        label={t("auth.signUpPage.form.confirmPassword")}
        name="confirmPassword"
      />
    </FieldGroup>
  )
}
