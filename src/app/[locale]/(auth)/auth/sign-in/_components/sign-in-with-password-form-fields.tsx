"use client"

import { type JSX } from "react"

import { useTranslations } from "next-intl"
import type z from "zod/v4"

import type { signInWithPasswordSchema } from "~/src/integrations/better-auth/auth.zod"
import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { FieldGroup } from "~/src/presentation/components/shadcn/field"

import { AuthPasswordField, AuthTextField } from "~/src/app/[locale]/(auth)/auth/_components/auth-form-fields"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import { AUTH_FIELD_GROUP_CLASS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-styles"
import { ROUTES } from "~/src/routes"

export type SignInFormValues = z.infer<typeof signInWithPasswordSchema>

/*
 * The recovery link rides the password label rather than hiding under the form. The
 * negative block margin keeps the label row tight while the anchor's own box stays a
 * 44px target.
 */
const FORGOT_LINK_CLASS =
  "-my-3 inline-flex h-11 items-center font-normal text-muted-foreground transition-colors duration-200 ease-exp hover:text-foreground"

function SignInPasswordField(): JSX.Element {
  const t = useTranslations("pages.auth.sign-in")

  return (
    <AuthPasswordField<SignInFormValues>
      autoComplete="current-password"
      formId={AUTH_FORM_IDS.SIGN_IN}
      label={
        <>
          <span>{t("form.password")}</span>
          <Link className={FORGOT_LINK_CLASS} href={ROUTES.FORGOT_PASSWORD}>
            {t("form.forgotPassword")}
          </Link>
        </>
      }
      labelClassName="flex w-full items-center justify-between gap-4"
      name="password"
    />
  )
}

export function SignInFormFields(): JSX.Element {
  const t = useTranslations("pages.auth.sign-in")

  return (
    <FieldGroup className={AUTH_FIELD_GROUP_CLASS}>
      <AuthTextField<SignInFormValues> formId={AUTH_FORM_IDS.SIGN_IN} label={t("form.email")} name="email" />
      <SignInPasswordField />
    </FieldGroup>
  )
}
