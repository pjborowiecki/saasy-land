import { type JSX } from "react"

import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { toast } from "sonner"
import { useLocale, useTranslations } from "use-intl/react"

import { signUpWithPasswordSchema } from "~/src/integrations/better-auth/auth.zod"
import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"

import { signUpWithPasswordMutation } from "~/src/modules/account/use-cases/sign-up-with-password"
import { SESSION_QUERY_KEYS } from "~/src/modules/session/session.constants"

import { useActionError } from "~/src/hooks/use-action-error"
import { useConfetti } from "~/src/hooks/use-confetti"

import { PasswordRequirements } from "~/src/presentation/components/custom/auth/components/password-requirements"
import { AUTH_FORM_IDS } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"
import { SignUpFormFields } from "~/src/presentation/components/custom/auth/sign-up/components/sign-up-with-password-form-fields"
import { SignUpSubmitButton } from "~/src/presentation/components/custom/auth/sign-up/components/sign-up-with-password-submit-button"

import { ROUTES } from "~/src/routes"

export const SignUpWithPasswordForm = (): JSX.Element => {
  const queryClient = useQueryClient()
  const signUpWithPasswordRequest = useMutation({
    ...signUpWithPasswordMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.ALL }),
  })

  const { triggerConfetti } = useConfetti()

  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const actionError = useActionError()

  const form = useForm({
    defaultValues: { confirmPassword: "", email: "", name: "", password: "" },
    onSubmit: async ({ value }): Promise<void> => {
      try {
        const data = value
        const callbackURL = localizePathname({ locale, pathname: ROUTES.APP })
        await signUpWithPasswordRequest.mutateAsync({ ...data, callbackURL })
        await router.navigate({
          search: { email: data.email },
          to: localizePathname({ locale, pathname: ROUTES.VERIFY_EMAIL }),
        })
        triggerConfetti()
        toast.success(t("pages.auth.sign-up.form.successCheckEmail"))
      } catch (error) {
        toast.error(actionError(error))
      }
    },
    validators: { onChange: signUpWithPasswordSchema, onSubmit: signUpWithPasswordSchema },
  })
  const isPending = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <form
      className="flex flex-col gap-6"
      id={`${AUTH_FORM_IDS.SIGN_UP}-form`}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field name="name">
        {(name) => (
          <form.Field name="email">
            {(email) => (
              <form.Field name="password">
                {(password) => (
                  <form.Field name="confirmPassword">
                    {(confirmPassword) => (
                      <SignUpFormFields name={name} email={email} password={password} confirmPassword={confirmPassword} />
                    )}
                  </form.Field>
                )}
              </form.Field>
            )}
          </form.Field>
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.values}>
        {({ confirmPassword, password }) => <PasswordRequirements confirmPassword={confirmPassword} password={password} />}
      </form.Subscribe>
      <SignUpSubmitButton isPending={isPending} />
    </form>
  )
}
