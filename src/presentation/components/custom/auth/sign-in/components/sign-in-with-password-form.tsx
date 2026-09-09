import { type JSX } from "react"

import { useForm, useSelector } from "@tanstack/react-form"
import { useRouter } from "@tanstack/react-router"
import { createClientOnlyFn } from "@tanstack/react-start"
import { toast } from "sonner"
import { useLocale, useTranslations } from "use-intl/react"

import { signIn } from "~/src/integrations/better-auth/auth.client"
import { AUTH_ERRORS, authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { signInWithPasswordSchema } from "~/src/integrations/better-auth/auth.zod"
import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"

import { usePostAuthRedirect } from "~/src/hooks/use-post-auth-redirect"

import { AUTH_FORM_IDS } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"
import { SignInFormFields } from "~/src/presentation/components/custom/auth/sign-in/components/sign-in-with-password-form-fields"
import { SignInSubmitButton } from "~/src/presentation/components/custom/auth/sign-in/components/sign-in-with-password-submit-button"

import { ROUTES } from "~/src/routes"

const signInEmail = createClientOnlyFn((data: Parameters<typeof signIn.email>[0]) => signIn.email(data))

export const SignInWithPasswordForm = (): JSX.Element => {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const redirectAfterAuth = usePostAuthRedirect()

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }): Promise<void> => {
      try {
        const res = await signInEmail({
          email: value.email,
          password: value.password,
        })

        if (res.error) {
          const errorKey = authErrorKey(res.error)
          toast.error(t(`auth.errors.${errorKey}`))

          if (errorKey === AUTH_ERRORS.EMAIL_NOT_VERIFIED) {
            void router.navigate({
              to: localizePathname({
                locale,
                pathname: `${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(value.email)}`,
              }),
            })
          }
          return
        }

        const signInData: unknown = res.data

        if (
          typeof signInData === "object" &&
          signInData !== null &&
          "twoFactorRedirect" in signInData &&
          signInData.twoFactorRedirect === true
        ) {
          return
        }

        toast.success(t("pages.auth.sign-in.form.success"))
        await redirectAfterAuth()
      } catch {
        toast.error(t("errors.action.INTERNAL_ERROR"))
      }
    },
    validators: { onChange: signInWithPasswordSchema, onSubmit: signInWithPasswordSchema },
  })
  const isPending = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <form
      className="flex flex-col gap-6"
      id={`${AUTH_FORM_IDS.SIGN_IN}-form`}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field name="email">
        {(email) => <form.Field name="password">{(password) => <SignInFormFields email={email} password={password} />}</form.Field>}
      </form.Field>
      <SignInSubmitButton isPending={isPending} />
    </form>
  )
}
