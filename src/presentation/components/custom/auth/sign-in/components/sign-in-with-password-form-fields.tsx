import { type JSX } from "react"

import { Link } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import type { StringField } from "~/src/integrations/tanstack-form/form.fields"

import { FieldGroup } from "~/src/presentation/components/shadcn/field"

import { AuthPasswordField, AuthTextField } from "~/src/presentation/components/custom/auth/components/auth-form-fields"
import { AUTH_FORM_IDS } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"
import { AUTH_FIELD_GROUP_CLASS } from "~/src/presentation/components/custom/auth/constants/auth-styles"

import { ROUTES } from "~/src/routes"

const FORGOT_LINK_CLASS =
  "-my-3 inline-flex h-11 items-center font-normal text-muted-foreground transition-colors duration-200 ease-exp hover:text-foreground"

const SignInPasswordField = ({ field }: { field: StringField }): JSX.Element => {
  const t = useTranslations("pages.auth.sign-in")

  return (
    <AuthPasswordField
      autoComplete="current-password"
      formId={AUTH_FORM_IDS.SIGN_IN}
      label={
        <>
          <span>{t("form.password")}</span>
          <Link className={FORGOT_LINK_CLASS} to={ROUTES.FORGOT_PASSWORD}>
            {t("form.forgotPassword")}
          </Link>
        </>
      }
      labelClassName="flex w-full items-center justify-between gap-4"
      name="password"
      field={field}
    />
  )
}

export const SignInFormFields = ({ email, password }: Readonly<{ email: StringField; password: StringField }>): JSX.Element => {
  const t = useTranslations("pages.auth.sign-in")

  return (
    <FieldGroup className={AUTH_FIELD_GROUP_CLASS}>
      <AuthTextField formId={AUTH_FORM_IDS.SIGN_IN} label={t("form.email")} name="email" field={email} />
      <SignInPasswordField field={password} />
    </FieldGroup>
  )
}
