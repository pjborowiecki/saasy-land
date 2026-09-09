import { type JSX } from "react"

import { useTranslations } from "use-intl/react"

import type { StringField } from "~/src/integrations/tanstack-form/form.fields"

import { FieldGroup } from "~/src/presentation/components/shadcn/field"

import { AuthPasswordField, AuthTextField } from "~/src/presentation/components/custom/auth/components/auth-form-fields"
import { AUTH_FORM_IDS } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"
import { AUTH_FIELD_GROUP_CLASS } from "~/src/presentation/components/custom/auth/constants/auth-styles"

export const SignUpFormFields = ({
  name,
  email,
  password,
  confirmPassword,
}: Readonly<{ name: StringField; email: StringField; password: StringField; confirmPassword: StringField }>): JSX.Element => {
  const t = useTranslations("pages.auth.sign-up")

  return (
    <FieldGroup className={AUTH_FIELD_GROUP_CLASS}>
      <AuthTextField formId={AUTH_FORM_IDS.SIGN_UP} label={t("form.name")} name="name" field={name} />
      <AuthTextField formId={AUTH_FORM_IDS.SIGN_UP} label={t("form.email")} name="email" field={email} />
      <AuthPasswordField formId={AUTH_FORM_IDS.SIGN_UP} label={t("form.password")} name="password" field={password} />
      <AuthPasswordField formId={AUTH_FORM_IDS.SIGN_UP} label={t("form.confirmPassword")} name="confirmPassword" field={confirmPassword} />
    </FieldGroup>
  )
}
