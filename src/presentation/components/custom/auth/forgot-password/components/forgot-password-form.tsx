import { type JSX } from "react"

import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useLocale, useTranslations } from "use-intl/react"

import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"

import { requestPasswordResetMutation } from "~/src/modules/verification/use-cases/request-password-reset"
import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { FieldGroup } from "~/src/presentation/components/shadcn/field"

import { AuthTextField } from "~/src/presentation/components/custom/auth/components/auth-form-fields"
import { AUTH_FORM_IDS } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"
import { AUTH_FIELD_GROUP_CLASS, AUTH_PRIMARY_BUTTON_CLASS } from "~/src/presentation/components/custom/auth/constants/auth-styles"

import { ROUTES } from "~/src/routes"

const forgotPasswordSchema = verificationZodSchemas.forgotPassword

export const ForgotPasswordForm = (): JSX.Element => {
  const requestPasswordResetRequest = useMutation(requestPasswordResetMutation)

  const locale = useLocale()
  const t = useTranslations()
  const actionError = useActionError()

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }): Promise<void> => {
      try {
        const redirectTo = localizePathname({
          locale,
          pathname: ROUTES.RESET_PASSWORD,
        })
        await requestPasswordResetRequest.mutateAsync({
          email: value.email,
          redirectTo,
        })
        toast.success(t("pages.auth.forgot-password.form.success"))
      } catch (error) {
        toast.error(actionError(error))
      }
    },
    validators: { onChange: forgotPasswordSchema, onSubmit: forgotPasswordSchema },
  })
  const isPending = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <form
      className="flex flex-col gap-6"
      id={`${AUTH_FORM_IDS.FORGOT_PASSWORD}-form`}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <FieldGroup className={AUTH_FIELD_GROUP_CLASS}>
        <form.Field name="email">
          {(field) => (
            <AuthTextField
              disabled={requestPasswordResetRequest.isSuccess}
              formId={AUTH_FORM_IDS.FORGOT_PASSWORD}
              label={t("pages.auth.forgot-password.form.email")}
              name="email"
              field={field}
            />
          )}
        </form.Field>
      </FieldGroup>

      <Button
        aria-label={t("pages.auth.forgot-password.form.submit")}
        className={AUTH_PRIMARY_BUTTON_CLASS}
        data-testid="forgot-password-form-submit-button"
        isDisabled={isPending || requestPasswordResetRequest.isSuccess}
        type="submit"
      >
        {isPending && <Loader2 aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.5} />}
        {isPending ? t("pages.auth.forgot-password.form.submitting") : t("pages.auth.forgot-password.form.submit")}
      </Button>
    </form>
  )
}
