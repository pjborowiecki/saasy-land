import { type JSX } from "react"

import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { SESSION_QUERY_KEYS } from "~/src/modules/session/session.constants"
import { resetPasswordMutation } from "~/src/modules/verification/use-cases/reset-password"
import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { FieldGroup } from "~/src/presentation/components/shadcn/field"

import { AuthPasswordField } from "~/src/presentation/components/custom/auth/components/auth-form-fields"
import { PasswordRequirements } from "~/src/presentation/components/custom/auth/components/password-requirements"
import { AUTH_FORM_IDS } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"
import { AUTH_FIELD_GROUP_CLASS, AUTH_PRIMARY_BUTTON_CLASS } from "~/src/presentation/components/custom/auth/constants/auth-styles"

import { ROUTES } from "~/src/routes"

const resetPasswordSchema = verificationZodSchemas.resetPasswordForm

interface ResetPasswordFormProps {
  readonly token: string
}

export const ResetPasswordForm = ({ token }: Readonly<ResetPasswordFormProps>): JSX.Element => {
  const queryClient = useQueryClient()
  const resetPasswordRequest = useMutation({
    ...resetPasswordMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.ALL }),
  })
  const router = useRouter()
  const t = useTranslations()
  const actionError = useActionError()

  const form = useForm({
    defaultValues: { confirmPassword: "", password: "" },
    onSubmit: async ({ value }): Promise<void> => {
      try {
        const data = value
        await resetPasswordRequest.mutateAsync({
          confirmPassword: data.confirmPassword,
          password: data.password,
          token,
        })
        toast.success(t("pages.auth.reset-password.form.success"))
        void router.navigate({ to: ROUTES.SIGN_IN })
      } catch (error) {
        toast.error(actionError(error))
      }
    },
    validators: { onChange: resetPasswordSchema, onSubmit: resetPasswordSchema },
  })
  const isPending = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <form
      className="flex flex-col gap-6"
      id={`${AUTH_FORM_IDS.RESET_PASSWORD}-form`}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <FieldGroup className={AUTH_FIELD_GROUP_CLASS}>
        <form.Field name="password">
          {(field) => (
            <AuthPasswordField
              formId={AUTH_FORM_IDS.RESET_PASSWORD}
              label={t("pages.auth.reset-password.form.password")}
              name="password"
              field={field}
            />
          )}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => (
            <AuthPasswordField
              formId={AUTH_FORM_IDS.RESET_PASSWORD}
              label={t("pages.auth.reset-password.form.confirmPassword")}
              name="confirmPassword"
              field={field}
            />
          )}
        </form.Field>
      </FieldGroup>

      <form.Subscribe selector={(state) => state.values}>
        {({ confirmPassword, password }) => <PasswordRequirements confirmPassword={confirmPassword} password={password} />}
      </form.Subscribe>

      <Button
        aria-label={t("pages.auth.reset-password.form.submit")}
        className={AUTH_PRIMARY_BUTTON_CLASS}
        data-testid="reset-password-form-submit-button"
        isDisabled={isPending}
        type="submit"
      >
        {isPending && <Loader2 aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.5} />}
        {isPending ? t("pages.auth.reset-password.form.submitting") : t("pages.auth.reset-password.form.submit")}
      </Button>
    </form>
  )
}
