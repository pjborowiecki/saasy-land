"use client"

import { type JSX } from "react"

import { useTranslations } from "next-intl"
import type z from "zod/v4"

import { CONSTANTS } from "~/src/constants"

import type { signInWithPasswordSchema } from "~/src/integrations/better-auth/auth.schemas"
import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { FieldGroup } from "~/src/components/shadcn/field"

import { AuthPasswordField, AuthTextField } from "~/src/app/[locale]/(auth)/auth/_components/auth-form-fields"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"

export type SignInFormValues = z.infer<ReturnType<typeof signInWithPasswordSchema>>

function SignInPasswordField(): JSX.Element {
  const t = useTranslations()

  return (
    <AuthPasswordField<SignInFormValues>
      autoComplete="current-password"
      formId={AUTH_FORM_IDS.SIGN_IN}
      label={
        <>
          <span>{t("auth.signInPage.form.password")}</span>
          <Link className="text-muted-foreground transition-colors hover:text-foreground" href={CONSTANTS.ROUTES.FORGOT_PASSWORD}>
            {t("auth.signInPage.form.forgotPassword")}
          </Link>
        </>
      }
      labelClassName="flex items-center justify-between"
      name="password"
    />
  )
}

export function SignInFormFields(): JSX.Element {
  const t = useTranslations()

  return (
    <FieldGroup className="flex flex-col gap-6">
      <AuthTextField<SignInFormValues> formId={AUTH_FORM_IDS.SIGN_IN} label={t("auth.signInPage.form.email")} name="email" />
      <SignInPasswordField />
    </FieldGroup>
  )
}
