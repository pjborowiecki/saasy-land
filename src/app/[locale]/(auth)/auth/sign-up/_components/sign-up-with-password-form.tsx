"use client"

import { type JSX, useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { getSession, signUp } from "~/src/integrations/better-auth/auth._client"
import { getPostAuthRedirect } from "~/src/integrations/better-auth/auth.access"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { signUpWithPasswordSchema } from "~/src/integrations/better-auth/auth.schemas"
import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { useConfetti } from "~/src/hooks/use-confetti"

import { PasswordRequirements } from "~/src/app/[locale]/(auth)/auth/_components/password-requirements"
import { AUTH_FORM_IDS, authFormElementId } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import { useFormSubmitHandler } from "~/src/app/[locale]/(auth)/auth/_utils/use-form-submit-handler"
import {
  SignUpFormFields,
  type SignUpFormValues,
} from "~/src/app/[locale]/(auth)/auth/sign-up/_components/sign-up-with-password-form-fields"
import { SignUpSubmitButton } from "~/src/app/[locale]/(auth)/auth/sign-up/_components/sign-up-with-password-submit-button"

export function SignUpWithPasswordForm(): JSX.Element {
  const { triggerConfetti } = useConfetti()

  const router = useRouter()
  const t = useTranslations()

  const formSchema = signUpWithPasswordSchema(t)
  const form = useForm<SignUpFormValues>({
    defaultValues: { confirmPassword: "", email: "", name: "", password: "" },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  })

  const onSubmit = useCallback(
    async (data: SignUpFormValues) => {
      await signUp.email({
        email: data.email,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(t(`auth.errors.${authErrorKey(ctx.error)}`))
          },
          onSuccess: async () => {
            triggerConfetti()
            toast.success(t("auth.signUpPage.form.success"))
            const { data: session } = await getSession()
            router.push(getPostAuthRedirect(session?.user.role))
          },
        },
        name: data.name,
        password: data.password,
      })
    },
    [router, t, triggerConfetti],
  )

  const handleFormSubmit = useFormSubmitHandler(form, onSubmit)

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" id={authFormElementId(AUTH_FORM_IDS.SIGN_UP)} onSubmit={handleFormSubmit}>
        <SignUpFormFields />
        <PasswordRequirements />
        <SignUpSubmitButton />
      </form>
    </FormProvider>
  )
}
